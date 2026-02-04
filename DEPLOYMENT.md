# Deployment Guide for Intelli Extract

This guide outlines the steps to build and deploy the Intelli Extract application for production.

## 1. Prerequisites

-   **Node.js**: Version 18+ installed.
-   **API Endpoint**: A running instance of your AI API accessible from the deployment environment.

## 2. Environment Configuration

For production, avoid hardcoding API URLs. Instead, use environment variables.

1.  Create a `.env` file in the root directory (local development):
    ```env
    VITE_API_BASE_URL=http://11.0.0.33:8090/api/v1
    ```
2.  Update `src/services/api.ts` to use the variable:
    ```typescript
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://11.0.0.33:8090/api/v1';
    ```

## 3. Building for Production

Run the build command to generate optimized static files:

```bash
npm run build
```

This creates a `dist/` directory containing:
-   `index.html`
-   `assets/` (bundled JS and CSS)

You can preview the production build locally:
```bash
npm run preview
```

## 4. Deployment Options

### Option A: Docker (Recommended)

Create a `Dockerfile` in the project root:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: Custom Nginx config if needed for handling React Router paths
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**
```bash
docker build -t intelli-extract .
docker run -p 80:80 intelli-extract
```

### Option B: Static Hosting (Netlify, Vercel, etc.)

Since this is a client-side React app, you can deploy it to any static host.

**Netlify:**
1.  Drag and drop the `dist/` folder to Netlify Drop.
2.  Or connect via Git:
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist`

**Important:** For Single Page Apps (SPA), you need to ensure all routes redirect to `index.html`.
-   **Netlify:** Create a `_redirects` file in `public/` containing `/*  /index.html  200`

### Option C: Nginx (Manual)

1.  Install Nginx on your server.
2.  Copy the contents of `dist/` to `/var/www/html` (or your web root).
3.  Configure Nginx to handle client-side routing:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 5. Verification

After deployment:
1.  Open the application URL.
2.  Check that the UI loads correctly.
3.  Test a document upload to ensure the API connection works (check CORS settings on your API server if the domains differ).
