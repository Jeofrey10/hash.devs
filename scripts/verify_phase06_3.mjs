import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p06_3';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p06_3_frames';
mkdirSync(framesDir, { recursive: true });
const artifactDir = 'C:\\Users\\KANIMOZHI\\.gemini\\antigravity\\brain\\6ff27cec-25f0-42d6-aef4-136c2fa30198';

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

async function captureScreenshot(client, path) {
  const result = await client.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(path, Buffer.from(result.data, 'base64'));
}

async function setViewport(client, width, height) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
}

async function evaluate(client, expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result ? res.result.value : null;
}

async function main() {
  const port = 9295;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://localhost:4250/'
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

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Chrome remote debugging did not respond in time.');
    }

    const browserClient = new CDPClient(versionData.webSocketDebuggerUrl);
    await browserClient.connect();

    const targets = await browserClient.send('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page');
    if (!pageTarget) {
      const created = await browserClient.send('Target.createTarget', { url: 'http://localhost:4250/' });
      pageTarget = { targetId: created.targetId };
    }

    const pageWsUrl = `http://127.0.0.1:${port}/json`;
    const pageListRes = await fetch(pageWsUrl);
    const pageList = await pageListRes.json();
    const pageObj = pageList.find((p) => p.id === pageTarget.targetId) || pageList[0];
    const client = new CDPClient(pageObj.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    console.log('[1/8] Navigating to http://localhost:4250/...');
    await client.send('Page.navigate', { url: 'http://localhost:4250/' });
    await wait(3500);

    // 1. Scroll to Contact section & Capture Overview
    console.log('[2/8] Inspecting Contact section composition...');
    await evaluate(client, `(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(1200);

    const shot1 = `${framesDir}\\p06_3_01_contact_overview.png`;
    await captureScreenshot(client, shot1);
    copyFileSync(shot1, `${artifactDir}\\p06_3_01_contact_overview.png`);

    // 2. Test empty submission to trigger validation feedback
    console.log('[3/8] Triggering validation by submitting empty form...');
    await evaluate(client, `(() => {
      const form = document.querySelector('#contact form');
      if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      }
    })()`);
    await wait(600);

    const shot2 = `${framesDir}\\p06_3_02_form_validation_errors.png`;
    await captureScreenshot(client, shot2);
    copyFileSync(shot2, `${artifactDir}\\p06_3_02_form_validation_errors.png`);

    const validationCheck = await evaluate(client, `(() => {
      const form = document.querySelector('#contact form');
      const alert = form?.querySelector('[role="alert"]');
      const nameErr = document.getElementById('name-error');
      const emailErr = document.getElementById('email-error');
      const descErr = document.getElementById('desc-error');
      return {
        hasAlert: !!alert,
        alertText: alert?.innerText || '',
        nameError: nameErr?.innerText || '',
        emailError: emailErr?.innerText || '',
        descError: descErr?.innerText || ''
      };
    })()`);
    console.log('Validation feedback check:', validationCheck);

    // 3. Fill form with valid project brief data & interact with pills
    console.log('[4/8] Populating form with valid project brief...');
    await evaluate(client, `(() => {
      const form = document.querySelector('#contact form');
      if (!form) return;

      const nameInput = document.getElementById('inquiry-name');
      const emailInput = document.getElementById('inquiry-email');
      const companyInput = document.getElementById('inquiry-company');
      const descInput = document.getElementById('inquiry-description');

      // Set input values using prototype setter to properly trigger React state update
      function setVal(input, val) {
        if (!input) return;
        const proto = input instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
        set.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      setVal(nameInput, 'Alexander Vance');
      setVal(emailInput, 'alexander@vance-dynamics.com');
      setVal(companyInput, 'Vance Dynamics');
      setVal(descInput, 'Engineering an autonomous spatial UI engine with real-time generative interfaces.');

      // Click "AI & Automation" discipline pill
      const pills = Array.from(form.querySelectorAll('[role="radiogroup"] button'));
      const aiPill = pills.find(p => p.innerText.includes('AI & Automation'));
      if (aiPill) aiPill.click();

      // Click "$50K – $100K" budget pill
      const budgetPill = pills.find(p => p.innerText.includes('$50K – $100K'));
      if (budgetPill) budgetPill.click();

      // Click "Within 1–3 months" timeline pill
      const timelinePill = pills.find(p => p.innerText.includes('Within 1–3 months'));
      if (timelinePill) timelinePill.click();
    })()`);
    await wait(600);

    const shot3 = `${framesDir}\\p06_3_03_form_filled_interactive.png`;
    await captureScreenshot(client, shot3);
    copyFileSync(shot3, `${artifactDir}\\p06_3_03_form_filled_interactive.png`);

    // 4. Submit form and verify success state
    console.log('[5/8] Submitting completed project brief...');
    await evaluate(client, `(() => {
      const form = document.querySelector('#contact form');
      if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      }
    })()`);
    await wait(1200);

    const shot4 = `${framesDir}\\p06_3_04_form_submission_success.png`;
    await captureScreenshot(client, shot4);
    copyFileSync(shot4, `${artifactDir}\\p06_3_04_form_submission_success.png`);

    const successCheck = await evaluate(client, `(() => {
      const contactSec = document.getElementById('contact');
      const heading = contactSec?.querySelector('h3');
      const bodyText = contactSec?.innerText || '';
      return {
        hasSuccessConfirmation: bodyText.includes('INQUIRY TRANSMISSION CONFIRMED'),
        thankYouText: heading?.innerText || '',
        hasReferenceCode: bodyText.includes('REFERENCE CODE:')
      };
    })()`);
    console.log('Submission success check:', successCheck);

    // 5. Test Reset Button
    console.log('[6/8] Testing "Initiate Another Inquiry" reset button...');
    await evaluate(client, `(() => {
      const contactSec = document.getElementById('contact');
      const resetBtn = Array.from(contactSec?.querySelectorAll('button') || []).find(b => b.innerText.includes('INITIATE ANOTHER INQUIRY'));
      if (resetBtn) resetBtn.click();
    })()`);
    await wait(600);

    // 6. Test Footer CTA Connectivity ("Get in Touch")
    console.log('[7/8] Testing Footer "Get in Touch" navigation connectivity to #contact...');
    await evaluate(client, `(() => {
      const footer = document.getElementById('site-footer');
      if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);

    await evaluate(client, `(() => {
      const banner = document.getElementById('collaboration-banner');
      const getInTouchLink = Array.from(banner?.querySelectorAll('a') || []).find(a => a.innerText.includes('Get in Touch'));
      if (getInTouchLink) getInTouchLink.click();
    })()`);
    await wait(1200);

    const shot5 = `${framesDir}\\p06_3_05_footer_cta_connectivity.png`;
    await captureScreenshot(client, shot5);
    copyFileSync(shot5, `${artifactDir}\\p06_3_05_footer_cta_connectivity.png`);

    // 7. Multi-viewport testing & zero horizontal overflow
    console.log('[8/8] Testing 6 target viewports for layout & zero horizontal overflow...');
    const viewports = [
      { name: '1920x1080', width: 1920, height: 1080 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1280x800', width: 1280, height: 800 },
      { name: '768x1024', width: 768, height: 1024 },
      { name: '390x844', width: 390, height: 844 },
      { name: '375x812', width: 375, height: 812 },
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await setViewport(client, vp.width, vp.height);
      await evaluate(client, `(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await wait(800);

      const metrics = await evaluate(client, `(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const overflow = Math.max(0, scrollWidth - window.innerWidth);
        const contactSec = document.getElementById('contact');
        const form = contactSec?.querySelector('form');
        const formWidth = form ? Math.round(form.getBoundingClientRect().width) : 0;
        return {
          overflow,
          formWidth
        };
      })()`);

      const vpShot = `${framesDir}\\p06_3_vp_${vp.name}.png`;
      await captureScreenshot(client, vpShot);
      copyFileSync(vpShot, `${artifactDir}\\p06_3_vp_${vp.name}.png`);

      vpResults.push({
        ...vp,
        metrics
      });
      console.log(`Viewport ${vp.name}: overflow = ${metrics.overflow}px, form width = ${metrics.formWidth}px`);
    }

    writeFileSync(`${artifactDir}\\p06_3_report.json`, JSON.stringify({
      validationCheck,
      successCheck,
      vpResults
    }, null, 2));

    await client.close();
    await browserClient.close();
    console.log('Phase 06.3 verification complete!');
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error('CDP test error:', err);
  process.exit(1);
});
