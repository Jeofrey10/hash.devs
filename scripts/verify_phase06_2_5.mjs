import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_2_5';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_2_5_frames';
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
  const port = 9292;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250/'
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
      throw new Error('Chrome remote debugging did not respond in time.');
    }

    const browserClient = new CDPClient(versionData.webSocketDebuggerUrl);
    await browserClient.connect();

    const targets = await browserClient.send('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page');
    if (!pageTarget) {
      const created = await browserClient.send('Target.createTarget', { url: 'http://localhost:4250/' });
      pageTarget = { targetId: created.targetId };
    }

    const attachRes = await browserClient.send('Target.attachToTarget', {
      targetId: pageTarget.targetId,
      flatten: true,
    });
    const sessionId = attachRes.sessionId;

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    console.log('[1/7] Navigating to http://localhost:4250/...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(3500);

    // 1. Check removal of blueprint panel
    console.log('[2/7] Verifying complete removal of Active Blueprint panel...');
    const blueprintCheck = await evaluate(client, `(() => {
      const textsToSearch = [
        'PROBLEM SPACE & TAXONOMY',
        'ACTIVE BLUEPRINT',
        'FOCUS: CLARITY FIRST',
        'STAGE EXECUTION // VERIFIED',
        'SCROLL TO ADVANCE'
      ];
      const bodyText = document.body.innerText;
      const foundTexts = textsToSearch.filter(t => bodyText.includes(t));
      
      const processSec = document.getElementById('process');
      const hasRadarSvg = processSec ? !!processSec.querySelector('svg circle[stroke-dasharray]') : false;
      
      return {
        foundTexts,
        hasRadarSvg,
        isCompletelyGone: foundTexts.length === 0
      };
    })()`);
    console.log('Blueprint removal check result:', blueprintCheck);

    // 2. Check layout width of process stage items
    console.log('[3/7] Verifying process stage items dimensions & layout...');
    const layoutCheck = await evaluate(client, `(() => {
      const processSec = document.getElementById('process');
      if (!processSec) return null;
      const articles = Array.from(processSec.querySelectorAll('article'));
      return articles.map((a, i) => {
        const rect = a.getBoundingClientRect();
        const title = a.querySelector('h3')?.innerText;
        return {
          index: i + 1,
          title,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          right: Math.round(rect.right)
        };
      });
    })()`);
    console.log('Stage articles layout metrics:', layoutCheck);

    // 3. Scroll to Process section and capture stage expansion
    console.log('[4/7] Scrolling to #process and capturing stage interactions...');
    await evaluate(client, `(() => {
      const el = document.getElementById('process');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(1200);

    const shot1 = `${framesDir}\\p06_2_5_01_stage01_fullwidth.png`;
    await captureScreenshot(client, shot1);
    copyFileSync(shot1, `${artifactDir}\\p06_2_5_01_stage01_fullwidth.png`);

    // Click stage 2
    await evaluate(client, `(() => {
      const articles = Array.from(document.querySelectorAll('#process article'));
      if (articles[1]) articles[1].click();
    })()`);
    await wait(600);
    const shot2 = `${framesDir}\\p06_2_5_02_stage02_expanded.png`;
    await captureScreenshot(client, shot2);
    copyFileSync(shot2, `${artifactDir}\\p06_2_5_02_stage02_expanded.png`);

    // Click stage 3
    await evaluate(client, `(() => {
      const articles = Array.from(document.querySelectorAll('#process article'));
      if (articles[2]) articles[2].click();
    })()`);
    await wait(600);
    const shot3 = `${framesDir}\\p06_2_5_03_stage03_expanded.png`;
    await captureScreenshot(client, shot3);
    copyFileSync(shot3, `${artifactDir}\\p06_2_5_03_stage03_expanded.png`);

    // Click stage 4
    await evaluate(client, `(() => {
      const articles = Array.from(document.querySelectorAll('#process article'));
      if (articles[3]) articles[3].click();
    })()`);
    await wait(600);
    const shot4 = `${framesDir}\\p06_2_5_04_stage04_expanded.png`;
    await captureScreenshot(client, shot4);
    copyFileSync(shot4, `${artifactDir}\\p06_2_5_04_stage04_expanded.png`);

    // 4. Verify Studio Position manifesto and Footer intact
    console.log('[5/7] Verifying Studio Position manifesto and official Footer intact...');
    await evaluate(client, `(() => {
      const m = document.getElementById('studio-manifesto-block');
      if (m) m.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await wait(1000);
    const shot5 = `${framesDir}\\p06_2_5_05_manifesto_intact.png`;
    await captureScreenshot(client, shot5);
    copyFileSync(shot5, `${artifactDir}\\p06_2_5_05_manifesto_intact.png`);

    await evaluate(client, `(() => {
      const f = document.getElementById('site-footer');
      if (f) f.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(1000);
    const shot6 = `${framesDir}\\p06_2_5_06_footer_intact.png`;
    await captureScreenshot(client, shot6);
    copyFileSync(shot6, `${artifactDir}\\p06_2_5_06_footer_intact.png`);

    // 5. Multi-viewport testing & horizontal overflow check
    console.log('[6/7] Testing 6 target viewports for layout & zero horizontal overflow...');
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
      await evaluate(client, `(() => {
        const el = document.getElementById('process');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await wait(800);

      const metrics = await evaluate(client, `(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.offsetWidth;
        const maxScroll = Math.max(docWidth, scrollWidth, bodyWidth);
        const overflow = Math.max(0, scrollWidth - window.innerWidth);
        const articles = Array.from(document.querySelectorAll('#process article'));
        return {
          overflow,
          articleCount: articles.length,
          firstArticleWidth: articles[0] ? Math.round(articles[0].getBoundingClientRect().width) : 0
        };
      })()`);

      const vpShot = `${framesDir}\\p06_2_5_vp_${vp.name}.png`;
      await captureScreenshot(client, vpShot);
      copyFileSync(vpShot, `${artifactDir}\\p06_2_5_vp_${vp.name}.png`);

      vpResults.push({
        ...vp,
        metrics
      });
      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, card width = ${metrics.firstArticleWidth}px`);
    }

    console.log('[7/7] All CDP verifications finished successfully!');
    writeFileSync(`${artifactDir}\\p06_2_5_report.json`, JSON.stringify({
      blueprintCheck,
      layoutCheck,
      vpResults
    }, null, 2));

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error('CDP test error:', err);
  process.exit(1);
});

