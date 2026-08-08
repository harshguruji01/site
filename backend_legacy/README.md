Prototype backend for HarshGuruJi

Quick start

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run locally:

```bash
JWT_SECRET=your_secret npm start
```

APIs

- `POST /api/register` { email, password, name }
- `POST /api/login` { email, password }
- `GET /api/users/:id` (Bearer token)
- `POST /api/users/:id/export` (Bearer token)
- `POST /api/users/import` { exported }
- `POST /api/sync` (Bearer token) { data }
- `POST /api/subscribers` { email, source }

 This is a minimal prototype using a file `data.json` for storage. For production, move to a proper database and secure secrets.

Additional API endpoints added:

- `GET /api/tools` — returns configured tools from `tools.json`.
- `POST /api/proxy` — simple server-side proxy for a small allowlist of hosts. Body: `{ "url": "https://..." }`.
- `POST /api/search-redirect` — returns a safe search redirect URL. Body: `{ "q": "search terms", "engine": "ddg|google|news" }`.

Notes:
- `tools.json` is file-based and used for prototype/demo only.
- The proxy is restricted to a short allowlist to avoid becoming an open proxy. Add hosts only if you control the backend hosting and understand traffic/privacy implications.

Proxy improvements:
- Basic in-memory caching added for `/api/proxy` (20s TTL) to reduce upstream calls.
- Simple per-IP rate limiting added (default 60 requests / minute). Tune `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` in `index.js` for production.

Security note: This cache and rate limiter are in-memory and ephemeral; for production use Redis or another durable store and a robust rate-limiting middleware.
