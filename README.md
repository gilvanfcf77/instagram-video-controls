# Instagram Video Controls

Extensão para Chrome/Edge que adiciona controles adicionais a vídeos do Instagram, incluindo:

- voltar/avançar em 5 segundos
- pausar/play
- botão de mudo
- alternar velocidade de reprodução
- fullscreen customizado
- barra de progresso e tempo de vídeo

## Instalação

1. Abra o navegador e acesse `chrome://extensions/` ou `edge://extensions/`.
2. Ative o Modo de desenvolvedor.
3. Clique em "Carregar sem compactação".
4. Selecione a pasta `instagram-video-controls`.

## Uso

- Os controles aparecem sobre o vídeo do Instagram.
- Fora do fullscreen, os botões são exibidos próximos à área da barra de progresso.
- O botão `⏶` alterna para fullscreen.
- O botão `🔊` ativa/desativa o som.
- As teclas `ArrowLeft` / `ArrowRight` fazem seek de 5s.
- O botão de velocidade alterna entre vários valores.

## Atalhos de teclado

- `ArrowLeft` — retrocede 5 segundos no vídeo.
- `ArrowRight` — avança 5 segundos no vídeo.
- `M` — ativa/desativa o som do vídeo.
- `F` — entra/sai do modo fullscreen.

## Arquivos

- `src/` - content scripts (lógica de injeção e controle de vídeos):
  - `constants.js`, `state.js`, `utils.js` - configurações, estado compartilhado e utilitários.
  - `videos.js` - quais vídeos recebem controles.
  - `audio.js` - um vídeo com som por vez e preferência de som do usuário.
  - `actions.js` - ações sobre o vídeo (seek, play/pause, tela cheia).
  - `overlay/` - criação, posicionamento, visibilidade e eventos do painel de controles.
  - `input/` - mouse e atalhos de teclado.
  - `main.js` - ponto de entrada.
- `styles.css` - estilos do overlay e UI.
- `manifest.json` - manifesto da extensão.
- `popup.html` - popup padrão da extensão.
- `icons/` - ícones da extensão.

## Notas

- A extensão foi projetada para funcionar no Instagram web.
- O comportamento de áudio e fullscreen pode variar de acordo com mudanças no site.
- A extensão ainda está em desenvolvimento e pode precisar de ajustes para compatibilidade futura.

## Possíveis melhorias

- **Usar um bundler (esbuild ou Vite).** Hoje os arquivos de `src/` são scripts comuns, sem `import`/`export`: compartilham o escopo global e dependem da ordem em que estão listados no `manifest.json` (Chrome não carrega content scripts como módulos ES). Um bundler permitiria módulos de verdade, com dependências explícitas e erros detectados no build. O custo é um passo de build e carregar a pasta `dist/` no navegador em vez da pasta do projeto.
