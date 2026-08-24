<div align="center">

# Lei Zhidong / 雷智栋

<a href="https://leizhidong.cn">
  <img src="https://readme-typing-svg.demolab.com?font=Space+Mono&weight=700&size=22&duration=2800&pause=900&color=FF8A00&center=true&vCenter=true&width=720&lines=Front-end+%2F+AI+Developer;Vue+%2B+Three.js+%2B+Playful+Motion;Turning+ideas+into+interactive+worlds" alt="动态打字标题：前端与 AI 开发、Vue 与 Three.js 创意交互" />
</a>

[![Live Site](https://img.shields.io/badge/Live_Site-leizhidong.cn-ff8a00?style=for-the-badge&logo=googlechrome&logoColor=white)](https://leizhidong.cn)
[![Vue 3](https://img.shields.io/badge/Vue_3-35495e?style=for-the-badge&logo=vuedotjs&logoColor=4fc08d)](https://vuejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-111111?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

一个会动、会响、偶尔还会打瞌睡的 3D 个人作品集。

</div>

<p align="center">
  <a href="docs/readme/portfolio-demo.mp4">
    <img src="docs/readme/portfolio-demo-cover.webp" alt="雷智栋 3D 个人作品集展示视频封面" width="100%" />
  </a>
</p>

<p align="center"><sub>GitHub README 不稳定支持内嵌 MP4 播放器，点击封面即可观看 10 秒展示视频。</sub></p>

## 🎬 这是什么

这是雷智栋的个人 3D 作品集网站，用来展示前端开发、AI 应用和交互视觉方向的项目。

如果普通作品集是一张简历，这里更像一间可以滚动参观的数字工作室：角色在电脑前忙活，场景会跟随滚动切换，按钮有声音，项目也不是老老实实排成一张表。当然，下面还是准备了一张表，毕竟代码可以幽默，文档最好别让人猜。

**在线体验：** [https://leizhidong.cn](https://leizhidong.cn)

## 🎯 体验亮点

| 能力 | 实现 | 体验 |
| --- | --- | --- |
| 3D 场景 | Three.js、GLB、GLSL | 在房间、实验室和联系场景之间连续穿梭 |
| 滚动叙事 | GSAP、Lenis | 页面滚动同步驱动镜头、DOM 和场景转场 |
| 声音反馈 | Howler、Audio Sprite | 环境音、悬浮音与点击音可独立开关 |
| 混合渲染 | Vue 3、TypeScript、WebGL | 3D 空间负责氛围，DOM 负责清晰的信息表达 |
| 内容加载 | 关键资源预载、非首屏资源延迟加载 | 先进入作品集，再按需加载更重的项目媒体 |
| 项目叙事 | 数据驱动内容、深路由 | 每个作品拥有独立页面、图文结构和下一项目导航 |

## 📚 精选作品

<p align="center">
  <a href="https://leizhidong.cn/#projects">
    <img src="docs/readme/portfolio-projects.png" alt="作品集网站中的精选项目列表" width="100%" />
  </a>
</p>

| 项目 | 简介 | 我的工作与成果 |
| --- | --- | --- |
| [《游园惊梦》](https://leizhidong.cn/#projects) | 用 AI 建模、Three.js 与 WebGL 重构苏州园林的沉浸式数字体验 | 队长与技术核心开发者；负责 3D/DOM 混合渲染、互动沙盘和页面动效；抖音 AI 创变者黑客松山西赛区一等奖 |
| [智演 Agent](https://leizhidong.cn/#projects) | 面向高密度人群风险治理的 AI 数字孪生推演工作区 | 项目负责人；负责前端交互、Canvas 2.5D 沙盘与 Agent 推演系统；中国机器人及人工智能大赛国奖 |
| [Pet Agent](https://leizhidong.cn/#projects) | 覆盖诊疗、宠粮识别、出行和训练的智能宠物管家 | AI Web 应用前端与核心开发者；整合 Qwen、RAG、图像识别和地图能力；中国高校智能机器人创意大赛国奖 |

## ⚙️ 技术栈

<div align="center">
  <img src="https://skillicons.dev/icons?i=vue,ts,vite,threejs,sass&theme=light" alt="Vue、TypeScript、Vite、Three.js 与 Sass 技术图标" />
</div>

```mermaid
flowchart LR
    accTitle: Portfolio rendering architecture
    accDescr: Vue content, Three.js scenes, GSAP motion, Lenis scrolling, and Howler audio combine into one browser experience.

    input["滚动 / 点击 / 指针"] --> vue["Vue 3 + TypeScript"]
    vue --> dom["DOM 内容层"]
    vue --> three["Three.js 场景层"]
    three --> webgl["WebGL + GLSL"]
    vue --> motion["GSAP + Lenis"]
    vue --> audio["Howler 音频层"]
    dom --> experience["交互式作品集"]
    webgl --> experience
    motion --> experience
    audio --> experience

    classDef input fill:#fff4df,stroke:#ff8a00,color:#2b2723
    classDef core fill:#e8f5ee,stroke:#42b883,color:#18382b
    classDef output fill:#e8eef9,stroke:#314b7b,color:#192743
    class input input
    class vue,three core
    class experience output
```

主要依赖：

- **Vue 3 + TypeScript + Vite**：组件、类型系统与构建链路。
- **Three.js + GLSL**：实时 3D、材质、Render Target 和自定义 Shader。
- **GSAP + Lenis**：时间线动画、滚动编排与场景过渡。
- **Howler**：环境音乐、交互音效和 Audio Sprite。
- **Sass**：响应式布局、视觉变量与组件样式。

## 🔧 本地运行

```bash
git clone https://github.com/Leizhidong-creator/leizhidong-myself.git
cd leizhidong-myself
npm install
npm run dev
```

开发服务器默认运行在 [http://localhost:3000](http://localhost:3000)。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run typecheck` | 执行 Vue / TypeScript 类型检查 |
| `npm test` | 运行资源、加载与部署契约测试 |
| `npm run build` | 类型检查并生成生产构建 |
| `npm run preview` | 本地预览生产构建 |
| `npm run verify` | 依次执行类型检查、测试与生产构建 |

## 📦 目录速览

```text
src/
├─ animations/          # 镜头、路点和场景转场
├─ assets/              # 模型、纹理、声音、视频与作品图片
├─ components/          # 全站通用交互组件
├─ content/projects/    # 项目数据与详情内容
├─ features/            # 首页、项目页与声音模块
├─ i18n/                # 多语言加载与消息
└─ three/               # 场景、相机、渲染器、对象与 Shader

tests/                  # 关键资源、预加载和 GitHub Pages 测试
public/                 # 字体、Meta 图片与静态页面
docs/readme/            # README 展示视频与截图
```

## 🌐 构建与部署

项目推送到 `main` 分支后，由 GitHub Actions 构建 `dist` 并部署到 GitHub Pages。构建流程同时生成 SPA 回退页，项目详情深路由可以直接访问。

```bash
npm run verify
```

提交前运行这条命令，可以一次检查类型、测试和生产构建。

## 🔗 动效来源

README 的动态标题由 [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) 生成，技术图标来自 [Skill Icons](https://github.com/tandpfun/skill-icons)。顶部作品演示视频由本仓库本地托管，不依赖来源不明的动漫素材。

## 📋 License

Copyright (c) 2026 雷智栋。项目代码、个人作品内容、模型、字体、音频和其他素材的使用范围见 [license.md](license.md) 及各自的原始许可说明。

<div align="center">

**认真做交互，顺便让页面有一点自己的脾气。**

[进入 3D 作品集](https://leizhidong.cn) · [查看源码](https://github.com/Leizhidong-creator/leizhidong-myself)

</div>
