// Instagram Video Controls - constants.js
//
// Os arquivos de src/ são content scripts comuns (sem módulos), carregados na
// ordem do manifest.json e compartilhando o mesmo escopo global.

const SKIP_SECONDS = 5;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DEFAULT_SPEED_INDEX = 2; // 1×
const HIDE_DELAY_MS = 500;     // tempo até os controles sumirem após o mouse sair
const NATIVE_CLICK_WINDOW_MS = 500; // volumechange até este tempo após clique num botão do Instagram = ação do usuário
