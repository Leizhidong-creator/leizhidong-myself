# Critical Home Loading Design

## Context

The production site currently keeps the logo preloader visible until every entry in `src/sources.ts` reports success. This preserves the complete 3D reveal, but the implementation has two weaknesses:

- A slow request delays the entire page because the slowest critical asset controls entry.
- The loaders have no failure or retry path, so a failed request can leave the preloader visible forever without making progress.

Production measurements on 2026-08-24 also showed that GitHub Pages delivery can be slow from the current network. The main JavaScript bundle took about 8 seconds, one room model took about 21 seconds, and the largest avatar model took about 86 seconds. This design therefore improves the application and asset pipeline while retaining GitHub Pages. It does not promise a fixed first-visit duration that the hosting network cannot guarantee.

## Goals

- Preserve the existing logo-first loading experience.
- Never reveal the home page until the complete 3D scene can render.
- Preload and decode the home-page sounds before entry.
- Preload the three project cover images before entry.
- Prevent project detail media and other noncritical assets from competing with critical assets.
- Retry failed critical requests indefinitely and resume automatically after connectivity returns.
- Make progress reflect real work and reach 100% only after a verified 3D frame.
- Improve repeat visits through immutable asset caching.

## Non-Goals

- Do not reveal a partial or progressively assembled 3D scene.
- Do not replace the logo preloader with an error screen or manual retry button.
- Do not migrate to a paid domestic server, object store, or CDN.
- Do not preload project detail images, videos, or media that are not visible on the home page.
- Do not set an absolute production load-time guarantee while the site remains on GitHub Pages.

## Critical Resource Contract

The application may leave the preloader only after all of the following conditions are true:

1. All four GLB models required by the home experience have downloaded and parsed.
2. Every texture used by those models and the home 3D scene has downloaded and decoded.
3. All sounds required on the home page have downloaded and decoded.
4. The three project cover images have downloaded and decoded.
5. Three.js objects have been created successfully.
6. Required shaders and render pipelines have compiled.
7. The application has rendered and validated the first nonblank 3D frame.

The critical contract must be represented explicitly in code. Entry must depend on a single `sceneReady` result rather than indirectly watching a resource counter.

## Deferred Resource Contract

The following resources must not start loading until the critical contract is satisfied:

- Project detail images beyond the three home-page covers.
- Project detail videos and other large media.
- Code used only inside project detail views.
- Any image or sound not needed by the initial home experience.

Deferred resources may begin after the preloader transition completes. Native lazy loading may be used for images, but components that eagerly import or mount large media should also be deferred so they do not create requests during the critical phase.

## Architecture

### Critical Manifest

Create one typed manifest describing critical models, textures, sounds, and cover images. Each entry contains a stable name, URL, resource type, and load/decode handler. The manifest is the source of truth for progress, retry behavior, and readiness.

The current `sources.ts` model and texture list becomes part of this manifest. Home sounds and the three cover images are added to it. Project detail assets remain outside it.

### Critical Loader

The critical loader owns these states:

- `idle`
- `downloading`
- `processing`
- `compiling`
- `validating-frame`
- `ready`

For every manifest entry it tracks attempt count, bytes when available, load state, and the decoded result. A successful result is stored once and is not downloaded again during the same session.

The loader exposes progress and a readiness promise/event. It does not manipulate DOM elements directly.

### Scene Gate

The scene gate coordinates the critical loader and Three.js initialization:

1. Wait for all critical downloads and decodes.
2. Construct the complete Three.js object graph.
3. Await renderer and shader compilation.
4. Render one frame.
5. Verify that the canvas contains nonblank pixels and no fatal initialization error occurred.
6. Mark `sceneReady` exactly once.

The preloader watches only `sceneReady`. It must not hide because a download percentage happens to equal 100%.

### Preloader View

The logo markup and minimum preloader styles remain in `index.html` so the loading screen can render before the Vue application and main stylesheet are ready. The Vue preloader controller updates the logo fill and performs the existing exit transition after `sceneReady`.

The preloader remains visible during disconnection and retry. It does not show an error screen or expose a manual retry action.

## Progress Model

Progress is monotonic and divided into real phases:

- 0-80%: critical resource download and decode.
- 80-95%: Three.js object creation and GPU/shader compilation.
- 95-100%: first-frame rendering and validation.

Download progress uses aggregate byte counts when response totals are available. When totals are unavailable, completed resource weights provide a deterministic fallback. Large resources receive weights based on build-time file size so a tiny texture does not advance progress as much as a large model.

The UI must never display 100% before frame validation succeeds.

## Retry And Connectivity Behavior

Every critical resource loader supplies an explicit failure callback. A failed request remains pending and retries automatically using this schedule:

- First retry after 1 second.
- Then 2 seconds.
- Then 4 seconds.
- Then 8 seconds.
- All later retries use a 10-second interval.

Retries continue indefinitely. Only the failed entries retry; successful resources remain cached in memory. When the browser reports that it is offline, retry timers pause. An `online` event immediately resumes pending requests.

