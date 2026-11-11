import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_launch_readiness';
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
  const port = 9395;
  console.log('[1/5] Launching Chrome on port ' + port);
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        versionData = await res.json();
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {}
      await wait(300);
    }

    const browserClient = new CDPClient(versionData.webSocketDebuggerUrl);
    await browserClient.connect();

    const targets = await browserClient.send('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page');

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');

    const consoleLogs = [];
    const networkErrors = [];

    client.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && client.callbacks.has(msg.id)) {
        const cb = client.callbacks.get(msg.id);
        client.callbacks.delete(msg.id);
        if (msg.error) cb.reject(msg.error);
        else cb.resolve(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'warning' || msg.params.type === 'error') {
          consoleLogs.push({
            type: msg.params.type,
            text: msg.params.args?.map(a => a.value || a.description || '').join(' ')
          });
        }
      }
      if (msg.method === 'Network.responseReceived') {
        if (msg.params.response.status >= 400 && !msg.params.response.url.includes('favicon')) {
          networkErrors.push({
            url: msg.params.response.url,
            status: msg.params.response.status
          });
        }
      }
    };

    // -------------------------------------------------------------
    // Route Audits & Proof Screenshots
    // -------------------------------------------------------------
    const routesToTest = [
      { name: 'homepage', path: '/', shot: 'launch_01_homepage.png' },
      { name: 'about', path: '/about', shot: 'launch_02_about.png' },
      { name: 'services', path: '/services', shot: 'launch_03_services.png' },
      { name: 'work', path: '/work', shot: 'launch_04_work.png' },
      { name: 'casestudy_pixwall', path: '/work/pixwall', shot: 'launch_05_casestudy_pixwall.png' },
      { name: 'casestudy_vox', path: '/work/vox-ai' },
      { name: 'casestudy_illora', path: '/work/illora-ai' },
      { name: 'casestudy_experimental', path: '/work/experimental' },
      { name: 'contact', path: '/contact', shot: 'launch_06_contact.png' },
      { name: 'not_found', path: '/work/invalid-project-xyz', shot: 'launch_07_not_found.png' },
      { name: 'unknown_route', path: '/random-unknown-route-123' }
    ];

    console.log('[2/5] Testing all routes and capturing high-res proof screenshots');
    const routeResults = [];

    for (const item of routesToTest) {
      await client.send('Page.navigate', { url: `http://localhost:4250${item.path}` });
      await wait(1800);

      const pageData = await client.send('Runtime.evaluate', {
        expression: `(() => {
          return {
            title: document.title,
            pathname: window.location.pathname,
            hasSkipLink: !!document.querySelector('a[href="#main-content"]'),
            h1Text: document.querySelector('h1')?.innerText?.trim() || null,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            navPresent: !!document.querySelector('header, nav, #header-nav'),
            footerPresent: !!document.querySelector('footer, #site-footer, [class*="footer"]')
          };
        })()`,
        returnByValue: true
      });

      const res = pageData.result?.value;
      routeResults.push({ ...item, result: res });

      if (item.shot) {
        const shot = await client.send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(path.join(artifactDir, item.shot), Buffer.from(shot.data, 'base64'));
      }

      console.log(`  Route ${item.path}: Title = "${res?.title}", H1 = "${res?.h1Text?.substring(0, 30)}...", Overflow = ${res?.hasHOverflow}`);
    }

    // -------------------------------------------------------------
    // Multi-Viewport Responsive Matrix Audit (8 Key Viewports)
    // -------------------------------------------------------------
    console.log('[3/5] Auditing responsive behavior across all 8 target viewports');
    const viewports = [
      { name: '1920x1080', w: 1920, h: 1080, mobile: false, label: 'Desktop ultrawide' },
      { name: '1440x900', w: 1440, h: 900, mobile: false, label: 'Standard desktop' },
      { name: '1280x800', w: 1280, h: 800, mobile: false, label: 'Laptop' },
      { name: '1024x768', w: 1024, h: 768, mobile: false, label: 'Small laptop' },
      { name: '768x1024', w: 768, h: 1024, mobile: false, label: 'Tablet' },
      { name: '430x932', w: 430, h: 932, mobile: true, label: 'Large mobile' },
      { name: '390x844', w: 390, h: 844, mobile: true, label: 'Standard mobile' },
      { name: '375x812', w: 375, h: 812, mobile: true, label: 'Compact mobile' }
    ];

    const vpAuditResults = [];

    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });
      await wait(400);

      const vpMetrics = await client.send('Runtime.evaluate', {
        expression: `(() => {
          return {
            viewport: '${vp.name}',
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            overflowPixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
            hasHOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        })()`,
        returnByValue: true
      });

      const metrics = vpMetrics.result?.value;
      vpAuditResults.push({ ...vp, ...metrics });
      console.log(`  Viewport ${vp.name} (${vp.label}): overflow = ${metrics?.overflowPixels}px (hasOverflow: ${metrics?.hasHOverflow})`);
    }

    // -------------------------------------------------------------
    // SEO, Structured Data, Robots & Sitemap Check
    // -------------------------------------------------------------
    console.log('[4/5] Checking SEO & structured data integration');
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(1200);

    const seoMetrics = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const jsonLd = document.querySelector('script[type="application/ld+json"]')?.innerText;

        return {
          ogTitle,
          ogDesc,
          ogImage,
          canonical,
          hasJsonLd: !!jsonLd,
          jsonLdValid: !!(jsonLd && JSON.parse(jsonLd))
        };
      })()`,
      returnByValue: true
    });
    console.log('SEO Audit:', JSON.stringify(seoMetrics.result?.value, null, 2));

    // Verify robots.txt and sitemap.xml via fetch
    const robotsRes = await fetch('http://localhost:4250/robots.txt');
    const robotsText = await robotsRes.text();
    const sitemapRes = await fetch('http://localhost:4250/sitemap.xml');
    const sitemapText = await sitemapRes.text();

    console.log('[5/5] Finalizing Launch Readiness Audit Summary');
    const auditSummary = {
      timestamp: new Date().toISOString(),
      routes: routeResults,
      viewports: vpAuditResults,
      consoleWarningsOrErrors: consoleLogs,
      networkErrors,
      seo: {
        ...seoMetrics.result?.value,
        robotsOk: robotsRes.ok && robotsText.includes('User-agent'),
        sitemapOk: sitemapRes.ok && sitemapText.includes('urlset')
      }
    };

    writeFileSync(
      path.join(artifactDir, 'phase09_launch_readiness_audit.json'),
      JSON.stringify(auditSummary, null, 2)
    );
    console.log('Audit saved to phase09_launch_readiness_audit.json');

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

