import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_pixwall_overflow2';

async function run() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9409',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/work/pixwall'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9409/json');
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
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await new Promise(r => setTimeout(r, 2000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const culprits = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 375 || el.scrollWidth > 375) {
          culprits.push({
            tag: el.tagName,
            className: el.className ? el.className.toString().substring(0, 60) : '',
            id: el.id,
            text: el.innerText ? el.innerText.substring(0, 30).replace(/\\n/g, ' ') : '',
            rect: { left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) },
            scrollWidth: el.scrollWidth
          });
        }
      });
      return culprits.filter(c => !['HTML', 'BODY'].includes(c.tag));
    })()`,
    returnByValue: true
  });

  console.log('CULPRITS IN /work/pixwall:\n', JSON.stringify(result.result.value.slice(0, 20), null, 2));

  ws.close();
  chrome.kill();
}

run().catch(console.error);

