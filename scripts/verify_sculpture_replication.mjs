import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p08_1';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p08_1_frames';
mkdirSync(framesDir, { recursive: true });
const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

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
  const port = 9303;
  console.log('[1/6] Launching Chrome on port 9303...');
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250/services'
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

    // 1. Audit & Capture About Page Hero (Source of Truth)
    console.log('[2/6] Navigating to /about to capture reference sculpture...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/about' });
    await wait(3500);
    await evaluate(client, 'document.fonts.ready');

    const aboutAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('about-hero');
      const canvas = hero ? hero.querySelector('canvas') : null;
      return {
        title: document.title,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
      };
    })()`);
    console.log('About Reference Audit:', aboutAudit);

    const aboutHeroPath = `${framesDir}\\about_hero_sculpture_reference.png`;
    await captureScreenshot(client, aboutHeroPath);
    copyFileSync(aboutHeroPath, `${artifactDir}\\about_hero_sculpture_reference.png`);

    // 2. Audit & Capture Services Page Hero (Replicated Sculpture)
    console.log('[3/6] Navigating to /services to capture replicated sculpture...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/services' });
    await wait(3500);
    await evaluate(client, 'document.fonts.ready');

    const servicesAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('services-hero');
      const canvas = hero ? hero.querySelector('canvas') : null;
      return {
        title: document.title,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
      };
    })()`);
    console.log('Services Replicated Audit:', servicesAudit);

    const servicesHeroPath = `${framesDir}\\services_hero_sculpture_replicated.png`;
    await captureScreenshot(client, servicesHeroPath);
    copyFileSync(servicesHeroPath, `${artifactDir}\\services_hero_sculpture_replicated.png`);

    // 3. Multi-Viewport Testing on /services
    console.log('[4/6] Running multi-viewport responsive testing on /services...');
    const viewports = [
      { name: '1920x1080', w: 1920, h: 1080 },
      { name: '1440x900', w: 1440, h: 900 },
      { name: '1280x800', w: 1280, h: 800 },
      { name: '768x1024', w: 768, h: 1024 },
      { name: '390x844', w: 390, h: 844 },
      { name: '375x812', w: 375, h: 812 },
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await setViewport(client, vp.w, vp.h);
      await evaluate(client, `window.scrollTo(0, 0)`);
      await wait(600);

      const metrics = await evaluate(client, `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const h1 = document.querySelector('#services-hero h1');
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        const canvas = document.querySelector('#services-hero canvas');
        return {
          overflow: Math.max(0, docW - winW),
          h1Width: h1Rect ? Math.round(h1Rect.width) : null,
          isH1Clipped: h1Rect ? (h1Rect.right > winW) : false,
          canvasRendered: !!canvas && canvas.width > 0
        };
      })()`);

      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.isH1Clipped}, canvas = ${metrics.canvasRendered}`);
      const vpPath = `${framesDir}\\services_replicated_vp_${vp.name}.png`;
      await captureScreenshot(client, vpPath);
      copyFileSync(vpPath, `${artifactDir}\\services_replicated_vp_${vp.name}.png`);

      vpResults.push({ name: vp.name, width: vp.w, height: vp.h, metrics });
    }

    // 4. Save Report
    console.log('[5/6] Saving verification report...');
    writeFileSync(
      `${artifactDir}\\p08_1_sculpture_replication_report.json`,
      JSON.stringify({ aboutAudit, servicesAudit, vpResults }, null, 2)
    );

    console.log('[6/6] Phase 08.1 verification completed successfully!');
  } finally {
    try {
      chrome.kill('SIGKILL');
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Phase 08.1 verification failed:', err);
  process.exit(1);
});
