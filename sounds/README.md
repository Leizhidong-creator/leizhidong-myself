# Sound Sprites

Use this folder to generate Howler-compatible sound sprites from individual sound
files.

## Generate a Sprite

From inside a sprite source folder, for example `sounds/room` or
`sounds/contact`, run:

```sh
npx audiosprite *.mp3 -o output/sprite --gap 0.2
```

This writes the combined audio files and `output/sprite.json`.

## Add or Update Sounds

1. Put the source `.mp3` files in the relevant sprite folder.
2. Name each file after the sprite id you want to use in Howler, for example
   `mouse-wheel-0.mp3` becomes `mouse-wheel-0`.
3. Run the generation command from that folder.
4. Copy the generated sprite audio file you want to ship into
   `src/assets/sounds/sprites/`.
5. Update `src/features/sounds/definitions/sprites.ts` with the timings from
   `output/sprite.json`.
6. Add or update the public sound keys in
   `src/features/sounds/definitions/sounds.ts`.

## Timing Format

`audiosprite` writes timings in seconds:

```json
"keyboard": { "start": 1.2, "end": 4.056666666666667, "loop": false }
```

Howler expects milliseconds and a duration:

```ts
keyboard: [1200, 2856.666666666667, false]
```

Use:

- `start * 1000` for the first value.
- `(end - start) * 1000` for the second value.
- The generated `loop` value for the third value.

## Notes

- Keep `--gap 0.2` so adjacent sprite sounds do not bleed into each other.
- Regenerate the sprite whenever a source file is added, removed, renamed, or
  edited.
