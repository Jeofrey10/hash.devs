import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_diag_mobile_hero2';
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
  const port = 9399;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

  await wait(2000);
  const versionRes = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await versionRes.json();
  const client = new CDPClient(tabs[0].webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const viewports = [
    { name: '375x812', w: 375, h: 812, mobile: true },
    { name: '390x844', w: 390, h: 844, mobile: true },
    { name: '320x568', w: 320, h: 568, mobile: true },
    { name: '768x1024', w: 768, h: 1024, mobile: false },
    { name: '1440x900', w: 1440, h: 900, mobile: false }
  ];

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(2500);

    const evalRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('#hero-section');
        const canvas = hero ? hero.querySelector('canvas') : null;
        const h1 = hero ? hero.querySelector('h1') : null;
        const cta = hero ? hero.querySelector('a[href="/work"]') : null;
        const header = document.querySelector('header');
        const lines = h1 ? Array.from(h1.querySelectorAll('.hero-headline-line')).map(l => ({
          text: l.innerText,
          rect: l.getBoundingClientRect(),
          opacity: window.getComputedStyle(l).opacity,
          transform: window.getComputedStyle(l).transform
        })) : [];

        const getInfo = (el) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom },
            style: {
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              zIndex: style.zIndex,
              position: style.position,
              transform: style.transform
            }
          };
        };

        return {
          windowSize: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
          hero: getInfo(hero),
          canvas: getInfo(canvas),
          h1: getInfo(h1),
          lines,
          cta: getInfo(cta),
          header: getInfo(header),
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      })()`,
      returnByValue: true
    });

    console.log(`\n=== VIEWPORT ${vp.name} ===\n`, JSON.stringify(evalRes.result?.value, null, 2));

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, `mobile_diag_${vp.name}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`Saved mobile_diag_${vp.name}.png`);
  }

  await client.close();
  chrome.kill();
}

main().catch(console.error);
