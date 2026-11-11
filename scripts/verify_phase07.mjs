import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_p07';
mkdirSync(userDataDir, { recursive: true });
const framesDir = 'C:\\hashdammi\\p07_frames';
mkdirSync(framesDir, { recursive: true });

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
    mobile: false,
  });
}

async function main() {
  console.log('--- STARTING PHASE 07 CONTACT EXPERIENCE VERIFICATION ---');

  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    `--user-data-dir=${userDataDir}`,
    '--use-gl=angle',
    '--use-angle=default',
    '--no-sandbox',
    '--no-first-run',
    'about:blank',
  ]);

  await wait(2000);

  try {
    const res = await fetch('http://localhost:9255/json');
    const tabs = await res.json();
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];

    const client = new CDPClient(pageTab.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    const consoleErrors = [];
    client.ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
      }
    });

    console.log('1. Loading Home page at 1440x900...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:4208/' });
    await wait(2500);

    // Scroll to #contact section
    console.log('2. Scrolling to #contact section...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `,
    });
    await wait(1500);

    // Capture Frame 1: Contact Section Header & Overview
    await captureScreenshot(client, `${framesDir}/p07_01_contact_header_overview.png`);
    console.log('-> Captured p07_01_contact_header_overview.png');

    // Scroll down slightly to align the Form & Sidebar
    await client.send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 380, behavior: 'instant' })`,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/p07_02_form_idle_state.png`);
    console.log('-> Captured p07_02_form_idle_state.png');

    // Test Form Validation Failure (Click Submit while empty)
    console.log('3. Testing client-side form validation failure...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const submitBtn = document.querySelector('#contact form button[type="submit"]');
          if (submitBtn) submitBtn.click();
        })()
      `,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/p07_03_form_validation_errors.png`);
    console.log('-> Captured p07_03_form_validation_errors.png');

    // Test Form Population & Pill Selection
    console.log('4. Populating valid project brief into inquiry form...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const nameInput = document.getElementById('inquiry-name');
          const emailInput = document.getElementById('inquiry-email');
          const companyInput = document.getElementById('inquiry-company');
          const descInput = document.getElementById('inquiry-description');

          // Native value setters to trigger React state updates
          const setNativeValue = (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
            valueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
          };

          if (nameInput) setNativeValue(nameInput, 'Elena Vance');
          if (emailInput) setNativeValue(emailInput, 'elena@vance-labs.io');
          if (companyInput) setNativeValue(companyInput, 'Vance Research Labs');
          if (descInput) setNativeValue(descInput, 'We are developing an autonomous intelligence system for real-time spatial diagnostics and require precision creative engineering.');

          // Select Project Type: AI & Intelligent Systems
          const aiPill = Array.from(document.querySelectorAll('button[role="radio"]')).find(b => b.innerText.includes('AI & Intelligent Systems'));
          if (aiPill) aiPill.click();

          // Select Budget: $50,000 – $100,000
          const budgetPill = Array.from(document.querySelectorAll('button[role="radio"]')).find(b => b.innerText.includes('$50,000 – $100,000'));
          if (budgetPill) budgetPill.click();

          // Select Timeline: Within 1–3 months
          const timelinePill = Array.from(document.querySelectorAll('button[role="radio"]')).find(b => b.innerText.includes('Within 1–3 months'));
          if (timelinePill) timelinePill.click();
        })()
      `,
    });
    await wait(800);
    await captureScreenshot(client, `${framesDir}/p07_04_form_filled_valid.png`);
    console.log('-> Captured p07_04_form_filled_valid.png');

    // Submit valid inquiry
    console.log('5. Submitting valid inquiry and capturing transmission confirmation...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const submitBtn = document.querySelector('#contact form button[type="submit"]');
          if (submitBtn) submitBtn.click();
        })()
      `,
    });
    await wait(1200);
    await captureScreenshot(client, `${framesDir}/p07_05_form_success_confirmed.png`);
    console.log('-> Captured p07_05_form_success_confirmed.png');

    // Scroll to bottom: Studio Manifesto / Final Position
    console.log('6. Scrolling to Final Studio Manifesto...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const contactEl = document.getElementById('contact');
          if (contactEl) {
            window.scrollTo({ top: contactEl.offsetTop + contactEl.offsetHeight - window.innerHeight, behavior: 'instant' });
          }
        })()
      `,
    });
    await wait(1000);
    await captureScreenshot(client, `${framesDir}/p07_06_studio_manifesto_final.png`);
    console.log('-> Captured p07_06_studio_manifesto_final.png');

    // Test direct route /contact
    console.log('7. Testing direct route navigation to /contact...');
    await client.send('Page.navigate', { url: 'http://localhost:4208/contact' });
    await wait(1800);
    await captureScreenshot(client, `${framesDir}/p07_07_direct_route_contact.png`);
    console.log('-> Captured p07_07_direct_route_contact.png');

    // 8. Multi-Viewport Verification across 6 standard screen sizes
    console.log('8. Running Multi-Viewport QA across 6 standard screen sizes...');
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
      await setViewport(client, vp.width, vp.height);
      await client.send('Page.navigate', { url: 'http://localhost:4208/#contact' });
      await wait(1500);

      const overflowMetrics = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const bodyScrollW = document.body.scrollWidth;
            const docScrollW = document.documentElement.scrollWidth;
            const windowInnerW = window.innerWidth;
            const maxScrollW = Math.max(bodyScrollW, docScrollW);
            return {
              maxScrollW,
              windowInnerW,
              overflow: maxScrollW > windowInnerW,
              diff: maxScrollW - windowInnerW
            };
          })()
        `,
        returnByValue: true,
      });

      await captureScreenshot(client, `${framesDir}/p07_vp_${vp.name}.png`);
      vpResults.push({
        name: vp.name,
        width: vp.width,
        height: vp.height,
        ...overflowMetrics.result.value,
      });
      console.log(`Viewport ${vp.name}: overflow = ${overflowMetrics.result.value.overflow} (diff = ${overflowMetrics.result.value.diff}px)`);
    }

    console.log('--- ALL PHASE 07 VERIFICATION TESTS FINISHED ---');
    console.log('Console Errors detected:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error(consoleErrors);
    }
    console.log('Viewport Results Summary:', JSON.stringify(vpResults, null, 2));

    await client.close();
  } finally {
    cp.kill();
  }
}

main().catch(console.error);

