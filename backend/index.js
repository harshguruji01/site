const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data.json');
const TOOLS_FILE = path.join(__dirname, 'tools.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { users: [], subscribers: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory cache and rate limiter for proxy
const PROXY_CACHE = new Map(); // key -> { ts, ttl, data }
const RATE_LIMIT = new Map(); // ip -> { count, windowStart }
const RATE_LIMIT_MAX = 60; // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const CACHE_TTL_MS = 20 * 1000; // 20 seconds

function readTools() {
  try {
    return JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  } catch (e) {
    return { tools: [] };
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/', (req, res) => res.json({ ok: true, version: '0.1.0' }));

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const data = readData();
  if (data.users.find(u => u.email === email)) return res.status(409).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, name: name || '', password_hash: hash, data: {}, created_at: new Date().toISOString() };
  data.users.push(user);
  writeData(data);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const data = readData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, token });
});

app.get('/api/users/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });
  const data = readData();
  const user = data.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const safe = { id: user.id, email: user.email, name: user.name, data: user.data, created_at: user.created_at };
  res.json({ ok: true, user: safe });
});

app.post('/api/users/:id/export', authMiddleware, (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });
  const data = readData();
  const user = data.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const exported = { id: user.id, email: user.email, name: user.name, data: user.data, created_at: user.created_at };
  res.json({ ok: true, exported });
});

app.post('/api/users/import', (req, res) => {
  const { exported } = req.body;
  if (!exported || !exported.email) return res.status(400).json({ error: 'Invalid payload' });
  const data = readData();
  if (data.users.find(u => u.email === exported.email)) return res.status(409).json({ error: 'User exists' });
  const user = { id: uuidv4(), email: exported.email, name: exported.name || '', password_hash: '', data: exported.data || {}, created_at: new Date().toISOString() };
  data.users.push(user);
  writeData(data);
  res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/api/sync', authMiddleware, (req, res) => {
  const payload = req.body;
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.data = Object.assign({}, user.data || {}, payload.data || {});
  user.last_sync = new Date().toISOString();
  writeData(data);
  res.json({ ok: true, data: user.data });
});

app.post('/api/subscribers', (req, res) => {
  const { email, source } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const data = readData();
  if (data.subscribers.find(s => s.email === email)) return res.json({ ok: true, message: 'Already subscribed' });
  data.subscribers.push({ id: uuidv4(), email, source: source || 'site', created_at: new Date().toISOString() });
  writeData(data);
  res.json({ ok: true });
});

// Return configured tools for frontend
app.get('/api/tools', (req, res) => {
  const tools = readTools();
  res.json({ ok: true, tools: tools.tools || [] });
});

// Simple proxy endpoint with host whitelist to avoid open proxy abuse
app.post('/api/proxy', async (req, res) => {
  const { url, method, body } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url required' });
  try {
    // rate limiting per IP
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const r = RATE_LIMIT.get(ip) || { count: 0, windowStart: now };
    if (now - r.windowStart > RATE_LIMIT_WINDOW_MS) {
      r.count = 0; r.windowStart = now;
    }
    r.count += 1;
    RATE_LIMIT.set(ip, r);
    if (r.count > RATE_LIMIT_MAX) return res.status(429).json({ error: 'Too many requests' });

    // cache lookup
    const cacheKey = url + '|' + (method || 'GET');
    const cached = PROXY_CACHE.get(cacheKey);
    if (cached && (now - cached.ts) < (cached.ttl || CACHE_TTL_MS)) {
      return res.json({ ok: true, fromCache: true, ...cached.data });
    }
    const allowedHosts = [
      'en.wikipedia.org',
      'nominatim.openstreetmap.org',
      'api.rss2json.com',
      'feeds.bbci.co.uk',
      'feeds.reuters.com',
      'api.unsplash.com',
      'images.unsplash.com',
      'timesofindia.indiatimes.com',
      'feeds.feedburner.com',
      'news.google.com',
      'rss.cnn.com',
      'rss.nytimes.com',
      'feeds.arstechnica.com',
      'api.openweathermap.org',
      'api.weatherapi.com'
    ];
    const parsed = new URL(url);
    if (!allowedHosts.includes(parsed.hostname)) return res.status(403).json({ error: 'Host not allowed' });

    const fetchOptions = { method: method || 'GET', headers: { 'User-Agent': 'HarshGuruJiBot/1.0 (harshguruji.online)' } };
    if (body && (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers['Content-Type'] = 'application/json';
    }

    const upstream = await fetch(url, fetchOptions);
    const contentType = upstream.headers.get('content-type') || '';
    let payload = {};
    if (contentType.includes('application/json')) {
      const js = await upstream.json();
      payload = { json: js };
    } else {
      const text = await upstream.text();
      payload = { text };
    }
    // store in cache
    PROXY_CACHE.set(cacheKey, { ts: now, ttl: CACHE_TTL_MS, data: payload });
    return res.json(Object.assign({ ok: true, fromCache: false }, payload));
  } catch (err) {
    console.error('proxy error', err);
    return res.status(500).json({ error: 'Proxy failed' });
  }
});

// Provide redirect/search suggestions (frontend opens returned URL)
app.post('/api/search-redirect', (req, res) => {
  const { q, engine } = req.body || {};
  if (!q) return res.status(400).json({ error: 'q required' });
  const enc = encodeURIComponent(q);
  const engines = {
    google: `https://www.google.com/search?q=${enc}`,
    ddg: `https://duckduckgo.com/?q=${enc}`,
    news: `https://news.google.com/search?q=${enc}`
  };
  const url = engines[engine] || engines.ddg;
  res.json({ ok: true, url });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend prototype running on port', PORT));
