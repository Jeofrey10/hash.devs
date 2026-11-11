import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_pixwall_deep';

async function run() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9412',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/work/pixwall'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9412/json');
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
      // Find the deepest leaf element that is wider than 375px
      const wideLeaves = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > 376 || el.scrollWidth > 376) {
          // Check if children also overflow, if not, this is a leaf/culprit
          const hasOverflowingChild = Array.from(el.children).some(c => {
            const cr = c.getBoundingClientRect();
            return cr.right > 376 || c.scrollWidth > 376;
          });
          if (!hasOverflowingChild || el.children.length === 0) {
            wideLeaves.push({
              tag: el.tagName,
              className: el.className ? el.className.toString().substring(0, 80) : '',
              id: el.id,
              text: el.innerText ? el.innerText.substring(0, 50).replace(/\\n/g, ' ') : '',
              right: Math.round(r.right),
              width: Math.round(r.width),
              scrollWidth: el.scrollWidth
            });
          }
        }
      });
      return wideLeaves;
    })()`,
    returnByValue: true
  });

  console.log('DEEPEST WIDE LEAVES IN /work/pixwall:\n', JSON.stringify(result.result.value, null, 2));

  ws.close();
  chrome.kill();
}

run().catch(console.error);

