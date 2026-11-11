import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_diag2';

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

async function evaluate(client, expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result ? res.result.value : null;
}

async function main() {
  const port = 9298;
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
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(3500);

    const widths = [1920, 1680, 1536, 1440, 1366, 1280, 1180, 1024, 768, 390, 375];

    for (const w of widths) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768,
      });
      await wait(300);

      const check = await evaluate(client, `(() => {
        const contact = document.getElementById('contact');
        const h2 = contact.querySelector('h2');
        const spans = Array.from(h2.querySelectorAll('span.contact-headline-line'));
        const exc = spans[2];
        if (!exc) return null;
        const rect = exc.getBoundingClientRect();
        const pRect = exc.parentElement.getBoundingClientRect();
        const colRect = contact.querySelector('.laptop\\\\:col-span-7').getBoundingClientRect();
        return {
          fontSize: window.getComputedStyle(h2).fontSize,
          excText: exc.innerText,
          excWidth: Math.round(rect.width),
          excRight: Math.round(rect.right),
          parentRight: Math.round(pRect.right),
          colRight: Math.round(colRect.right),
          clippedByParent: rect.right > pRect.right + 0.5,
          clippedByCol: rect.right > colRect.right + 0.5,
          diff: Math.round(rect.right - pRect.right)
        };
      })()`);

      console.log(`Width ${w}px: fontSize=${check.fontSize}, excWidth=${check.excWidth}px, diff=${check.diff}px, clipped=${check.clippedByParent || check.clippedByCol}`);
    }

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

