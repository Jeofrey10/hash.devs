import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_3_2';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_3_2_frames';
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
  const port = 9300;
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
    console.log('[1/5] Navigating to http://localhost:4250/...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(3500);

    await evaluate(client, 'document.fonts.ready');

    const viewports = [
      { name: '1920x1080', width: 1920, height: 1080 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1280x800', width: 1280, height: 800 },
      { name: '768x1024', width: 768, height: 1024 },
      { name: '390x844', width: 390, height: 844 },
      { name: '375x812', width: 375, height: 812 },
    ];

    console.log('[2/5] Performing rigorous glyph & period verification across all 6 viewports...');
    const reportData = [];

    for (const vp of viewports) {
      await setViewport(client, vp.width, vp.height);
      await evaluate(client, `(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await wait(900);

      const metrics = await evaluate(client, `(() => {
        const contact = document.getElementById('contact');
        if (!contact) return null;

        const h2 = contact.querySelector('h2');
        const spans = Array.from(h2.querySelectorAll('span.contact-headline-line'));
        const excSpan = spans[spans.length - 1]; // "EXCEPTIONAL."
        const excParent = excSpan.parentElement;

        const scrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const overflow = Math.max(0, scrollWidth - windowWidth);

        const excRect = excSpan.getBoundingClientRect();
        const parentRect = excParent.getBoundingClientRect();
        const pTag = contact.querySelector('p');
        const pRect = pTag ? pTag.getBoundingClientRect() : null;

        // Measure period specifically using a Range
        const textNode = excSpan.firstChild;
        let periodRect = null;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          const range = document.createRange();
          const str = textNode.textContent;
          const dotIdx = str.lastIndexOf('.');
          if (dotIdx !== -1) {
            range.setStart(textNode, dotIdx);
            range.setEnd(textNode, dotIdx + 1);
            const r = range.getBoundingClientRect();
            periodRect = {
              width: Math.round(r.width * 100) / 100,
              height: Math.round(r.height * 100) / 100,
              left: Math.round(r.left),
              right: Math.round(r.right),
              top: Math.round(r.top),
              bottom: Math.round(r.bottom)
            };
          }
        }

        const isPeriodClipped = periodRect ? (periodRect.right > parentRect.right || periodRect.right > windowWidth) : true;
        const marginToParentRight = Math.round(parentRect.right - excRect.right);

        return {
          overflow,
          fontSize: window.getComputedStyle(h2).fontSize,
          spansCount: spans.length,
          excText: excSpan.innerText,
          excWidth: Math.round(excRect.width),
          parentWidth: Math.round(parentRect.width),
          marginToParentRight,
          periodFound: !!periodRect,
          periodMetrics: periodRect,
          isPeriodClipped,
          isParagraphClipped: pRect ? (pRect.right > windowWidth) : false
        };
      })()`);

      const vpShot = `${framesDir}\\p06_3_2_vp_${vp.name}.png`;
      await captureScreenshot(client, vpShot);
      copyFileSync(vpShot, `${artifactDir}\\p06_3_2_vp_${vp.name}.png`);

      reportData.push({
        ...vp,
        metrics
      });

      console.log(`Viewport ${vp.name}:`);
      console.log(`  FontSize: ${metrics.fontSize}`);
      console.log(`  "EXCEPTIONAL." width: ${metrics.excWidth}px (Parent width: ${metrics.parentWidth}px, Breathing Room: ${metrics.marginToParentRight}px)`);
      console.log(`  Period glyph: ${metrics.periodFound ? 'Found' : 'MISSING'}, width: ${metrics.periodMetrics?.width}px, isPeriodClipped: ${metrics.isPeriodClipped}`);
      console.log(`  Horizontal Overflow: ${metrics.overflow}px, Paragraph Clipped: ${metrics.isParagraphClipped}`);
    }

    console.log('[3/5] Capturing focused period proof screenshots at 1920x1080 and 1440x900...');
    // 1920x1080 proof
    await setViewport(client, 1920, 1080);
    await evaluate(client, `(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);
    const shot1920 = `${artifactDir}\\p06_3_2_1920_period_verified.png`;
    await captureScreenshot(client, shot1920);

    // 1440x900 proof
    await setViewport(client, 1440, 900);
    await evaluate(client, `(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);
    const shot1440 = `${artifactDir}\\p06_3_2_1440_period_verified.png`;
    await captureScreenshot(client, shot1440);

    console.log('[4/5] Saving detailed report...');
    writeFileSync(`${artifactDir}\\p06_3_2_report.json`, JSON.stringify(reportData, null, 2));

    await client.close();
    await browserClient.close();
    console.log('[5/5] Verification script finished successfully!');
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error('CDP verification error:', err);
  process.exit(1);
});

