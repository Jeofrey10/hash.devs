import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_contact_simple';
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
  const port = 9375;
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
    // Test 1: Header Simplification Audit
    // -------------------------------------------------------------
    console.log('[3/6] Inspecting simplified header');
    const headerAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('#contact');
        const headerText = section.querySelector('.mb-12, .sm\\\\:mb-16')?.innerText || '';

        return {
          hasHeadline: headerText.includes("LET'S BUILD") && headerText.includes("SOMETHING") && headerText.includes("EXCEPTIONAL."),
          hasIdentifier: headerText.includes("07 // PROJECT INITIATION"),
          hasIntro: headerText.includes("We collaborate with ambitious founders"),
          hasRemovedProtocol: !headerText.includes("INQUIRY PROTOCOL"),
          hasRemovedTransmitBadge: !headerText.includes("TRANSMIT BRIEF ↓")
        };
      })()`,
      returnByValue: true
    });
    console.log('Header Audit Result:', JSON.stringify(headerAudit.result?.value, null, 2));

    // -------------------------------------------------------------
    // Test 2: Simplified Direct Contact Sidebar Audit
    // -------------------------------------------------------------
    console.log('[4/6] Inspecting simplified direct contact sidebar');
    const sidebarAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const sidebar = document.querySelector('#contact .laptop\\\\:col-span-5');
        const text = sidebar ? sidebar.innerText : '';
        const links = Array.from(sidebar ? sidebar.querySelectorAll('a') : []);
        const mailtoLink = links.find(a => a.href && a.href.startsWith('mailto:'))?.href || '';

        return {
          hasEmailUs: text.includes('EMAIL US') && text.includes('hello@hash.devs'),
          hasCallUs: text.includes('CALL US'),
          hasCallIcon: text.includes('📞'),
          mailtoRecipient: mailtoLink.split('?')[0].replace('mailto:', ''),
          hasRemovedGlobalHubs: !text.includes('GLOBAL HUBS') && !text.includes('TOKYO') && !text.includes('LONDON'),
          hasRemovedSocials: !text.includes('VERIFIED CHANNELS') && !text.includes('GITHUB') && !text.includes('LINKEDIN'),
          hasRemovedCollaborationModes: !text.includes('COLLABORATION MODES') && !text.includes('FULL-STACK ENGINEERING'),
          hasRemovedCapacityHUD: !text.includes('STUDIO CAPACITY') && !text.includes('ACCEPTING COMMISSIONS')
        };
      })()`,
      returnByValue: true
    });
    console.log('Sidebar Audit Result:', JSON.stringify(sidebarAudit.result?.value, null, 2));

    const shot1 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_simplified_01_overview.png'), Buffer.from(shot1.data, 'base64'));

    // -------------------------------------------------------------
    // Test 3: Simplified Form Fields & Submission Audit
    // -------------------------------------------------------------
    console.log('[5/6] Inspecting simplified form fields (5 essential fields only)');
    const formAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const text = form ? form.innerText : '';

        return {
          hasField1Name: text.includes('01. YOUR NAME'),
          hasField2Email: text.includes('02. WORK EMAIL'),
          hasField3Company: text.includes('03. COMPANY / BRAND'),
          hasField4Type: text.includes('04. PROJECT TYPE'),
          hasField5Description: text.includes('05. TELL US ABOUT YOUR PROJECT'),
          hasRemovedBudget: !text.includes('ESTIMATED BUDGET') && !text.includes('$25K'),
          hasRemovedTimeline: !text.includes('TARGET TIMELINE') && !text.includes('Within 1 month'),
          hasExplanation: text.includes('Your email application will open with your project details prepared. Please review and send to complete your inquiry.')
        };
      })()`,
      returnByValue: true
    });
    console.log('Form Structure Audit Result:', JSON.stringify(formAudit.result?.value, null, 2));

    // Test Empty Validation
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.click();
      })()`
    });
    await wait(400);

    const validationAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        return {
          nameError: document.querySelector('#name-error')?.innerText || null,
          emailError: document.querySelector('#email-error')?.innerText || null,
          descError: document.querySelector('#desc-error')?.innerText || null
        };
      })()`,
      returnByValue: true
    });
    console.log('Validation Audit Result:', JSON.stringify(validationAudit.result?.value, null, 2));

    const shot2 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_simplified_02_validation.png'), Buffer.from(shot2.data, 'base64'));

    // Fill valid form and submit
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const setReactValue = (el, val) => {
          const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          const desc = Object.getOwnPropertyDescriptor(proto, 'value');
          desc.set.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setReactValue(document.querySelector('#inquiry-name'), 'Marcus Vance');
        setReactValue(document.querySelector('#inquiry-email'), 'marcus@vance-systems.io');
        setReactValue(document.querySelector('#inquiry-company'), 'Vance Systems');
        setReactValue(document.querySelector('#inquiry-description'), 'We are building a real-time collaborative workspace for autonomous robotic fleets. Looking for world-class digital product engineering and WebGL interfaces.');

        const buttons = Array.from(document.querySelectorAll('#contact form button'));
        const typeBtn = buttons.find(b => b.innerText.includes('Creative Technology'));
        if (typeBtn) typeBtn.click();
      })()`
    });
    await wait(300);

    // Submit form
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.click();
      })()`
    });
    await wait(600);

    const dispatchedAudit = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const region = document.querySelector('#contact [role="region"]');
        if (!region) return { found: false };

        const text = region.innerText;
        const links = Array.from(region.querySelectorAll('a'));
        const mailtoLink = links.find(a => a.href && a.href.startsWith('mailto:'))?.href || '';
        const params = new URLSearchParams(mailtoLink.split('?')[1] || '');

        return {
          found: true,
          hasClearInstruction: text.includes('Your email application will open with your project details prepared. Please review and send to complete your inquiry.'),
          recipient: mailtoLink.split('?')[0].replace('mailto:', ''),
          subject: params.get('subject'),
          bodyContainsClient: (params.get('body') || '').includes('Marcus Vance'),
          bodyContainsEmail: (params.get('body') || '').includes('marcus@vance-systems.io'),
          bodyContainsType: (params.get('body') || '').includes('Creative Technology'),
          hasNoFakeReferenceCode: !text.includes('INQ-') && !text.includes('REFERENCE CODE'),
          hasNoFakeSuccessMessage: !text.includes('TRANSMISSION CONFIRMED') && !text.includes('MESSAGE RECEIVED BY SERVER')
        };
      })()`,
      returnByValue: true
    });
    console.log('Dispatched Audit Result:', JSON.stringify(dispatchedAudit.result?.value, null, 2));

    const shot3 = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path.join(artifactDir, 'contact_simplified_03_dispatched.png'), Buffer.from(shot3.data, 'base64'));

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
      headerAudit: headerAudit.result?.value,
      sidebarAudit: sidebarAudit.result?.value,
      formAudit: formAudit.result?.value,
      validationAudit: validationAudit.result?.value,
      dispatchedAudit: dispatchedAudit.result?.value,
      viewports: vpResults,
      timestamp: new Date().toISOString()
    };

    writeFileSync(
      path.join(artifactDir, 'contact_simplified_audit.json'),
      JSON.stringify(auditSummary, null, 2)
    );
    console.log('\nVerification completed successfully. Audit saved to contact_simplified_audit.json');

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

