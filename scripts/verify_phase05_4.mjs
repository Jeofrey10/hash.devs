import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p05_4';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p05_4_frames';
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
  console.log('--- STARTING PHASE 05.4 IMMERSIVE 3D SHOWCASE SYSTEM VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9268',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9268/json');
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

    // Scroll to #work section
    console.log('2. Scrolling to #work section header...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const work = document.getElementById('work');
          if (work) work.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1500);

    // Inspect Card 1: PIXWALL 3D Scene
    console.log('3. Inspecting Card 1 (PIXWALL 3D Digital Art Atelier)...');
    const pixwallMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('article a[href="/work/pixwall"]') || document.querySelectorAll('#work article')[0];
          const canvas = card ? card.querySelector('canvas') : null;
          return {
            cardFound: !!card,
            canvasFound: !!canvas,
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Pixwall 3D Metrics:', pixwallMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/p05_4_01_pixwall_3d.png`);
    console.log('-> Captured p05_4_01_pixwall_3d.png');

    // Horizontal Scroll to Card 2: VOX AI
    console.log('4. Navigating to Card 2 (VOX AI 3D Industrial Hardware)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          if (cards[1]) cards[1].scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
        })()
      `,
    });
    await wait(1200);

    const voxMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          const card = cards[1];
          const canvas = card ? card.querySelector('canvas') : null;
          return {
            cardFound: !!card,
            canvasFound: !!canvas,
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('VOX AI 3D Metrics:', voxMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/p05_4_02_vox_ai_3d.png`);
    console.log('-> Captured p05_4_02_vox_ai_3d.png');

    // Horizontal Scroll to Card 3: ILLORA AI
    console.log('5. Navigating to Card 3 (ILLORA AI 3D Autonomous Multi-Agent DAG)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          if (cards[2]) cards[2].scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
        })()
      `,
    });
    await wait(1200);

    const illoraMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          const card = cards[2];
          const canvas = card ? card.querySelector('canvas') : null;
          return {
            cardFound: !!card,
            canvasFound: !!canvas,
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('ILLORA AI 3D Metrics:', illoraMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/p05_4_03_illora_ai_3d.png`);
    console.log('-> Captured p05_4_03_illora_ai_3d.png');

    // Horizontal Scroll to Card 4: EXPERIMENTAL WORKS
    console.log('6. Navigating to Card 4 (EXPERIMENTAL WORKS Liquid Chrome Torus)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          if (cards[3]) cards[3].scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
        })()
      `,
    });
    await wait(1200);

    const expMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#work article');
          const card = cards[3];
          const canvas = card ? card.querySelector('canvas') : null;
          return {
            cardFound: !!card,
            canvasFound: !!canvas,
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Experimental Chrome 3D Metrics:', expMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/p05_4_04_experimental_chrome_3d.png`);
    console.log('-> Captured p05_4_04_experimental_chrome_3d.png');

    // Multi-viewport QA across 6 standard screen sizes
    console.log('7. Running Multi-Viewport QA across 6 standard screen sizes...');
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
            const work = document.getElementById('work');
            if (work) work.scrollIntoView({ behavior: 'instant', block: 'start' });
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
      await captureScreenshot(client, `${framesDir}/p05_4_vp_${vp.name}.png`);
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

