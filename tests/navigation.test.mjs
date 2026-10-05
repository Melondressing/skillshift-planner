import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "../scripts/load-app.mjs";

const { app, elements } = loadApp();
const navButtons = () => [...elements.get("tabs").innerHTML.matchAll(/data-tab="(\w+)"/g)].map((m) => m[1]);

test("navigation has four numbered steps plus a settings gear", () => {
  app.render();
  assert.deepEqual(navButtons(), ["setup", "members", "roster", "summary", "settings"]);
  assert.ok(!elements.get("tabs").innerHTML.includes('data-tab="roadmap"'));
});

test("every panel belongs to exactly one view", () => {
  const views = ["setup", "members", "roster", "summary", "settings", "roadmap"].map((id) => app.findView(id));
  assert.deepEqual(views.map((v) => v.id), ["setup", "members", "roster", "summary", "settings", "roadmap"]);
  const panels = views.flatMap((view) => [...view.panels]);
  const expected = ["dashboard", "parts", "skills", "members", "requirements", "schedule", "labor", "validation", "settings", "roadmap"];
  assert.deepEqual(panels.sort(), expected.sort());
});

test("summary no longer repeats the labor metrics", () => {
  app.render();
  assert.ok(!elements.get("labor").innerHTML.includes('class="card metric'));
  assert.ok(elements.get("dashboard").innerHTML.includes('class="card metric'));
});

test("step labels are translated", () => {
  const state = app.__getState();
  state.settings.language = "en";
  app.render();
  assert.match(elements.get("tabs").innerHTML, /Store setup/);
  state.settings.language = "ko";
  app.render();
  assert.match(elements.get("tabs").innerHTML, /매장 설정/);
});

test("settings links to the roadmap", () => {
  app.render();
  assert.ok(elements.get("settings").innerHTML.includes('data-tab="roadmap"'));
});
