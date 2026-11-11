import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_contact_exp';
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
  const port = 9365;
  console.log('[1/6] Launching Chrome CDP on port ' + port);
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:4250'
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

    console.log('[2/6] Navigating to http://localhost:4250 and scrolling to #contact');
    await client.send('Page.navigate', { url: 'http://localhost:4250' });
    await wait(2000);

    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const contact = document.querySelector('#contact');
        if (contact) contact.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await wait(1200);

    // -------------------------------------------------------------
    // Test 1: Direct Email & Direct Phone Inspection
    // -------------------------------------------------------------
    console.log('[3/6] Inspecting Direct Email and Phone Actions in DirectContactInfo');
    const directActionsRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('#contact a'));
        const mailtoLinks = links.filter(a => a.href && a.href.startsWith('mailto:'));
        const telLinks = links.filter(a => a.href && a.href.startsWith('tel:'));

        const generalMailto = mailtoLinks[0]?.href || '';
        const telHref = telLinks[0]?.href || '';

        const params = new URLSearchParams(generalMailto.split('?')[1] || '');

        return {
          emailRecipient: generalMailto.split('?')[0].replace('mailto:', ''),
          subject: params.get('subject'),
          body: params.get('body'),
          hasPreFilledTemplate: (params.get('body') || '').includes("I'm interested in discussing a potential project"),
          telHref,
          phoneDisplay: telLinks[0]?.innerText?.trim() || ''
        };
      })()`,
      returnByValue: true
    });
    const directActions = directActionsRes.result?.value;
    console.log('Direct Actions Result:', JSON.stringify(directActions, null, 2));

    const shot1 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_real_01_channels.png'), Buffer.from(shot1.data, 'base64'));

    // -------------------------------------------------------------
    // Test 2: Validation on Empty Submission
    // -------------------------------------------------------------
    console.log('[4/6] Testing form validation on empty submission');
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.click();
      })()`
    });
    await wait(400);

    const validationRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        return {
          nameError: document.querySelector('#name-error')?.innerText || null,
          emailError: document.querySelector('#email-error')?.innerText || null,
          descError: document.querySelector('#desc-error')?.innerText || null
        };
      })()`,
      returnByValue: true
    });
    console.log('Validation Errors Result:', JSON.stringify(validationRes.result?.value, null, 2));

    const shot2 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_real_02_validation.png'), Buffer.from(shot2.data, 'base64'));

    // -------------------------------------------------------------
    // Test 3: Form Fill & Genuine Mailto Dispatch Generation
    // -------------------------------------------------------------
    console.log('[5/6] Filling form with valid inquiry and clicking TRANSMIT BRIEF');
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const setReactValue = (el, val) => {
          const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          const desc = Object.getOwnPropertyDescriptor(proto, 'value');
          desc.set.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setReactValue(document.querySelector('#inquiry-name'), 'Elena Rostova');
        setReactValue(document.querySelector('#inquiry-email'), 'elena@rostova.design');
        setReactValue(document.querySelector('#inquiry-company'), 'Rostova Studio Inc');
        setReactValue(document.querySelector('#inquiry-description'), 'Architecting an intelligent generative UI platform with sub-second latency, custom WebGL shaders, and spatial design.');

        const buttons = Array.from(document.querySelectorAll('#contact form button'));
        const aiBtn = buttons.find(b => b.innerText.includes('AI & Automation'));
        if (aiBtn) aiBtn.click();

        const budgetBtn = buttons.find(b => b.innerText.includes('$50K – $100K'));
        if (budgetBtn) budgetBtn.click();

        const timelineBtn = buttons.find(b => b.innerText.includes('Within 1 month'));
        if (timelineBtn) timelineBtn.click();
      })()`
    });
    await wait(400);

    // Click submit
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.click();
      })()`
    });
    await wait(600);

    // Inspect the dispatched state
    const dispatchedStateRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const region = document.querySelector('#contact [role="region"]');
        if (!region) return { found: false };

        const text = region.innerText;
        const links = Array.from(region.querySelectorAll('a'));
        const mailtoLink = links.find(a => a.href && a.href.startsWith('mailto:'))?.href || '';
        const params = new URLSearchParams(mailtoLink.split('?')[1] || '');

        return {
          found: true,
          hasClearInstruction: text.includes('Your email application will open with your project brief prepared. Please review and send the email to complete your inquiry.'),
          hasNoFakeReferenceCode: !text.includes('INQ-HASH-') && !text.includes('REFERENCE CODE:'),
          hasNoFakeConfirmation: !text.includes('INQUIRY TRANSMISSION CONFIRMED'),
          recipient: mailtoLink.split('?')[0].replace('mailto:', ''),
          subject: params.get('subject'),
          bodyContainsClient: (params.get('body') || '').includes('Elena Rostova'),
          bodyContainsDiscipline: (params.get('body') || '').includes('AI & Automation'),
          bodyContainsBudget: (params.get('body') || '').includes('$50K – $100K'),
          hasCopyBriefBtn: Array.from(region.querySelectorAll('button')).some(b => b.innerText.includes('COPY PREPARED BRIEF')),
          hasCopyEmailBtn: Array.from(region.querySelectorAll('button')).some(b => b.innerText.includes('COPY EMAIL ADDRESS')),
          hasEditBriefBtn: Array.from(region.querySelectorAll('button')).some(b => b.innerText.includes('EDIT INQUIRY FIELDS'))
        };
      })()`,
      returnByValue: true
    });
    const dispatchedState = dispatchedStateRes.result?.value;
    console.log('Dispatched State Verification:', JSON.stringify(dispatchedState, null, 2));

    const shot3 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_real_03_dispatched_view.png'), Buffer.from(shot3.data, 'base64'));

    // -------------------------------------------------------------
    // Test 4: Multi-Viewport Audit (1920, 1440, 1280, 1024, 768, 390, 375)
    // -------------------------------------------------------------
    console.log('[6/6] Auditing responsive behavior across 7 viewports');
    const viewports = [
      { name: '1920x1080', w: 1920, h: 1080, mobile: false },
      { name: '1440x900', w: 1440, h: 900, mobile: false },
      { name: '1280x800', w: 1280, h: 800, mobile: false },
      { name: '1024x768', w: 1024, h: 768, mobile: false },
      { name: '768x1024', w: 768, h: 1024, mobile: false },
      { name: '390x844', w: 390, h: 844, mobile: true },
      { name: '375x812', w: 375, h: 812, mobile: true }
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });
      await wait(500);

      const vpMetrics = await client.send('Runtime.evaluate', {
        expression: `(() => {
          return {
            viewport: '${vp.name}',
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        })()`,
        returnByValue: true
      });
      vpResults.push(vpMetrics.result?.value);
      console.log(`  Viewport ${vp.name}: overflow = ${vpMetrics.result?.value?.hasHOverflow}`);
    }

    const auditSummary = {
      directActions,
      validation: validationRes.result?.value,
      dispatchedState,
      viewports: vpResults,
      timestamp: new Date().toISOString()
    };

    writeFileSync(
      path.join(artifactDir, 'contact_real_communication_audit.json'),
      JSON.stringify(auditSummary, null, 2)
    );
    console.log('\nVerification completed successfully. Audit saved to contact_real_communication_audit.json');

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
