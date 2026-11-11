import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_cs_diag';

const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4209'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  if (d.toString().includes('4209')) serverReady = true;
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  `--user-data-dir=${userDataDir}`,
  '--no-sandbox',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9230/json');
  const tabs = await res.json();
  const pageTab = tabs[0];
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
  await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4209/work/pixwall' });
  await new Promise((r) => setTimeout(r, 1500));

  const diag = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const winW = window.innerWidth;
        const all = document.querySelectorAll('*');
        const wide = [];
        all.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > winW + 1) {
            wide.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              width: rect.width,
              scrollWidth: el.scrollWidth
            });
          }
        });
        return { winW, wideCount: wide.length, topWide: wide.slice(0, 5) };
      })()
    `,
    returnByValue: true,
  });

  console.log('Diagnostic result:', JSON.stringify(diag.result?.result?.value, null, 2));

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  cp.kill();
  preview.kill();
}
