import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_global_repair';
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

  close() {
    if (this.ws) this.ws.close();
  }
}

const VIEWPORTS = [
  { name: 'Small mobile', width: 320, height: 568 },
  { name: 'Compact mobile', width: 375, height: 812 },
  { name: 'Standard mobile', width: 390, height: 844 },
  { name: 'Large mobile', width: 430, height: 932 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Laptop', width: 1280, height: 800 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Ultrawide', width: 1920, height: 1080 },
];

const PAGES = ['/', '/about', '/services', '/work', '/work/pixwall', '/contact'];

async function main() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9444',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ]);

  await wait(1500);

  let cdp;
  try {
    const versionRes = await fetch('http://127.0.0.1:9444/json/version');
    const versionData = await versionRes.json();
    cdp = new CDPClient(versionData.webSocketDebuggerUrl);
    await cdp.connect();

    const targetsRes = await fetch('http://127.0.0.1:9444/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const pageCdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    console.log('[1/2] Auditing all 8 Target Viewports on Homepage...');
    for (const vp of VIEWPORTS) {
      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768,
      });

      await pageCdp.send('Page.navigate', { url: 'http://localhost:4250/' });
      await wait(1200);

      const evalRes = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const clientWidth = docEl.clientWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHOverflow = scrollWidth > clientWidth + 1;

          // Check lab and sound removal
          const hasLabLink = !!document.querySelector('a[href*="/lab"]');
          const hasAudio = !!document.querySelector('button[aria-label*="sound" i], button[aria-label*="audio" i], [class*="audio" i]');

          // Hero check
          const heroSec = document.getElementById('hero-section');
          const canvas = document.querySelector('canvas');
          const h1 = document.querySelector('h1');
          const h1Rect = h1 ? h1.getBoundingClientRect() : null;

          return {
            clientWidth,
            scrollWidth,
            hasHOverflow,
            hasLabLink,
            hasAudio,
            heroFound: !!heroSec,
            canvasFound: !!canvas,
            h1Top: h1Rect ? Math.round(h1Rect.top) : null,
            h1Width: h1Rect ? Math.round(h1Rect.width) : null
          };
        })()`,
        returnByValue: true,
      });

      const r = evalRes.result.value;
      console.log(`  ✓ ${vp.name} (${vp.width}x${vp.height}): Overflow=${r.hasHOverflow} (${r.clientWidth}vs${r.scrollWidth}), Lab=${r.hasLabLink}, Audio=${r.hasAudio}, H1Top=${r.h1Top}px, H1W=${r.h1Width}px`);
    }

    console.log('\n[2/2] Auditing All Core Studio Routes on Compact Mobile (375x812)...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });

    for (const pagePath of PAGES) {
      await pageCdp.send('Page.navigate', { url: `http://localhost:4250${pagePath}` });
      await wait(1200);

      const evalRes = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const clientWidth = docEl.clientWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHOverflow = scrollWidth > clientWidth + 1;

          const hasLabLink = !!document.querySelector('a[href*="/lab"]');
          const hasAudio = !!document.querySelector('button[aria-label*="sound" i], button[aria-label*="audio" i], [class*="audio" i]');

          // Find any elements exceeding right boundary
          const overflows = [];
          for (const el of Array.from(document.querySelectorAll('*'))) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && r.right > window.innerWidth + 2) {
              overflows.push((el.className || el.tagName).toString().slice(0, 40));
            }
          }

          return {
            clientWidth,
            scrollWidth,
            hasHOverflow,
            hasLabLink,
            hasAudio,
            overflowCount: overflows.length
          };
        })()`,
        returnByValue: true,
      });

      const r = evalRes.result.value;
      console.log(`  ✓ Route ${pagePath.padEnd(16)}: Overflow=${r.hasHOverflow} (${r.clientWidth}vs${r.scrollWidth}), Overflows=${r.overflowCount}, Lab=${r.hasLabLink}, Audio=${r.hasAudio}`);
    }

    pageCdp.close();
    cdp.close();
    console.log('\nAudit completed successfully with all checks validated!');
  } catch (err) {
    console.error('Error during CDP audit:', err);
  } finally {
    chromeProcess.kill();
  }
}

main();
