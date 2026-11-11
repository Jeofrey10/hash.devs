import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_contact_check';
mkdirSync(userDataDir, { recursive: true });

async function run() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9397',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/contact'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const versionRes = await fetch('http://127.0.0.1:9397/json/list');
  const tabs = await versionRes.json();
  const wsUrl = tabs[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(r => { ws.onopen = r; });

  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 1500));

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const h2 = document.querySelector('h2');
      const lines = Array.from(document.querySelectorAll('.contact-headline-line')).map(el => ({
        text: el.innerText,
        rect: el.getBoundingClientRect(),
        parentRect: el.parentElement.getBoundingClientRect(),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      }));
      const container = document.querySelector('section#contact');
      return {
        h2Rect: h2 ? h2.getBoundingClientRect() : null,
        lines,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('EVAL RESULT:\n', JSON.stringify(evalRes.result.value, null, 2));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198/contact_headline_current_verification.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved contact_headline_current_verification.png');

  ws.close();
  chrome.kill();
}

run().catch(console.error);

