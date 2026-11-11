import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_inspect_hero_dom';

async function inspectHero() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9406',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9406/json');
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 2000));

  const domInspection = await send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.querySelector('#hero-section');
      const allElements = hero ? Array.from(hero.querySelectorAll('*')).map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          id: el.id,
          className: el.className ? el.className.toString().substring(0, 40) : '',
          text: el.children.length === 0 ? el.innerText?.trim() : '',
          rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) }
        };
      }).filter(item => item.rect.w > 0 && item.rect.h > 0) : [];

      const header = document.querySelector('header');
      const headerRect = header ? header.getBoundingClientRect() : null;

      return {
        headerRect,
        heroElements: allElements
      };
    })()`,
    returnByValue: true
  });

  console.log('DOM INSPECTION (375x812):\n', JSON.stringify(domInspection.result.value, null, 2));

  ws.close();
  chrome.kill();
}

inspectHero().catch(console.error);

