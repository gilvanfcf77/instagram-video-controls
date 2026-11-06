# Instagram Video Controls

Chrome/Edge extension that adds extra controls to Instagram videos, including:

- seek back/forward by 5 seconds
- pause/play
- sound button with a volume bar (0 to 100)
- playback speed toggle
- custom fullscreen
- progress bar and video time

## Installation

1. Open your browser and go to `chrome://extensions/` or `edge://extensions/`.
2. Turn on Developer mode.
3. Click "Load unpacked".
4. Select the `instagram-video-controls` folder.

## Usage

- The controls appear over the Instagram video when the mouse is over it, in a column on the right, with the progress bar at the bottom.
- The `⛶` button toggles fullscreen. In fullscreen, clicking the screen pauses/resumes the video.
- The `🔊` button turns the sound on/off. With the mouse over it, a volume bar opens to its left; dragging it to 0 mutes the video.
- The speed button cycles through 0.5×, 0.75×, 1×, 1.25×, 1.5× and 2×.
- The controls disappear when an Instagram dialog (report, share, `...` menu) opens over the video.

### Sound

- Only one video plays with sound at a time: the one that is playing and most visible on screen.
- The sound button, the volume bar, the `M` key and Instagram's native sound button set the sound preference, which then applies to the following videos.
- Until a preference has been chosen, the extension does not interfere with Instagram's mute.

## Keyboard shortcuts

- `ArrowLeft` — seeks back 5 seconds in the video.
- `ArrowRight` — seeks forward 5 seconds in the video.
- `M` — turns the video's sound on/off.
- `F` — enters/exits fullscreen mode.

The shortcuts do not work while you are typing (comments, search) or when an Instagram dialog is open over the video.

## Files

- `src/` - content scripts (video injection and control logic):
  - `constants.js`, `state.js`, `utils.js` - settings, shared state and utilities.
  - `videos.js` - which videos get controls.
  - `audio.js` - one video with sound at a time and the user's sound preference.
  - `actions.js` - actions on the video (seek, play/pause, fullscreen).
  - `overlay/` - creation, positioning, visibility and events of the control panel (including the progress bar, volume and fullscreen).
  - `input/` - mouse and keyboard shortcuts.
  - `main.js` - entry point.
- `styles.css` - overlay and UI styles.
- `manifest.json` - extension manifest.
- `popup.html` - the extension's default popup.
- `icons/` - extension icons.

## Notes

- The extension was designed to work on Instagram web.
- Audio and fullscreen behavior may vary as the site changes.
- The extension is still in development and may need adjustments for future compatibility.

## Possible improvements

- **Use a bundler (esbuild or Vite).** Today the files in `src/` are plain scripts, with no `import`/`export`: they share the global scope and depend on the order in which they are listed in `manifest.json` (Chrome does not load content scripts as ES modules). A bundler would allow real modules, with explicit dependencies and errors caught at build time. The cost is a build step and loading the `dist/` folder in the browser instead of the project folder.
