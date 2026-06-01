// Text Tool JS - client-side processing only
document.addEventListener('DOMContentLoaded', ()=>{
  const ta = document.getElementById('text-input');
  const countWords = s => (s.trim().length? s.trim().split(/\s+/).length:0);
  const countChars = s => s.length;
  const preview = document.getElementById('preview');
  const wordsEl = document.getElementById('words');
  const charsEl = document.getElementById('chars');
  const copyBtn = document.getElementById('btn-copy');
  const downloadBtn = document.getElementById('btn-download');
  const resetBtn = document.getElementById('btn-reset');
  const shareBtn = document.getElementById('btn-share');
  const upperBtn = document.getElementById('btn-upper');
  const lowerBtn = document.getElementById('btn-lower');
  const titleBtn = document.getElementById('btn-title');
  const trimBtn = document.getElementById('btn-trim');
  const removeSpacesBtn = document.getElementById('btn-remove-spaces');
  const notif = document.getElementById('notif');
  const loading = document.getElementById('loading-ind');

  function updateMetrics(){
    const v = ta.value || '';
    wordsEl.textContent = countWords(v);
    charsEl.textContent = countChars(v);
    preview.textContent = v;
  }
  function showMsg(text, ok=true){ notif.textContent = text; notif.className = ok? 'notice success':'notice info'; setTimeout(()=>{ if(notif) notif.textContent=''; },2000); }

  // Real-time updates
  ta.addEventListener('input', ()=>{
    updateMetrics();
  });

  // Actions
  copyBtn.addEventListener('click', async ()=>{
    try{ await navigator.clipboard.writeText(ta.value); showMsg('Copied to clipboard'); }
    catch(e){ showMsg('Copy failed: use Ctrl+C', false); }
  });

  downloadBtn.addEventListener('click', ()=>{
    const blob = new Blob([ta.value||''], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'text.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); showMsg('Download started');
  });

  resetBtn.addEventListener('click', ()=>{ ta.value=''; updateMetrics(); showMsg('Reset'); });

  shareBtn.addEventListener('click', async ()=>{
    if(navigator.share){ try{ await navigator.share({ title: document.title, text: ta.value, url: location.href }); showMsg('Shared via native share'); }catch(e){ showMsg('Share canceled', false); }} else { try{ await navigator.clipboard.writeText(ta.value); showMsg('Copied text — share manually'); }catch(e){ showMsg('Unable to share', false);} }
  });

  upperBtn.addEventListener('click', ()=>{ ta.value = ta.value.toUpperCase(); updateMetrics(); showMsg('Converted to UPPERCASE'); });
  lowerBtn.addEventListener('click', ()=>{ ta.value = ta.value.toLowerCase(); updateMetrics(); showMsg('Converted to lowercase'); });
  titleBtn.addEventListener('click', ()=>{ ta.value = ta.value.replace(/\w\S*/g, w=> w.charAt(0).toUpperCase()+w.substr(1).toLowerCase()); updateMetrics(); showMsg('Converted to Title Case'); });
  trimBtn.addEventListener('click', ()=>{ ta.value = ta.value.trim(); updateMetrics(); showMsg('Trimmed leading/trailing whitespace'); });
  removeSpacesBtn.addEventListener('click', ()=>{ ta.value = ta.value.replace(/\s+/g,' '); updateMetrics(); showMsg('Normalized spaces'); });

  // keyboard shortcuts (Ctrl+Enter to download)
  ta.addEventListener('keydown', (e)=>{ if((e.ctrlKey||e.metaKey) && e.key==='Enter'){ downloadBtn.click(); } });

  // initial metrics
  updateMetrics();
});
