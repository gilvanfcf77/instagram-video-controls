// Instagram Video Controls - overlay/layout.js
// Posiciona o overlay (fixed, no <body>) sobre o vídeo.

// Distância que os botões precisam se afastar da borda direita para não cobrir
// a seta "próximo" do carrossel do Instagram (botão pequeno no meio da borda).
// Amostra pontos na faixa direita do vídeo (meio da altura) e procura, na pilha
// de elementos de cada ponto, um botão do Instagram que não seja nosso.
function rightEdgeInset(video, rect) {
  if (!rect.width || !rect.height) return 0;
  let inset = 0;
  for (const dx of [12, 24, 36]) {
    for (const fy of [0.4, 0.5, 0.6]) {
      const x = rect.right - dx;
      const y = rect.top + rect.height * fy;
      for (const el of document.elementsFromPoint(x, y)) {
        if (el === video || el.closest('.igvc-overlay')) continue;
        const btn = el.closest('button, [role="button"], [aria-label]');
        if (!btn || btn.contains(video)) continue;
        const r = btn.getBoundingClientRect();
        if (r.width > rect.width / 3 || r.left < rect.left) continue;
        inset = Math.max(inset, rect.right - r.left);
        break;
      }
    }
  }
  return inset ? Math.min(inset, 80) + 8 : 0;
}

// Fração da largura do vídeo que não está cortada por ancestrais com overflow
// (ex.: carrossel do Instagram, onde o vídeo continua no DOM ao lado da foto).
function visibleWidthRatio(video, rect) {
  if (!rect.width) return 0;
  let left = rect.left, right = rect.right;
  for (let el = video.parentElement; el && el !== document.body; el = el.parentElement) {
    const { overflowX } = getComputedStyle(el);
    if (overflowX === 'visible') continue;
    const r = el.getBoundingClientRect();
    left = Math.max(left, r.left);
    right = Math.min(right, r.right);
  }
  return Math.max(0, right - left) / rect.width;
}

// Uma janela do Instagram (denúncia, compartilhar, menu "...") está por cima do
// vídeo. Nosso overlay tem z-index máximo e apareceria sobre ela. Amostra o
// centro e a coluna de botões e vê se o elemento do topo (ignorando o overlay)
// está num dialog que não contém o vídeo — o popup do próprio post contém.
function isCoveredByDialog(video, rect) {
  if (!rect.width || !rect.height) return false;
  const points = [
    [rect.left + rect.width / 2, rect.top + rect.height / 2],
    [rect.right - 30, rect.top + rect.height * 0.4],
    [rect.right - 30, rect.top + rect.height * 0.8],
  ];
  return points.some(([x, y]) => {
    const top = document.elementsFromPoint(x, y).find(el => !el.closest('.igvc-overlay'));
    const dialog = top && top.closest('[role="dialog"]');
    return !!dialog && !dialog.contains(video);
  });
}

function positionOverlay(overlay, video) {
  const rect = video.getBoundingClientRect();
  const fs = overlay.classList.contains('igvc-overlay--fullscreen');
  overlay.classList.toggle('igvc-overlay--clipped', !fs && visibleWidthRatio(video, rect) < 0.5);
  overlay.classList.toggle('igvc-overlay--covered', !fs && isCoveredByDialog(video, rect));
  overlay.style.left   = rect.left + 'px';
  overlay.style.top    = rect.top  + 'px';
  overlay.style.width  = rect.width  + 'px';
  overlay.style.height = rect.height + 'px';
  if (!fs) {
    overlay.style.setProperty('--igvc-edge-inset', rightEdgeInset(video, rect) + 'px');
  }
}
