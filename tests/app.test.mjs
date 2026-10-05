import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { loadApp } from "../scripts/load-app.mjs";

test("app boots and renders with no saved data", () => {
  const { app, getState, elements } = loadApp();
  const state = getState();
  assert.equal(state.appVersion, app.createDefaultState().appVersion);
  assert.ok(state.employees.length > 0);
  assert.ok(elements.get("dashboard").innerHTML.length > 0);
});

test("saved data from an older app version is replaced with defaults", () => {
  const { app, getState } = loadApp({
    localStorage: { skillshift_planner_v14: JSON.stringify({ appVersion: 1, employees: [] }) },
  });
  assert.equal(getState().appVersion, app.createDefaultState().appVersion);
  assert.ok(getState().employees.length > 0);
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
