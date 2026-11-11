import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_audit_mobile_hero';
mkdirSync(userDataDir, { recursive: true });
const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function audit() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9403',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/'
  ]);

  await wait(2000);
  const res = await fetch('http://127.0.0.1:9403/json');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const curId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await wait(1500);

  const viewports = [
    { name: '1440x900', w: 1440, h: 900, mobile: false },
    { name: '768x1024', w: 768, h: 1024, mobile: false },
    { name: '430x932', w: 430, h: 932, mobile: true },
    { name: '390x844', w: 390, h: 844, mobile: true },
    { name: '375x812', w: 375, h: 812, mobile: true },
    { name: '320x568', w: 320, h: 568, mobile: true },
  ];

  const results = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    // Wait for resize handler and animations
    await wait(800);

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('#hero-section');
        const canvas = hero ? hero.querySelector('canvas') : null;
        const h1 = hero ? hero.querySelector('h1') : null;
        const lines = h1 ? Array.from(h1.querySelectorAll('.hero-headline-line')).map(l => ({
          text: l.innerText,
          rect: l.getBoundingClientRect(),
          opacity: window.getComputedStyle(l).opacity,
          visibility: window.getComputedStyle(l).visibility,
          transform: window.getComputedStyle(l).transform
        })) : [];
        const cta = hero ? hero.querySelector('a[href="/work"]') : null;
        const header = document.querySelector('header');
        const meta = hero ? hero.querySelector('[class*="border-t"]') : null;

        const getSummary = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return {
            rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), bottom: Math.round(r.bottom) },
            opacity: s.opacity,
            visibility: s.visibility,
            display: s.display,
            zIndex: s.zIndex
          };
        };

        return {
          viewport: { w: window.innerWidth, h: window.innerHeight },
          hero: getSummary(hero),
          canvas: getSummary(canvas),
          h1: getSummary(h1),
          lines,
          cta: getSummary(cta),
          meta: getSummary(meta),
          header: getSummary(header),
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      })()`,
      returnByValue: true
    });

    const data = evalRes.result?.value;
    results.push({ name: vp.name, data });
    console.log(`\n=== VP ${vp.name} ===`);
    console.log('Hero rect:', data?.hero?.rect, 'opacity:', data?.hero?.opacity);
    console.log('Canvas rect:', data?.canvas?.rect, 'display:', data?.canvas?.display, 'opacity:', data?.canvas?.opacity);
    console.log('H1 rect:', data?.h1?.rect);
    console.log('Lines:', data?.lines?.map(l => `${l.text}: op=${l.opacity}, vis=${l.visibility}, top=${Math.round(l.rect.top)}, h=${Math.round(l.rect.height)}`).join(' | '));
    console.log('CTA rect:', data?.cta?.rect);
    console.log('Meta rect:', data?.meta?.rect);
    console.log('Header rect:', data?.header?.rect);
    console.log('Overflow:', data?.overflow, `(${data?.scrollWidth} vs ${data?.clientWidth})`);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, `mobile_hero_audit_${vp.name}.png`), Buffer.from(shot.data, 'base64'));
  }

  writeFileSync(path.join(artifactDir, 'mobile_hero_audit.json'), JSON.stringify(results, null, 2));
  console.log('\nAudit complete and screenshots saved!');

  ws.close();
  chrome.kill();
}

audit().catch(console.error);

