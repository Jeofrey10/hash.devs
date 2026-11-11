import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p51';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p51_frames';
mkdirSync(framesDir, { recursive: true });

// Start preview server
const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4202'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('4202') || str.includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  `--user-data-dir=${userDataDir}`,
  '--use-gl=angle',
  '--use-angle=default',
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
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4202/' });
  await new Promise((r) => setTimeout(r, 3000));

  // Determine section offsets
  const metrics = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const work = document.querySelector("#work");
        const gallery = document.querySelector("#work [class*='laptop:h-screen']");
        return {
          workTop: work ? work.offsetTop : 4069,
          scrollHeight: document.body.scrollHeight
        };
      })()
    `,
    returnByValue: true,
  });
  const data = metrics.result?.result?.value || metrics.result?.value || { workTop: 4069 };
  console.log('Layout metrics:', data);

  const workTop = data.workTop || 4069;

  let frameIdx = 1;
  const captureFrame = async (name) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `${framesDir}/frame_${String(frameIdx).padStart(2, '0')}_${name}.png`;
    writeFileSync(filename, Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved frame ${frameIdx}: ${name}`);
    frameIdx++;
  };

  // 1. Frame 01: Featured Works Header
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop});
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await captureFrame('header_entrance');

  // 2. Project 01: PIXWALL (Framed Poster Artwork & Luxury Commerce)
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop + 650});`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await captureFrame('pixwall_framed_art');

  // 3. Project 02: VOX AI (Industrial 6061 Aluminum Hardware)
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop + 1850});`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await captureFrame('vox_ai_hardware');

  // 4. Project 03: ILLORA AI (Enterprise Multi-Agent Pipeline Console)
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop + 2700});`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await captureFrame('illora_ai_console');

  // 5. Project 04: EXPERIMENTAL WORKS (Real-Time Three.js Liquid Chrome CGI)
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop + 3700});`,
  });
  await new Promise((r) => setTimeout(r, 1500)); // allow WebGL frame render
  await captureFrame('experimental_liquid_chrome');

  // 6. Test Reverse Scroll
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop + 1850});`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('reverse_scroll_vox');

  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${workTop});`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('reverse_scroll_header');

  // 7. Multi-viewport validation
  const viewports = [
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1280, height: 800, name: '1280x800' },
    { width: 768, height: 1024, name: '768x1024' },
    { width: 390, height: 844, name: '390x844' },
    { width: 375, height: 812, name: '375x812' },
  ];

  const vpResults = [];
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024,
    });

    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo(0, document.querySelector("#work").offsetTop);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyW = document.body.scrollWidth;
          const winW = window.innerWidth;
          const headline = document.querySelector("#work h2");
          const headlineW = headline ? headline.scrollWidth : 0;
          return {
            viewport: "${vp.name}",
            bodyScrollWidth: bodyW,
            windowInnerWidth: winW,
            hasHorizontalOverflow: bodyW > winW,
            headlineWidth: headlineW
          };
        })()
      `,
      returnByValue: true,
    });
    const res = check.result?.result?.value || check.result?.value;
    vpResults.push(res);

    const vpShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/p51_${vp.name}.png`, Buffer.from(vpShot.result.data, 'base64'));
    console.log(`Verified ${vp.name}:`, res);
  }

  writeFileSync('C:/hashdammi/p51_vp_results.json', JSON.stringify(vpResults, null, 2));

  ws.close();
} catch (err) {
  console.error('Error in verify_phase05_1:', err);
} finally {
  cp.kill();
  preview.kill();
}

