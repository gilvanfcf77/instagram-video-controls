// Instagram Video Controls - content.js

const SKIP_SECONDS = 5;

let currentVideo = null;
let currentControls = null;
let hideTimeout = null;
let currentCleanup = null; // guarda função de limpeza do vídeo atual

// ─── Cria o painel de controles ───────────────────────────────────────────────
function createControls() {
  const overlay = document.createElement('div');
  overlay.className = 'igvc-overlay';

  const buttons = [
    { id: 'igvc-back',       icon: '⏪', label: `-${SKIP_SECONDS}s`, title: `Voltar ${SKIP_SECONDS}s` },
    { id: 'igvc-play',       icon: '⏸',  label: '',                   title: 'Play / Pause' },
    { id: 'igvc-forward',    icon: '⏩', label: `+${SKIP_SECONDS}s`, title: `Avançar ${SKIP_SECONDS}s` },
    { id: 'igvc-mute',       icon: '🔊', label: '',                   title: 'Mudo / Som' },
    { id: 'igvc-speed',      icon: '⚡', label: '1×',                 title: 'Velocidade' },
    { id: 'igvc-fullscreen', icon: '⛶',  label: '',                   title: 'Tela cheia' },
  ];

  buttons.forEach(({ id, icon, label, title }) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'igvc-btn';
    btn.title = title;
    btn.innerHTML = `<span class="igvc-icon">${icon}</span>${label ? `<span class="igvc-label">${label}</span>` : ''}`;
    overlay.appendChild(btn);
  });

  const progressWrap = document.createElement('div');
  progressWrap.className = 'igvc-progress-wrap';

  const progressBar = document.createElement('div');
  progressBar.className = 'igvc-progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'igvc-progress-fill';

  const progressHandle = document.createElement('div');
  progressHandle.className = 'igvc-progress-handle';

  progressFill.appendChild(progressHandle);
  progressBar.appendChild(progressFill);

  const timeDisplay = document.createElement('span');
  timeDisplay.className = 'igvc-time';
  timeDisplay.textContent = '0:00 / 0:00';

  progressWrap.appendChild(progressBar);
  progressWrap.appendChild(timeDisplay);
  overlay.appendChild(progressWrap);

  return overlay;
}

function positionOverlay(overlay, video) {
  const rect = video.getBoundingClientRect();
  overlay.style.left   = rect.left + 'px';
  overlay.style.top    = rect.top  + 'px';
  overlay.style.width  = rect.width  + 'px';
  overlay.style.height = rect.height + 'px';
}

function formatTime(secs) {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Registra eventos nos controles ──────────────────────────────────────────
function bindControls(overlay, video) {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let speedIdx = 2;

  const playBtn  = overlay.querySelector('#igvc-play');
  const backBtn  = overlay.querySelector('#igvc-back');
  const fwdBtn   = overlay.querySelector('#igvc-forward');
  const muteBtn  = overlay.querySelector('#igvc-mute');
  const speedBtn = overlay.querySelector('#igvc-speed');
  const fsBtn    = overlay.querySelector('#igvc-fullscreen');
  const fill     = overlay.querySelector('.igvc-progress-fill');
  const bar      = overlay.querySelector('.igvc-progress-bar');
  const timeDisp = overlay.querySelector('.igvc-time');

  const updatePlayIcon = () => {
    playBtn.querySelector('.igvc-icon').textContent = video.paused ? '▶' : '⏸';
  };
  const updateMuteIcon = () => {
    muteBtn.querySelector('.igvc-icon').textContent = video.muted ? '🔇' : '🔊';
  };

  let internalMuted = false;
  video.muted = false;

  const setInternalMute = (value) => {
    internalMuted = value;
    video.muted = value;
    updateMuteIcon();
  };

  const enforceInternalMute = () => {
    if (!internalMuted && video.muted) {
      video.muted = false;
      updateMuteIcon();
    }
  };

  const updateProgress = () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    fill.style.width = `${pct}%`;
    timeDisp.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  };

  video.addEventListener('loadedmetadata', updateProgress);
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('play', () => {
    updatePlayIcon();
    enforceInternalMute();
  });
  video.addEventListener('pause', updatePlayIcon);
  // Sincroniza o ícone se o Instagram mudar o muted externamente
  video.addEventListener('volumechange', () => {
    enforceInternalMute();
    updateMuteIcon();
  });
  video.addEventListener('pointerdown', (e) => {
    if (e.target === video && !internalMuted) {
      enforceInternalMute();
    }
  });
  updatePlayIcon();
  updateMuteIcon();

  // Cada botão usa pointerdown em vez de click — dispara antes que o Instagram
  // consiga reagir ao evento, e usamos preventDefault para cancelar o click
  // sintético que viria depois.
  const handle = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn(e);
  };

  playBtn.addEventListener('pointerdown', handle(() => {
    if (video.paused) {
      video.play();
      // Instagram pode forçar muted=true ao retomar — restaura o estado interno.
      setTimeout(() => {
        enforceInternalMute();
      }, 50);
    } else {
      video.pause();
    }
  }));

  backBtn.addEventListener('pointerdown', handle(() => {
    video.currentTime = Math.max(0, video.currentTime - SKIP_SECONDS);
    showSkipFeedback(overlay, `-${SKIP_SECONDS}s`);
  }));

  fwdBtn.addEventListener('pointerdown', handle(() => {
    video.currentTime = Math.min(video.duration || Infinity, video.currentTime + SKIP_SECONDS);
    showSkipFeedback(overlay, `+${SKIP_SECONDS}s`);
  }));

  muteBtn.addEventListener('pointerdown', handle(() => {
    setInternalMute(!internalMuted);
  }));

  speedBtn.addEventListener('pointerdown', handle(() => {
    speedIdx = (speedIdx + 1) % speeds.length;
    video.playbackRate = speeds[speedIdx];
    speedBtn.querySelector('.igvc-label').textContent = `${speeds[speedIdx]}×`;
  }));

  const updateFsIcon = () => {
    const isFs = !!document.fullscreenElement;
    fsBtn.querySelector('.igvc-icon').textContent = isFs ? '✕' : '⛶';
    fsBtn.title = isFs ? 'Sair da tela cheia' : 'Tela cheia';
  };

  fsBtn.addEventListener('pointerdown', handle(() => {
    if (!document.fullscreenElement) {
      const activeVideo = [...document.querySelectorAll('video')]
        .find(v => !v.paused && v.readyState >= 2) || video;
      activeVideo.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
    } else {
      document.exitFullscreen();
    }
  }));

  const onFullscreenChange = () => {
    updateFsIcon();
    const fsEl = document.fullscreenElement;
    if (fsEl) {
      // Corrige o corte causado pelo object-fit: cover do Instagram
      const fsVideo = fsEl.tagName === 'VIDEO' ? fsEl : fsEl.querySelector('video');
      if (fsVideo) {
        fsVideo.style.objectFit = 'contain';
      }

      document.body.appendChild(overlay);
      overlay.style.position = 'fixed';
      overlay.style.left   = '0';
      overlay.style.top    = '0';
      overlay.style.width  = '100vw';
      overlay.style.height = '100vh';
      overlay.classList.add('igvc-overlay--fullscreen');
      showOverlay(overlay);
      } else {
        if (video) {
          video.style.objectFit = '';
        }
      overlay.classList.remove('igvc-overlay--fullscreen');
      // Reposiciona em dois momentos — o vídeo pode demorar para se estabilizar
      setTimeout(() => positionOverlay(overlay, video), 150);
      setTimeout(() => positionOverlay(overlay, video), 500);
}
  };
  document.addEventListener('fullscreenchange', onFullscreenChange);

  // Barra de progresso
  let dragging = false;
  let activePointerId = null;

  const seekToX = (clientX) => {
    if (!video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    enforceInternalMute();
  };

  bar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  return () => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
  };
}

