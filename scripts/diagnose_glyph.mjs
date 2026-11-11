import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_diag';

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
  const port = 9297;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
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

    // Wait for fonts
    await evaluate(client, 'document.fonts.ready');

    const diag = await evaluate(client, `(() => {
      const contact = document.getElementById('contact');
      const h2 = contact.querySelector('h2');
      const divs = Array.from(h2.children);
      const spans = Array.from(h2.querySelectorAll('span.contact-headline-line'));

      return {
        h2Computed: {
          fontSize: window.getComputedStyle(h2).fontSize,
          letterSpacing: window.getComputedStyle(h2).letterSpacing,
          fontFamily: window.getComputedStyle(h2).fontFamily,
          width: h2.getBoundingClientRect().width,
        },
        divs: divs.map((d, i) => {
          const rect = d.getBoundingClientRect();
          const cs = window.getComputedStyle(d);
          return {
            index: i,
            overflow: cs.overflow,
            width: rect.width,
            height: rect.height,
            scrollWidth: d.scrollWidth,
            clientWidth: d.clientWidth,
            isOverflowing: d.scrollWidth > d.clientWidth + 1
          };
        }),
        spans: spans.map((s, i) => {
          const rect = s.getBoundingClientRect();
          const parentRect = s.parentElement.getBoundingClientRect();
          return {
            index: i,
            text: s.innerText,
            width: rect.width,
            left: rect.left,
            right: rect.right,
            parentRight: parentRect.right,
            isClippedByParent: rect.right > parentRect.right + 1,
            diff: rect.right - parentRect.right
          };
        })
      };
    })()`);

    console.log(JSON.stringify(diag, null, 2));

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

