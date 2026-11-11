import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_services';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\services_frames';
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
  const port = 9302; // Use distinct port 9302
  console.log('[1/7] Spawning Chrome process with CDP on port 9302...');
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

    console.log('[2/7] Navigating to http://localhost:4250/services...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/services' });
    await wait(3500);

    await evaluate(client, 'document.fonts.ready');

    // 1. Structure Verification
    console.log('[3/7] Verifying all 6 sections + official footer on /services...');
    const pageAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('services-hero');
      const canvas3D = hero ? hero.querySelector('canvas') : null;
      const capabilities = document.getElementById('our-capabilities');
      const matrix = document.getElementById('services-matrix');
      const methodology = document.getElementById('engineering-methodology');
      const technology = document.getElementById('technology-craft');
      const cta = document.getElementById('services-cta');
      const footer = document.getElementById('site-footer') || document.querySelector('footer');

      return {
        title: document.title,
        hasHero: !!hero,
        hasCanvas3D: !!canvas3D,
        canvasSize: canvas3D ? { w: canvas3D.width, h: canvas3D.height } : null,
        hasCapabilities: !!capabilities,
        hasMatrix: !!matrix,
        matrixRowsCount: matrix ? matrix.querySelectorAll('[role="button"]').length : 0,
        hasMethodology: !!methodology,
        methodologyStagesCount: methodology ? methodology.querySelectorAll('h3').length : 0,
        hasTechnology: !!technology,
        hasCTA: !!cta,
        hasFooter: !!footer,
      };
    })()`);
    console.log('Services Page Structure Audit:', pageAudit);

    // 2. Accordion Interactive Verification
    console.log('[4/7] Testing interactive discipline accordion expansion...');
    const accordionAudit = await evaluate(client, `(() => {
      const rows = Array.from(document.querySelectorAll('#services-matrix [role="button"]'));
      const initialExpanded = rows.map(r => r.getAttribute('aria-expanded'));
      
      // Click second row (Web Experiences) to test expansion toggle
      if (rows[1]) {
        rows[1].click();
      }
      const afterClickRow1 = rows.map(r => r.getAttribute('aria-expanded'));

      // Click third row (Creative Tech)
      if (rows[2]) {
        rows[2].click();
      }
      const afterClickRow2 = rows.map(r => r.getAttribute('aria-expanded'));

      return { initialExpanded, afterClickRow1, afterClickRow2 };
    })()`);
    console.log('Accordion Interaction Audit:', accordionAudit);

    // 3. Capture Each Section at 1920x1080
    console.log('[5/7] Capturing high-resolution section screenshots...');
    
    // Section 1: Hero
    await evaluate(client, `window.scrollTo(0, 0)`);
    await wait(600);
    const s1Path = `${framesDir}\\services_01_hero_3d.png`;
    await captureScreenshot(client, s1Path);
    copyFileSync(s1Path, `${artifactDir}\\services_01_hero_3d.png`);

    // Section 2: Capabilities Intro
    await evaluate(client, `document.getElementById('our-capabilities')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s2Path = `${framesDir}\\services_02_capabilities.png`;
    await captureScreenshot(client, s2Path);
    copyFileSync(s2Path, `${artifactDir}\\services_02_capabilities.png`);

    // Section 3: Discipline Matrix (Row 1 expanded)
    await evaluate(client, `document.getElementById('services-matrix')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s3Path = `${framesDir}\\services_03_matrix_expanded.png`;
    await captureScreenshot(client, s3Path);
    copyFileSync(s3Path, `${artifactDir}\\services_03_matrix_expanded.png`);

    // Section 4: Engineering Methodology
    await evaluate(client, `document.getElementById('engineering-methodology')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s4Path = `${framesDir}\\services_04_engineering_approach.png`;
    await captureScreenshot(client, s4Path);
    copyFileSync(s4Path, `${artifactDir}\\services_04_engineering_approach.png`);

    // Section 5: Technology & Craft
    await evaluate(client, `document.getElementById('technology-craft')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s5Path = `${framesDir}\\services_05_technology_craft.png`;
    await captureScreenshot(client, s5Path);
    copyFileSync(s5Path, `${artifactDir}\\services_05_technology_craft.png`);

    // Section 6: CTA & Footer
    await evaluate(client, `document.getElementById('services-cta')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s6Path = `${framesDir}\\services_06_cta_and_footer.png`;
    await captureScreenshot(client, s6Path);
    copyFileSync(s6Path, `${artifactDir}\\services_06_cta_and_footer.png`);

    // 4. Responsive Testing Across All 6 Viewports
    console.log('[6/7] Running multi-viewport responsive testing...');
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
        return {
          overflow: Math.max(0, docW - winW),
          h1Width: h1Rect ? Math.round(h1Rect.width) : null,
          isH1Clipped: h1Rect ? (h1Rect.right > winW) : false
        };
      })()`);

      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.isH1Clipped}`);
      
      const vpPath = `${framesDir}\\services_vp_${vp.name}.png`;
      await captureScreenshot(client, vpPath);
      copyFileSync(vpPath, `${artifactDir}\\services_vp_${vp.name}.png`);

      vpResults.push({ name: vp.name, width: vp.w, height: vp.h, metrics });
    }

    // 5. Save Report
    console.log('[7/7] Saving verification report...');
    writeFileSync(
      `${artifactDir}\\services_page_report.json`,
      JSON.stringify({ pageAudit, accordionAudit, vpResults }, null, 2)
    );

    console.log('Services page verification completed successfully!');
  } finally {
    try {
      chrome.kill('SIGKILL');
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Services verification failed:', err);
  process.exit(1);
});
