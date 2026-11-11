import { spawn } from 'child_process';

async function main() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4240'], { shell: true, stdio: 'pipe' });
  await new Promise(r => setTimeout(r, 2500));

  const cp = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9280',
    '--user-data-dir=C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_test_metrics',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const res = await fetch('http://localhost:9280/json');
  const tabs = await res.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://localhost:4240/' });
  await new Promise(r => setTimeout(r, 2500));

  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName,
          text: h.innerText.slice(0, 40),
          id: h.id,
          parent: h.parentElement?.id || h.parentElement?.className?.slice(0, 30)
        }));
        return headings;
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('MEASUREMENT RESULTS:');
  console.log(JSON.stringify(result.result?.value || result, null, 2));

  ws.close();
  cp.kill();
  server.kill();
  process.exit(0);
}

main();
