# Classical Gardens of Suzhou README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将仓库 README 改写为中文主导、具有前端美学叙事和可核验技术细节的《游园惊梦》项目说明。

**Architecture:** 只修改根目录 `README.md`，用 GitHub 原生 Markdown 组织首屏、作品叙事、技术链路、优化表格、模型致谢和运行说明；复用仓库内已提交的园林预览图，不引入新的运行时依赖。

**Tech Stack:** Markdown、Vue 3、TypeScript、Vite、Three.js、GSAP、Lenis、Howler、GLSL。

## Global Constraints

- 正文以中文为主，英文只用于摘要、模型名、技术栈和必要术语。
- README 只介绍 `Classical Gardens of Suzhou / 游园惊梦`，不介绍其他作品。
- 奖项写作必须包含“抖音 AI 创变者黑客松山西赛区一等奖 · 游园会之星”。
- 当前仓库技术栈按 Vue 3 事实书写；React `lazy` / `Suspense` 与 `useGLTF.preload` 只能标注为竞赛版本优化思路。
- 不写未经来源文档明确证明的性能基准；作品集文档标记为估算的数字必须保留估算属性或省略。

### Task 1: Write the README case study

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: `src/content/projects/en/garden-dream.ts`, `作品展示一/作品一文字.md`, `E:/A竞赛和项目/作品集文档.md`, `package.json`, and existing garden preview assets.
- Produces: a GitHub-renderable README with clickable live-demo and model-source links, local image gallery, Chinese-first copy, English abstract, technical pipeline, optimization table, and run commands.

- [ ] **Step 1: Confirm image paths and dimensions**

Run:

```powershell
Get-ChildItem src/assets/images/projects/garden-dream -File | Select-Object Name,Length
```

Use the existing `garden-dream-0.webp`, `garden-dream-1.webp`, and `garden-dream-2.webp` paths in the README. Do not add or rename assets.

- [ ] **Step 2: Replace the generic README content**

Write these sections in order:

1. Title, badges, award line, demo/model links, and a three-image gallery.
2. 中文项目简介 and a short English abstract.
3. “为什么做” and “核心体验” sections covering flower-window storytelling, miniature 3D garden, and `一窗一景` sandbox.
4. “技术实现” with the `2D reference → Meta SAM 3D → adaptation → Three.js/WebGL → DOM + 3D` chain and current Vue repository stack.
5. “我是如何优化这条链路的” table covering staged loading, GLB prefetch, coordinate tags, mixed rendering, animation, and audio coordination. Mark React-era techniques as competition prototype decisions.
6. “Meta SAM 3D 模型来源” with the official link `https://github.com/facebookresearch/sam-3d-objects`, attribution boundary, and project-side adaptations.
7. “本地运行”, “目录速览”, “项目身份与荣誉”, and license note.

- [ ] **Step 3: Verify content and Markdown**

Run:

```powershell
rg -n "智演|Pet Agent|游园惊梦|sam-3d-objects|npm run" README.md
npm run build
```

Expected: no other project names or placeholders appear; the award, model URL, live demo, and commands appear; the production build passes.

- [ ] **Step 4: Commit the README**

```bash
git add README.md
git commit -m "docs: present classical gardens project"
```
