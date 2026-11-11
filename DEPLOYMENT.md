# HASH.DEVS — DEPLOYMENT & INFRASTRUCTURE GUIDE

## 1. Build Overview

The application compiles into an ultra-fast, zero-dependency static bundle suitable for global Edge CDN hosting.

- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Node Requirement:** `>= 18.0.0`

---

## 2. Deployment Targets

### 2.1 Vercel Deployment

Create a `vercel.json` in the root (or configure via dashboard):

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2.2 Cloudflare Pages

- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- Configure `_redirects` file in `public/`:
  ```
  /*    /index.html   200
  ```

### 2.3 Netlify Deployment

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2.4 Docker / Nginx Container

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Caching & Performance Headers

Ensure server or CDN headers serve immutable cache rules for Vite assets:
- `/assets/*` -> `Cache-Control: public, max-age=31536000, immutable`
- `/index.html` -> `Cache-Control: public, max-age=0, must-revalidate`
- `/favicon.svg` -> `Cache-Control: public, max-age=86400`

