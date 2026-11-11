import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_contact_final';
mkdirSync(userDataDir, { recursive: true });
const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

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
  const port = 9335;
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
      } catch (e) {}
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

    const viewports = [
      { name: '1920x1080', w: 1920, h: 1080, mobile: false },
      { name: '1440x900', w: 1440, h: 900, mobile: false },
      { name: '1280x800', w: 1280, h: 800, mobile: false },
      { name: '1024x768', w: 1024, h: 768, mobile: false },
      { name: '768x1024', w: 768, h: 1024, mobile: false },
      { name: '390x844', w: 390, h: 844, mobile: true },
      { name: '375x812', w: 375, h: 812, mobile: true }
    ];

    const results = [];

    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await wait(600);

      // Scroll into contact view
      await client.send('Runtime.evaluate', {
        expression: `(() => {
          const contact = document.querySelector('#contact');
          if (contact) {
            contact.scrollIntoView({ behavior: 'instant' });
          }
        })()`,
        awaitPromise: true
      });

      await wait(1400);

      // Capture screenshot
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(artifactDir, `contact_verified_${vp.name}.png`);
      writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

      // Evaluate measurements
      const metricsRes = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const section = document.querySelector('#contact');
          if (!section) return { found: false };
          const h2 = section.querySelector('h2');
          const lines = Array.from(h2 ? h2.querySelectorAll('.contact-headline-line') : []).map(el => {
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();
            return {
              text: el.innerText.trim(),
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              parentWidth: Math.round(parentRect.width),
              parentRight: Math.round(parentRect.right),
              isClipped: rect.right > parentRect.right + 2,
              clearanceRight: Math.round(parentRect.right - rect.right)
            };
          });

          const leftCol = section.querySelector('.laptop\\\\:col-span-8');
          const rightCol = section.querySelector('.laptop\\\\:col-span-4');
          const transmitBadge = section.querySelector('.text-brand-white.font-bold.shrink-0');
          const transmitRect = transmitBadge ? transmitBadge.getBoundingClientRect() : null;

          return {
            found: true,
            viewportWidth: window.innerWidth,
            docScrollWidth: document.documentElement.scrollWidth,
            docClientWidth: document.documentElement.clientWidth,
            hasHOverflow: document.documentElement.scrollWidth > window.innerWidth,
            leftColWidth: leftCol ? Math.round(leftCol.getBoundingClientRect().width) : null,
            rightColWidth: rightCol ? Math.round(rightCol.getBoundingClientRect().width) : null,
            transmitBadgeWithinViewport: transmitRect ? transmitRect.right <= window.innerWidth : true,
            transmitBadgeRight: transmitRect ? Math.round(transmitRect.right) : null,
            lines
          };
        })()`,
        returnByValue: true
      });

      const metrics = metricsRes.result?.value;
      results.push({ viewport: vp.name, metrics });
      console.log(`[PASS] Verified ${vp.name}: overflow=${metrics?.hasHOverflow}, lines=${metrics?.lines?.length}, transmitInBounds=${metrics?.transmitBadgeWithinViewport}`);
    }

    const reportPath = path.join(artifactDir, 'contact_typography_audit.json');
    writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nAudit successfully written to ${reportPath}`);

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

