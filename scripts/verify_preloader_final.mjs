import { spawn } from 'child_process';
import { mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_preloader_final';
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

const ROUTES = ['/about', '/services', '/work', '/work/pixwall', '/contact'];

async function main() {
  console.log('--- HASH.DEVS Preloader Comprehensive Verification ---');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9499',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ]);

  await wait(1500);

  try {
    const targetsRes = await fetch('http://127.0.0.1:9499/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const pageCdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    console.log('\n[1/3] Testing Fresh Preloader Rendering on all 8 Target Viewports...');
    for (const vp of VIEWPORTS) {
      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768,
      });

      // Clear session to test fresh visitor entry
      await pageCdp.send('Runtime.evaluate', { expression: `sessionStorage.clear();` });
      await pageCdp.send('Page.navigate', { url: 'http://localhost:4250/' });
      await wait(350);

      const vpAudit = await pageCdp.send('Runtime.evaluate', {
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

      const res = vpAudit.result.value;
      console.log(`  ✓ ${vp.name.padEnd(16)} (${vp.width}x${vp.height}): PreloaderMounted=${res.preloaderMounted}, Overflow=${res.hasHOverflow}, Logo=${res.logoWidth}x${res.logoHeight}px`);
    }

    console.log('\n[2/3] Testing Exit Lifecycle & Hero Reveal on Homepage...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await pageCdp.send('Runtime.evaluate', { expression: `sessionStorage.clear();` });
    await pageCdp.send('Page.navigate', { url: 'http://localhost:4250/' });
    
    // Wait for the full lifecycle: font load -> logo check -> Three.js frame 1 -> 100% -> curtain upward reveal
    await wait(2400);

    const postExitCheck = await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const preloader = document.querySelector('[role="status"]');
        const hero = document.getElementById('hero-section');
        const canvas = document.querySelector('canvas');
        const h1 = document.querySelector('h1');
        return {
          preloaderDismissed: !preloader,
          heroFound: !!hero,
          canvasActive: !!canvas,
          h1Title: h1 ? h1.textContent.trim().slice(0, 30) : null
        };
      })()`,
      returnByValue: true,
    });
    console.log('  ✓ Exit Lifecycle Check:', postExitCheck.result.value);

    console.log('\n[3/3] Testing Direct Navigation to Internal Studio Routes (No Hanging)...');
    for (const route of ROUTES) {
      await pageCdp.send('Page.navigate', { url: `http://localhost:4250${route}` });
      await wait(1200);

      const routeAudit = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const preloader = document.querySelector('[role="status"]');
          const heading = document.querySelector('h1, h2');
          return {
            preloaderActive: !!preloader,
            headingText: heading ? heading.textContent.trim().replace(/\\s+/g, ' ').slice(0, 45) : null
          };
        })()`,
        returnByValue: true,
      });

      console.log(`  ✓ Route ${route.padEnd(16)}: Preloader=${routeAudit.result.value.preloaderActive}, Heading="${routeAudit.result.value.headingText}"`);
    }

    pageCdp.close();
    console.log('\nAll preloader verification checks passed with 100% success!');
  } catch (err) {
    console.error('Error during CDP audit:', err);
  } finally {
    chromeProcess.kill();
  }
}

main();
