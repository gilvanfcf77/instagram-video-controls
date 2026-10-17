// Instagram Video Controls - main.js
// Ponto de entrada: vigia os vídeos da página e registra os eventos globais.

// Fração visível de cada vídeo, atualizada pelo IntersectionObserver.
const visibleRatios = new WeakMap();

// O vídeo principal é o que o Instagram está TOCANDO e está mais visível — não
// o primeiro que cruza 50% da tela. Num scroll que para no meio do caminho,
// o vizinho pode passar de 50% enquanto o Instagram continua tocando o
// anterior; trocar nesse momento silenciaria o vídeo que está tocando.
function pickAudioVideo() {
  let best = null;
  let bestRatio = 0.5;
  // Em tela cheia, vídeos da página atrás não podem tirar o som do vídeo em tela cheia
  const fsEl = document.fullscreenElement;
  document.querySelectorAll('video').forEach(video => {
    const ratio = visibleRatios.get(video) || 0;
    if (video.paused || ratio < bestRatio || !isEligibleVideo(video)) return;
    if (fsEl && !fsEl.contains(video)) return;
    best = video;
    bestRatio = ratio;
  });
  if (best) setAudioVideo(best);
}

function observeVideos() {
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visibleRatios.set(entry.target, entry.intersectionRatio);
      if (entry.isIntersecting && entry.intersectionRatio > 0.5 && isEligibleVideo(entry.target)) {
        attachOverlay(entry.target);
      }
    });
    pickAudioVideo();
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  const scan = () => {
    // Vídeo atual saiu do DOM (navegação no Instagram) — remove o overlay órfão
    if (state.currentVideo && !state.currentVideo.isConnected && !document.fullscreenElement) {
      detachOverlay();
    }
    document.querySelectorAll('video').forEach(video => {
      if (!video.dataset.igvcBound) {
        video.dataset.igvcBound = '1';
        intersectionObserver.observe(video);
      }
    });
  };

  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();

  // Eventos de mídia não borbulham — captura no document para vigiar o
  // vídeo principal mesmo quando os controles estão em outro vídeo.
  const onMediaEvent = (e) => {
    if (e.target === state.audioVideo) enforceSoundPref();
  };
  // Quando o Instagram troca o vídeo que toca, o som vai junto
  const onPlayStateChange = (e) => {
    if (e.target.tagName === 'VIDEO') pickAudioVideo();
  };
  document.addEventListener('play', onPlayStateChange, true);
  document.addEventListener('pause', onPlayStateChange, true);
  document.addEventListener('play', onMediaEvent, true);
  document.addEventListener('volumechange', onMediaEvent, true);

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('keydown', handleKeyDown);
}

observeVideos();
