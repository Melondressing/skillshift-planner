import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "../scripts/load-app.mjs";

test("narrow screens get one card per time block instead of the wide table", () => {
  const { app, elements } = loadApp({ narrowScreen: true });
  app.showView("roster");
  const html = elements.get("schedule").innerHTML;
  assert.ok(!html.includes("horizontal-roster-table"));
  assert.equal((html.match(/roster-block-card/g) || []).length, 6);
  // Monday lunch peak has two floor seats; the second is labelled #2.
  assert.match(html, /플로어 #2/);
  assert.match(html, /data-action="assign-schedule" data-key="req_monday_2__sreq_monday_2_3_1__0"/);
});

test("wide screens keep the spreadsheet", () => {
  const { app, elements } = loadApp();
  app.showView("roster");
  assert.match(elements.get("schedule").innerHTML, /horizontal-roster-table/);
});
