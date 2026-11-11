import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_repair_final';
mkdirSync(userDataDir, { recursive: true });
const artifactDir = 'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  const port = 9415;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

  await wait(2000);
  const versionRes = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await versionRes.json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const client = new CDPClient(pageTab.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  // Exact 8 viewports specified by user directive
  const viewports = [
    { name: 'compact_mobile', label: 'Compact mobile', w: 320, h: 568, mobile: true, shot: 'mobile_repair_01_compact_320x568.png' },
    { name: 'iphone_se', label: 'iPhone SE', w: 375, h: 812, mobile: true, shot: 'mobile_repair_02_iphonese_375x812.png' },
    { name: 'iphone_14_15', label: 'iPhone 14/15', w: 390, h: 844, mobile: true, shot: 'mobile_repair_03_iphone14_390x844.png' },
    { name: 'large_mobile', label: 'Large mobile', w: 430, h: 932, mobile: true, shot: 'mobile_repair_04_largemobile_430x932.png' },
    { name: 'small_tablet', label: 'Small tablet', w: 768, h: 1024, mobile: false, shot: 'mobile_repair_05_tablet_768x1024.png' },
    { name: 'laptop', label: 'Laptop', w: 1280, h: 800, mobile: false, shot: 'mobile_repair_06_laptop_1280x800.png' },
    { name: 'desktop', label: 'Desktop', w: 1440, h: 900, mobile: false, shot: 'mobile_repair_07_desktop_1440x900.png' },
    { name: 'ultrawide', label: 'Ultrawide', w: 1920, h: 1080, mobile: false, shot: 'mobile_repair_08_ultrawide_1920x1080.png' },
  ];

  const vpResults = [];

  console.log('[1/3] Testing Homepage across all 8 target viewports...');
  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(2200);

    const auditData = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('#hero-section');
        const canvas = hero ? hero.querySelector('canvas') : null;
        const h1 = hero ? hero.querySelector('h1') : null;
        const ctaWork = hero ? hero.querySelector('a[href="/work"]') : null;
        const ctaContact = hero ? hero.querySelector('a[href="/contact"]') : null;
        const meta = hero ? hero.querySelector('[class*="border-t"]') : null;
        const header = document.querySelector('header');
        const docEl = document.documentElement;

        const getRect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
        };

        const lines = h1 ? Array.from(h1.querySelectorAll('.hero-headline-line')).map(l => ({
          text: l.innerText.trim(),
          rect: getRect(l),
          clipped: l.getBoundingClientRect().right > docEl.clientWidth
        })) : [];

        // Check if any element overflows viewport width
        let overflowingCount = 0;
        document.querySelectorAll('*').forEach(el => {
          if (el.getBoundingClientRect().right > docEl.clientWidth + 1) {
            overflowingCount++;
          }
        });

        return {
          viewport: { w: window.innerWidth, h: window.innerHeight },
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasHOverflow: docEl.scrollWidth > docEl.clientWidth,
          overflowingCount,
          heroVisible: !!hero && hero.getBoundingClientRect().height > 0,
          canvasRect: getRect(canvas),
          h1Rect: getRect(h1),
          lines,
          ctaWorkRect: getRect(ctaWork),
          ctaContactRect: getRect(ctaContact),
          headerRect: getRect(header),
          metaRect: getRect(meta),
          h1BelowHeader: h1 && header ? h1.getBoundingClientRect().top >= header.getBoundingClientRect().bottom - 10 : true
        };
      })()`,
      returnByValue: true
    });

    const res = auditData.result?.value;
    vpResults.push({ ...vp, result: res });

    console.log(`  ✓ ${vp.label} (${vp.w}x${vp.h}): Hero=${res?.heroVisible}, Canvas=${!!res?.canvasRect}, Overflow=${res?.hasHOverflow} (${res?.scrollWidth}vs${res?.clientWidth}), H1=${res?.h1Rect?.w}x${res?.h1Rect?.h}, BelowHeader=${res?.h1BelowHeader}`);

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, vp.shot), Buffer.from(shot.data, 'base64'));
  }

  // Multi-route mobile audit
  console.log('\n[2/3] Auditing all internal studio routes on iPhone SE (375x812)...');
  const otherRoutes = [
    { path: '/work/pixwall', shot: 'mobile_repair_09_pixwall_375x812.png', name: 'pixwall' },
    { path: '/about', shot: 'mobile_repair_10_about_375x812.png', name: 'about' },
    { path: '/services', shot: 'mobile_repair_11_services_375x812.png', name: 'services' },
    { path: '/work', shot: 'mobile_repair_12_work_375x812.png', name: 'work' },
    { path: '/contact', shot: 'mobile_repair_13_contact_375x812.png', name: 'contact' },
  ];

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  const routeResults = [];
  for (const r of otherRoutes) {
    await client.send('Page.navigate', { url: `http://localhost:4250${r.path}` });
    await wait(2000);

    const rAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        let overflowingCount = 0;
        document.querySelectorAll('*').forEach(el => {
          if (el.getBoundingClientRect().right > docEl.clientWidth + 1) {
            overflowingCount++;
          }
        });
        return {
          path: window.location.pathname,
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasHOverflow: docEl.scrollWidth > docEl.clientWidth,
          overflowingCount
        };
      })()`,
      returnByValue: true
    });

    const res = rAudit.result?.value;
    routeResults.push({ ...r, result: res });
    console.log(`  ✓ Route ${r.path}: Overflow=${res?.hasHOverflow} (${res?.scrollWidth}vs${res?.clientWidth}), Overflows=${res?.overflowingCount}`);

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, r.shot), Buffer.from(shot.data, 'base64'));
  }

  console.log('\n[3/3] Saving final audit report...');
  writeFileSync(
    path.join(artifactDir, 'mobile_repair_audit.json'),
    JSON.stringify({ viewports: vpResults, routes: routeResults, timestamp: new Date().toISOString() }, null, 2)
  );

  await client.close();
  chrome.kill();
  console.log('Mobile repair audit complete!');
}

main().catch(console.error);

