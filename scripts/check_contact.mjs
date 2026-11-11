import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_contact_check';
mkdirSync(userDataDir, { recursive: true });

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

async function main() {
  const port = 9325;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250'
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        versionData = await res.json();
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) { }
      await wait(300);
    }

    const browserClient = new CDPClient(versionData.webSocketDebuggerUrl);
    await browserClient.connect();

    const targets = await browserClient.send('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page');

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const viewports = [1920, 1440, 1280, 1024, 768, 390];

    for (const w of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768
      });

      await wait(600);

      await client.send('Runtime.evaluate', {
        expression: `(() => {
          const contact = document.querySelector('#contact');
          if (contact) {
            contact.scrollIntoView({ behavior: 'instant' });
          }
        })()`,
        awaitPromise: true
      });

      await wait(1200);

      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198/contact_debug_${w}.png`, Buffer.from(shot.data, 'base64'));

      const res = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const section = document.querySelector('#contact');
          if (!section) return { found: false };
          const h2 = section.querySelector('h2');
          const lines = Array.from(h2 ? h2.querySelectorAll('.contact-headline-line') : []).map(el => {
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();
            return {
              text: el.innerText,
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              parentWidth: Math.round(parentRect.width),
              parentRight: Math.round(parentRect.right),
              clippedRight: Math.round(rect.right - parentRect.right)
            };
          });
          const headerGrid = section.querySelector('.mb-14, .sm\\\\:mb-20') || section.querySelector('[class*=\"laptop:grid-cols-12\"]');
          const leftCol = section.querySelector('.laptop\\\\:col-span-8');
          const rightCol = section.querySelector('.laptop\\\\:col-span-4');
          return {
            viewportWidth: window.innerWidth,
            docScrollWidth: document.documentElement.scrollWidth,
            hasHOverflow: document.documentElement.scrollWidth > window.innerWidth,
            lines,
            leftColWidth: leftCol ? Math.round(leftCol.getBoundingClientRect().width) : null,
            rightColWidth: rightCol ? Math.round(rightCol.getBoundingClientRect().width) : null,
            rightColRight: rightCol ? Math.round(rightCol.getBoundingClientRect().right) : null
          };
        })()`,
        returnByValue: true
      });

      console.log(`Viewport ${w}:`, JSON.stringify(res.result?.value, null, 2));
    }

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
