import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_3_1';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_3_1_frames';
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
  const port = 9296;
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

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    console.log('[1/4] Navigating to http://localhost:4250/...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(3500);

    const viewports = [
      { name: '1920x1080', width: 1920, height: 1080 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1280x800', width: 1280, height: 800 },
      { name: '768x1024', width: 768, height: 1024 },
      { name: '390x844', width: 390, height: 844 },
      { name: '375x812', width: 375, height: 812 },
    ];

    console.log('[2/4] Testing all 6 target viewports for headline & paragraph clipping...');
    const results = [];

    for (const vp of viewports) {
      await setViewport(client, vp.width, vp.height);
      await evaluate(client, `(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await wait(1000);

      const inspection = await evaluate(client, `(() => {
        const contact = document.getElementById('contact');
        if (!contact) return null;

        const h2 = contact.querySelector('h2');
        const h2Spans = Array.from(h2 ? h2.querySelectorAll('.contact-headline-line') : []);
        const introP = contact.querySelector('p');
        const protocolDiv = contact.querySelector('div.font-mono');

        const scrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const overflow = Math.max(0, scrollWidth - windowWidth);

        const h2Rect = h2 ? h2.getBoundingClientRect() : null;
        const pRect = introP ? introP.getBoundingClientRect() : null;

        const spanMetrics = h2Spans.map(s => {
          const r = s.getBoundingClientRect();
          return {
            text: s.innerText,
            width: Math.round(r.width),
            height: Math.round(r.height),
            right: Math.round(r.right),
            isClipped: r.right > windowWidth
          };
        });

        const isParagraphClipped = pRect ? (pRect.right > windowWidth) : false;

        return {
          overflow,
          h2Width: h2Rect ? Math.round(h2Rect.width) : 0,
          pWidth: pRect ? Math.round(pRect.width) : 0,
          pRight: pRect ? Math.round(pRect.right) : 0,
          windowWidth,
          isParagraphClipped,
          spanMetrics
        };
      })()`);

      const shotPath = `${framesDir}\\p06_3_1_vp_${vp.name}.png`;
      await captureScreenshot(client, shotPath);
      copyFileSync(shotPath, `${artifactDir}\\p06_3_1_vp_${vp.name}.png`);

      results.push({
        ...vp,
        inspection
      });

      console.log(`Viewport ${vp.name}: overflow = ${inspection.overflow}px, headline clipped = ${inspection.spanMetrics.some(s => s.isClipped)}, paragraph clipped = ${inspection.isParagraphClipped}`);
      console.log(`  Spans: ${inspection.spanMetrics.map(s => s.text + ' (w=' + s.width + 'px, r=' + s.right + 'px)').join(' | ')}`);
      console.log(`  Paragraph: right = ${inspection.pRight}px (viewport = ${inspection.windowWidth}px)`);
    }

    console.log('[3/4] Capturing focused hero-level contact header at 1440x900 (user reference resolution)...');
    await setViewport(client, 1440, 900);
    await evaluate(client, `(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);
    const detailShot = `${artifactDir}\\p06_3_1_fixed_header_1440.png`;
    await captureScreenshot(client, detailShot);

    console.log('[4/4] Writing report...');
    writeFileSync(`${artifactDir}\\p06_3_1_report.json`, JSON.stringify(results, null, 2));

    await client.close();
    await browserClient.close();
    console.log('Verification script completed successfully!');
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error('CDP test error:', err);
  process.exit(1);
});

