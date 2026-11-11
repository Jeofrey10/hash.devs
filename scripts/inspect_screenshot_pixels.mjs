import { spawn } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_shot_inspect';

async function inspectShots() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9405',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9405/json');
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

  // Let's load the screenshot in the browser and analyze its pixels on a canvas!
  const shots = ['mobile_hero_audit_375x812.png', 'mobile_hero_audit_1440x900.png'];
  const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

  for (const shot of shots) {
    const fileUrl = 'file:///' + path.join(artifactDir, shot).replace(/\\/g, '/');
    await send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 1000));

    const analysis = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelector('img');
        if (!img) return { error: 'No image element' };
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let neonPixels = 0;
        let whitePixels = 0;
        let metallicPixels = 0;
        let total = canvas.width * canvas.height;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          // Neon green: strong green, lower red/blue
          if (g > 160 && r < 100 && b < 120) neonPixels++;
          // High bright white/chrome
          if (r > 200 && g > 200 && b > 200) whitePixels++;
          // Metallic gray reflections
          if (r > 90 && g > 90 && b > 90 && Math.abs(r-g) < 15 && Math.abs(g-b) < 15) metallicPixels++;
        }

        return {
          width: canvas.width,
          height: canvas.height,
          neonPixels,
          whitePixels,
          metallicPixels
        };
      })()`,
      returnByValue: true
    });

    console.log(`ANALYSIS FOR ${shot}:`, analysis.result.value);
  }

  ws.close();
  chrome.kill();
}

inspectShots().catch(console.error);

