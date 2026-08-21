import thumbnailGardenDream from "../../../assets/thumbnails/garden-dream.jpg";
import thumbnailZhiyanAgent from "../../../assets/thumbnails/zhiyan-agent.jpg";
import thumbnailPetAgent from "../../../assets/thumbnails/pet-agent.jpg";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "《游园惊梦》",
    slug: "garden-dream",
    thumbnail: thumbnailGardenDream,
    description: "沉浸式 AI 数字园林体验",
  },
  {
    title: "智演 Agent",
    slug: "zhiyan-agent",
    thumbnail: thumbnailZhiyanAgent,
    description: "AI 数字孪生推演工作区",
  },
  {
    title: "Pet Agent",
    slug: "pet-agent",
    thumbnail: thumbnailPetAgent,
    description: "多场景智能宠物管家",
  },
] as const satisfies ProjectPreview[];
