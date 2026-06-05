if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
      console.log('SW registered:', reg.scope);
      // optional: listen for updates
      reg.addEventListener('updatefound', ()=>{
        const newSW = reg.installing;
        newSW.addEventListener('statechange', ()=>console.log('SW state:', newSW.state));
      });
    }).catch(err=>console.warn('SW registration failed', err));
  });
}
