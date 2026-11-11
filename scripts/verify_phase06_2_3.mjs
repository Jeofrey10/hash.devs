import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_2_3';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_2_3_frames';
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
  console.log('=== STARTING PHASE 06.2.3 VERIFICATION ===');

  const server = spawn('npx', ['vite', 'preview', '--port', '4245'], {
    shell: true,
    stdio: 'pipe',
  });

  await wait(3000);

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9285',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2500);

  try {
    const res = await fetch('http://localhost:9285/json');
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

    // 1. Initial State at Rest (1440x900)
    console.log('1. Loading page at 1440x900...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4245/' });
    await wait(2500);

    console.log('2. Scrolling to #studio-manifesto-block...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(1200);

    const restMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          const h2 = el ? el.querySelector('h2') : null;
          const canvas = el ? el.querySelector('canvas') : null;
          const comp = h2 ? window.getComputedStyle(h2) : null;
          const spans = Array.from(el.querySelectorAll('.manifesto-line'));

          return {
            h2Exists: !!h2,
            h2Text: h2 ? h2.innerText.replace(/\\s+/g, ' ').trim() : '',
            h2Visible: comp ? comp.display !== 'none' && comp.visibility !== 'hidden' && comp.opacity !== '0' : false,
            h2Color: comp ? comp.color : '',
            h2Font: comp ? comp.fontFamily : '',
            canvasExists: !!canvas,
            canvasAriaHidden: canvas ? canvas.getAttribute('aria-hidden') : null,
            lineCount: spans.length,
            lines: spans.map(s => s.innerText.trim())
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Rest Metrics:', restMetrics.result.value);

    // State 1: Crisp Headline at Rest (Zero ghosting)
    const shot01 = `${framesDir}/p06_2_3_01_headline_at_rest.png`;
    await captureScreenshot(client, shot01);
    copyFileSync(shot01, `${artifactDir}/p06_2_3_01_headline_at_rest.png`);
    console.log('-> Captured p06_2_3_01_headline_at_rest.png');

    // 2. Cursor Interaction - Top Line
    console.log('3. Hovering cursor over top line (GREAT PRODUCTS ARE)...');
    const topLinePos = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const span = document.querySelector('.manifesto-line');
          if (!span) return null;
          const rect = span.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `,
      returnByValue: true,
    });

    if (topLinePos.result.value) {
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: topLinePos.result.value.x,
        y: topLinePos.result.value.y,
      });
      await wait(600);

      const shot02 = `${framesDir}/p06_2_3_02_cursor_top_line.png`;
      await captureScreenshot(client, shot02);
      copyFileSync(shot02, `${artifactDir}/p06_2_3_02_cursor_top_line.png`);
      console.log('-> Captured p06_2_3_02_cursor_top_line.png');
    }

    // 3. Cursor Interaction - Center Line (RIGOROUS ARCHITECTURE,)
    console.log('4. Hovering cursor over center line (RIGOROUS ARCHITECTURE,)...');
    const centerLinePos = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const spans = document.querySelectorAll('.manifesto-line');
          const span = spans[3] || spans[0];
          const rect = span.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `,
      returnByValue: true,
    });

    if (centerLinePos.result.value) {
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: centerLinePos.result.value.x,
        y: centerLinePos.result.value.y,
      });
      await wait(600);

      const shot03 = `${framesDir}/p06_2_3_03_cursor_center_line.png`;
      await captureScreenshot(client, shot03);
      copyFileSync(shot03, `${artifactDir}/p06_2_3_03_cursor_center_line.png`);
      console.log('-> Captured p06_2_3_03_cursor_center_line.png');
    }

    // 4. Cursor Interaction - Bottom Line (ENGINEERING.)
    console.log('5. Hovering cursor over bottom line (ENGINEERING.)...');
    const bottomLinePos = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const spans = document.querySelectorAll('.manifesto-line');
          const span = spans[spans.length - 1];
          const rect = span.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `,
      returnByValue: true,
    });

    if (bottomLinePos.result.value) {
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: bottomLinePos.result.value.x,
        y: bottomLinePos.result.value.y,
      });
      await wait(600);

      const shot04 = `${framesDir}/p06_2_3_04_cursor_bottom_line.png`;
      await captureScreenshot(client, shot04);
      copyFileSync(shot04, `${artifactDir}/p06_2_3_04_cursor_bottom_line.png`);
      console.log('-> Captured p06_2_3_04_cursor_bottom_line.png');
    }

    // 5. Cursor Exit & Full Return
    console.log('6. Moving cursor out of section and waiting for rest...');
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 10,
      y: 10,
    });
    await wait(1400);

    const shot05 = `${framesDir}/p06_2_3_05_cursor_exit_restored.png`;
    await captureScreenshot(client, shot05);
    copyFileSync(shot05, `${artifactDir}/p06_2_3_05_cursor_exit_restored.png`);
    console.log('-> Captured p06_2_3_05_cursor_exit_restored.png');

    // 6. Reverse Scroll Test
    console.log('7. Testing reverse scroll restoration...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' });`,
    });
    await wait(800);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(800);

    const shot06 = `${framesDir}/p06_2_3_06_reverse_scroll_restored.png`;
    await captureScreenshot(client, shot06);
    copyFileSync(shot06, `${artifactDir}/p06_2_3_06_reverse_scroll_restored.png`);
    console.log('-> Captured p06_2_3_06_reverse_scroll_restored.png');

    // 7. Multi-Viewport Layout QA across 6 standard screen sizes
    console.log('8. Running Multi-Viewport QA across 6 screen sizes...');
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
      await client.send('Page.navigate', { url: 'http://localhost:4245/' });
      await wait(1500);

      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('studio-manifesto-block');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()
        `,
      });
      await wait(800);

      const overflow = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const h2 = document.querySelector('#studio-manifesto-block h2');
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
              h2ScrollWidth: h2 ? h2.scrollWidth : 0,
              h2ClientWidth: h2 ? h2.clientWidth : 0
            };
          })()
        `,
        returnByValue: true,
      });

      const shotPath = `${framesDir}/p06_2_3_vp_${vp.name}.png`;
      await captureScreenshot(client, shotPath);
      copyFileSync(shotPath, `${artifactDir}/p06_2_3_vp_${vp.name}.png`);

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

    // 8. Reduced Motion Mode
    console.log('9. Testing prefers-reduced-motion fallback...');
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await client.send('Page.navigate', { url: 'http://localhost:4245/' });
    await wait(2000);

    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(1000);

    const shotReduced = `${framesDir}/p06_2_3_07_reduced_motion_static.png`;
    await captureScreenshot(client, shotReduced);
    copyFileSync(shotReduced, `${artifactDir}/p06_2_3_07_reduced_motion_static.png`);
    console.log('-> Captured p06_2_3_07_reduced_motion_static.png');

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

