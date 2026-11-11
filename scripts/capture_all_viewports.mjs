import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile2';
mkdirSync(userDataDir, { recursive: true });

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch('http://localhost:9225/json');
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

  const viewports = [
    { name: '1920x1080', w: 1920, h: 1080, mobile: false },
    { name: '1440x900', w: 1440, h: 900, mobile: false },
    { name: '1280x800', w: 1280, h: 800, mobile: false },
    { name: '768x1024', w: 768, h: 1024, mobile: false },
    { name: '390x844', w: 390, h: 844, mobile: true },
    { name: '375x812', w: 375, h: 812, mobile: true },
  ];

  for (const vp of viewports) {
    console.log(`Processing ${vp.name}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });

    await send('Page.navigate', { url: 'http://localhost:4192/' });
    await new Promise((r) => setTimeout(r, 2200));

    // 1. Capture Hero (Preservation Check)
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/phase04-hero-${vp.name}.png`, Buffer.from(heroShot.result.data, 'base64'));

    // 2. Scroll to Brand Statement
    await send('Runtime.evaluate', {
      expression: `
        const brand = document.querySelector("#brand-statement");
        window.scrollTo(0, brand.offsetTop + 200);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      `,
    });
    await new Promise((r) => setTimeout(r, 2000));

    const brandShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/phase04-brand-${vp.name}.png`, Buffer.from(brandShot.result.data, 'base64'));

    // 3. Scroll to Studio Showcase Headline
    await send('Runtime.evaluate', {
      expression: `
        const show = document.querySelector("#studio-showcase");
        window.scrollTo(0, show.offsetTop + (window.innerWidth >= 1024 ? 120 : 60));
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      `,
    });
    await new Promise((r) => setTimeout(r, 1600));

    const headlineShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/phase04-showcase-headline-${vp.name}.png`, Buffer.from(headlineShot.result.data, 'base64'));

    // 4. Scroll to Studio Showcase Capability Panels
    await send('Runtime.evaluate', {
      expression: `
        const show = document.querySelector("#studio-showcase");
        window.scrollTo(0, show.offsetTop + (window.innerWidth >= 1024 ? 650 : 500));
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      `,
    });
    await new Promise((r) => setTimeout(r, 1600));

    const panelsShot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`C:/hashdammi/phase04-panels-${vp.name}.png`, Buffer.from(panelsShot.result.data, 'base64'));

    console.log(`Finished ${vp.name}`);
  }

  ws.close();
} catch (err) {
  console.error('Error during capture:', err);
} finally {
  cp.kill();
}

