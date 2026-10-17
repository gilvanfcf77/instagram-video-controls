// Instagram Video Controls - input/mouse.js
// O overlay segue o vídeo sob o mouse.

let mouseFrame = null;

function handleMouseMove(e) {
  if (mouseFrame) return;
  const { clientX, clientY, target } = e;
  mouseFrame = requestAnimationFrame(() => {
    mouseFrame = null;
    if (document.fullscreenElement) return;

    const hovered = videoAtPoint(clientX, clientY);
    if (hovered && hovered !== state.currentVideo) attachOverlay(hovered);

    const { currentVideo, currentControls } = state;
    if (!currentControls) return;
    if (!currentVideo.isConnected) {
      detachOverlay();
      return;
    }

    positionOverlay(currentControls, currentVideo);
    if (hovered === currentVideo || currentControls.contains(target)) {
      showOverlay(currentControls);
    } else {
      scheduleHide(currentControls);
    }
  });
}
