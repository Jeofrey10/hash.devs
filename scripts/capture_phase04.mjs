import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
  ]);

  await sleep(1500);

  try {
    const res = await fetch('http://localhost:9222/json');
    const tabs = await res.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;

    if (!wsUrl) {
      console.error('No tab found');
      chromeProcess.kill();
      return;
    }

    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await send('Page.enable');
    await send('DOM.enable');

    const viewports = [
      { name: '1440x900', w: 1440, h: 900 },
      { name: '1920x1080', w: 1920, h: 1080 },
      { name: '1280x800', w: 1280, h: 800 },
      { name: '768x1024', w: 768, h: 1024 },
      { name: '390x844', w: 390, h: 844 },
      { name: '375x812', w: 375, h: 812 },
    ];

    for (const vp of viewports) {
      console.log(`Testing viewport ${vp.name}...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      });

      await send('Page.navigate', { url: 'http://localhost:4192/' });
      await sleep(2500);

      // 1. Capture Hero (Preservation Check)
      if (vp.name === '1440x900') {
        const heroShot = await send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(`C:/hashdammi/phase04-hero-${vp.name}.png`, Buffer.from(heroShot.data, 'base64'));
        console.log(`Saved phase04-hero-${vp.name}.png`);
      }

      // 2. Scroll to Brand Statement
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('#brand-statement');
          if (el) {
            window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          }
        `,
      });
      await sleep(1500);

      const brandShot = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`C:/hashdammi/phase04-brand-${vp.name}.png`, Buffer.from(brandShot.data, 'base64'));
      console.log(`Saved phase04-brand-${vp.name}.png`);

      // 3. Scroll to Studio Showcase
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('#studio-showcase');
          if (el) {
            window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          }
        `,
      });
      await sleep(1500);

      const showcaseShot = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`C:/hashdammi/phase04-showcase-${vp.name}.png`, Buffer.from(showcaseShot.data, 'base64'));
      console.log(`Saved phase04-showcase-${vp.name}.png`);
    }

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProcess.kill();
  }
}

run();
