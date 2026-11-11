import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_frames';
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
    mobile: false,
  });
}

async function main() {
  console.log('--- STARTING PHASE 06 STUDIO PROCESS VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9244',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9244/json');
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

    // Scroll to #process section
    console.log('2. Scrolling to #process section...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('process');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1500);

    // Capture Frame 1: Process Section Header & Stage 01
    await captureScreenshot(client, `${framesDir}/p06_01_process_header_stage01.png`);
    console.log('-> Captured p06_01_process_header_stage01.png');

    // Scroll down to activate Stage 02: Strategy & Direction
    console.log('3. Scrolling to activate Stage 02 (STRATEGY & DIRECTION)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[1]) {
            articles[1].click();
            articles[1].scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p06_02_stage02_strategy.png`);
    console.log('-> Captured p06_02_stage02_strategy.png');

    // Scroll down to activate Stage 03: Design & Engineer
    console.log('4. Scrolling to activate Stage 03 (DESIGN & ENGINEER)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[2]) {
            articles[2].click();
            articles[2].scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p06_03_stage03_engineer.png`);
    console.log('-> Captured p06_03_stage03_engineer.png');

    // Scroll down to activate Stage 04: Launch & Evolve
    console.log('5. Scrolling to activate Stage 04 (LAUNCH & EVOLVE)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[3]) {
            articles[3].click();
            articles[3].scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p06_04_stage04_evolve.png`);
    console.log('-> Captured p06_04_stage04_evolve.png');

    // Scroll to bottom of #process: Monumental Closing Statement / Studio Position
    console.log('6. Scrolling to Studio Position Manifesto...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const processEl = document.getElementById('process');
          if (processEl) {
            window.scrollTo({ top: processEl.offsetTop + processEl.offsetHeight - window.innerHeight, behavior: 'instant' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p06_05_studio_position_manifesto.png`);
    console.log('-> Captured p06_05_studio_position_manifesto.png');

    // Test reverse scroll back to Stage 01
    console.log('7. Testing reverse scroll back to Stage 01...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[0]) {
            articles[0].click();
            articles[0].scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p06_06_reverse_scroll_stage01.png`);
    console.log('-> Captured p06_06_reverse_scroll_stage01.png');

    // 8. Multi-Viewport Verification across 6 standard screen sizes
    console.log('8. Running Multi-Viewport QA across 6 standard screen sizes...');
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
      await client.send('Page.navigate', { url: 'http://localhost:4208/#process' });
      await wait(1500);

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

      await captureScreenshot(client, `${framesDir}/p06_vp_${vp.name}.png`);
      vpResults.push({
        name: vp.name,
        width: vp.width,
        height: vp.height,
        ...overflowMetrics.result.value,
      });
      console.log(`Viewport ${vp.name}: overflow = ${overflowMetrics.result.value.overflow} (diff = ${overflowMetrics.result.value.diff}px)`);
    }

    console.log('--- ALL PHASE 06 VERIFICATION TESTS FINISHED ---');
    console.log('Console Errors detected:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error(consoleErrors);
    }
    console.log('Viewport Results Summary:', JSON.stringify(vpResults, null, 2));

    await client.close();
  } finally {
    cp.kill();
  }
}

main().catch(console.error);

