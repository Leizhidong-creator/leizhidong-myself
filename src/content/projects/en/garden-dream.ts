import garden0 from "../../../assets/images/projects/garden-dream/garden-dream-0.webp";
import garden1 from "../../../assets/images/projects/garden-dream/garden-dream-1.webp";
import garden2 from "../../../assets/images/projects/garden-dream/garden-dream-2.webp";
import garden3 from "../../../assets/images/projects/garden-dream/garden-dream-3.webp";
import garden4 from "../../../assets/images/projects/garden-dream/garden-dream-4.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "《游园惊梦》",
  theme: "dark",
  tags: ["vue", "three", "javascript", "gsap", "tailwind"],
  live: "https://leizhidong-creator.github.io/Classical-Gardens-of-Suzhou/",
  description:
    "一站式沉浸数字园林体验，在 48 小时黑客松中用 AI 建模、Three.js 与 WebGL 重构苏州园林的微缩景观。<br/><br/>我担任队长与技术核心开发者，负责 3D 空间和 2D DOM 的混合渲染、互动沙盘、光影表现和页面动效。<br/><br/>成果：抖音 AI 创变者黑客松联赛山西赛区一等奖。",
  components: [
    {
      type: "media",
      props: { type: "image", src: garden0, alt: "数字园林首页", caption: "Immersive garden entry" },
    },
    {
      type: "text",
      props: {
        title: "AI 建模与微缩景观",
        text: "项目在 48 小时内完成极限开发，创新引入 Meta SAM 3D 建模技术重构苏州园林景观；基于 Three.js 与 WebGL 攻克 3D 空间和 2D DOM 的无缝混合渲染，以及复杂光影失真的表现难题，复刻水乡古建的柔光镜像与“掌中微缩”把玩体验。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: garden1, alt: "花窗叙事交互", caption: "Window-based narrative flow" },
    },
    {
      type: "text",
      props: {
        title: "花窗叙事与东方美学",
        text: "针对传统线上文旅“形式枯燥”的痛点，项目打破全局漫游的传统套路，以江南“花窗”为核心设计递进式交互，为年轻用户与国风爱好者提供共享诗意与情绪疗愈的数字东方美学体验。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: garden2, alt: "园林微缩场景", caption: "Miniature 3D landscape" },
    },
    {
      type: "text",
      props: {
        title: "从观者到造园者",
        text: "项目突破常规数字展陈边界，落地“一窗一景”自由沙盘模块。用户可以拖拽重组亭台、假山与园林元素，生成带有个人审美色彩的专属数字窗景，让浏览从观看走向参与和创造。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: garden3, alt: "自由造景沙盘", caption: "UGC garden sandbox" },
    },
    {
      type: "text",
      props: {
        title: "我的职责",
        text: "我担任队长与技术核心开发者，统筹 48 小时内的产品方案、前端实现和交互落地，重点负责 3D 场景搭建、2D/3D 混合渲染、交互沙盘、光影表现和页面动效串联。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: garden4, alt: "项目成果展示", caption: "Final experience view" },
    },
    {
      type: "list",
      props: {
        title: "技术栈与成果",
        size: "lg",
        items: [
          "Vue、HTML5 Canvas、JavaScript、Three.js、React、SAM 3D、GSAP、Tailwind CSS、Vite",
          "成果：抖音 AI 创变者黑客松联赛山西赛区一等奖",
        ],
      },
    },
  ],
} as const satisfies ProjectContent;
