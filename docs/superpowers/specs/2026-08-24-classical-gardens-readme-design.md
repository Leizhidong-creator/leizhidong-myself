# Classical Gardens of Suzhou README Design

## Purpose

Rewrite the repository README as a Chinese-first, visually directed case study for **Classical Gardens of Suzhou / 游园惊梦**. The README should make the experience understandable before asking readers to parse implementation details, while still documenting the optimization decisions that make the project technically credible.

## Audience

- Visitors evaluating a front-end visual experience on GitHub.
- Competition reviewers and collaborators who need a concise account of the product idea, role, result, and technical contribution.
- Developers who want to run the current repository and follow the open-source model reference.

## Content Contract

### Opening

- Chinese title: `游园惊梦｜Classical Gardens of Suzhou`.
- One-line positioning: an immersive digital garden experience that turns classical Suzhou garden culture into an explorable, interactive miniature world.
- A short English abstract directly below the Chinese introduction.
- High-signal links for live demo, repository, and Meta Research's official `facebookresearch/sam-3d-objects` repository.
- Award line: `抖音 AI 创变者黑客松山西赛区一等奖 · 游园会之星`.

### Experience narrative

Explain three product ideas in plain language:

1. Flower-window-led progressive storytelling rather than a conventional all-at-once virtual tour.
2. A miniature 3D garden with soft-water-town light, reflective surfaces, and a hand-held scale.
3. The `一窗一景` sandbox, where visitors move garden elements and become co-creators of a personal window scene.

### Technical case study

Document the pipeline as a compact flow:

`2D reference → Meta SAM 3D asset generation → material / scale / coordinate adaptation → Three.js + WebGL scene → DOM and 3D interaction layer`.

Describe the current repository stack truthfully as `Vue 3`, `TypeScript`, `Vite`, `Three.js`, `GSAP`, `Lenis`, `Howler`, and GLSL tooling. Framework-specific optimizations from the competition prototype (React `lazy` / `Suspense`, `useGLTF.preload`) must be labeled as prototype-era implementation decisions, not claimed as the current Vue implementation.

### Optimization section

Use a table with problem, decision, and effect:

- Initial blank screen: split the experience into scenes and load the light first scene before heavier 3D resources.
- Model request contention: use GLB prefetch and `useGLTF.preload` in the competition prototype; keep non-critical detail media out of the critical path.
- Models that only display: bind component tags to local model coordinates through `tags.json`, then combine camera controls with DOM labels.
- Rendering pressure: coordinate Three.js / React Three Fiber, GSAP transitions, and audio playback; target a smooth mid-range-device interaction rather than maximum polygon density.

Avoid presenting estimated performance figures as benchmark results unless the source document explicitly identifies them as estimates. The 48-hour delivery and award are factual project outcomes.

### Model source and attribution

Link to the official Meta Research repository and state that the project uses the model as an upstream research/open-source asset. Clarify that the project contribution is asset selection, model cleanup and adaptation, scene composition, coordinate mapping, loading strategy, and interaction design. Do not imply that the repository's model weights or license are owned by this project.

### Practical usage

- Include `npm install`, `npm run dev`, `npm run build`, and `npm run preview`.
- Mention the development port only if it matches the current Vite configuration.
- Add a compact current-repository tree, focused on `src/content/projects`, `src/assets/images/projects`, `src/assets/models`, and `src/three`.

### Visual language

- Use restrained Markdown badges, not a dense badge wall.
- Use existing garden preview assets in a two- or three-image gallery near the top.
- Keep headings short, use Chinese body copy, and reserve English for the abstract and selected technical labels.
- Use no invented metrics, external testimonials, or claims not supported by the repository or the portfolio document.

## Verification

Before completion, verify:

- All local image links resolve from GitHub's README context.
- The live demo URL and Meta SAM 3D URL are clickable.
- Commands match `package.json`.
- Award wording and role match `作品集文档.md`.
- The README does not describe the other portfolio projects.
- Markdown renders without malformed tables, broken HTML, or unclosed links.
