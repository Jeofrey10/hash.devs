import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p5_rec';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p5_frames';
mkdirSync(framesDir, { recursive: true });

// Start preview server
const preview = spawn('cmd.exe', ['/c', 'npm run preview -- --port 4199'], {
  cwd: 'C:\\hashdammi',
  stdio: 'pipe',
});

let serverReady = false;
preview.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('4199') || str.includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 200));
}

const cp = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  `--user-data-dir=${userDataDir}`,
  '--use-gl=angle',
  '--use-angle=default',
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

  await send('Page.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:4199/' });
  await new Promise((r) => setTimeout(r, 3000));

  // Determine section offsets
  const metrics = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const work = document.querySelector("#work");
        const gallery = document.querySelector("#work [class*='laptop:h-screen']");
        return {
          workTop: work ? work.offsetTop : 4200,
          galleryTop: gallery ? gallery.offsetTop : 4800,
          scrollHeight: document.body.scrollHeight
        };
      })()
    `,
    returnByValue: true,
  });
  const data = metrics.result?.result?.value || metrics.result?.value || { workTop: 4200, galleryTop: 4800 };
  console.log('Layout metrics:', data);

  const workTop = data.workTop || 4200;

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

  // 2. Scroll into pinned gallery start: Project 01 (PIXWALL)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 650});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('project_01_pixwall');

  // 3. Hover on PIXWALL card to activate custom VIEW PROJECT cursor & tilt
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 600,
    y: 450,
  });
  await new Promise((r) => setTimeout(r, 500));
  await captureFrame('pixwall_hover_cursor');

  // 4. Scrubbing towards Project 02 (VOX AI)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 1400});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('scrubbing_to_vox');

  // 5. Project 02 (VOX AI) centered
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 1850});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('project_02_vox_ai');

  // 6. Scrubbing towards Project 03 (ILLORA AI)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 2600});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('project_03_illora_ai');

  // 7. Scrubbing towards Project 04 (EXPERIMENTAL WORKS)
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 3400});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('project_04_experimental');

  // 8. Fully reached end of gallery: Project 04 in full view, scrubber at 100%
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 3900});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('gallery_end_status');

  // 9. Reverse scrolling back to VOX AI
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop + 1850});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('reverse_scroll_vox');

  // 10. Reverse scroll back to header
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, ${workTop});
    `,
  });
  await new Promise((r) => setTimeout(r, 800));
  await captureFrame('reverse_scroll_header');

  // 11. Multi-viewport validation
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
    writeFileSync(`C:/hashdammi/featured_works_${vp.name}.png`, Buffer.from(vpShot.result.data, 'base64'));
    console.log(`Verified & captured ${vp.name}:`, res);
  }

  writeFileSync('C:/hashdammi/vp_results.json', JSON.stringify(vpResults, null, 2));

  ws.close();
} catch (err) {
  console.error('Error in record_featured_works:', err);
} finally {
  cp.kill();
  preview.kill();
}
