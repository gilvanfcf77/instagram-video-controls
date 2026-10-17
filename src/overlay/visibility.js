// Instagram Video Controls - overlay/visibility.js

function showOverlay(overlay) {
  clearTimeout(state.hideTimeout);
  state.hideTimeout = null;
  overlay.classList.add('igvc-overlay--visible');
}

function scheduleHide(overlay) {
  if (state.hideTimeout) return; // já agendado — não empilha timers
  state.hideTimeout = setTimeout(() => {
    state.hideTimeout = null;
    overlay.classList.remove('igvc-overlay--visible');
  }, HIDE_DELAY_MS);
}

function showSkipFeedback(overlay, text) {
  let fb = overlay.querySelector('.igvc-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'igvc-feedback';
    overlay.appendChild(fb);
  }
  fb.textContent = text;
  fb.classList.remove('igvc-feedback--show');
  void fb.offsetWidth;
  fb.classList.add('igvc-feedback--show');
}
