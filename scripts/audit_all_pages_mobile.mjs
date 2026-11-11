import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_audit_all_mobile';
mkdirSync(userDataDir, { recursive: true });
const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function auditPages() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9407',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/'
  ]);

  await wait(2000);
  const res = await fetch('http://127.0.0.1:9407/json');
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

  const routes = ['/', '/about', '/services', '/work', '/work/pixwall', '/contact'];
  const mobileVps = [
    { name: '320x568', w: 320, h: 568 },
    { name: '375x812', w: 375, h: 812 },
    { name: '390x844', w: 390, h: 844 },
    { name: '430x932', w: 430, h: 932 }
  ];

  const issues = [];

  for (const route of routes) {
    for (const vp of mobileVps) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: true
      });

      await send('Page.navigate', { url: `http://localhost:4250${route}` });
      await wait(1800);

      const pageAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const hasHOverflow = docEl.scrollWidth > docEl.clientWidth;
          
          // Find any overflowing elements
          const overflowingElements = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > docEl.clientWidth + 1) {
              overflowingElements.push({
                tag: el.tagName,
                className: el.className ? el.className.toString().substring(0, 50) : '',
                text: el.innerText ? el.innerText.substring(0, 30) : '',
                right: Math.round(r.right),
                width: Math.round(r.width)
              });
            }
          });

          // Check all h1, h2, h3 for clipping or width > clientWidth
          const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => {
            const r = h.getBoundingClientRect();
            return {
              tag: h.tagName,
              text: h.innerText.substring(0, 40),
              width: Math.round(r.width),
              left: Math.round(r.left),
              right: Math.round(r.right),
              clipped: r.right > docEl.clientWidth
            };
          });

          return {
            route: window.location.pathname,
            vp: '${vp.name}',
            scrollWidth: docEl.scrollWidth,
            clientWidth: docEl.clientWidth,
            hasHOverflow,
            overflowCount: overflowingElements.length,
            overflowingSample: overflowingElements.slice(0, 5),
            headings
          };
        })()`,
        returnByValue: true
      });

      const res = pageAudit.result?.value;
      if (res?.hasHOverflow || res?.overflowCount > 0) {
        issues.push(res);
        console.log(`[ALERT] ${route} on ${vp.name}: hasHOverflow=${res.hasHOverflow}, overflows=${res.overflowCount}`);
      } else {
        console.log(`[OK] ${route} on ${vp.name}: scrollWidth=${res?.scrollWidth}, clientWidth=${res?.clientWidth}`);
      }
    }
  }

  writeFileSync(path.join(artifactDir, 'all_pages_mobile_audit.json'), JSON.stringify(issues, null, 2));
  console.log('\nAudit complete! Found', issues.length, 'issues across tested combinations.');

  ws.close();
  chrome.kill();
}

auditPages().catch(console.error);

