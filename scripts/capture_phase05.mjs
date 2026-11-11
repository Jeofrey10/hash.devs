import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p5';
mkdirSync(userDataDir, { recursive: true });

// Start preview server
const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4198'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('4198') || str.includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  `--user-data-dir=${userDataDir}`,
  '--use-gl=angle',
  '--use-angle=default',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9226/json');
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

  console.log('Testing 1920x1080...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4198/' });
  await new Promise((r) => setTimeout(r, 3000));

  // Find offset of #work
  const offsetRes = await send('Runtime.evaluate', {
    expression: 'document.querySelector("#work")?.offsetTop',
  });
  const workOffset = offsetRes.result?.value || offsetRes.result?.result?.value;
  console.log('Work offsetTop:', workOffset);

  // 1. Scroll to Featured Works header
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#work").offsetTop);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1200));

  const shotHeader = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/p5_header_1920x1080.png', Buffer.from(shotHeader.result.data, 'base64'));
  console.log('Saved p5_header_1920x1080.png');

  // 2. Scroll into pinned horizontal gallery: Project 01 (PIXWALL)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#work").offsetTop + 400);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const shotPixwall = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/p5_project_01_pixwall.png', Buffer.from(shotPixwall.result.data, 'base64'));
  console.log('Saved p5_project_01_pixwall.png');

  // 3. Scroll deeper into horizontal gallery: Project 02 (VOX AI)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#work").offsetTop + 1400);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const shotVox = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/p5_project_02_vox.png', Buffer.from(shotVox.result.data, 'base64'));
  console.log('Saved p5_project_02_vox.png');

  // 4. Scroll further into horizontal gallery: Project 03 (ILLORA AI)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#work").offsetTop + 2400);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const shotIllora = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/p5_project_03_illora.png', Buffer.from(shotIllora.result.data, 'base64'));
  console.log('Saved p5_project_03_illora.png');

  // 5. Scroll to final project: Project 04 (EXPERIMENTAL WORKS)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, document.querySelector("#work").offsetTop + 3400);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const shotExp = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/hashdammi/p5_project_04_experimental.png', Buffer.from(shotExp.result.data, 'base64'));
  console.log('Saved p5_project_04_experimental.png');

  // 6. Test Responsive Viewports:
  const viewports = [
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1280, height: 800, name: '1280x800' },
    { width: 768, height: 1024, name: '768x1024' },
    { width: 390, height: 844, name: '390x844' },
    { width: 375, height: 812, name: '375x812' },
  ];

  for (const vp of viewports) {
    console.log(`Testing viewport ${vp.name}...`);
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
    await new Promise((r) => setTimeout(r, 1000));

    // Check horizontal overflow
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyW = document.body.scrollWidth;
          const winW = window.innerWidth;
          const workEl = document.querySelector("#work");
          return {
            bodyScrollWidth: bodyW,
            windowInnerWidth: winW,
            hasHorizontalOverflow: bodyW > winW,
            workOffsetTop: workEl?.offsetTop
          };
        })()
      `,
    });
    console.log(`${vp.name} overflow metrics:`, overflowCheck.result?.value || overflowCheck.result?.result?.value);

    const vpShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/p5_work_${vp.name}.png`, Buffer.from(vpShot.result.data, 'base64'));
    console.log(`Saved p5_work_${vp.name}.png`);
  }

  ws.close();
} catch (err) {
  console.error('Error in capture_phase05:', err);
} finally {
  cp.kill();
  preview.kill();
}