Retry attempts must not reset visible progress. Duplicate callbacks from abandoned attempts must be ignored through per-attempt identity or cancellation.

## Performance Work

### Request Priority

- Start only critical manifest requests during the preloader phase.
- Prevent project detail components and media from mounting eagerly.
- Avoid eager audio or image requests outside the critical manifest.
- Limit critical request concurrency to four so models, textures, sounds, and covers make steady progress on weak connections.

### Asset Optimization

- Optimize GLB geometry with Meshopt after visual comparison against the originals. Do not add a separate Draco decoder payload.
- Remove unused mesh attributes, animation tracks, cameras, lights, and duplicate materials from exported models.
- Resize textures to the maximum resolution actually visible in the scene.
- Keep scene textures in WebP for this implementation and recompress them at the smallest visually acceptable size. Do not introduce KTX2/Basis decoder files in this scope.
- Encode home sounds as OGG using a bitrate that remains audibly equivalent for the site.
- Convert the three project covers to WebP at the dimensions and quality needed by the home cards.

Optimization must be accepted through visual and audio comparison, not file size alone.

### Code Splitting

- Keep boot, preloader, home UI, Three.js initialization, and critical asset code on the initial path.
- Move project detail components and their media imports into route-level or feature-level dynamic chunks.
- Avoid importing all project detail media from modules that execute during home startup.

### Caching

Hashed build assets should be served with immutable caching where the hosting platform permits it. The HTML document remains short-lived so new asset hashes can deploy safely. Runtime retry must reuse the same versioned URLs and must not add cache-busting query strings to successful immutable assets.

A service worker is optional and not required for the first implementation. Browser HTTP caching is the primary repeat-visit optimization to avoid introducing stale deployment behavior.

## Sound Behavior

Home sounds are part of the critical manifest and must finish downloading and decoding before entry. Browser autoplay restrictions still apply: preloading makes the buffers ready, but actual playback begins only after the existing user interaction enables sound.

## Cover Image Behavior

Exactly the three images displayed in the home Projects section are critical. The loader waits for `decode()` so the images can paint immediately after reveal. Images inside project detail views remain deferred.

## Error Handling

- Critical download or decode failure: keep the preloader visible and retry indefinitely.
- Offline browser: keep the preloader visible, pause timers, and resume on reconnect.
- Three.js construction or compilation failure: keep the preloader visible and restart the scene preparation step without redownloading successful resources, using the same capped retry schedule as downloads.
- Blank first frame: keep the preloader visible, retry rendering with the same capped schedule, and rebuild the renderer if the context was lost.
- WebGL unavailable: remain on the preloader because a complete 3D experience cannot be provided under the approved product requirement.

All failures should produce structured development logs. Production UI remains the existing logo loading state.

## Testing

### Unit Tests

- Critical and deferred manifests contain the intended assets and no duplicates.
- Progress is monotonic and cannot reach 100% before frame validation.
- Successful resources are not downloaded again when another resource retries.
- Retry delays follow 1, 2, 4, 8, and then 10 seconds indefinitely.
- Offline state pauses retries and the online event resumes them.
- Stale callbacks from earlier attempts cannot overwrite a later successful result.
- `sceneReady` emits once only after every gate condition succeeds.

### Integration Tests

- Delay each critical resource type independently and verify that the preloader remains visible.
- Fail a model, texture, sound, and cover request, then restore it and verify automatic recovery.
- Verify that no project detail image or video request starts during critical loading.
- Verify that the three covers are decoded when the page is revealed.
- Verify that sound is immediately available after the user enables it.
- Verify that renderer compilation and first-frame validation are complete before reveal.

### Visual And Performance Verification

- Compare optimized models and textures against the originals at desktop and mobile viewports.
- Compare audio output before and after compression.
- Check the first rendered canvas with a pixel test to ensure it is nonblank.
- Test cold cache, warm cache, throttled network, temporary offline, and reconnect scenarios.
- Record critical bytes, request count, and time-to-ready before and after optimization.
- Run the existing type check, build, and test suite.

## Acceptance Criteria

- The logo preloader appears with the existing visual treatment.
- The home page never appears with missing 3D objects, textures, sounds, or project covers.
- The preloader exits only after a validated complete 3D frame.
- Failed requests retry indefinitely without losing completed progress.
- Network recovery completes loading without a manual page refresh.
- Project detail media does not compete with critical resources during startup.
- Optimized assets pass visual and audio comparison.
- Critical payload size and competing startup requests are lower than the current production build.
- Repeat visits reuse cached versioned assets.
- Existing tests, type checking, and production build pass.

## Delivery Sequence

1. Introduce the critical manifest, loader state machine, retries, and unit tests.
2. Gate the preloader on decoded assets, renderer compilation, and first-frame validation.
3. Move home sounds and the three covers into the critical manifest.
4. Defer project detail code and media.
5. Optimize models, textures, sounds, and cover images with comparison checks.
6. Verify cold, warm, slow, offline, reconnect, desktop, and mobile scenarios.
