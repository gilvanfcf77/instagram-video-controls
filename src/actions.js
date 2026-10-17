// Instagram Video Controls - actions.js
// Ações sobre o vídeo, usadas pelos botões e pelos atalhos de teclado.

function skip(video, secs) {
  video.currentTime = Math.min(video.duration || Infinity, Math.max(0, video.currentTime + secs));
}

function togglePlay(video) {
  if (video.paused) {
    video.play();
    // Instagram pode forçar muted=true ao retomar — restaura o estado interno.
    setTimeout(enforceSoundPref, 50);
  } else {
    video.pause();
  }
}

function toggleFullscreen(video) {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  // Tela cheia no container (não no <video>) para o overlay poder ficar dentro dele
  const target = video.parentElement || video;
  target.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
}
