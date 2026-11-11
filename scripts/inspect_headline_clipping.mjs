import { spawn } from 'child_process';
import { mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_headline';
mkdirSync(userDataDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9230/json');
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
  await send('Runtime.enable');

  const viewports = [
    { name: '1920x1080', w: 1920, h: 1080, mobile: false },
    { name: '1440x900', w: 1440, h: 900, mobile: false },
    { name: '1280x800', w: 1280, h: 800, mobile: false },
    { name: '768x1024', w: 768, h: 1024, mobile: false },
    { name: '390x844', w: 390, h: 844, mobile: true },
    { name: '375x812', w: 375, h: 812, mobile: true },
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });

    await send('Page.navigate', { url: 'http://localhost:4192/' });
    await new Promise((r) => setTimeout(r, 1500));

    const metrics = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const h2 = document.querySelector("#studio-showcase h2");
          const parent = h2 ? h2.parentElement : null;
          const lines = Array.from(document.querySelectorAll("#studio-showcase .showcase-headline-line"));
          const lineWrappers = lines.map(l => l.parentElement);
          
          return {
            viewport: "${vp.name}",
            parent: parent ? {
              className: parent.className,
              clientWidth: parent.clientWidth,
              scrollWidth: parent.scrollWidth,
              offsetWidth: parent.offsetWidth
            } : null,
            h2: h2 ? {
              fontSize: window.getComputedStyle(h2).fontSize,
              clientWidth: h2.clientWidth,
              scrollWidth: h2.scrollWidth,
            } : null,
            lines: lines.map((l, i) => {
              const rect = l.getBoundingClientRect();
              const pRect = lineWrappers[i].getBoundingClientRect();
              return {
                text: l.innerText,
                spanWidth: rect.width,
                wrapperWidth: pRect.width,
                isClipped: rect.width > pRect.width,
                overflowDiff: rect.width - pRect.width
              };
            })
          };
        })()
      `,
    });

    console.log(JSON.stringify(metrics.result?.result?.value || metrics.result?.value, null, 2));
  }

  ws.close();
} catch (e) {
  console.error('Error:', e);
} finally {
  cp.kill();
}

