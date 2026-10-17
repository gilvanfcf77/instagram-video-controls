// Instagram Video Controls - overlay/bind.js
// Liga os botões do overlay às ações sobre o vídeo.

function bindControls(overlay, video) {
  let speedIdx = DEFAULT_SPEED_INDEX;

  const playBtn  = overlay.querySelector('#igvc-play');
  const backBtn  = overlay.querySelector('#igvc-back');
  const fwdBtn   = overlay.querySelector('#igvc-forward');
  const muteBtn  = overlay.querySelector('#igvc-mute');
  const speedBtn = overlay.querySelector('#igvc-speed');
  const fsBtn    = overlay.querySelector('#igvc-fullscreen');

  const updatePlayIcon = () => {
    playBtn.querySelector('.igvc-icon').textContent = video.paused ? '▶' : '⏸';
  };
  const updateMuteIcon = () => {
    muteBtn.querySelector('.igvc-icon').textContent = isAudible(video) ? '🔊' : '🔇';
  };

  // Todos os listeners no vídeo/document usam este signal para serem
  // removidos quando o overlay mudar para outro vídeo.
  const ac = new AbortController();
  const { signal } = ac;

  video.addEventListener('play', updatePlayIcon, { signal });
  video.addEventListener('pause', updatePlayIcon, { signal });
  // Sincroniza o ícone se o Instagram mudar o muted externamente
  video.addEventListener('volumechange', updateMuteIcon, { signal });
  updatePlayIcon();
  updateMuteIcon();

  // Cada botão usa pointerdown em vez de click — dispara antes que o Instagram
  // consiga reagir ao evento, e usamos preventDefault para cancelar o click
  // sintético que viria depois.
  // Usar um controle torna este o vídeo principal (dono do áudio).
  const handle = (fn, { claimAudio = true } = {}) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (claimAudio) setAudioVideo(video);
    fn(e);
  };

  playBtn.addEventListener('pointerdown', handle(() => togglePlay(video)));

  backBtn.addEventListener('pointerdown', handle(() => {
    skip(video, -SKIP_SECONDS);
    showSkipFeedback(overlay, `-${SKIP_SECONDS}s`);
  }));

  fwdBtn.addEventListener('pointerdown', handle(() => {
    skip(video, SKIP_SECONDS);
    showSkipFeedback(overlay, `+${SKIP_SECONDS}s`);
  }));

  muteBtn.addEventListener('pointerdown', handle(() => toggleSound(video), { claimAudio: false }));

  speedBtn.addEventListener('pointerdown', handle(() => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    video.playbackRate = SPEEDS[speedIdx];
    speedBtn.querySelector('.igvc-icon').textContent = `${SPEEDS[speedIdx]}×`;
  }));

  fsBtn.addEventListener('pointerdown', handle(() => toggleFullscreen(video)));

  bindProgress(overlay, video, signal);
  bindVolume(overlay, video, signal);
  bindFullscreen(overlay, video, fsBtn, signal);

  return () => ac.abort();
}
