// Instagram Video Controls - audio.js
// Só um vídeo com som por vez (state.audioVideo) e preferência de som do usuário.

// O Instagram pode silenciar tanto por muted quanto por volume 0.
function isAudible(video) {
  return !video.muted && video.volume > 0;
}

function setAudioVideo(video) {
  if (video === state.audioVideo) return;
  // Só um vídeo com som por vez: o principal anterior é silenciado. Sem
  // preferência do usuário, o mute fica por conta do Instagram.
  if (state.soundPref !== null && state.audioVideo && state.audioVideo.isConnected) {
    state.audioVideo.muted = true;
  }
  state.audioVideo = video;
  enforceSoundPref();
}

// Reaplica a preferência do usuário no vídeo principal caso o Instagram
// altere o mute.
function enforceSoundPref() {
  const { soundPref, audioVideo } = state;
  if (soundPref === null || !audioVideo) return;
  if (audioVideo.muted !== !soundPref) audioVideo.muted = !soundPref;
  // Ligar o som num vídeo com volume 0 não basta tirar o mute
  if (soundPref && audioVideo.volume === 0) audioVideo.volume = state.lastVolume || 1;
}

// Alterna o som do vídeo e o torna o principal. O estado é lido ANTES de
// setAudioVideo, que já reaplicaria a preferência antiga neste vídeo.
function toggleSound(video) {
  const turnOn = !isAudible(video);
  state.soundPref = turnOn;
  setAudioVideo(video);
  enforceSoundPref();
}
