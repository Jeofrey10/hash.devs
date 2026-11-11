import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_cs';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\cs_frames';
mkdirSync(framesDir, { recursive: true });

// Start preview server
const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4208'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('4208') || str.includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  `--user-data-dir=${userDataDir}`,
  '--use-gl=angle',
  '--use-angle=default',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9229/json');
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

  let frameIdx = 1;
  const captureFrame = async (name) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `${framesDir}/cs_frame_${String(frameIdx).padStart(2, '0')}_${name}.png`;
    writeFileSync(filename, Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved frame ${frameIdx}: ${name}`);
    frameIdx++;
  };

  // 1. Navigate to Home Featured Works & click PIXWALL
  console.log('Navigating to Home...');
  await send('Page.navigate', { url: 'http://localhost:4208/' });
  await new Promise((r) => setTimeout(r, 2500));

  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, document.querySelector("#work").offsetTop + 650);',
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('home_work_pixwall_card');

  // Click on the PIXWALL card link
  console.log('Clicking on PIXWALL card to test transition...');
  await send('Runtime.evaluate', {
    expression: 'document.querySelector("a[href*=\'/work/pixwall\']").click();',
  });
  // Capture transition curtain
  await new Promise((r) => setTimeout(r, 150));
  await captureFrame('pixwall_transition_curtain');

  // Wait for curtain to clear and hero to reveal
  await new Promise((r) => setTimeout(r, 1000));
  await captureFrame('pixwall_case_study_hero');

  // Scroll down to PIXWALL Story & Overview
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 1100);',
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('pixwall_story_overview');

  // Scroll down to PIXWALL Visual Showcase & Tech Architecture
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 2400);',
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('pixwall_visual_showcase');

  // Scroll down to PIXWALL Closing Statement & Navigation
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, document.body.scrollHeight - 1000);',
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('pixwall_navigation');

  // 2. Direct Route Loading: Test VOX AI direct URL
  console.log('Testing direct route loading: /work/vox-ai...');
  await send('Page.navigate', { url: 'http://localhost:4208/work/vox-ai' });
  await new Promise((r) => setTimeout(r, 1200));
  await captureFrame('vox_ai_direct_load');

  // 3. Direct Route Loading: Test ILLORA AI direct URL
  console.log('Testing direct route loading: /work/illora-ai...');
  await send('Page.navigate', { url: 'http://localhost:4208/work/illora-ai' });
  await new Promise((r) => setTimeout(r, 1200));
  await captureFrame('illora_ai_direct_load');

  // 4. Direct Route Loading: Test EXPERIMENTAL direct URL & 3D WebGL
  console.log('Testing direct route loading: /work/experimental...');
  await send('Page.navigate', { url: 'http://localhost:4208/work/experimental' });
  await new Promise((r) => setTimeout(r, 1600)); // allow WebGL frame render
  await captureFrame('experimental_direct_load');

  // 5. Test Circular Next Navigation from EXPERIMENTAL back to PIXWALL
  console.log('Clicking Next Project link from Experimental...');
  await send('Runtime.evaluate', {
    expression: 'document.querySelector("a[href*=\'/work/pixwall\']").click();',
  });
  await new Promise((r) => setTimeout(r, 1200));
  await captureFrame('circular_next_to_pixwall');

  // 6. Test Return to Selected Works link
  console.log('Clicking Return to Selected Works...');
  await send('Runtime.evaluate', {
    expression: 'document.querySelector("a[href*=\'/ #work\']", "a[href*=\'#work\']").click();',
  });
  await new Promise((r) => setTimeout(r, 1200));
  await captureFrame('returned_to_home_work');

  // 7. Multi-viewport validation for Case Study (/work/pixwall)
  console.log('Starting multi-viewport validation...');
  await send('Page.navigate', { url: 'http://localhost:4208/work/pixwall' });
  await new Promise((r) => setTimeout(r, 1200));

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

    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise((r) => setTimeout(r, 600));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyW = document.body.scrollWidth;
          const winW = window.innerWidth;
          const title = document.querySelector("h1");
          return {
            viewport: "${vp.name}",
            bodyScrollWidth: bodyW,
            windowInnerWidth: winW,
            hasHorizontalOverflow: bodyW > winW,
            titleText: title ? title.textContent.trim() : ""
          };
        })()
      `,
      returnByValue: true,
    });
    const res = check.result?.result?.value || check.result?.value;
    vpResults.push(res);

    const vpShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/cs_${vp.name}.png`, Buffer.from(vpShot.result.data, 'base64'));
    console.log(`Verified ${vp.name}:`, res);
  }

  writeFileSync('C:/hashdammi/cs_vp_results.json', JSON.stringify(vpResults, null, 2));

  ws.close();
} catch (err) {
  console.error('Error in verify_case_studies:', err);
} finally {
  cp.kill();
  preview.kill();
}

