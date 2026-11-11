import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_test_font';

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
  const port = 9299;
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

    await evaluate(client, 'document.fonts.ready');

    const sizes = [50, 54, 58, 60, 62, 64, 66, 68, 70, 72];
    const measurements = await evaluate(client, `(() => {
      const results = [];
      const testSpan = document.createElement('span');
      testSpan.className = 'font-display font-extrabold tracking-tighter text-brand-neon';
      testSpan.style.visibility = 'hidden';
      testSpan.style.position = 'absolute';
      testSpan.innerText = 'EXCEPTIONAL.';
      document.body.appendChild(testSpan);

      const sizes = [50, 54, 58, 60, 62, 64, 66, 68, 70, 72];
      for (const s of sizes) {
        testSpan.style.fontSize = s + 'px';
        const rect = testSpan.getBoundingClientRect();
        results.push({
          fontSize: s,
          width: Math.round(rect.width)
        });
      }
      testSpan.remove();
      return results;
    })()`);

    console.log('Measurements:', measurements);

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

