import { spawn } from 'child_process';
import { mkdirSync } from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\KANIMOZHI\\AppData\\Local\\Temp\\chrome_cdp_profile_form_test';
mkdirSync(userDataDir, { recursive: true });

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
  const port = 9355;
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

    await client.send('Page.navigate', { url: 'http://localhost:4250' });
    await wait(1800);

    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const contact = document.querySelector('#contact');
        if (contact) contact.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await wait(600);

    // 1. Click submit on empty form
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#contact form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.click();
      })()`
    });

    // Wait for React to re-render error messages
    await wait(400);

    const errorsRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        return {
          nameError: document.querySelector('#name-error')?.innerText || null,
          emailError: document.querySelector('#email-error')?.innerText || null,
          descError: document.querySelector('#desc-error')?.innerText || null
        };
      })()`,
      returnByValue: true
    });
    console.log('Errors after click:', errorsRes.result?.value);

    // 2. Fill form with React native value setters
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
        setReactValue(document.querySelector('#inquiry-description'), 'Architecting an intelligent generative UI platform with sub-second latency, custom shaders, and spatial design.');

        const buttons = Array.from(document.querySelectorAll('#contact form button'));
        const aiBtn = buttons.find(b => b.innerText.includes('AI & Automation'));
        if (aiBtn) aiBtn.click();
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

    // Check dispatched view
    const dispatchCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const region = document.querySelector('#contact [role="region"]');
        if (!region) return { found: false, htmlSnippet: document.querySelector('#contact').innerHTML.substring(0, 300) };
        return {
          found: true,
          text: region.innerText
        };
      })()`,
      returnByValue: true
    });
    console.log('Dispatched check:', dispatchCheck.result?.value);

    await client.close();
    await browserClient.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

