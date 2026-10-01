import { createClient as createClientEsm } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const SUPABASE_URL = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;

// --- CROSS-SUBDOMAIN COOKIE + LOCALSTORAGE STORAGE ADAPTER ---
// Enables seamless Single Sign-On (SSO) across webguruji.online, store.webguruji.online, and chat.webguruji.online
export function getSharedCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return decodeURIComponent(parts.pop().split(';').shift());
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function setSharedCookie(name, value, days = 365) {
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

export function removeSharedCookie(name) {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  let domainStr = '';
  if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
    domainStr = '; domain=.webguruji.online';
  }
  document.cookie = `${name}=; path=/; max-age=0${domainStr}; SameSite=Lax`;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export const crossDomainStorage = {
  getItem: (key) => {
    try {
      const local = localStorage.getItem(key);
      if (local) {
        setSharedCookie(key, local);
        return local;
      }
    } catch (e) {}

    const fromCookie = getSharedCookie(key);
    if (fromCookie) {
      try {
        localStorage.setItem(key, fromCookie);
      } catch (e) {}
      return fromCookie;
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    setSharedCookie(key, value);
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    removeSharedCookie(key);
  }
};

const clientOptions = {
  auth: {
    storage: crossDomainStorage,
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
}

// Initialize Supabase: Re-use window.supabaseClient if already created, or create via ESM/window.supabase
let client = null;
if (typeof window !== 'undefined' && window.supabaseClient) {
  client = window.supabaseClient;
} else {
  try {
    client = createClientEsm(supabaseUrl, supabaseKey, clientOptions);
  } catch (err) {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      client = window.supabase.createClient(supabaseUrl, supabaseKey, clientOptions);
    } else {
      console.error('Failed to initialize Supabase client:', err);
    }
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
