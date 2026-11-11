import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_footer_restore';
mkdirSync(userDataDir, { recursive: true });
const artifactDir = 'C:\\Users\\KANIMOZHI\\.gemini\\antigravity\\brain\\6ff27cec-25f0-42d6-aef4-136c2fa30198';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function captureScreenshot(client, path) {
  const result = await client.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(path, Buffer.from(result.data, 'base64'));
}

async function setViewport(client, width, height) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
}

async function main() {
  console.log('=== STARTING FOOTER RESTORATION AUDIT ===');

  const server = spawn('npx', ['vite', 'preview', '--port', '4225'], {
    shell: true,
    stdio: 'pipe',
  });

  await wait(3000);

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9265',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2500);

  try {
    const res = await fetch('http://localhost:9265/json');
    const tabs = await res.json();
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];

    const client = new CDPClient(pageTab.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    const consoleErrors = [];
    client.ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
      }
    });

    // 1. Desktop 1440x900
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4225/' });
    await wait(2500);

    // Scroll to footer
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1200);

    const desktopShot = `${artifactDir}/restored_footer_desktop_1440.png`;
    await captureScreenshot(client, desktopShot);
    console.log('-> Captured restored_footer_desktop_1440.png');

    // 2. Mobile 375x812
    await setViewport(client, 375, 812);
    await client.send('Page.navigate', { url: 'http://localhost:4225/' });
    await wait(2000);

    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1000);

    const mobileShot = `${artifactDir}/restored_footer_mobile_375.png`;
    await captureScreenshot(client, mobileShot);
    console.log('-> Captured restored_footer_mobile_375.png');

    // Audit Footer Elements
    const audit = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const banner = document.getElementById('collaboration-banner');
          const info = document.getElementById('information-footer');
          const wordmark = document.getElementById('footer-wordmark');
          const logoImg = wordmark ? wordmark.querySelector('img') : null;
          const links = Array.from(document.querySelectorAll('#site-footer a')).map(a => ({
            text: a.innerText.trim(),
            href: a.getAttribute('href'),
            ariaLabel: a.getAttribute('aria-label')
          }));

          return {
            zoneA: {
              exists: !!banner,
              bg: banner ? window.getComputedStyle(banner).backgroundColor : '',
              headline: banner ? banner.querySelector('h2')?.innerText.replace(/\\s+/g, ' ').trim() : ''
            },
            zoneB: {
              exists: !!info,
              bg: info ? window.getComputedStyle(info).backgroundColor : '',
              socialCount: info ? info.querySelectorAll('a[target="_blank"]').length : 0,
              legalCount: info ? info.querySelectorAll('a[href^="#"]').length : 0
            },
            zoneC: {
              exists: !!wordmark,
              logoSrc: logoImg ? logoImg.getAttribute('src') : '',
              logoAlt: logoImg ? logoImg.getAttribute('alt') : '',
              isMonumental: logoImg ? logoImg.getAttribute('src').includes('hashdevs-logo-dark-monumental') : false,
              clientWidth: logoImg ? logoImg.clientWidth : 0
            },
            links
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('=== FOOTER AUDIT METRICS ===');
    console.log(JSON.stringify(audit.result.value, null, 2));
    console.log('Console Errors:', consoleErrors);

    await client.close();
  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    cp.kill();
    server.kill();
    process.exit(0);
  }
}

main();

