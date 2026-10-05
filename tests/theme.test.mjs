import test from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "../scripts/load-app.mjs";

test("settings offers light, dark and auto appearance, defaulting to soft light", () => {
  const { app, elements } = loadApp();
  app.showView("settings");
  const html = elements.get("settings").innerHTML;
  assert.match(html, /data-setting="theme"/);
  assert.match(html, /value="light" selected/);
  assert.match(html, /value="dark"/);
});

test("choosing dark is stored on the device and marks the page; light clears it", () => {
  const { app, elements } = loadApp();
  const localStorage = app.localStorage;
  const root = app.document.documentElement;
  app.setTheme("dark");
  assert.equal(localStorage.getItem("skillshift_theme"), "dark");
  assert.equal(root.dataset.theme, "dark");
  app.showView("settings");
  assert.match(elements.get("settings").innerHTML, /value="dark" selected/);
  app.setTheme("light");
  assert.equal(localStorage.getItem("skillshift_theme"), null);
  assert.equal(root.dataset.theme, "light");
});

test("a saved theme survives resetting the roster data", () => {
  const { app } = loadApp({ localStorage: { skillshift_theme: "dark" } });
  const localStorage = app.localStorage;
  app.clearStoredState();
  assert.equal(localStorage.getItem("skillshift_theme"), "dark");
});
