(function() {
  window.SUPABASE_URL = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
  window.SUPABASE_ANON_KEY = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';

  function getSharedCookie(name) {
    if (typeof document === 'undefined') return null;
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      try {
        return decodeURIComponent(parts.pop().split(';').shift());
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  function setSharedCookie(name, value, days) {
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

  function removeSharedCookie(name) {
    if (typeof document === 'undefined') return;
    var hostname = window.location.hostname;
    var domainStr = '';
    if (hostname === 'webguruji.online' || hostname.endsWith('.webguruji.online')) {
      domainStr = '; domain=.webguruji.online';
    }
    document.cookie = name + '=; path=/; max-age=0' + domainStr + '; SameSite=Lax';
    document.cookie = name + '=; path=/; max-age=0; SameSite=Lax';
  }

  window.HG_SHARED_STORAGE = {
    getItem: function(key) {
      try {
        var local = localStorage.getItem(key);
        if (local) {
          setSharedCookie(key, local);
          return local;
        }
      } catch (e) {}

      var fromCookie = getSharedCookie(key);
      if (fromCookie) {
        try {
          localStorage.setItem(key, fromCookie);
        } catch (e) {}
        return fromCookie;
      }
      return null;
    },
    setItem: function(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
      setSharedCookie(key, value);
    },
    removeItem: function(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
      removeSharedCookie(key);
    }
  };

  window.getSharedCookie = getSharedCookie;
  window.setSharedCookie = setSharedCookie;
  window.removeSharedCookie = removeSharedCookie;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: {
        storage: window.HG_SHARED_STORAGE,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }
})();
