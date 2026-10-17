# Instagram Video Controls

Extensão para Chrome/Edge que adiciona controles adicionais a vídeos do Instagram, incluindo:

- voltar/avançar em 5 segundos
- pausar/play
- botão de som com barra de volume (0 a 100)
- alternar velocidade de reprodução
- fullscreen customizado
- barra de progresso e tempo de vídeo

## Instalação

1. Abra o navegador e acesse `chrome://extensions/` ou `edge://extensions/`.
2. Ative o Modo de desenvolvedor.
3. Clique em "Carregar sem compactação".
4. Selecione a pasta `instagram-video-controls`.

## Uso

- Os controles aparecem sobre o vídeo do Instagram quando o mouse está sobre ele, numa coluna à direita, com a barra de progresso embaixo.
- O botão `⛶` alterna para fullscreen. Em fullscreen, clicar na tela pausa/retoma o vídeo.
- O botão `🔊` ativa/desativa o som. Com o mouse sobre ele, abre uma barra de volume à esquerda; arrastar até 0 deixa o vídeo mudo.
- O botão de velocidade alterna entre 0.5×, 0.75×, 1×, 1.25×, 1.5× e 2×.
- Os controles somem quando uma janela do Instagram (denúncia, compartilhar, menu `...`) abre por cima do vídeo.

### Som

- Só um vídeo toca com som por vez: o que está tocando e mais visível na tela.
- O botão de som, a barra de volume, a tecla `M` e o botão de som nativo do Instagram definem a preferência de som, que passa a valer para os próximos vídeos.
- Enquanto nenhuma preferência foi escolhida, a extensão não interfere no mute do Instagram.

## Atalhos de teclado

- `ArrowLeft` — retrocede 5 segundos no vídeo.
- `ArrowRight` — avança 5 segundos no vídeo.
- `M` — ativa/desativa o som do vídeo.
- `F` — entra/sai do modo fullscreen.

Os atalhos não funcionam enquanto você digita (comentários, busca) ou com uma janela do Instagram aberta por cima do vídeo.

## Arquivos

- `src/` - content scripts (lógica de injeção e controle de vídeos):
  - `constants.js`, `state.js`, `utils.js` - configurações, estado compartilhado e utilitários.
  - `videos.js` - quais vídeos recebem controles.
  - `audio.js` - um vídeo com som por vez e preferência de som do usuário.
  - `actions.js` - ações sobre o vídeo (seek, play/pause, tela cheia).
  - `overlay/` - criação, posicionamento, visibilidade e eventos do painel de controles (incluindo barra de progresso, volume e fullscreen).
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
