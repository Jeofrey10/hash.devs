import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile';
mkdirSync(userDataDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9224/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
  console.log('Selected page tab:', pageTab.id, pageTab.url);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  console.log('WebSocket connected');

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

  const nav = await send('Page.navigate', { url: 'http://localhost:4192/' });
  console.log('Navigated result:', nav);

  await new Promise((r) => setTimeout(r, 2500));

  const offset = await send('Runtime.evaluate', {
    expression: 'document.querySelector("#brand-statement")?.offsetTop',
  });
  console.log('Brand statement offsetTop:', offset);

  // Set 1440x900 viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Scroll to Brand Statement and refresh ScrollTrigger
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#brand-statement").offsetTop);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });

  await new Promise((r) => setTimeout(r, 1200));

  const brandShot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/phase04-brand-1440x900.png', Buffer.from(brandShot.result.data, 'base64'));
  console.log('Saved phase04-brand-1440x900.png!');

  // Scroll to Studio Showcase
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#studio-showcase").offsetTop);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });

  await new Promise((r) => setTimeout(r, 1200));

  const showcaseShot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/phase04-showcase-1440x900.png', Buffer.from(showcaseShot.result.data, 'base64'));
  console.log('Saved phase04-showcase-1440x900.png!');

  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  cp.kill();
}
