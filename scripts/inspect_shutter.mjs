import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_inspect';
mkdirSync(userDataDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
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

  const consoleLogs = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(msg.params.args.map((a) => a.value || a.description).join(' '));
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

  await send('Page.navigate', { url: 'http://localhost:4192/' });
  await new Promise((r) => setTimeout(r, 2500));

  // Inspect layout geometry
  const layout = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        try {
          const brand = document.querySelector("#brand-statement");
          const show = document.querySelector("#studio-showcase");
          const slats = Array.from(document.querySelectorAll(".shutter-slat"));
          const showContent = show ? show.querySelector(".relative.z-content") : null;
          
          return {
            windowHeight: window.innerHeight,
            scrollY: window.scrollY,
            brand: brand ? {
              offsetTop: brand.offsetTop,
              offsetHeight: brand.offsetHeight
            } : null,
            showcase: show ? {
              offsetTop: show.offsetTop,
              offsetHeight: show.offsetHeight
            } : null,
            showcaseContent: showContent ? {
              offsetTop: showContent.offsetTop,
              offsetHeight: showContent.offsetHeight
            } : null,
            slatsCount: slats.length,
            slats: slats.map((s, i) => {
              const rect = s.getBoundingClientRect();
              const cs = window.getComputedStyle(s);
              return {
                index: i,
                rect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height },
                transform: cs.transform
              };
            })
          };
        } catch (e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
  });

  console.log('=== INITIAL LAYOUT ===', JSON.stringify(layout, null, 2));
  const val = layout.result?.result?.value || layout.result?.value;
  if (!val || val.error) {
    throw new Error('Evaluation failed: ' + JSON.stringify(layout));
  }

  const brand = val.brand;
  const show = val.showcase;

  const testScrolls = [
    { label: 'brand_bottom', y: brand.offsetTop + brand.offsetHeight - 900 },
    { label: 'handoff_start', y: show.offsetTop - 700 },
    { label: 'handoff_trigger', y: show.offsetTop - 500 },
    { label: 'showcase_entry', y: show.offsetTop - 200 },
    { label: 'showcase_top', y: show.offsetTop },
    { label: 'showcase_revealed', y: show.offsetTop + 300 }
  ];

  for (const step of testScrolls) {
    console.log('Scrolling to:', step.label, 'y =', step.y);
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo(0, ${step.y});
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    const state = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const show = document.querySelector("#studio-showcase");
          const slats = Array.from(document.querySelectorAll(".shutter-slat"));
          return {
            scrollY: window.scrollY,
            showcaseTop: show ? show.getBoundingClientRect().top : null,
            slats: slats.map((s, i) => {
              const r = s.getBoundingClientRect();
              return {
                index: i,
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
                transform: window.getComputedStyle(s).transform
              };
            })
          };
        })()
      `,
    });
    console.log(step.label, 'state:', JSON.stringify(state.result.value));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/inspect_${step.label}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  console.log('Console logs count:', consoleLogs.length);
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  cp.kill();
}
