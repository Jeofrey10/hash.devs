import { spawn } from 'child_process';
import http from 'http';

function getChromePath() {
  return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
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
  console.log('Launching Chrome for Phase 05.3 QA Inspection...');
  const chromeProc = spawn(getChromePath(), [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:4208/'
  ]);

  await wait(2500);

  try {
    const targets = await fetchJSON('http://127.0.0.1:9222/json');
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('Connected to CDP. Inspecting Home #work section...');
    await wait(2000);

    // Scroll to #work
    const scrollRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView();
          return {
            found: !!el,
            top: el ? el.getBoundingClientRect().top : null
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Scroll to #work result:', scrollRes.result.value);

    await wait(1500);

    // Check gallery track metrics
    const galleryMetrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const track = document.querySelector('[class*="galleryTrack"]') || document.querySelector('.will-change-transform');
          const cards = document.querySelectorAll('article');
          const pinContainer = track ? track.closest('.laptop\\\\:h-screen') : null;
          return {
            trackFound: !!track,
            scrollWidth: track ? track.scrollWidth : null,
            windowWidth: window.innerWidth,
            cardCount: cards.length,
            cardWidths: Array.from(cards).map(c => c.getBoundingClientRect().width),
            pinFound: !!pinContainer
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Gallery metrics:', galleryMetrics.result.value);

    // Test direct load of all 4 case studies
    const routes = ['/work/pixwall', '/work/vox-ai', '/work/illora-ai', '/work/experimental'];
    for (const r of routes) {
      console.log('Navigating to ' + r + '...');
      await client.send('Page.navigate', { url: 'http://localhost:4208' + r });
      await wait(1500);
      const res = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const h1 = document.querySelector('h1');
            const h1Text = h1 ? h1.innerText : null;
            const hasCanvas = !!document.querySelector('canvas');
            const scrollW = document.documentElement.scrollWidth;
            const innerW = window.innerWidth;
            return {
              url: window.location.pathname,
              h1Text,
              hasCanvas,
              scrollW,
              innerW,
              overflow: scrollW > innerW
            };
          })()
        `,
        returnByValue: true,
      });
      console.log('Route ' + r + ' evaluation:', res.result.value);
    }

    await client.close();
  } finally {
    chromeProc.kill();
  }
}

main().catch(console.error);
