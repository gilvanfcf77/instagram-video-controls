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

## Arquivos

- `content.js` - lógica principal de injeção e controle de vídeos.
- `styles.css` - estilos do overlay e UI.
- `manifest.json` - manifesto da extensão.
- `popup.html` - popup padrão da extensão.
- `icons/` - ícones da extensão.

## Notas

- A extensão foi projetada para funcionar no Instagram web.
- O comportamento de áudio e fullscreen pode variar de acordo com mudanças no site.
- A extensão ainda está em desenvolvimento e pode precisar de ajustes para compatibilidade futura.
