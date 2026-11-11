import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_hero_clean';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\hero_clean_frames';
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
  console.log('--- STARTING HERO CLEANUP VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9265',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9265/json');
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

    // 1. Verify Hero Description Removal
    console.log('2. Inspecting Hero Description Removal & CTA Position...');
    const heroMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const heroSection = document.getElementById('hero-section');
          const descriptionText = "We transform ambitious ideas into distinctive digital experiences";
          const hasDescText = heroSection ? heroSection.innerText.includes(descriptionText) : false;
          
          const headline = heroSection ? heroSection.querySelector('h1') : null;
          const headlineRect = headline ? headline.getBoundingClientRect() : null;
          
          const ctaPrimary = heroSection ? heroSection.querySelector('a[href="/work"]') : null;
          const ctaRect = ctaPrimary ? ctaPrimary.getBoundingClientRect() : null;
          
          const distanceBetweenHeadlineAndCta = (headlineRect && ctaRect)
            ? Math.round(ctaRect.top - headlineRect.bottom)
            : null;

          return {
            heroExists: !!heroSection,
            hasDescText,
            headlineText: headline ? headline.innerText.replace(/\\s+/g, ' ').trim() : '',
            headlineBottom: headlineRect ? Math.round(headlineRect.bottom) : null,
            ctaTop: ctaRect ? Math.round(ctaRect.top) : null,
            gapHeadlineToCta: distanceBetweenHeadlineAndCta
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Hero Structure Metrics:', heroMetrics.result.value);

    // Capture Frame 1: Full Hero Section with Headline and Raised CTAs
    await captureScreenshot(client, `${framesDir}/hero_clean_01_hero_desktop.png`);
    console.log('-> Captured hero_clean_01_hero_desktop.png');

    // 2. Verify Navigation Audio Controller (Sound [OFF] removed)
    console.log('3. Inspecting Navigation Sound Control...');
    const audioMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('header button[aria-label*="ambient sound"]');
          if (!btn) return { found: false };
          const rect = btn.getBoundingClientRect();
          const hasEqualizerBars = btn.querySelectorAll('span span').length >= 4;
          return {
            found: true,
            rawText: btn.innerText.trim(),
            hasSoundText: btn.innerText.toUpperCase().includes('SOUND'),
            hasOffText: btn.innerText.toUpperCase().includes('OFF'),
            hasEqualizerBars,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            ariaLabel: btn.getAttribute('aria-label')
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Audio Controller Metrics:', audioMetrics.result.value);

    // Capture Frame 2: Navigation Audio Button
    await captureScreenshot(client, `${framesDir}/hero_clean_02_audio_control_idle.png`);
    console.log('-> Captured hero_clean_02_audio_control_idle.png');

    // 3. Test Audio Toggle Click
    console.log('4. Testing Audio Controller Toggle Click...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('header button[aria-label*="ambient sound"]');
          if (btn) btn.click();
        })()
      `,
    });
    await wait(800);

    const toggledMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('header button[aria-label*="ambient sound"]');
          return {
            ariaLabelAfterClick: btn ? btn.getAttribute('aria-label') : null,
            textAfterClick: btn ? btn.innerText.trim() : null
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Audio Controller After Click:', toggledMetrics.result.value);
    await captureScreenshot(client, `${framesDir}/hero_clean_03_audio_control_toggled.png`);
    console.log('-> Captured hero_clean_03_audio_control_toggled.png');

    // 4. Test Mobile Viewport at 390x844
    console.log('5. Testing Mobile Viewport at 390x844...');
    await setViewport(client, 390, 844);
    await client.send('Page.navigate', { url: 'http://localhost:4208/' });
    await wait(2000);
    await captureScreenshot(client, `${framesDir}/hero_clean_04_mobile_hero.png`);
    console.log('-> Captured hero_clean_04_mobile_hero.png');

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
      await captureScreenshot(client, `${framesDir}/hero_clean_vp_${vp.name}.png`);
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

