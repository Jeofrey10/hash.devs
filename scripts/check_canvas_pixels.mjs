import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_pixel_check';

async function checkPixels() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9404',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'http://localhost:4250/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9404/json');
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

  // Test 1440x900 desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 2000));

  const pixelData = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('#hero-section canvas');
      if (!canvas) return { error: 'No canvas found' };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { error: 'No GL context' };
      
      const width = canvas.width;
      const height = canvas.height;
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      let nonZeroCount = 0;
      let greenPixels = 0;
      let chromePixels = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        if (a > 0) {
          nonZeroCount++;
          if (g > 150 && r < 100) greenPixels++;
          if (r > 150 && g > 150 && b > 150) chromePixels++;
        }
      }

      return {
        canvasWidth: width,
        canvasHeight: height,
        totalPixels: width * height,
        nonZeroCount,
        greenPixels,
        chromePixels,
        ratio: nonZeroCount / (width * height)
      };
    })()`,
    returnByValue: true
  });

  console.log('CANVAS PIXEL AUDIT:', pixelData.result.value);

  ws.close();
  chrome.kill();
}

checkPixels().catch(console.error);
