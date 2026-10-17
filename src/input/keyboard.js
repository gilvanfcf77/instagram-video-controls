// Instagram Video Controls - input/keyboard.js
// Atalhos: ←/→ seek, M som, F tela cheia.

function handleKeyDown(e) {
  const video = state.currentVideo;
  if (!video) return;
  if (isEditableElement(document.activeElement)) return;

  const flash = (text) => {
    const overlay = state.currentControls;
    if (!overlay) return;
    showOverlay(overlay);
    showSkipFeedback(overlay, text);
    scheduleHide(overlay);
  };

  if (['ArrowLeft', 'ArrowRight', 'f', 'F'].includes(e.key)) {
    setAudioVideo(video);
  }

  switch (e.key) {
    case 'ArrowLeft':
      skip(video, -SKIP_SECONDS);
      flash(`-${SKIP_SECONDS}s`);
      e.preventDefault(); break;
    case 'ArrowRight':
      skip(video, SKIP_SECONDS);
      flash(`+${SKIP_SECONDS}s`);
      e.preventDefault(); break;
    case 'm': case 'M':
      toggleSound(video); break;
    case 'f': case 'F':
      toggleFullscreen(video); break;
  }
}
