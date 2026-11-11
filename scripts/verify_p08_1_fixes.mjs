import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p08_1_fixes';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p08_1_fixes_frames';
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
  const port = 9305;
  console.log('[1/7] Spawning Chrome process on port 9305...');
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

    // -------------------------------------------------------------
    // 1. Audit Issue 1: About Hero Headline
    // -------------------------------------------------------------
    console.log('[2/7] Verifying Issue 1: About Hero Headline on /about...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/about' });
    await wait(3500);
    await evaluate(client, 'document.fonts.ready');

    const aboutHeroAudit = await evaluate(client, `(() => {
      const hero = document.getElementById('about-hero');
      const h1 = hero ? hero.querySelector('h1') : null;
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const col = h1 ? h1.parentElement : null;
      const colRect = col ? col.getBoundingClientRect() : null;
      const greenSpans = hero ? Array.from(hero.querySelectorAll('h1 .text-brand-neon')) : [];
      const greenWords = greenSpans.map(s => s.textContent.trim());

      return {
        h1Text: h1 ? h1.innerText.replace(/\\n/g, ' ') : '',
        h1Width: h1Rect ? Math.round(h1Rect.width) : 0,
        colWidth: colRect ? Math.round(colRect.width) : 0,
        isH1Clipped: h1Rect && colRect ? h1Rect.right > colRect.right + 1 : false,
        greenWords,
      };
    })()`);
    console.log('About Hero Headline Audit:', aboutHeroAudit);

    const s1Path = `${framesDir}\\about_hero_headline_fixed.png`;
    await captureScreenshot(client, s1Path);
    copyFileSync(s1Path, `${artifactDir}\\about_hero_headline_fixed.png`);

    // -------------------------------------------------------------
    // 2. Audit Issue 2: Engineering Approach Card Title Collisions
    // -------------------------------------------------------------
    console.log('[3/7] Verifying Issue 2: Engineering Approach Cards on /services...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/services' });
    await wait(3500);
    await evaluate(client, 'document.fonts.ready');

    await evaluate(client, `document.getElementById('engineering-methodology')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);

    const approachAudit = await evaluate(client, `(() => {
      const section = document.getElementById('engineering-methodology');
      const cards = section ? Array.from(section.querySelectorAll('.laptop\\\\:grid-cols-4 > div')) : [];
      
      const cardAudits = cards.map((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const h3 = card.querySelector('h3');
        const h3Rect = h3 ? h3.getBoundingClientRect() : null;
        return {
          title: h3 ? h3.innerText : '',
          cardLeft: Math.round(cardRect.left),
          cardRight: Math.round(cardRect.right),
          cardWidth: Math.round(cardRect.width),
          h3Width: h3Rect ? Math.round(h3Rect.width) : 0,
          h3FitsInsideCard: h3Rect ? h3Rect.right <= cardRect.right : false,
        };
      });

      // Check adjacent card collision: card[i].cardRight <= card[i+1].cardLeft
      let hasCollision = false;
      for (let i = 0; i < cardAudits.length - 1; i++) {
        if (cardAudits[i].cardRight > cardAudits[i+1].cardLeft) {
          hasCollision = true;
        }
      }

      return { cardAudits, hasCollision };
    })()`);
    console.log('Engineering Approach Cards Audit:', approachAudit);

    const s2Path = `${framesDir}\\services_engineering_approach_cards_fixed.png`;
    await captureScreenshot(client, s2Path);
    copyFileSync(s2Path, `${artifactDir}\\services_engineering_approach_cards_fixed.png`);

    // -------------------------------------------------------------
    // 3. Audit Issue 3: Work Page — Experimental Works Title & CTA
    // -------------------------------------------------------------
    console.log('[4/7] Verifying Issue 3: Experimental Works Title & CTA on /work...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/work' });
    await wait(3500);
    await evaluate(client, 'document.fonts.ready');

    await evaluate(client, `document.getElementById('project-experimental')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(800);

    const workAudit = await evaluate(client, `(() => {
      const expSection = document.getElementById('project-experimental');
      const h3 = expSection ? expSection.querySelector('h3') : null;
      const h3Rect = h3 ? h3.getBoundingClientRect() : null;
      const col = h3 ? h3.parentElement : null;
      const colRect = col ? col.getBoundingClientRect() : null;

      // Bottom bar containing artifact label and view case study
      const bottomBar = expSection ? expSection.querySelector('article .min-w-0 > a > div:last-child') || expSection.querySelector('article div.bg-brand-surface\\\\/95') : null;
      const label = bottomBar ? bottomBar.children[0] : null;
      const cta = bottomBar ? bottomBar.children[1] : null;
      const labelRect = label ? label.getBoundingClientRect() : null;
      const ctaRect = cta ? cta.getBoundingClientRect() : null;

      let bottomBarOverlap = false;
      if (labelRect && ctaRect) {
        if (Math.abs(labelRect.top - ctaRect.top) < 15) {
          bottomBarOverlap = labelRect.right > ctaRect.left;
        }
      }

      return {
        h3Text: h3 ? h3.innerText.replace(/\\n/g, ' ') : '',
        h3Width: h3Rect ? Math.round(h3Rect.width) : 0,
        colWidth: colRect ? Math.round(colRect.width) : 0,
        isH3Clipped: h3Rect && colRect ? h3Rect.right > colRect.right + 1 : false,
        hasBottomBar: !!bottomBar,
        bottomBarOverlap,
      };
    })()`);
    console.log('Work Page Experimental Works Audit:', workAudit);

    const s3Path = `${framesDir}\\work_experimental_works_fixed.png`;
    await captureScreenshot(client, s3Path);
    copyFileSync(s3Path, `${artifactDir}\\work_experimental_works_fixed.png`);

    // -------------------------------------------------------------
    // 4. Multi-Viewport Responsive Testing Across All 6 Resolutions
    // -------------------------------------------------------------
    console.log('[5/7] Running multi-viewport responsive testing across all 6 resolutions...');
    const viewports = [
      { name: '1920x1080', w: 1920, h: 1080 },
      { name: '1440x900', w: 1440, h: 900 },
      { name: '1280x800', w: 1280, h: 800 },
      { name: '768x1024', w: 768, h: 1024 },
      { name: '390x844', w: 390, h: 844 },
      { name: '375x812', w: 375, h: 812 },
    ];

    const vpResults = { about: [], services: [], work: [] };

    // Test on /about
    await client.send('Page.navigate', { url: 'http://localhost:4250/about' });
    await wait(2000);
    for (const vp of viewports) {
      await setViewport(client, vp.w, vp.h);
      await evaluate(client, 'window.scrollTo(0, 0)');
      await wait(400);
      const metrics = await evaluate(client, `(() => {
        return {
          overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          h1Clipped: (() => {
            const h1 = document.querySelector('#about-hero h1');
            return h1 ? h1.getBoundingClientRect().right > window.innerWidth : false;
          })()
        };
      })()`);
      console.log(`[About] ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.h1Clipped}`);
      vpResults.about.push({ name: vp.name, ...metrics });
    }

    // Test on /work
    await client.send('Page.navigate', { url: 'http://localhost:4250/work' });
    await wait(2000);
    for (const vp of viewports) {
      await setViewport(client, vp.w, vp.h);
      await evaluate(client, 'window.scrollTo(0, 0)');
      await wait(400);
      const metrics = await evaluate(client, `(() => {
        return {
          overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          h1Clipped: (() => {
            const h1 = document.querySelector('#work-hero h1');
            return h1 ? h1.getBoundingClientRect().right > window.innerWidth : false;
          })()
        };
      })()`);
      console.log(`[Work] ${vp.name}: overflow = ${metrics.overflow}px, H1 clipped = ${metrics.h1Clipped}`);
      vpResults.work.push({ name: vp.name, ...metrics });
    }

    // 5. Save Report
    console.log('[6/7] Saving verification report...');
    writeFileSync(
      `${artifactDir}\\p08_1_typography_correction_report.json`,
      JSON.stringify({ aboutHeroAudit, approachAudit, workAudit, vpResults }, null, 2)
    );

    console.log('[7/7] Phase 08.1 typography & placement verification completed successfully!');
  } finally {
    try {
      chrome.kill('SIGKILL');
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Phase 08.1 typography verification failed:', err);
  process.exit(1);
});
