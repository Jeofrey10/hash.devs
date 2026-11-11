import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p53';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\qa_frames';
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
  console.log('--- STARTING PHASE 05.3 PRODUCTION QA VERIFICATION ---');

  // Launch Chrome with angle backend
  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9233/json');
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
    await wait(3000);

    // Scroll directly to #work section
    console.log('2. Scrolling to #work section...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1500);

    // Capture Frame 1: Pixwall in Gallery
    await captureScreenshot(client, `${framesDir}/qa_01_gallery_pixwall.png`);
    console.log('-> Captured qa_01_gallery_pixwall.png');

    // Horizontal scrub to Card 2: Vox AI
    console.log('3. Scrubbing to Card 2: VOX AI...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 800, behavior: 'instant' })`,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/qa_02_gallery_vox_ai.png`);
    console.log('-> Captured qa_02_gallery_vox_ai.png');

    // Horizontal scrub to Card 3: Illora AI
    console.log('4. Scrubbing to Card 3: ILLORA AI...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 850, behavior: 'instant' })`,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/qa_03_gallery_illora_ai.png`);
    console.log('-> Captured qa_03_gallery_illora_ai.png');

    // Horizontal scrub to Card 4: Experimental Works (Torus Knot WebGL)
    console.log('5. Scrubbing to Card 4: EXPERIMENTAL WORKS...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 900, behavior: 'instant' })`,
    });
    await wait(1200);
    await captureScreenshot(client, `${framesDir}/qa_04_gallery_experimental.png`);
    console.log('-> Captured qa_04_gallery_experimental.png');

    // Verify reverse scrolling
    console.log('6. Testing reverse scroll back to Card 1...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: -2550, behavior: 'instant' })`,
    });
    await wait(1000);
    const counterText = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const c = document.querySelector('[class*="counterRef"]') || Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('/ 04'));
          return c ? c.innerText : 'not found';
        })()
      `,
      returnByValue: true,
    });
    console.log('Reverse scroll counter indicator:', counterText.result.value);

    // Click Card 1 (Pixwall) to test transition and navigation
    console.log('7. Clicking Pixwall card to trigger CaseStudyTransition...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const link = document.querySelector('a[href="/work/pixwall"]');
          if (link) link.click();
        })()
      `,
    });
    await wait(350);
    await captureScreenshot(client, `${framesDir}/qa_05_pixwall_curtain_transition.png`);
    console.log('-> Captured qa_05_pixwall_curtain_transition.png');

    await wait(1500);
    await captureScreenshot(client, `${framesDir}/qa_06_pixwall_case_study_hero.png`);
    console.log('-> Captured qa_06_pixwall_case_study_hero.png');

    // Scroll down Pixwall Case Study to Story & Visual
    console.log('8. Scrolling through Pixwall Case Study chapters...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 900, behavior: 'instant' })`,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/qa_07_pixwall_editorial_story.png`);
    console.log('-> Captured qa_07_pixwall_editorial_story.png');

    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 1100, behavior: 'instant' })`,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/qa_08_pixwall_visual_architecture.png`);
    console.log('-> Captured qa_08_pixwall_visual_architecture.png');

    // Test direct route loading of Vox AI
    console.log('9. Direct URL loading of /work/vox-ai...');
    await client.send('Page.navigate', { url: 'http://localhost:4208/work/vox-ai' });
    await wait(1800);
    await captureScreenshot(client, `${framesDir}/qa_09_vox_ai_case_study.png`);
    console.log('-> Captured qa_09_vox_ai_case_study.png');

    // Test direct route loading of Illora AI
    console.log('10. Direct URL loading of /work/illora-ai...');
    await client.send('Page.navigate', { url: 'http://localhost:4208/work/illora-ai' });
    await wait(1800);
    await captureScreenshot(client, `${framesDir}/qa_10_illora_ai_case_study.png`);
    console.log('-> Captured qa_10_illora_ai_case_study.png');

    // Test direct route loading of Experimental Works
    console.log('11. Direct URL loading of /work/experimental...');
    await client.send('Page.navigate', { url: 'http://localhost:4208/work/experimental' });
    await wait(2200);
    await captureScreenshot(client, `${framesDir}/qa_11_experimental_case_study.png`);
    console.log('-> Captured qa_11_experimental_case_study.png');

    // Scroll to bottom of /work/experimental to test circular next navigation
    console.log('12. Testing circular next navigation from Experimental back to Pixwall...');
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })`,
    });
    await wait(800);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const nextLink = document.querySelector('a[href="/work/pixwall"]');
          if (nextLink) nextLink.click();
        })()
      `,
    });
    await wait(1800);
    await captureScreenshot(client, `${framesDir}/qa_12_circular_returned_to_pixwall.png`);
    console.log('-> Captured qa_12_circular_returned_to_pixwall.png');

    // Click Return to Selected Works Archive
    console.log('13. Returning to Selected Works Archive (/#work)...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const backLink = document.querySelector('a[href="/#work"]');
          if (backLink) backLink.click();
        })()
      `,
    });
    await wait(1800);
    await captureScreenshot(client, `${framesDir}/qa_13_returned_to_home_gallery.png`);
    console.log('-> Captured qa_13_returned_to_home_gallery.png');

    // 14. Responsive Verification across all 6 resolutions
    console.log('14. Running Multi-Viewport QA across 6 standard screen sizes...');
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
      await client.send('Page.navigate', { url: 'http://localhost:4208/#work' });
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

      await captureScreenshot(client, `${framesDir}/qa_vp_${vp.name}.png`);
      vpResults.push({
        name: vp.name,
        width: vp.width,
        height: vp.height,
        ...overflowMetrics.result.value,
      });
      console.log(`Viewport ${vp.name}: overflow = ${overflowMetrics.result.value.overflow} (diff = ${overflowMetrics.result.value.diff}px)`);
    }

    console.log('--- ALL QA TESTS FINISHED ---');
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

