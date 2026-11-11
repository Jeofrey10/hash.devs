import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_test_nav_clean';

async function test() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9402',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9402/json');
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
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: '({ href: location.href, title: document.title, hero: !!document.querySelector("#hero-section"), body: document.body.innerHTML.substring(0, 300) })',
    returnByValue: true
  });
  console.log('PAGE INFO:', pageInfo.result.value);

  ws.close();
  chrome.kill();
}

test().catch(console.error);

