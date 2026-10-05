import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { loadApp } from "../scripts/load-app.mjs";
import { plain } from "./helpers.mjs";

test("app boots and renders with no saved data", () => {
  const { app, getState, elements } = loadApp();
  const state = getState();
  assert.equal(state.appVersion, app.createDefaultState().appVersion);
  assert.ok(state.employees.length > 0);
  assert.ok(elements.get("dashboard").innerHTML.length > 0);
});

test("saved data from an older app version is migrated, not wiped", () => {
  const { app } = loadApp();
  const saved = app.createDefaultState();
  saved.appVersion = 3;
  saved.employees = saved.employees.slice(0, 1);
  saved.employees[0].name = "Old Staff";
  saved.schedule = { "req_monday_0__sreq_monday_0_0_0__0": saved.employees[0].id };
  const { getState, app: loaded } = loadApp({ localStorage: { skillshift_planner_v14: JSON.stringify(saved) } });
  assert.equal(getState().appVersion, app.createDefaultState().appVersion);
  assert.deepEqual(plain(getState().employees.map((e) => e.name)), ["Old Staff"]);
  assert.equal(Object.keys(getState().schedule).length, 1);
  assert.equal(JSON.parse(loaded.localStorage.getItem("skillshift_planner_v14")).appVersion, getState().appVersion);
});

test("data under an older storage key is carried over", () => {
  const { getState } = loadApp({
    localStorage: {
      skillshift_planner_v12: JSON.stringify({ appVersion: 2, employees: [{ id: "a", name: "Too old" }] }),
      skillshift_planner_v13: JSON.stringify({ appVersion: 3, employees: [{ id: "b", name: "Legacy" }] }),
    },
  });
  assert.deepEqual(plain(getState().employees.map((e) => e.name)), ["Legacy"]);
});

test("unreadable saved data is backed up before starting fresh", () => {
  const { app, getState } = loadApp({ localStorage: { skillshift_planner_v14: "{not json" } });
  assert.ok(getState().employees.length > 0);
  assert.equal(app.localStorage.getItem("skillshift_planner_v14_unreadable"), "{not json");
});

test("reset lives at the bottom of settings, not in the header", () => {
  const { app, elements } = loadApp();
  app.showView("settings");
  const html = elements.get("settings").innerHTML;
  assert.ok(html.includes('data-action="reset-all"'));
  assert.ok(html.lastIndexOf('data-action="reset-all"') > html.indexOf("feedback-block"));
  const indexHtml = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.ok(!indexHtml.includes("resetBtn"));
});

test("saved data from the current version is kept", () => {
  const { app } = loadApp();
  const saved = app.createDefaultState();
  saved.settings.laborBudget = 1234;
  saved.employees = saved.employees.slice(0, 2);
  const { getState } = loadApp({ localStorage: { skillshift_planner_v14: JSON.stringify(saved) } });
  assert.equal(getState().settings.laborBudget, 1234);
  assert.equal(getState().employees.length, 2);
});

test("export script writes the default state as JSON", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "skillshift-"));
  const out = path.join(dir, "state.json");
  execFileSync(process.execPath, ["scripts/export-default-state.mjs", out], { stdio: "pipe" });
  const state = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.ok(state.appVersion >= 1);
  assert.ok(Array.isArray(state.requirements) && state.requirements.length > 0);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("saved data with missing lists is repaired instead of crashing", () => {
  const { app } = loadApp();
  const saved = app.createDefaultState();
  saved.requirements[0].stationRequirements = undefined;
  saved.schedule = null;
  delete saved.stations;
  const { getState, elements } = loadApp({ localStorage: { skillshift_planner_v14: JSON.stringify(saved) } });
  assert.deepEqual(getState().requirements[0].stationRequirements.length, 0);
  assert.equal(typeof getState().schedule, "object");
  assert.ok(getState().stations.length > 0);
  assert.ok(elements.get("validation").innerHTML.length > 0);
});

test("the header shows autosave instead of save/JSON buttons; backup lives in settings", () => {
  const indexHtml = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.ok(!indexHtml.includes("saveBtn"));
  assert.ok(!indexHtml.includes("exportBtn"));
  assert.ok(indexHtml.includes('id="saveStatus"'));
  const { app, elements } = loadApp();
  app.showView("settings");
  const html = elements.get("settings").innerHTML;
  assert.ok(html.includes('data-action="export-json"'));
  assert.ok(html.includes('data-action="import-json"'));
  assert.match(html, /백업 파일 받기/);
  app.saveState();
  assert.match(elements.get("saveStatus").textContent, /자동 저장됨 · /);
});