function showSkipFeedback(overlay, text) {
  let fb = overlay.querySelector('.igvc-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'igvc-feedback';
    overlay.appendChild(fb);
  }
  fb.textContent = text;
  fb.classList.remove('igvc-feedback--show');
  void fb.offsetWidth;
  fb.classList.add('igvc-feedback--show');
}

// ─── Anexa o overlay ao <body> posicionado sobre o vídeo ─────────────────────
function attachOverlay(video) {
  if (currentVideo === video && currentControls) return;

  // Remove listeners do vídeo anterior antes de criar novos
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  currentVideo = video;
  if (currentControls) currentControls.remove();

  const overlay = createControls();
  const cleanupBindings = bindControls(overlay, video);

  document.body.appendChild(overlay);
  currentControls = overlay;

  positionOverlay(overlay, video);

  const onScroll = () => positionOverlay(overlay, video);
  const onResize = () => positionOverlay(overlay, video);
  const onMouseMove = (e) => {
    const rect = video.getBoundingClientRect();
    const insideVideo =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;
    const insideOverlay = overlay.contains(e.target);

    if (insideVideo || insideOverlay) {
      showOverlay(overlay);
    } else {
      scheduleHide(overlay);
    }
  };

  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keydown', handleKeyDown);

  // Limpa todos os listeners quando trocar de vídeo
  currentCleanup = () => {
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('keydown', handleKeyDown);
    if (cleanupBindings) cleanupBindings();
  };
}

function showOverlay(overlay) {
  clearTimeout(hideTimeout);
  overlay.classList.add('igvc-overlay--visible');
}

function scheduleHide(overlay) {
  hideTimeout = setTimeout(() => {
    overlay.classList.remove('igvc-overlay--visible');
  }, 1500);
}

function isEditableElement(element) {
  while (element && element !== document.body && element !== document.documentElement) {
    const tag = element.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    const contentEditable = element.getAttribute?.('contenteditable');
    if (contentEditable === '' || contentEditable === 'true' || contentEditable === 'plaintext-only') return true;
    element = element.parentElement;
  }
  return false;
}

function handleKeyDown(e) {
  if (!currentVideo) return;
  if (isEditableElement(document.activeElement)) return;

  switch (e.key) {
    case 'ArrowLeft':
      currentVideo.currentTime = Math.max(0, currentVideo.currentTime - SKIP_SECONDS);
      e.preventDefault(); break;
    case 'ArrowRight':
      currentVideo.currentTime = Math.min(currentVideo.duration || Infinity, currentVideo.currentTime + SKIP_SECONDS);
      e.preventDefault(); break;
    case 'm': case 'M':
      currentVideo.muted = !currentVideo.muted; break;
    case 'f': case 'F':
      if (!document.fullscreenElement) {
        const activeVideo = [...document.querySelectorAll('video')]
          .find(v => !v.paused && v.readyState >= 2) || currentVideo;
        activeVideo.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else {
        document.exitFullscreen();
      }
      break;
  }
}

function observeVideos() {
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        attachOverlay(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const mutationObserver = new MutationObserver(() => {
    document.querySelectorAll('video').forEach(video => {
      if (!video.dataset.igvcBound) {
        video.dataset.igvcBound = '1';
        video.addEventListener('mouseenter', () => attachOverlay(video));
        intersectionObserver.observe(video);
      }
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('video').forEach(video => {
    if (!video.dataset.igvcBound) {
      video.dataset.igvcBound = '1';
      video.addEventListener('mouseenter', () => attachOverlay(video));
      intersectionObserver.observe(video);
    }
  });
}

observeVideos();
