// Instagram Video Controls - overlay/create.js
// Monta o DOM do painel de controles.

function createControls() {
  const overlay = document.createElement('div');
  overlay.className = 'igvc-overlay';

  const buttons = [
    // Todos só com ícone para terem o mesmo tamanho; a velocidade usa o
    // próprio valor (1×, 1.5×...) como ícone.
    { id: 'igvc-back',       icon: '⏪', title: `Voltar ${SKIP_SECONDS}s` },
    { id: 'igvc-play',       icon: '⏸',  title: 'Play / Pause' },
    { id: 'igvc-forward',    icon: '⏩', title: `Avançar ${SKIP_SECONDS}s` },
    { id: 'igvc-mute',       icon: '🔊', title: 'Mudo / Som' },
    { id: 'igvc-speed',      icon: '1×', title: 'Velocidade' },
    { id: 'igvc-fullscreen', icon: '⛶',  title: 'Tela cheia' },
  ];

  // Botões agrupados num container próprio — soltos no overlay eles vazavam
  // para fora de vídeos pequenos.
  const buttonRow = document.createElement('div');
  buttonRow.className = 'igvc-buttons';

  buttons.forEach(({ id, icon, title }) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'igvc-btn';
    btn.title = title;
    btn.innerHTML = `<span class="igvc-icon">${icon}</span>`;
    buttonRow.appendChild(btn);
  });
  overlay.appendChild(buttonRow);

  // Botão de som + barra de volume que abre à esquerda dele no hover
  const muteBtn = buttonRow.querySelector('#igvc-mute');
  const volume = document.createElement('div');
  volume.className = 'igvc-volume';
  volume.innerHTML =
    '<div class="igvc-volume-slider"><div class="igvc-volume-pill">' +
      '<div class="igvc-volume-bar"><div class="igvc-volume-fill"></div></div>' +
    '</div></div>';
  muteBtn.replaceWith(volume);
  volume.appendChild(muteBtn);

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
