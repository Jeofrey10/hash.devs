import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_footer_logo';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\footer_logo_frames';
mkdirSync(framesDir, { recursive: true });
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
  console.log('=== STARTING FOOTER CLINE & OFFICIAL LOGO VERIFICATION ===');

  // Start preview server
  const server = spawn('npx', ['vite', 'preview', '--port', '4219'], {
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log('[Vite Preview]', d.toString().trim()));
  server.stderr.on('data', (d) => console.error('[Vite Preview Err]', d.toString().trim()));

  await wait(3000);

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9260',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2500);

  try {
    const res = await fetch('http://localhost:9260/json');
    const tabs = await res.json();
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];

    const client = new CDPClient(pageTab.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    console.log('1. Loading Home page at 1440x900...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4219/' });
    await wait(2500);

    // Scroll to #site-footer
    console.log('2. Scrolling to #site-footer...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1200);

    // Capture Zone A: Collaboration Banner
    const bannerPath = `${framesDir}/footer_01_collaboration_banner.png`;
    await captureScreenshot(client, bannerPath);
    copyFileSync(bannerPath, `${artifactDir}/footer_01_collaboration_banner.png`);
    console.log('-> Captured footer_01_collaboration_banner.png');

    // Scroll down to Zone B and Zone C
    console.log('3. Scrolling to Zone B Information & Zone C Monumental Logo...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1200);

    const infoAndLogoPath = `${framesDir}/footer_02_info_and_monumental_logo.png`;
    await captureScreenshot(client, infoAndLogoPath);
    copyFileSync(infoAndLogoPath, `${artifactDir}/footer_02_info_and_monumental_logo.png`);
    console.log('-> Captured footer_02_info_and_monumental_logo.png');

    // Inspect logo element and dimensions
    const logoMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const wordmark = document.getElementById('footer-wordmark');
          const img = wordmark ? wordmark.querySelector('img') : null;
          return {
            exists: !!img,
            src: img ? img.getAttribute('src') : null,
            alt: img ? img.getAttribute('alt') : null,
            naturalWidth: img ? img.naturalWidth : 0,
            naturalHeight: img ? img.naturalHeight : 0,
            clientWidth: img ? img.clientWidth : 0,
            clientHeight: img ? img.clientHeight : 0,
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Monumental Logo Metrics:', logoMetrics.result.value);

    // Check Multi-Viewport QA across 6 standard screen sizes
    console.log('4. Running Multi-Viewport QA across 6 standard screen sizes...');
    const viewports = [
      { width: 1920, height: 1080, name: '1920x1080' },
      { width: 1440, height: 900, name: '1440x900' },
      { width: 1280, height: 800, name: '1280x800' },
      { width: 768, height: 1024, name: '768x1024' },
      { width: 390, height: 844, name: '390x844' },
      { width: 375, height: 812, name: '375x812' },
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await setViewport(client, vp.width, vp.height);
      await client.send('Page.navigate', { url: 'http://localhost:4219/' });
      await wait(1500);

      // Scroll to footer bottom
      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const footer = document.getElementById('site-footer');
            if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
          })()
        `,
      });
      await wait(1000);

      const overflow = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            };
          })()
        `,
        returnByValue: true,
      });

      const shotPath = `${framesDir}/footer_vp_${vp.name}.png`;
      await captureScreenshot(client, shotPath);
      copyFileSync(shotPath, `${artifactDir}/footer_vp_${vp.name}.png`);

      vpResults.push({
        viewport: vp.name,
        overflow: overflow.result.value.hasHorizontalOverflow,
        scrollWidth: overflow.result.value.scrollWidth,
        clientWidth: overflow.result.value.clientWidth,
      });
      console.log(`-> Viewport ${vp.name}: overflow=${overflow.result.value.hasHorizontalOverflow}`);
    }

    console.log('=== MULTI-VIEWPORT RESULTS ===');
    console.table(vpResults);

    await client.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    cp.kill();
    server.kill();
    process.exit(0);
  }
}

main();

