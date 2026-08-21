import zhiyan0 from "../../../assets/images/projects/zhiyan-agent/zhiyan-agent-0.png";
import zhiyan1 from "../../../assets/images/projects/zhiyan-agent/zhiyan-agent-1.png";
import zhiyan2 from "../../../assets/images/projects/zhiyan-agent/zhiyan-agent-2.png";
import zhiyan3 from "../../../assets/images/projects/zhiyan-agent/zhiyan-agent-3.png";

import type { ProjectContent } from "../../types";

export default {
  title: "智演 Agent",
  theme: "dark",
  tags: ["javascript", "canvas", "fastapi", "rag", "ai"],
  description:
    "面向城市高密度人群风险治理的 AI 数字孪生推演工作区，将参数配置、实时沙盘、Agent 认知日志、RAG 诊断和干预复演整合为单页产品。<br/><br/>我担任项目负责人、前端交互与可视化负责人、AI Agent 推演系统负责人。<br/><br/>成果：中国机器人及人工智能大赛国奖。",
  components: [
    {
      type: "media",
      props: { type: "image", src: zhiyan0, alt: "智演 Agent 工作区", caption: "AI simulation workspace" },
    },
    {
      type: "text",
      props: {
        title: "AI 数字孪生工作区",
        text: "项目面向大型活动、交通枢纽等高密度人群场景，设计并实现一套浏览器端 AI 数字孪生推演工作区，将参数配置、实时沙盘、Agent 认知日志、RAG 诊断报告和干预方案复演整合为单页交互产品。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: zhiyan1, alt: "实时推演沙盘", caption: "Realtime 2.5D simulation map" },
    },
    {
      type: "text",
      props: {
        title: "核心前端与复杂状态",
        text: "我负责核心前端工作区搭建，使用原生 JavaScript 管理全局运行状态、接口请求、动画帧播放、报告历史，以及 Agent 选中、悬浮、锁定等复杂交互；并通过模块化函数拆分数据加载、仿真播放、指标更新、日志渲染和报告弹窗逻辑。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: zhiyan2, alt: "Agent 认知日志", caption: "Agent cognition stream" },
    },
    {
      type: "text",
      props: {
        title: "Canvas 2.5D 实时沙盘",
        text: "我自研 Canvas 2.5D 可视化沙盘，基于等距投影将二维人群轨迹映射为具有空间纵深的街区场景，绘制建筑体块、热力网格、风险区域、干预护栏、Agent 光点、选中描边和涟漪反馈，实现接近三维工作区的浏览器内实时渲染体验。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: zhiyan3, alt: "RAG 诊断报告", caption: "RAG diagnosis and replay" },
    },
    {
      type: "text",
      props: {
        title: "AI 推演到可操作界面",
        text: "我将后端多 Agent 推演、慢脑 LLM 认知日志和 RAG 诊断结果转化为前端可理解、可点击、可复演的工作流；用户可以从报告推荐方案一键进入二次仿真，对比干预前后峰值密度、危险步数和慢脑触发次数。",
      },
    },
    {
      type: "list",
      props: {
        title: "产品化表达",
        size: "lg",
        items: [
          "采用深色玻璃拟态与 Bento Dashboard 信息架构，设计视频背景、沉浸式全屏推演、右侧认知流、横向报告历史和响应式布局。",
          "技术栈：JavaScript、HTML、CSS、Canvas 2D/2.5D 等距渲染、FastAPI、Pydantic、NumPy、LangChain、ChromaDB、LLM、RAG。",
          "成果：中国机器人及人工智能大赛国奖。",
        ],
      },
    },
  ],
} as const satisfies ProjectContent;
