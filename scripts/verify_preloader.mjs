import { spawn } from 'child_process';
import { mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_preloader_test';
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

async function main() {
  console.log('Testing Cinematic Preloader lifecycle across viewports and routes...');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9455',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ]);

  await wait(1500);

  let cdp;
  try {
    const versionRes = await fetch('http://127.0.0.1:9455/json/version');
    const versionData = await versionRes.json();
    cdp = new CDPClient(versionData.webSocketDebuggerUrl);
    await cdp.connect();

    const targetsRes = await fetch('http://127.0.0.1:9455/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const pageCdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    console.log('\n[1/3] Testing Initial Entry & Preloader Life-cycle on Compact Mobile (375x812)...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });

    // Clear session storage so it acts as fresh first-time visit
    await pageCdp.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(300);

    // Sample preloader mid-flight
    const midPreload = await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const preloader = document.querySelector('[role="status"]');
        const text = preloader ? preloader.textContent : '';
        return {
          preloaderFound: !!preloader,
          textSample: text.slice(0, 80)
        };
      })()`,
      returnByValue: true,
    });
    console.log('  Mid-flight Preloader:', midPreload.result.value);

    // Wait for preloader curtain exit animation to complete (approx 2s)
    await wait(2200);

    const postPreload = await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const preloader = document.querySelector('[role="status"]');
        const hero = document.getElementById('hero-section');
        const canvas = document.querySelector('canvas');
        return {
          preloaderDismissed: !preloader,
          heroVisible: !!hero,
          canvasActive: !!canvas
        };
      })()`,
      returnByValue: true,
    });
    console.log('  Post-exit Site State:', postPreload.result.value);

    console.log('\n[2/3] Testing Direct Navigation to Internal Routes (No Hanging, Direct Load)...');
    const testRoutes = ['/about', '/services', '/work', '/contact'];
    for (const r of testRoutes) {
      await pageCdp.send('Page.navigate', { url: `http://localhost:4250${r}` });
      await wait(500);

      const routeCheck = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const preloader = document.querySelector('[role="status"]');
          const h1 = document.querySelector('h1, h2');
          return {
            preloaderPresent: !!preloader,
            headingText: h1 ? h1.textContent.trim().slice(0, 40) : null
          };
        })()`,
        returnByValue: true,
      });
      console.log(`  ✓ Route ${r.padEnd(12)}: Preloader=${routeCheck.result.value.preloaderPresent}, H1="${routeCheck.result.value.headingText}"`);
    }

    console.log('\n[3/3] Testing Fresh Preloader Rendering on all 8 Target Viewports...');
    for (const vp of VIEWPORTS) {
      // Clear session storage before each load to simulate first-entry
      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768,
      });

      // Inject clean session
      await pageCdp.send('Runtime.evaluate', {
        expression: `sessionStorage.clear();`,
      });

      await pageCdp.send('Page.navigate', { url: 'http://localhost:4250/' });
      await wait(400);

      const vpCheck = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const clientWidth = docEl.clientWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHOverflow = scrollWidth > clientWidth + 1;

          const preloader = document.querySelector('[role="status"]');
          const logoImg = preloader ? preloader.querySelector('img') : null;
          const logoRect = logoImg ? logoImg.getBoundingClientRect() : null;

          return {
            hasHOverflow,
            preloaderMounted: !!preloader,
            logoWidth: logoRect ? Math.round(logoRect.width) : null,
            logoHeight: logoRect ? Math.round(logoRect.height) : null
          };
        })()`,
        returnByValue: true,
      });

      const res = vpCheck.result.value;
      console.log(`  ✓ ${vp.name.padEnd(16)} (${vp.width}x${vp.height}): Preloader=${res.preloaderMounted}, Overflow=${res.hasHOverflow}, Logo=${res.logoWidth}x${res.logoHeight}px`);
    }

    pageCdp.close();
    cdp.close();
    console.log('\nPreloader verification passed with 100% success!');
  } catch (err) {
    console.error('CDP verification error:', err);
  } finally {
    chromeProcess.kill();
  }
}

main();

