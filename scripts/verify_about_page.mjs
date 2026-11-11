import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_about';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\about_frames';
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

async function evaluate(client, expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result ? res.result.value : null;
}

async function main() {
  const port = 9301;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250/about'
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        versionData = await res.json();
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {}
      await wait(300);
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Chrome remote debugging did not respond.');
    }

    const browserClient = new CDPClient(versionData.webSocketDebuggerUrl);
    await browserClient.connect();

    const targets = await browserClient.send('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page');

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('[1/6] Navigating to http://localhost:4250/about...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/about' });
    await wait(4000);

    await evaluate(client, 'document.fonts.ready');

    // 1. Structure Verification
    console.log('[2/6] Verifying all 6 sections + official footer on /about...');
    const pageAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('about-hero');
      const canvas3D = hero ? hero.querySelector('canvas') : null;
      const philosophy = document.getElementById('studio-philosophy');
      const whoWeAre = document.getElementById('who-we-are');
      const approach = document.getElementById('our-approach');
      const capabilities = document.getElementById('creative-capabilities');
      const cta = document.getElementById('about-cta');
      const footer = document.getElementById('site-footer');

      return {
        title: document.title,
        hasHero: !!hero,
        hasCanvas3D: !!canvas3D,
        canvasSize: canvas3D ? { w: canvas3D.width, h: canvas3D.height } : null,
        hasPhilosophy: !!philosophy,
        hasWhoWeAre: !!whoWeAre,
        hasApproach: !!approach,
        principlesCount: approach ? approach.querySelectorAll('article').length : 0,
        hasCapabilities: !!capabilities,
        capabilitiesCount: capabilities ? capabilities.querySelectorAll('.group').length : 0,
        hasCTA: !!cta,
        hasFooter: !!footer
      };
    })()`);
    console.log('About Page Structure Audit:', pageAudit);

    // 2. Capture Each Section at 1920x1080
    console.log('[3/6] Capturing high-resolution section screenshots...');
    
    // Section 1: Hero
    const s1Path = `${framesDir}\\about_01_hero_3d.png`;
    await captureScreenshot(client, s1Path);
    copyFileSync(s1Path, `${artifactDir}\\about_01_hero_3d.png`);

    // Section 2: Philosophy
    await evaluate(client, `document.getElementById('studio-philosophy')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s2Path = `${framesDir}\\about_02_philosophy.png`;
    await captureScreenshot(client, s2Path);
    copyFileSync(s2Path, `${artifactDir}\\about_02_philosophy.png`);

    // Section 3: Who We Are
    await evaluate(client, `document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s3Path = `${framesDir}\\about_03_who_we_are.png`;
    await captureScreenshot(client, s3Path);
    copyFileSync(s3Path, `${artifactDir}\\about_03_who_we_are.png`);

    // Section 4: Our Approach (click principle 2 to test interactivity)
    await evaluate(client, `(() => {
      const el = document.getElementById('our-approach');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        const articles = el.querySelectorAll('article');
        if (articles[1]) articles[1].click();
      }
    })()`);
    await wait(600);
    const s4Path = `${framesDir}\\about_04_our_approach.png`;
    await captureScreenshot(client, s4Path);
    copyFileSync(s4Path, `${artifactDir}\\about_04_our_approach.png`);

    // Section 5: Creative Capabilities
    await evaluate(client, `document.getElementById('creative-capabilities')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s5Path = `${framesDir}\\about_05_capabilities.png`;
    await captureScreenshot(client, s5Path);
    copyFileSync(s5Path, `${artifactDir}\\about_05_capabilities.png`);

    // Section 6 & 7: CTA and Footer
    await evaluate(client, `document.getElementById('about-cta')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s6Path = `${framesDir}\\about_06_cta_and_footer.png`;
    await captureScreenshot(client, s6Path);
    copyFileSync(s6Path, `${artifactDir}\\about_06_cta_and_footer.png`);

    // 3. Multi-Viewport Testing Across All 6 Dimensions
    console.log('[4/6] Running multi-viewport responsive testing...');
    const viewports = [
      { name: '1920x1080', width: 1920, height: 1080 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1280x800', width: 1280, height: 800 },
      { name: '768x1024', width: 768, height: 1024 },
      { name: '390x844', width: 390, height: 844 },
      { name: '375x812', width: 375, height: 812 },
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await setViewport(client, vp.width, vp.height);
      await evaluate(client, `window.scrollTo(0, 0)`);
      await wait(600);

      const metrics = await evaluate(client, `(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const overflow = Math.max(0, scrollWidth - windowWidth);
        const hero = document.getElementById('about-hero');
        const h1 = hero ? hero.querySelector('h1') : null;
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        return {
          overflow,
          h1Width: h1Rect ? Math.round(h1Rect.width) : 0,
          isH1Clipped: h1Rect ? (h1Rect.right > windowWidth) : false
        };
      })()`);

      const vpPath = `${framesDir}\\about_vp_${vp.name}.png`;
      await captureScreenshot(client, vpPath);
      copyFileSync(vpPath, `${artifactDir}\\about_vp_${vp.name}.png`);

      vpResults.push({
        ...vp,
        metrics
      });

      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.isH1Clipped}`);
    }

    console.log('[5/6] Saving verification report...');
    writeFileSync(`${artifactDir}\\about_page_report.json`, JSON.stringify({
      pageAudit,
      vpResults
    }, null, 2));

    await client.close();
    await browserClient.close();
    console.log('[6/6] About page verification completed successfully!');
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error('CDP verification error:', err);
  process.exit(1);
});

