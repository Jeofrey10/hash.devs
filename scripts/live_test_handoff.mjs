import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_livetest';
mkdirSync(userDataDir, { recursive: true });

const framesDir = 'C:\\hashdammi\\test_frames';
mkdirSync(framesDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9227/json');
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

  const consoleLogs = [];
  const consoleErrors = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value || a.description).join(' ');
      consoleLogs.push(text);
      if (msg.params.type === 'error') {
        consoleErrors.push(text);
      }
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Step 1: Navigating to homepage...');
  await send('Page.navigate', { url: 'http://localhost:4192/' });
  await new Promise((r) => setTimeout(r, 2500));

  // Frame counter
  let frameIdx = 0;
  const snap = async (label) => {
    const num = String(frameIdx++).padStart(3, '0');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `${framesDir}/frame_${num}_${label}.png`;
    writeFileSync(filename, Buffer.from(shot.result.data, 'base64'));
    return filename;
  };

  await snap('hero');

  // Step 2: Scroll slowly through Brand Statement
  console.log('Step 2: Scrolling through Brand Statement...');
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.querySelector("#brand-statement").offsetTop);`,
  });
  await new Promise((r) => setTimeout(r, 1200));
  await snap('brand_statement');

  // Get exact geometry of Brand Statement and Showcase
  const geom = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const brand = document.querySelector("#brand-statement");
        const show = document.querySelector("#studio-showcase");
        return {
          brandTop: brand.offsetTop,
          brandHeight: brand.offsetHeight,
          showcaseTop: show.offsetTop,
          showcaseHeight: show.offsetHeight
        };
      })()
    `,
  });

  const gVal = geom.result?.result?.value || geom.result?.value;
  const { brandTop, brandHeight, showcaseTop } = gVal;
  console.log('Geometry:', { brandTop, brandHeight, showcaseTop });

  // Step 3: Scroll approaching the handoff where shutter louvers are closed
  console.log('Step 3: Approaching Studio Showcase handoff (louvers closed)...');
  const approachY = showcaseTop - 900 * 0.45; // trigger is at 55%
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${approachY});` });
  await new Promise((r) => setTimeout(r, 600));
  await snap('handoff_closed_louvers');

  // Step 4: Scroll into showcase triggering shutter opening
  console.log('Step 4: Scrolling to trigger shutter opening...');
  const triggerY = showcaseTop - 900 * 0.58; // Past 55%
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${triggerY});` });
  
  // Capture dynamic opening frames
  for (let i = 0; i < 6; i++) {
    await new Promise((r) => setTimeout(r, 200));
    await snap(`shutter_opening_${i}`);
  }

  // Step 5: Full showcase header revealed
  console.log('Step 5: Full showcase header revealed...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 200});` });
  await new Promise((r) => setTimeout(r, 800));
  await snap('showcase_header_revealed');

  // Step 6: Scroll down to Capability Panels
  console.log('Step 6: Scrolling into Capability Panels...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop + 450});` });
  await new Promise((r) => setTimeout(r, 1200));
  await snap('capability_panels');

  // Step 7: Reverse scrolling back upward
  console.log('Step 7: Reversing scroll back upward...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.45});` });
  
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 200));
    await snap(`reverse_closing_${i}`);
  }

  // Step 8: Return to Brand Statement
  console.log('Step 8: Back at Brand Statement...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${brandTop + 200});` });
  await new Promise((r) => setTimeout(r, 800));
  await snap('back_at_brand');

  // Step 9: Refresh test near showcase
  console.log('Step 9: Testing page refresh near showcase...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop + 200});` });
  await new Promise((r) => setTimeout(r, 500));
  await send('Page.reload');
  await new Promise((r) => setTimeout(r, 2500));
  await snap('after_reload_near_showcase');

  // Step 10: Resize test
  console.log('Step 10: Testing viewport resize (768x1024 tablet)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 1024,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, document.querySelector("#studio-showcase").offsetTop - 200);` });
  await new Promise((r) => setTimeout(r, 1000));
  await snap('tablet_showcase');

  console.log('=== TEST SUMMARY ===');
  console.log('Frames captured:', frameIdx);
  console.log('Console Errors:', consoleErrors);

  ws.close();
} catch (err) {
  console.error('Error during test:', err);
} finally {
  cp.kill();
}
