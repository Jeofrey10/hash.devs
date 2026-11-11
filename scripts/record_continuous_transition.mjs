import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_continuous';
mkdirSync(userDataDir, { recursive: true });

const recDir = 'C:\\hashdammi\\continuous_recording';
mkdirSync(recDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
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

  console.log('Navigating to app...');
  await send('Page.navigate', { url: 'http://localhost:4192/' });
  await new Promise((r) => setTimeout(r, 2200));

  const geom = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => ({
      brandTop: document.querySelector("#brand-statement").offsetTop,
      showcaseTop: document.querySelector("#studio-showcase").offsetTop
    }))()`,
  });

  const { brandTop, showcaseTop } = geom.result?.result?.value || geom.result?.value;
  console.log('Geometry:', { brandTop, showcaseTop });

  let f = 0;
  const grab = async (label) => {
    const num = String(f++).padStart(3, '0');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const p = `${recDir}/frame_${num}_${label}.png`;
    writeFileSync(p, Buffer.from(shot.result.data, 'base64'));
    console.log(`[Frame ${num}] ${label}`);
  };

  // 1. Initial Brand Statement
  console.log('--- Step 1: Initial Brand Statement ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${brandTop});` });
  await new Promise((r) => setTimeout(r, 800));
  await grab('01_brand_statement');

  // 2. Complete Closed Shutter (Approach Y = 1200, trigger is at Y ≈ 1397)
  console.log('--- Step 2: Complete Closed Shutter (Approach) ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.72});` });
  await new Promise((r) => setTimeout(r, 600));
  await grab('02_shutter_completely_closed');

  // 3. Four alternating slats opening (cross trigger at Y = showcaseTop - 900 * 0.45)
  console.log('--- Step 3: Four Alternating Slats Opening ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.45});` });
  
  // Continuous sampling across the opening duration (0.0s to 1.3s)
  for (let t = 0; t <= 7; t++) {
    await new Promise((r) => setTimeout(r, 160));
    await grab(`03_slats_opening_t${t}`);
  }

  // 4. Complete Showcase headline reveal
  console.log('--- Step 4: Complete Showcase Headline Reveal ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 120});` });
  await new Promise((r) => setTimeout(r, 700));
  await grab('04_showcase_headline_revealed');

  // 5. All four capability panels
  console.log('--- Step 5: All Four Capability Panels ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop + 550});` });
  await new Promise((r) => setTimeout(r, 1000));
  await grab('05_capability_panels_revealed');

  // 6. Upward scrolling starts
  console.log('--- Step 6: Upward Scrolling ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 100});` });
  await new Promise((r) => setTimeout(r, 600));
  await grab('06_scrolling_upward');

  // 7. Four slats closing in reverse (scroll above trigger Y = showcaseTop - 900 * 0.72)
  console.log('--- Step 7: Four Slats Closing in Reverse ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${showcaseTop - 900 * 0.72});` });

  // Continuous sampling across reverse closure
  for (let t = 0; t <= 6; t++) {
    await new Promise((r) => setTimeout(r, 160));
    await grab(`07_slats_closing_reverse_t${t}`);
  }

  // 8. Return to Brand Statement
  console.log('--- Step 8: Return to Brand Statement ---');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${brandTop});` });
  await new Promise((r) => setTimeout(r, 800));
  await grab('08_returned_to_brand_statement');

  console.log('=== CONTINUOUS RECORDING COMPLETED ===');
  console.log('Total frames:', f);
  console.log('Console Errors:', consoleErrors);

  ws.close();
} catch (e) {
  console.error('Error during continuous recording:', e);
} finally {
  cp.kill();
}

