# Audio files (optional)

The game ships with a **built-in synthesized soundtrack and sound effects** (generated live with the Web Audio API — no files, nothing copyrighted).

If you record a real version of the anthem or want custom sounds:

1. Drop your files here, e.g. `birthday-anthem.mp3`, `hit.mp3`.
2. Open `js/audio.js` and fill in the paths at the top:

```js
const AUDIO_FILES = {
  song: "assets/audio/birthday-anthem.mp3",
  sfx: { hit: "assets/audio/hit.mp3", /* ...others stay null = synth */ },
};
```

Any entry left as `null` keeps using the built-in synth.
Use only sounds you made yourself or that are royalty-free (e.g. CC0).
