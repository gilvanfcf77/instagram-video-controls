// Instagram Video Controls - overlay/progress.js
// Barra de progresso: atualização com o vídeo e seek por clique/arraste.

function bindProgress(overlay, video, signal) {
  const fill     = overlay.querySelector('.igvc-progress-fill');
  const bar      = overlay.querySelector('.igvc-progress-bar');
  const timeDisp = overlay.querySelector('.igvc-time');

  const updateProgress = () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    fill.style.width = `${pct}%`;
    timeDisp.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  };

  video.addEventListener('loadedmetadata', updateProgress, { signal });
  video.addEventListener('timeupdate', updateProgress, { signal });

  let dragging = false;
  let activePointerId = null;

  const seekToX = (clientX) => {
    if (!video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  };

  bar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAudioVideo(video);
    dragging = true;
    activePointerId = e.pointerId;
    bar.setPointerCapture(activePointerId);
    seekToX(e.clientX);
  });

  bar.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== activePointerId) return;
    seekToX(e.clientX);
  });

  const stopDrag = (e) => {
    if (!dragging || e.pointerId !== activePointerId) return;
    dragging = false;
    activePointerId = null;
    if (bar.hasPointerCapture(e.pointerId)) {
      bar.releasePointerCapture(e.pointerId);
    }
  };

  bar.addEventListener('pointerup', stopDrag);
  bar.addEventListener('pointercancel', stopDrag);
}
