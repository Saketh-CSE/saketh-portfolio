# Saketha Ram portfolio

A responsive, single-page portfolio built with React, Vite, Lucide React, and Framer Motion. The UI is rendered from JSX components; content is organized in `src/data/portfolio.js`.

## Install and run

```powershell
npm install
npm run dev
```

Vite prints the local URL after starting the development server. Create a production build with `npm run build`; preview it with `npm run preview`. Run component and interaction tests with `npm test`.

## Deploy

Run `npm run build` and publish the generated `dist/` directory to a static host such as GitHub Pages, Netlify, or Vercel. Vite is configured with a relative asset base so the build can be served from a project subpath. No router fallback or backend is required.

The portfolio assistant uses deterministic local responses from the published portfolio content. It does not send questions to an external service.
