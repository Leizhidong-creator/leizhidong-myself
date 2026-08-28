import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const files = [
  "index.html",
  "vercel.json",
  "README.md",
  "license.md",
  "public/legal.html",
  "public/privacy.html",
  "public/de/legal.html",
  "public/de/privacy.html",
  "src/components/Footer.vue",
  "src/components/Header.vue",
  "src/components/Social.vue",
  "src/components/WeChatContactModal.vue",
  "src/components/icons/Wechat.vue",
  "src/content/contact.ts",
  "src/content/social.ts",
  "src/content/projects/index.ts",
  "src/content/projects/previews/en.ts",
  "src/content/projects/en/garden-dream.ts",
  "src/content/projects/en/zhiyan-agent.ts",
  "src/content/projects/en/pet-agent.ts",
  "src/i18n/messages/namespaces/common/en.json",
  "src/features/projects/components/ProjectHero.vue",
  "src/features/home/components/Hero.vue",
  "src/features/home/components/BoxDetails.vue",
  "src/features/home/components/BoxDescription.vue",
  "src/features/home/components/BoxServices.vue",
];

test("portfolio content is personalized for Lei Zhidong", () => {
  const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");

  assert.match(combined, /雷智栋/);
  assert.match(combined, /leizhidong985985/);
  assert.match(combined, /gaddaladurgarao661@gmail\.com/);
  assert.match(combined, /游园惊梦/);
  assert.match(combined, /智演 Agent/);
  assert.match(combined, /Pet Agent/);
  assert.match(combined, /AI 建模与微缩景观/);
  assert.match(combined, /Canvas 2\.5D 实时沙盘/);
  assert.match(combined, /AIGC 多场景 Web 工作台/);
  assert.match(combined, /联系我/);
  assert.match(combined, /leizhidong-creator\.github\.io\/Classical-Gardens-of-Suzhou\//);
  assert.doesNotMatch(combined, /hanko-n123-d4gdtdwz71e80944b-1436264436\.tcloudbaseapp\.com/);
  assert.match(combined, /访问项目/);
  assert.match(combined, /"source": "\/\(.\*\)"/);
  assert.match(combined, /"destination": "\/index\.html"/);
  assert.match(combined, /rzzhlong20061107/);
  assert.match(combined, /wechat-qr\.jpg/);
  assert.match(combined, /WeChatContactModal/);

  assert.doesNotMatch(combined, /David/i);
  assert.doesNotMatch(combined, /Heckhoff/i);
  assert.doesNotMatch(combined, /StreakOn/);
  assert.doesNotMatch(combined, /CubeWar/);
  assert.doesNotMatch(combined, /Quibbo/);
  assert.doesNotMatch(combined, /Sharkie/);
  assert.doesNotMatch(combined, /Pok[eé]dex/i);
});
