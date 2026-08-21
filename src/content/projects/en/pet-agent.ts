import pet0 from "../../../assets/images/projects/pet-agent/pet-agent-0.png";
import pet1 from "../../../assets/images/projects/pet-agent/pet-agent-1.png";
import pet2 from "../../../assets/images/projects/pet-agent/pet-agent-2.png";
import pet3 from "../../../assets/images/projects/pet-agent/pet-agent-3.png";
import pet4 from "../../../assets/images/projects/pet-agent/pet-agent-4.png";
import pet5 from "../../../assets/images/projects/pet-agent/pet-agent-5.png";

import type { ProjectContent } from "../../types";

export default {
  title: "Pet Agent",
  theme: "dark",
  tags: ["javascript", "fastapi", "qwen", "rag", "ai"],
  description:
    "智能宠物管家 Web 应用，围绕宠物档案、AI 诊疗、宠粮识别、带宠出行、行为训练和 QA 问答构建多场景 AIGC 工作台。<br/><br/>我负责 AI Web 应用前端开发与核心流程实现，把 Qwen、图像识别、RAG 和高德地图能力封装为可操作的页面流程。<br/><br/>成果：中国高校智能机器人创意大赛（国奖）。",
  components: [
    {
      type: "media",
      props: { type: "image", src: pet0, alt: "Pet Agent 首页", caption: "Pet Agent dashboard" },
    },
    {
      type: "text",
      props: {
        title: "AIGC 多场景 Web 工作台",
        text: "项目围绕宠物档案、AI 诊疗、宠粮识别、带宠出行、行为训练、QA 问答 6 个核心场景，设计并实现从用户输入、图片/报告上传、AI 生成、结果展示到二次追问的端到端交互流程，与“文本/图片输入 - AI 生成 - 浏览器内编辑/确认”的 AI 产品链路高度同构。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: pet1, alt: "宠物档案", caption: "Pet profile workflow" },
    },
    {
      type: "text",
      props: {
        title: "AI 能力的前端产品化",
        text: "我将 Qwen 大模型、图像识别与 RAG 检索能力封装为可操作的页面流程，完成多步骤宠物档案表单、上传区、加载态、异常项识别结果、周计划卡片、训练打卡和聊天窗口等界面状态，降低用户理解 AI 输出和继续操作的成本。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: pet2, alt: "AI 诊疗", caption: "AI diagnosis panel" },
    },
    {
      type: "text",
      props: {
        title: "诊疗与报告理解",
        text: "在 AI 诊疗场景中，页面承接宠物档案、症状输入、图片/报告上传和模型分析结果展示，并通过结构化卡片、风险提示和后续建议，把复杂 AI 输出变成用户可以继续追问和采取行动的界面。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: pet3, alt: "宠粮识别", caption: "Food recognition result" },
    },
    {
      type: "text",
      props: {
        title: "识别结果与服务型交互",
        text: "在宠粮识别和健康建议流程中，我重点处理上传、识别、加载、异常项提示和结果复核等状态，让图像识别能力从“模型输出”转化为更清晰的消费决策辅助体验。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: pet4, alt: "带宠出行", caption: "Map-powered travel assistant" },
    },
    {
      type: "text",
      props: {
        title: "地图 API 与出行助手",
        text: "在诊疗和出行模块接入高德地图能力，支持附近宠物医院、宠物友好酒店、餐厅和景点检索与地图展示，并结合宠物档案生成出行提醒、材料清单和路线建议，体现前端对外部 API、异步数据和业务状态联动的处理能力。",
      },
    },
    {
      type: "media",
      props: { type: "image", src: pet5, alt: "训练与问答", caption: "Training and QA flow" },
    },
    {
      type: "text",
      props: {
        title: "可复用 UI 与状态组织",
        text: "我围绕顶部导航、场景卡片、标签选择、多步骤表单、文件上传、AI 结果面板、聊天消息流等高频模块沉淀复用结构；并按“宠物档案 + 场景结果 + 会话上下文”组织跨页面数据，为迁移到 Vue 3 Composition API / Pinia / Nuxt SSR 类项目保留良好适配空间。",
      },
    },
    {
      type: "list",
      props: {
        title: "技术栈与成果",
        size: "lg",
        items: [
          "技术栈：Web 前端交互、TypeScript/JavaScript、FastAPI、Qwen、RAG、图像识别、高德地图 API。",
          "身份：AI Web 应用前端开发 / 核心开发者。",
          "成果：中国高校智能机器人创意大赛（国奖）。",
        ],
      },
    },
  ],
} as const satisfies ProjectContent;
