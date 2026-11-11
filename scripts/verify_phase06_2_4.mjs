import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_2_4';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_2_4_frames';
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
  console.log('=== STARTING PHASE 06.2.4 VERIFICATION ===');

  const server = spawn('npx', ['vite', 'preview', '--port', '4250'], {
    shell: true,
    stdio: 'pipe',
  });

  await wait(3000);

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9290',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2500);

  try {
    const res = await fetch('http://localhost:9290/json');
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
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(2500);

    console.log('2. Scrolling to Studio Process section (#process)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('process');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1200);

    const shot01 = `${framesDir}/p06_2_4_01_header_and_stage01.png`;
    await captureScreenshot(client, shot01);
    copyFileSync(shot01, `${artifactDir}/p06_2_4_01_header_and_stage01.png`);
    console.log('-> Captured p06_2_4_01_header_and_stage01.png');

    // 2. Select Stage 02: STRATEGY & DIRECTION
    console.log('3. Selecting Stage 02 (STRATEGY & DIRECTION)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[1]) articles[1].click();
        })()
      `,
    });
    await wait(600);

    const shot02 = `${framesDir}/p06_2_4_02_stage02_expanded.png`;
    await captureScreenshot(client, shot02);
    copyFileSync(shot02, `${artifactDir}/p06_2_4_02_stage02_expanded.png`);
    console.log('-> Captured p06_2_4_02_stage02_expanded.png');

    // 3. Select Stage 03: DESIGN & ENGINEER
    console.log('4. Selecting Stage 03 (DESIGN & ENGINEER)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[2]) articles[2].click();
        })()
      `,
    });
    await wait(600);

    const shot03 = `${framesDir}/p06_2_4_03_stage03_expanded.png`;
    await captureScreenshot(client, shot03);
    copyFileSync(shot03, `${artifactDir}/p06_2_4_03_stage03_expanded.png`);
    console.log('-> Captured p06_2_4_03_stage03_expanded.png');

    // 4. Select Stage 04: LAUNCH & EVOLVE
    console.log('5. Selecting Stage 04 (LAUNCH & EVOLVE)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const articles = document.querySelectorAll('#process article');
          if (articles[3]) articles[3].click();
        })()
      `,
    });
    await wait(600);

    const shot04 = `${framesDir}/p06_2_4_04_stage04_expanded.png`;
    await captureScreenshot(client, shot04);
    copyFileSync(shot04, `${artifactDir}/p06_2_4_04_stage04_expanded.png`);
    console.log('-> Captured p06_2_4_04_stage04_expanded.png');

    // 5. Scroll down to Studio Position Manifesto
    console.log('6. Verifying Studio Position Manifesto directly below...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('studio-manifesto-block');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `,
    });
    await wait(1000);

    const shotManifesto = `${framesDir}/p06_2_4_05_manifesto_intact.png`;
    await captureScreenshot(client, shotManifesto);
    copyFileSync(shotManifesto, `${artifactDir}/p06_2_4_05_manifesto_intact.png`);
    console.log('-> Captured p06_2_4_05_manifesto_intact.png');

    // 6. Scroll down to verify Footer remains 100% UNTOUCHED
    console.log('7. Verifying Official Footer remains untouched...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('site-footer');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1000);

    const footerAudit = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const banner = document.getElementById('collaboration-banner');
          const info = document.getElementById('information-footer');
          const wordmark = document.getElementById('footer-wordmark');
          const logoImg = wordmark ? wordmark.querySelector('img') : null;
          return {
            bannerExists: !!banner,
            bannerHeadline: banner ? banner.querySelector('h2')?.innerText.replace(/\\s+/g, ' ').trim() : '',
            infoExists: !!info,
            wordmarkLogoSrc: logoImg ? logoImg.getAttribute('src') : null,
            isMonumentalLogo: logoImg ? logoImg.getAttribute('src').includes('hashdevs-logo-dark-monumental') : false
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Footer Integrity Audit:', footerAudit.result.value);

    const shotFooter = `${framesDir}/p06_2_4_06_footer_untouched.png`;
    await captureScreenshot(client, shotFooter);
    copyFileSync(shotFooter, `${artifactDir}/p06_2_4_06_footer_untouched.png`);
    console.log('-> Captured p06_2_4_06_footer_untouched.png');

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
      await client.send('Page.navigate', { url: 'http://localhost:4250/' });
      await wait(1500);

      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('process');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          })()
        `,
      });
      await wait(800);

      const overflow = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            };
          })()
        `,
        returnByValue: true,
      });

      const shotPath = `${framesDir}/p06_2_4_vp_${vp.name}.png`;
      await captureScreenshot(client, shotPath);
      copyFileSync(shotPath, `${artifactDir}/p06_2_4_vp_${vp.name}.png`);

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

