// Instagram Video Controls - overlay/fullscreen.js
// Leva o overlay para dentro do elemento em tela cheia e de volta ao <body>.

function bindFullscreen(overlay, video, fsBtn, signal) {
  const updateFsIcon = () => {
    const isFs = !!document.fullscreenElement;
    fsBtn.querySelector('.igvc-icon').textContent = isFs ? '✕' : '⛶';
    fsBtn.title = isFs ? 'Sair da tela cheia' : 'Tela cheia';
  };

  const setFullscreenVideoStyle = (on) => {
    // Corrige o corte causado pelo object-fit: cover do Instagram
    video.style.objectFit = on ? 'contain' : '';
    video.style.width     = on ? '100%' : '';
    video.style.height    = on ? '100%' : '';
  };

  const onFullscreenChange = () => {
    updateFsIcon();
    const fsEl = document.fullscreenElement;
    if (fsEl && fsEl.contains(video)) {
      // O overlay precisa estar DENTRO do elemento em tela cheia para ser visível
      setFullscreenVideoStyle(true);
      fsEl.appendChild(overlay);
      overlay.classList.add('igvc-overlay--fullscreen');
      showOverlay(overlay);
    } else if (!fsEl) {
      setFullscreenVideoStyle(false);
      document.body.appendChild(overlay);
      overlay.classList.remove('igvc-overlay--fullscreen');
      // Reposiciona em dois momentos — o vídeo pode demorar para se estabilizar
      setTimeout(() => positionOverlay(overlay, video), 150);
      setTimeout(() => positionOverlay(overlay, video), 500);
    }
  };
  document.addEventListener('fullscreenchange', onFullscreenChange, { signal });
  if (document.fullscreenElement) onFullscreenChange();

  // Em tela cheia o overlay cobre o vídeo inteiro e a camada de clique do
  // Instagram fica fora do elemento em tela cheia — o play/pause por clique
  // na tela fica por nossa conta.
  overlay.addEventListener('click', (e) => {
    if (!overlay.classList.contains('igvc-overlay--fullscreen')) return;
    if (e.target.closest('.igvc-btn, .igvc-progress-wrap, .igvc-volume')) return;
    setAudioVideo(video);
    togglePlay(video);
    showSkipFeedback(overlay, video.paused ? '⏸' : '▶');
  }, { signal });
}
