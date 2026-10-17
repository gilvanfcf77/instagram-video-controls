// Instagram Video Controls - overlay/volume.js
// Barra de volume (0 a 100) que aparece ao passar o mouse no botão de som.

function bindVolume(overlay, video, signal) {
  const wrap = overlay.querySelector('.igvc-volume');
  const bar  = overlay.querySelector('.igvc-volume-bar');
  const fill = overlay.querySelector('.igvc-volume-fill');

  // Mudo aparece como 0, como no controle nativo
  const updateVolume = () => {
    fill.style.width = `${isAudible(video) ? video.volume * 100 : 0}%`;
  };
  video.addEventListener('volumechange', updateVolume, { signal });
  updateVolume();

  const setVolumeFromX = (clientX) => {
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    // Escolher um volume é escolher o som: vira a preferência do usuário
    state.soundPref = ratio > 0;
    if (ratio > 0) {
      video.volume = ratio;
      state.lastVolume = ratio;
    }
    video.muted = ratio === 0;
  };

  let activePointerId = null;

  bar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAudioVideo(video);
    activePointerId = e.pointerId;
    bar.setPointerCapture(activePointerId);
    // Mantém a barra aberta durante o arraste, mesmo com o mouse fora dela
    wrap.classList.add('igvc-volume--dragging');
    setVolumeFromX(e.clientX);
  });

  bar.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activePointerId) return;
    setVolumeFromX(e.clientX);
  });

  const stopDrag = (e) => {
    if (e.pointerId !== activePointerId) return;
    activePointerId = null;
    wrap.classList.remove('igvc-volume--dragging');
    if (bar.hasPointerCapture(e.pointerId)) {
      bar.releasePointerCapture(e.pointerId);
    }
  };

  bar.addEventListener('pointerup', stopDrag);
  bar.addEventListener('pointercancel', stopDrag);
}
