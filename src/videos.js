// Instagram Video Controls - videos.js
// Quais vídeos da página recebem controles.

// Prévias do grid (Explore, perfil) ficam dentro de links para o post.
function isPreviewVideo(video) {
  return !!video.closest('a[href*="/p/"], a[href*="/reel/"]');
}

function isEligibleVideo(video) {
  if (!video.isConnected || isPreviewVideo(video)) return false;
  // Com um popup de post aberto, ignora os vídeos da página atrás dele
  const dialogHasVideo = !!document.querySelector('[role="dialog"] video');
  return !dialogHasVideo || !!video.closest('[role="dialog"]');
}

// O Instagram cobre o <video> com camadas transparentes, então mouseenter no
// vídeo nem sempre dispara. Procuramos o vídeo pela pilha de elementos no ponto.
function videoAtPoint(x, y) {
  return document.elementsFromPoint(x, y)
    .find(el => el.tagName === 'VIDEO' && isEligibleVideo(el)) || null;
}
