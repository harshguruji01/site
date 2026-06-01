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
