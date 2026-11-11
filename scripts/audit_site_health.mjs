import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_site_audit';
mkdirSync(userDataDir, { recursive: true });
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

async function main() {
  const port = 9385;
  console.log('[Audit] Spawning Chrome on port ' + port);
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
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
    await client.send('Log.enable');
    await client.send('Network.enable');

    const routes = [
      '/',
      '/about',
      '/services',
      '/work',
      '/work/pixwall',
      '/work/vox-ai',
      '/work/illora-ai',
      '/work/experimental',
      '/contact',
      '/invalid-route-test'
    ];

    const auditResults = [];

    for (const r of routes) {
      console.log(`[Audit] Navigating to ${r}...`);
      const consoleMessages = [];
      const failedRequests = [];

      const logListener = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          consoleMessages.push({
            type: msg.params.type,
            args: msg.params.args?.map(a => a.value || a.description || '')
          });
        }
        if (msg.method === 'Network.responseReceived') {
          if (msg.params.response.status >= 400) {
            failedRequests.push({
              url: msg.params.response.url,
              status: msg.params.response.status
            });
          }
        }
      };

      client.ws.addEventListener('message', logListener);

      await client.send('Page.navigate', { url: `http://localhost:4250${r}` });
      await wait(1800);

      const metrics = await client.send('Runtime.evaluate', {
        expression: `(() => {
          return {
            title: document.title,
            currentUrl: window.location.pathname,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            bodyTextLength: document.body.innerText.length,
            missingImages: Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src)
          };
        })()`,
        returnByValue: true
      });

      client.ws.removeEventListener('message', logListener);

      auditResults.push({
        route: r,
        metrics: metrics.result?.value,
        consoleMessages,
        failedRequests
      });

      console.log(`  -> Title: "${metrics.result?.value?.title}", Current: ${metrics.result?.value?.currentUrl}, Overflow: ${metrics.result?.value?.hasHOverflow}, FailedReqs: ${failedRequests.length}`);
    }

    writeFileSync(
      path.join(artifactDir, 'initial_site_health_audit.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log('[Audit] Health audit saved to initial_site_health_audit.json');

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

