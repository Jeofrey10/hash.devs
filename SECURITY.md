# HASH.DEVS — SECURITY POLICY & GUIDELINES

## 1. Security Overview

As a high-profile creative technology and digital development studio, HASH.DEVS enforces rigorous frontend and infrastructure security practices to protect brand integrity, client inquiries, and user privacy.

---

## 2. Content Security Policy (CSP) Recommendations

When deploying to production edge environments (Cloudflare Pages, Vercel, AWS CloudFront), implement the following CSP headers:

```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  media-src 'self' https: blob:;
  connect-src 'self' https:;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

---

## 3. Dependency Management & Vulnerability Auditing

1. **Lockfile Discipline:** The `package-lock.json` file must always be committed and verified in CI pipelines via `npm ci`.
2. **Automated Audits:** Run `npm audit` on every release branch. High or critical vulnerabilities must be patched immediately.
3. **Minimal Dependency Surface:** Avoid superfluous third-party packages. Utilities such as class merging and animation helpers are implemented in-house or via tier-1 verified packages (`gsap`, `lenis`, `clsx`, `tailwind-merge`).

---

## 4. Input Sanitization & Form Handling (Phase 08 Preparation)

For upcoming contact forms and interactive inquiry fields:
- No raw HTML rendering via `dangerouslySetInnerHTML`.
- All client inputs will be validated using strict schemas (e.g., Zod) before transmission.
- Direct API endpoints must be protected with rate limiting and origin verification.

---

## 5. Reporting a Security Vulnerability

If you discover a security vulnerability in this project, please notify the security team:

- **Email:** `security@hash.devs`
- **Response SLA:** Within 24 hours of disclosure.
- Please include reproduction steps, environment details, and proof-of-concept payloads.

