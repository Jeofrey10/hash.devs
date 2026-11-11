import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_hero';
mkdirSync(userDataDir, { recursive: true });

const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4195'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('4195') || str.includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  `--user-data-dir=${userDataDir}`,
  '--use-gl=angle',
  '--use-angle=default',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9225/json');
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
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4195/' });

  // Wait 3s for WebGL emblem to render
  await new Promise((r) => setTimeout(r, 3000));

  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/current_hero_1920x1080.png', Buffer.from(heroShot.result.data, 'base64'));
  console.log('Saved current_hero_1920x1080.png successfully!');

  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  cp.kill();
  preview.kill();
}
