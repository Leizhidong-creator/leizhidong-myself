import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("Pet Agent award copy is updated everywhere in project content", () => {
  const content = readFileSync("src/content/projects/en/pet-agent.ts", "utf8");

  assert.match(content, /中国高校智能机器人创意大赛（国奖）/);
  assert.doesNotMatch(content, /太原理工大学 AI 黑客松一等奖/);
});
