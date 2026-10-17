// Instagram Video Controls - overlay/attach.js
// Anexa o overlay ao <body> posicionado sobre o vídeo.

function attachOverlay(video) {
  if (state.currentVideo === video && state.currentControls) return;
  if (!isEligibleVideo(video)) return;
  // Em tela cheia só o elemento em tela cheia aparece: trocar para um vídeo
  // de fora dele tiraria o overlay da tela.
  const fsEl = document.fullscreenElement;
  if (fsEl && !fsEl.contains(video)) return;

  // Não mexe no som aqui — isso é papel de setAudioVideo.
  detachOverlay();

  state.currentVideo = video;

  const overlay = createControls();
  // Anexa antes do bind: bindFullscreen move o overlay para dentro da tela
  // cheia se o vídeo já estiver nela (ex.: Instagram trocou o <video>).
  document.body.appendChild(overlay);
  const cleanupBindings = bindControls(overlay, video);
  state.currentControls = overlay;

  positionOverlay(overlay, video);

  const reposition = () => {
    if (!document.fullscreenElement) positionOverlay(overlay, video);
  };
  // Pega mudanças de tamanho/layout do vídeo que não vêm de scroll/resize
  const resizeObserver = new ResizeObserver(reposition);
  resizeObserver.observe(video);

  window.addEventListener('scroll', reposition, true);
  window.addEventListener('resize', reposition);
  // O carrossel desliza com transform — não gera scroll nem resize
  window.addEventListener('transitionend', reposition, true);

  // Limpa todos os listeners quando trocar de vídeo
  state.currentCleanup = () => {
    resizeObserver.disconnect();
    window.removeEventListener('scroll', reposition, true);
    window.removeEventListener('transitionend', reposition, true);
    window.removeEventListener('resize', reposition);
    if (cleanupBindings) cleanupBindings();
  };
}

function detachOverlay() {
  if (state.currentCleanup) {
    state.currentCleanup();
    state.currentCleanup = null;
  }
  if (state.currentControls) state.currentControls.remove();
  clearTimeout(state.hideTimeout);
  state.hideTimeout = null;
  state.currentControls = null;
  state.currentVideo = null;
}
