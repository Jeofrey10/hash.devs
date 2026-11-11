import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_seq';
mkdirSync(userDataDir, { recursive: true });

const seqDir = 'C:\\hashdammi\\shutter_sequence';
mkdirSync(seqDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9228/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4192/' });
  await new Promise((r) => setTimeout(r, 2200));

  const geom = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => ({ showcaseTop: document.querySelector("#studio-showcase").offsetTop }))()`,
  });
  const showcaseTop = (geom.result?.result?.value || geom.result?.value).showcaseTop;
  console.log('showcaseTop:', showcaseTop);

  // 1. Initial State: scroll to y=1250 where showcase is approaching, louvers are 100% closed
  console.log('Position 1: Louvers closed...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.70});` });
  await new Promise((r) => setTimeout(r, 600));

  let f = 0;
  const grab = async (label) => {
    const num = String(f++).padStart(3, '0');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const p = `${seqDir}/seq_${num}_${label}.png`;
    writeFileSync(p, Buffer.from(shot.result.data, 'base64'));
    console.log('Captured', p);
  };

  await grab('01_louvers_closed_approach');

  // 2. Trigger point: scroll to y = showcaseTop - 900 * 0.50 (crosses start: 'top 55%')
  console.log('Position 2: Crossing trigger point...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.45});` });
  
  // Capture dynamic opening over time (0.0s, 0.2s, 0.4s, 0.6s, 0.8s, 1.0s, 1.2s)
  for (let t = 0; t <= 6; t++) {
    await new Promise((r) => setTimeout(r, 180));
    await grab(`02_shutter_wiping_open_t${t}`);
  }

  // 3. Showcase fully revealed
  console.log('Position 3: Fully revealed...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 150});` });
  await new Promise((r) => setTimeout(r, 600));
  await grab('03_showcase_fully_revealed');

  // 4. Reverse scroll: scroll back up to y=1200
  console.log('Position 4: Reversing scroll back up...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.70});` });
  for (let t = 0; t <= 5; t++) {
    await new Promise((r) => setTimeout(r, 180));
    await grab(`04_shutter_closing_reverse_t${t}`);
  }

  console.log('Done capturing sequence!');
  ws.close();
} catch (e) {
  console.error('Sequence capture error:', e);
} finally {
  cp.kill();
}

