import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_manifesto';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\manifesto_repair_frames';
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

async function captureScreenshot(client, path, clip = null) {
  const params = { format: 'png' };
  if (clip) params.clip = clip;
  const result = await client.send('Page.captureScreenshot', params);
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
  console.log('=== STARTING STUDIO MANIFESTO REPAIR VERIFICATION ===');

  const server = spawn('npx', ['vite', 'preview', '--port', '4230'], {
    shell: true,
    stdio: 'pipe',
  });

  await wait(3000);

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9270',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2500);

  try {
    const res = await fetch('http://localhost:9270/json');
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

    console.log('1. Loading page at 1440x900...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4230/' });
    await wait(2500);

    // Scroll to Manifesto block
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

    // Get Manifesto bounding box
    const manifestoBox = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const h2 = el.querySelector('h2');
          const canvas = el.querySelector('canvas');
          const comp = h2 ? window.getComputedStyle(h2) : null;
          return {
            x: Math.max(0, rect.left),
            y: Math.max(0, rect.top),
            width: Math.min(1440, rect.width),
            height: rect.height,
            h2Text: h2 ? h2.innerText.replace(/\\s+/g, ' ').trim() : '',
            h2Visible: h2 ? comp.display !== 'none' && comp.visibility !== 'hidden' && comp.opacity !== '0' : false,
            h2Color: comp ? comp.color : '',
            h2Font: comp ? comp.fontFamily : '',
            canvasExists: !!canvas,
            canvasAriaHidden: canvas ? canvas.getAttribute('aria-hidden') : null
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Manifesto Box & Typography metrics:', manifestoBox.result.value);

    // Capture initial static resting state
    const shot01 = `${framesDir}/manifesto_01_solid_headline_at_rest.png`;
    await captureScreenshot(client, shot01);
    copyFileSync(shot01, `${artifactDir}/manifesto_01_solid_headline_at_rest.png`);
    console.log('-> Captured manifesto_01_solid_headline_at_rest.png');

    // 3. Move cursor to interact with headline
    console.log('3. Hovering cursor over headline lines...');
    const headlineCenter = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const h2 = document.querySelector('#studio-manifesto-block h2');
          if (!h2) return null;
          const rect = h2.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height * 0.3
          };
        })()
      `,
      returnByValue: true,
    });

    if (headlineCenter.result.value) {
      const { x, y } = headlineCenter.result.value;
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x,
        y,
      });
      await wait(600);

      const shot02 = `${framesDir}/manifesto_02_cursor_interaction_active.png`;
      await captureScreenshot(client, shot02);
      copyFileSync(shot02, `${artifactDir}/manifesto_02_cursor_interaction_active.png`);
      console.log('-> Captured manifesto_02_cursor_interaction_active.png');

      // Move cursor to bottom line
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: x + 40,
        y: y + 80,
      });
      await wait(600);

      const shot03 = `${framesDir}/manifesto_03_cursor_line7_interaction.png`;
      await captureScreenshot(client, shot03);
      copyFileSync(shot03, `${artifactDir}/manifesto_03_cursor_line7_interaction.png`);
      console.log('-> Captured manifesto_03_cursor_line7_interaction.png');

      // Move cursor away
      console.log('4. Moving cursor out of section...');
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: 10,
        y: 10,
      });
      await wait(1200);

      const shot04 = `${framesDir}/manifesto_04_particles_returned_rest.png`;
      await captureScreenshot(client, shot04);
      copyFileSync(shot04, `${artifactDir}/manifesto_04_particles_returned_rest.png`);
      console.log('-> Captured manifesto_04_particles_returned_rest.png');
    }

    // 5. Test Reverse Scrolling
    console.log('5. Testing reverse scroll restoration...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' });`,
    });
    await wait(1000);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(1000);

    const shot05 = `${framesDir}/manifesto_05_reverse_scroll_restored.png`;
    await captureScreenshot(client, shot05);
    copyFileSync(shot05, `${artifactDir}/manifesto_05_reverse_scroll_restored.png`);
    console.log('-> Captured manifesto_05_reverse_scroll_restored.png');

    // 6. Multi-Viewport Layout QA across 6 standard screen sizes
    console.log('6. Running Multi-Viewport QA across 6 screen sizes...');
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
      await client.send('Page.navigate', { url: 'http://localhost:4230/' });
      await wait(1500);

      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('studio-manifesto-block');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()
        `,
      });
      await wait(1000);

      const overflow = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const h2 = document.querySelector('#studio-manifesto-block h2');
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
              h2Width: h2 ? h2.scrollWidth : 0,
              h2ClientWidth: h2 ? h2.clientWidth : 0
            };
          })()
        `,
        returnByValue: true,
      });

      const shotPath = `${framesDir}/manifesto_vp_${vp.name}.png`;
      await captureScreenshot(client, shotPath);
      copyFileSync(shotPath, `${artifactDir}/manifesto_vp_${vp.name}.png`);

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

    // 7. Test Reduced Motion
    console.log('7. Testing prefers-reduced-motion fallback...');
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await client.send('Page.navigate', { url: 'http://localhost:4230/' });
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

    const reducedMotionAudit = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          const h2 = el ? el.querySelector('h2') : null;
          const canvas = el ? el.querySelector('canvas') : null;
          return {
            h2Exists: !!h2,
            h2Text: h2 ? h2.innerText.replace(/\\s+/g, ' ').trim() : '',
            canvasExists: !!canvas
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Reduced Motion Audit:', reducedMotionAudit.result.value);

    const shotReduced = `${framesDir}/manifesto_06_reduced_motion_static.png`;
    await captureScreenshot(client, shotReduced);
    copyFileSync(shotReduced, `${artifactDir}/manifesto_06_reduced_motion_static.png`);
    console.log('-> Captured manifesto_06_reduced_motion_static.png');

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

