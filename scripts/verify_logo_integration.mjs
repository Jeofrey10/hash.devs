import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_logo';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\logo_frames';
mkdirSync(framesDir, { recursive: true });

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
  console.log('--- STARTING HASH.DEVS OFFICIAL LOGO INTEGRATION VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9262',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9262/json');
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

    console.log('1. Loading Home page at 1440x900...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4208/' });
    await wait(2500);

    // Verify Navigation Logo
    console.log('2. Inspecting Navigation Logo...');
    const navLogoMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = document.querySelector('header a[aria-label="HASH.DEVS Home"] img');
          if (!img) return { found: false };
          const rect = img.getBoundingClientRect();
          return {
            found: true,
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height),
            complete: img.complete
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Nav Logo Metrics:', navLogoMetrics.result.value);

    // Capture Frame 1: Top Navigation with Official Logo
    await captureScreenshot(client, `${framesDir}/logo_01_navigation_desktop.png`);
    console.log('-> Captured logo_01_navigation_desktop.png');

    // Scroll to Footer Information Area (Zone B)
    console.log('3. Scrolling to Footer Information Branding...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const info = document.getElementById('information-footer');
          if (info) info.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(1200);

    const infoLogoMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = document.querySelector('#information-footer img[alt*="HASH.DEVS"]');
          if (!img) return { found: false };
          const rect = img.getBoundingClientRect();
          return {
            found: true,
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height)
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Footer Information Logo Metrics:', infoLogoMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/logo_02_footer_info_badge.png`);
    console.log('-> Captured logo_02_footer_info_badge.png');

    // Scroll to Oversized Footer Logo (Zone C)
    console.log('4. Scrolling to Monumental Oversized Footer Logo (Zone C)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const wordmark = document.getElementById('footer-wordmark');
          if (wordmark) wordmark.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1200);

    const oversizedLogoMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = document.getElementById('footer-wordmark-image');
          if (!img) return { found: false };
          const rect = img.getBoundingClientRect();
          const container = document.getElementById('footer-wordmark');
          return {
            found: true,
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height),
            containerBg: container ? window.getComputedStyle(container).backgroundColor : ''
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Oversized Footer Logo Metrics:', oversizedLogoMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/logo_03_oversized_footer_logo.png`);
    console.log('-> Captured logo_03_oversized_footer_logo.png');

    // Test Mobile Navigation with Logo at 390x844
    console.log('5. Testing Mobile Drawer with Official Logo at 390x844...');
    await setViewport(client, 390, 844);
    await client.send('Page.navigate', { url: 'http://localhost:4208/' });
    await wait(2000);

    // Click mobile hamburger menu
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button[aria-label="Open mobile menu"]');
          if (btn) btn.click();
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/logo_04_mobile_nav_drawer.png`);
    console.log('-> Captured logo_04_mobile_nav_drawer.png');

    // Close mobile menu and scroll to footer at 390x844
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[aria-label="Close menu"]');
          if (closeBtn) closeBtn.click();
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/logo_05_mobile_footer_logo.png`);
    console.log('-> Captured logo_05_mobile_footer_logo.png');

    // Multi-viewport QA across 6 standard screen sizes
    console.log('6. Running Multi-Viewport QA across 6 standard screen sizes...');
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
      await client.send('Page.navigate', { url: 'http://localhost:4208/' });
      await wait(1500);

      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const footer = document.getElementById('site-footer');
            if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
          })()
        `,
      });
      await wait(1000);

      const overflowMetrics = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const bodyScrollW = document.body.scrollWidth;
            const docScrollW = document.documentElement.scrollWidth;
            const windowInnerW = window.innerWidth;
            const maxScrollW = Math.max(bodyScrollW, docScrollW);
            return {
              maxScrollW,
              windowInnerW,
              overflow: maxScrollW > windowInnerW,
              diff: maxScrollW - windowInnerW
            };
          })()
        `,
        returnByValue: true,
      });

      const metrics = overflowMetrics.result.value;
      vpResults.push({ name: vp.name, ...metrics });
      console.log(`Viewport ${vp.name}: innerW=${metrics.windowInnerW}, scrollW=${metrics.maxScrollW}, overflow=${metrics.overflow}`);

      await captureScreenshot(client, `${framesDir}/logo_vp_${vp.name}.png`);
      console.log(`-> Captured logo_vp_${vp.name}.png`);
    }

    console.log('\n--- MULTI-VIEWPORT AUDIT REPORT ---');
    console.table(vpResults);

    const hasAnyOverflow = vpResults.some((r) => r.overflow);
    if (hasAnyOverflow) {
      console.error('FAIL: Detected horizontal layout overflow in one or more viewports!');
    } else {
      console.log('PASS: All 6 standard viewports verified with 0 horizontal overflow.');
    }

    if (consoleErrors.length > 0) {
      console.warn('Browser Console Errors detected:', consoleErrors);
    } else {
      console.log('PASS: Zero console errors during verification.');
    }

    await client.close();
  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    cp.kill();
    console.log('Chrome process exited.');
  }
}

main();
