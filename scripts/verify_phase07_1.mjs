import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p07_1';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p07_1_frames';
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
  console.log('--- STARTING PHASE 07.1 CINEMATIC EDITORIAL FOOTER VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9258',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9258/json');
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

    // Scroll to #site-footer
    console.log('2. Scrolling to #site-footer...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1200);

    // Capture Frame 1: Zone A - Collaboration Banner
    await captureScreenshot(client, `${framesDir}/p07_1_01_collaboration_banner.png`);
    console.log('-> Captured p07_1_01_collaboration_banner.png');

    // Inspect Zone A properties
    const zoneAMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const banner = document.getElementById('collaboration-banner');
          const headline = banner ? banner.querySelector('h2') : null;
          const bg = banner ? window.getComputedStyle(banner).backgroundColor : '';
          return {
            exists: !!banner,
            headlineText: headline ? headline.innerText.replace(/\\s+/g, ' ').trim() : '',
            bg
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Zone A metrics:', zoneAMetrics.result.value);

    // Test GET IN TOUCH interaction
    console.log('3. Testing GET IN TOUCH smooth-scroll link to #contact...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const getInTouchLink = document.querySelector('a[href="#contact"]');
          if (getInTouchLink) getInTouchLink.click();
        })()
      `,
    });
    await wait(1500);

    const scrollPosAfterClick = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const contact = document.getElementById('contact');
          const rect = contact ? contact.getBoundingClientRect() : null;
          return {
            contactTop: rect ? rect.top : null,
            scrollY: window.scrollY
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Scroll position after GET IN TOUCH click:', scrollPosAfterClick.result.value);
    await captureScreenshot(client, `${framesDir}/p07_1_02_contact_scrolled_to.png`);
    console.log('-> Captured p07_1_02_contact_scrolled_to.png');

    // Scroll back down to footer to capture Zone B and Zone C
    console.log('4. Scrolling to Zone B Information & Zone C Wordmark...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1200);
    await captureScreenshot(client, `${framesDir}/p07_1_03_information_and_wordmark.png`);
    console.log('-> Captured p07_1_03_information_and_wordmark.png');

    // Inspect Zone B and Zone C elements
    const footerContentMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const infoFooter = document.getElementById('information-footer');
          const wordmark = document.getElementById('footer-wordmark');
          const wordmarkHeading = wordmark ? wordmark.querySelector('h2') : null;
          return {
            infoFooterExists: !!infoFooter,
            infoBg: infoFooter ? window.getComputedStyle(infoFooter).backgroundColor : '',
            wordmarkExists: !!wordmark,
            wordmarkText: wordmarkHeading ? wordmarkHeading.innerText.trim() : '',
            wordmarkComputedFont: wordmarkHeading ? window.getComputedStyle(wordmarkHeading).fontFamily : '',
            wordmarkFontSize: wordmarkHeading ? window.getComputedStyle(wordmarkHeading).fontSize : '',
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Footer Zone B & C metrics:', footerContentMetrics.result.value);

    // Capture entire footer overview
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const banner = document.getElementById('collaboration-banner');
          if (banner) {
            window.scrollTo({ top: banner.offsetTop + 100, behavior: 'instant' });
          }
        })()
      `,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/p07_1_04_footer_transition_overview.png`);
    console.log('-> Captured p07_1_04_footer_transition_overview.png');

    // Test direct route /contact footer presence
    console.log('5. Testing /contact standalone route with footer integration...');
    await client.send('Page.navigate', { url: 'http://localhost:4208/contact' });
    await wait(2000);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.getElementById('site-footer');
          if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p07_1_05_direct_contact_footer.png`);
    console.log('-> Captured p07_1_05_direct_contact_footer.png');

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

      await captureScreenshot(client, `${framesDir}/p07_1_vp_${vp.name}.png`);
      console.log(`-> Captured p07_1_vp_${vp.name}.png`);
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
