// Instagram Video Controls - utils.js

function formatTime(secs) {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function isEditableElement(element) {
  while (element && element !== document.body && element !== document.documentElement) {
    const tag = element.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    const contentEditable = element.getAttribute?.('contenteditable');
    if (contentEditable === '' || contentEditable === 'true' || contentEditable === 'plaintext-only') return true;
    element = element.parentElement;
  }
  return false;
}
