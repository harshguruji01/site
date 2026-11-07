(function() {
  window.SUPABASE_URL = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
  window.SUPABASE_ANON_KEY = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';
  window.SUPABASE_STORAGE_KEY = 'sb-wumdbpyhpblvgjttsbpv-auth-token';

  function getRawCookie(name) {
    if (typeof document === 'undefined') return null;
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length >= 2) {
      var rawVal = parts.pop().split(';').shift();
      try {
        return decodeURIComponent(rawVal);
      } catch (e) {
        return rawVal;
      }
    }
    return null;
  }

  function getSharedCookie(name) {
    var main = getRawCookie(name);
    if (!main) return null;
    if (main.indexOf('chunked:') === 0) {
      var count = parseInt(main.split(':')[1], 10);
      var combined = '';
      for (var i = 0; i < count; i++) {
        var part = getRawCookie(name + '.' + i);
        if (part) {
          combined += part;
        }
      }
      return combined || null;
    }
    return main;
  }

  function setRawCookie(name, value, days) {
    if (typeof document === 'undefined') return;
    days = days || 365;
    var maxAge = days * 24 * 60 * 60;
    var hostname = window.location.hostname;
    var domainStr = '';
    if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
      domainStr = '; domain=.webguruji.online';
    }
    var secureStr = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + domainStr + '; SameSite=Lax' + secureStr;
  }

  function removeRawCookie(name) {
    if (typeof document === 'undefined') return;
    var hostname = window.location.hostname;
    var domainStr = '';
    if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
      domainStr = '; domain=.webguruji.online';
    }
    var secureStr = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = name + '=; path=/; max-age=0' + domainStr + '; SameSite=Lax' + secureStr;
    document.cookie = name + '=; path=/; max-age=0; SameSite=Lax' + secureStr;
  }

  function setSharedCookie(name, value, days) {
    if (!value) {
      removeSharedCookie(name);
      return;
    }
    var CHUNK_SIZE = 1800;
    var strVal = String(value);

    for (var k = 0; k < 10; k++) {
      removeRawCookie(name + '.' + k);
    }

    if (strVal.length > CHUNK_SIZE) {
      var chunks = [];
      for (var i = 0; i < strVal.length; i += CHUNK_SIZE) {
        chunks.push(strVal.substring(i, i + CHUNK_SIZE));
      }
      setRawCookie(name, 'chunked:' + chunks.length, days);
      for (var j = 0; j < chunks.length; j++) {
        setRawCookie(name + '.' + j, chunks[j], days);
      }
    } else {
      setRawCookie(name, strVal, days);
    }
  }

  function removeSharedCookie(name) {
    var main = getRawCookie(name);
    if (main && main.indexOf('chunked:') === 0) {
      var count = parseInt(main.split(':')[1], 10);
      for (var i = 0; i < count; i++) {
        removeRawCookie(name + '.' + i);
      }
    }
    for (var k = 0; k < 10; k++) {
      removeRawCookie(name + '.' + k);
    }
    removeRawCookie(name);
  }

  function syncUserSessionSummary(sessionJson) {
    try {
      if (!sessionJson) {
        removeRawCookie('hg_user_session');
        return;
      }
      var parsed = typeof sessionJson === 'string' ? JSON.parse(sessionJson) : sessionJson;
      var user = parsed.user || parsed;
      if (user && user.id) {
        var summary = {
          id: user.id,
          email: user.email || '',
          name: (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || (user.email ? user.email.split('@')[0] : 'User'),
          avatar_url: (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || null,
          golden_tick: !!(user.user_metadata && user.user_metadata.golden_tick),
          updated_at: Date.now()
        };
        setRawCookie('hg_user_session', JSON.stringify(summary), 365);
      }
    } catch (e) {}
  }

  window.HG_SHARED_STORAGE = {
    getItem: function(key) {
      var fromCookie = getSharedCookie(key);
      var local = null;
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

      if (local) {
        setSharedCookie(key, local);
        syncUserSessionSummary(local);
        return local;
      }
      return null;
    },
    setItem: function(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
      setSharedCookie(key, value);
      if (key.indexOf('auth-token') !== -1 || key === window.SUPABASE_STORAGE_KEY) {
        syncUserSessionSummary(value);
      }
    },
    removeItem: function(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
      removeSharedCookie(key);
      if (key.indexOf('auth-token') !== -1 || key === window.SUPABASE_STORAGE_KEY) {
        removeRawCookie('hg_user_session');
      }
    }
  };

  window.getSharedCookie = getSharedCookie;
  window.setSharedCookie = setSharedCookie;
  window.removeSharedCookie = removeSharedCookie;

  function wrapSupabaseCreateClient() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return;
    if (window.supabase.__hg_wrapped) return;

    var orig = window.supabase.createClient;
    window.supabase.createClient = function(url, key, options) {
      options = options || {};
      options.auth = options.auth || {};
      if (!options.auth.storage) {
        options.auth.storage = window.HG_SHARED_STORAGE;
      }
      if (!options.auth.storageKey) {
        options.auth.storageKey = window.SUPABASE_STORAGE_KEY;
      }
      if (options.auth.persistSession === undefined) options.auth.persistSession = true;
      if (options.auth.autoRefreshToken === undefined) options.auth.autoRefreshToken = true;
      if (options.auth.detectSessionInUrl === undefined) options.auth.detectSessionInUrl = true;

      return orig.call(window.supabase, url, key, options);
    };
    window.supabase.__hg_wrapped = true;
  }

  // Hook createClient wrapping
  wrapSupabaseCreateClient();
  if (typeof window !== 'undefined' && !window.supabase) {
    var checkInterval = setInterval(function() {
      if (window.supabase) {
        wrapSupabaseCreateClient();
        if (!window.supabaseClient && typeof window.supabase.createClient === 'function') {
          window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        }
        clearInterval(checkInterval);
      }
    }, 50);
    setTimeout(function() { clearInterval(checkInterval); }, 5000);
  }

  if (window.supabase && typeof window.supabase.createClient === 'function' && !window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
})();
