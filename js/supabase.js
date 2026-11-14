// Safe Supabase Initializer - Supports window.supabase CDN and dynamic ESM fallback

export const SUPABASE_URL = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';
export const SUPABASE_STORAGE_KEY = 'sb-wumdbpyhpblvgjttsbpv-auth-token';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;

// --- CROSS-SUBDOMAIN COOKIE + LOCALSTORAGE STORAGE ADAPTER ---
// Enables seamless Single Sign-On (SSO) across webguruji.online and all subdomains (login, store, books, chat, ai, etc.)
function getRawCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length >= 2) {
    const rawVal = parts.pop().split(';').shift();
    try {
      return decodeURIComponent(rawVal);
    } catch (e) {
      return rawVal;
    }
  }
  return null;
}

export function getSharedCookie(name) {
  const main = getRawCookie(name);
  if (!main) return null;
  if (main.startsWith('chunked:')) {
    const count = parseInt(main.split(':')[1], 10);
    let combined = '';
    for (let i = 0; i < count; i++) {
      const part = getRawCookie(`${name}.${i}`);
      if (part) combined += part;
    }
    return combined || null;
  }
  return main;
}

function setRawCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const hostname = window.location.hostname;
  let domainStr = '';
  if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
    domainStr = '; domain=.webguruji.online';
  }
  const secureStr = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}${domainStr}; SameSite=Lax${secureStr}`;
}

function removeRawCookie(name) {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  let domainStr = '';
  if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
    domainStr = '; domain=.webguruji.online';
  }
  const secureStr = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${name}=; path=/; max-age=0${domainStr}; SameSite=Lax${secureStr}`;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secureStr}`;
}

export function setSharedCookie(name, value, days = 365) {
  if (!value) {
    removeSharedCookie(name);
    return;
  }
  // Safe chunk size: 1800 chars so URI-encoded value never exceeds 2800 bytes (browser max 4096 bytes)
  const CHUNK_SIZE = 1800;
  const strVal = String(value);

  // Clear previous chunk cookies to prevent stale chunks
  for (let k = 0; k < 10; k++) {
    removeRawCookie(`${name}.${k}`);
  }

  if (strVal.length > CHUNK_SIZE) {
    const chunks = [];
    for (let i = 0; i < strVal.length; i += CHUNK_SIZE) {
      chunks.push(strVal.substring(i, i + CHUNK_SIZE));
    }
    setRawCookie(name, `chunked:${chunks.length}`, days);
    for (let j = 0; j < chunks.length; j++) {
      setRawCookie(`${name}.${j}`, chunks[j], days);
    }
  } else {
    setRawCookie(name, strVal, days);
  }
}

export function removeSharedCookie(name) {
  const main = getRawCookie(name);
  if (main && main.startsWith('chunked:')) {
    const count = parseInt(main.split(':')[1], 10);
    for (let i = 0; i < count; i++) {
      removeRawCookie(`${name}.${i}`);
    }
  }
  for (let k = 0; k < 10; k++) {
    removeRawCookie(`${name}.${k}`);
  }
  removeRawCookie(name);
}

// Write/Sync user session summary cookie for instant UI hydration across subdomains
function syncUserSessionSummary(sessionJson) {
  try {
    if (!sessionJson) {
      removeRawCookie('hg_user_session');
      return;
    }
    const parsed = typeof sessionJson === 'string' ? JSON.parse(sessionJson) : sessionJson;
    const user = parsed.user || parsed;
    if (user && user.id) {
      const summary = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'User'),
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        golden_tick: !!user.user_metadata?.golden_tick,
        updated_at: Date.now()
      };
      setRawCookie('hg_user_session', JSON.stringify(summary), 365);
    }
  } catch (e) {}
}

export const crossDomainStorage = {
  getItem: (key) => {
    // 1. Check shared domain cookie (.webguruji.online) - Single Source of Truth for SSO
    const fromCookie = getSharedCookie(key);
    let local = null;
    try {
      local = localStorage.getItem(key);
    } catch (e) {}

    if (fromCookie) {
      if (local !== fromCookie) {
        try {
          localStorage.setItem(key, fromCookie);
        } catch (e) {}
      }
      return fromCookie;
    }

    // 2. Fallback to localStorage if no cookie present
    if (local) {
      setSharedCookie(key, local);
      syncUserSessionSummary(local);
      return local;
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    setSharedCookie(key, value);
    if (key.includes('auth-token') || key === SUPABASE_STORAGE_KEY) {
      syncUserSessionSummary(value);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    removeSharedCookie(key);
    if (key.includes('auth-token') || key === SUPABASE_STORAGE_KEY) {
      removeRawCookie('hg_user_session');
    }
  }
};

export const clientOptions = {
  auth: {
    storage: crossDomainStorage,
    storageKey: SUPABASE_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
};

// Expose storage helpers to window
if (typeof window !== 'undefined') {
  window.HG_SHARED_STORAGE = crossDomainStorage;
  window.getSharedCookie = getSharedCookie;
  window.setSharedCookie = setSharedCookie;
  window.removeSharedCookie = removeSharedCookie;
  window.SUPABASE_STORAGE_KEY = SUPABASE_STORAGE_KEY;
}

// Initialize Supabase: Re-use window.supabaseClient if already created, or create via window.supabase
let client = null;
if (typeof window !== 'undefined' && window.supabaseClient) {
  client = window.supabaseClient;
} else if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    client = window.supabase.createClient(supabaseUrl, supabaseKey, clientOptions);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

// Expose to window for global access across scripts
if (typeof window !== 'undefined') {
  window.supabaseClient = client;
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
}

export default supabase;
