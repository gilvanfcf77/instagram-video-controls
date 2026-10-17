// Instagram Video Controls - state.js
// Estado mutável compartilhado entre os arquivos.

const state = {
  currentVideo: null,    // vídeo com os controles (segue o mouse)
  currentControls: null, // overlay do vídeo atual
  currentCleanup: null,  // função de limpeza do vídeo atual
  hideTimeout: null,
  // Preferência de som escolhida pelo usuário (botão ou tecla M).
  // null = ainda não escolheu → não interferimos no mute do Instagram.
  soundPref: null,
  // Vídeo "principal", dono do áudio. É diferente de currentVideo: passar o
  // mouse por outro vídeo não pode tirar o som do principal. Só muda quando um
  // vídeo entra em foco na tela (scroll, popup) ou quando o usuário usa os
  // controles/atalhos nele.
  audioVideo: null,
  // Último volume > 0, para restaurar ao ligar o som de um vídeo com volume 0.
  lastVolume: null,
};
