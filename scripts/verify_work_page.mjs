import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_work';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\work_frames';
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
  const port = 9304;
  console.log('[1/7] Spawning Chrome process with CDP on port 9304...');
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250/work'
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

    console.log('[2/7] Navigating to http://localhost:4250/work...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/work' });
    await wait(3500);

    await evaluate(client, 'document.fonts.ready');

    // 1. Structure Verification
    console.log('[3/7] Verifying all 6 sections + official footer on /work...');
    const pageAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('work-hero');
      const intro = document.getElementById('archive-intro');
      const archive = document.getElementById('project-archive');
      const disciplines = document.getElementById('project-disciplines');
      const experiment = document.getElementById('experimentation-statement');
      const cta = document.getElementById('work-cta');
      const footer = document.querySelector('footer');

      const projectArticles = archive ? Array.from(archive.querySelectorAll('article')) : [];
      const projectIds = projectArticles.map(a => a.id);

      return {
        title: document.title,
        hasHero: !!hero,
        hasIntro: !!intro,
        hasArchive: !!archive,
        projectCount: projectArticles.length,
        projectIds,
        hasDisciplines: !!disciplines,
        disciplinesCount: disciplines ? disciplines.querySelectorAll('.grid > div').length : 0,
        hasExperiment: !!experiment,
        hasCTA: !!cta,
        hasFooter: !!footer,
      };
    })()`);
    console.log('Work Page Structure Audit:', pageAudit);

    // 2. Case Study Connectivity Verification
    console.log('[4/7] Testing Case Study link connectivity (/work/:id)...');
    const connectivityTest = await evaluate(client, `(() => {
      const links = Array.from(document.querySelectorAll('#project-archive a[href^="/work/"]'));
      const targets = links.map(l => l.getAttribute('href'));
      return {
        totalLinks: links.length,
        uniqueRoutes: Array.from(new Set(targets))
      };
    })()`);
    console.log('Connectivity Test:', connectivityTest);

    // Test clicking the first case study link (pixwall)
    await evaluate(client, `document.querySelector('#project-pixwall a[href="/work/pixwall"]')?.click()`);
    await wait(2000);
    const pixwallNavUrl = await evaluate(client, 'window.location.pathname');
    console.log('Navigated to Pixwall Case Study:', pixwallNavUrl);

    // Test back navigation
    await evaluate(client, 'window.history.back()');
    await wait(2000);
    const backNavUrl = await evaluate(client, 'window.location.pathname');
    console.log('Returned back to Archive:', backNavUrl);

    // 3. Capture Each Section Screenshot
    console.log('[5/7] Capturing high-resolution section screenshots...');
    
    // Section 1: Hero
    await evaluate(client, `window.scrollTo(0, 0)`);
    await wait(600);
    const s1Path = `${framesDir}\\work_01_hero.png`;
    await captureScreenshot(client, s1Path);
    copyFileSync(s1Path, `${artifactDir}\\work_01_hero.png`);

    // Section 2: Archive Intro
    await evaluate(client, `document.getElementById('archive-intro')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s2Path = `${framesDir}\\work_02_archive_intro.png`;
    await captureScreenshot(client, s2Path);
    copyFileSync(s2Path, `${artifactDir}\\work_02_archive_intro.png`);

    // Section 3a: Pixwall
    await evaluate(client, `document.getElementById('project-pixwall')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);
    const s3Path = `${framesDir}\\work_03_pixwall.png`;
    await captureScreenshot(client, s3Path);
    copyFileSync(s3Path, `${artifactDir}\\work_03_pixwall.png`);

    // Section 3b: Vox AI
    await evaluate(client, `document.getElementById('project-vox-ai')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);
    const s4Path = `${framesDir}\\work_04_vox_ai.png`;
    await captureScreenshot(client, s4Path);
    copyFileSync(s4Path, `${artifactDir}\\work_04_vox_ai.png`);

    // Section 3c: Illora AI
    await evaluate(client, `document.getElementById('project-illora-ai')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);
    const s5Path = `${framesDir}\\work_05_illora_ai.png`;
    await captureScreenshot(client, s5Path);
    copyFileSync(s5Path, `${artifactDir}\\work_05_illora_ai.png`);

    // Section 3d: Experimental Works
    await evaluate(client, `document.getElementById('project-experimental')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);
    const s6Path = `${framesDir}\\work_06_experimental_works.png`;
    await captureScreenshot(client, s6Path);
    copyFileSync(s6Path, `${artifactDir}\\work_06_experimental_works.png`);

    // Section 4: Disciplines
    await evaluate(client, `document.getElementById('project-disciplines')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s7Path = `${framesDir}\\work_07_disciplines.png`;
    await captureScreenshot(client, s7Path);
    copyFileSync(s7Path, `${artifactDir}\\work_07_disciplines.png`);

    // Section 5: Experimentation
    await evaluate(client, `document.getElementById('experimentation-statement')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s8Path = `${framesDir}\\work_08_experimentation.png`;
    await captureScreenshot(client, s8Path);
    copyFileSync(s8Path, `${artifactDir}\\work_08_experimentation.png`);

    // Section 6: CTA & Footer
    await evaluate(client, `document.getElementById('work-cta')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);
    const s9Path = `${framesDir}\\work_09_cta_and_footer.png`;
    await captureScreenshot(client, s9Path);
    copyFileSync(s9Path, `${artifactDir}\\work_09_cta_and_footer.png`);

    // 4. Multi-Viewport Testing
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
        const h1 = document.querySelector('#work-hero h1');
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        return {
          overflow: Math.max(0, docW - winW),
          h1Width: h1Rect ? Math.round(h1Rect.width) : null,
          isH1Clipped: h1Rect ? (h1Rect.right > winW) : false
        };
      })()`);

      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.isH1Clipped}`);
      
      const vpPath = `${framesDir}\\work_vp_${vp.name}.png`;
      await captureScreenshot(client, vpPath);
      copyFileSync(vpPath, `${artifactDir}\\work_vp_${vp.name}.png`);

      vpResults.push({ name: vp.name, width: vp.w, height: vp.h, metrics });
    }

    // 5. Save Report
    console.log('[7/7] Saving verification report...');
    writeFileSync(
      `${artifactDir}\\work_page_report.json`,
      JSON.stringify({ pageAudit, connectivityTest, pixwallNavUrl, backNavUrl, vpResults }, null, 2)
    );

    console.log('Work page verification completed successfully!');
  } finally {
    try {
      chrome.kill('SIGKILL');
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Work verification failed:', err);
  process.exit(1);
});

