import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;
beforeEach(() => t.reset());

const progress = () => Object.fromEntries(app.getSetupProgress().map((s) => [s.key, s.done]));

test("the sample roster only lacks assignments", () => {
  assert.deepEqual(progress(), { stations: true, staff: true, requirements: true, assign: false });
  app.showView("summary");
  const html = elements.get("dashboard").innerHTML;
  assert.match(html, /getting-started/);
  assert.ok(!html.includes('data-action="load-sample"'));
});

test("an empty store shows every step and offers sample data", () => {
  t.setState(app.createBlankState());
  assert.ok(Object.values(progress()).every((done) => !done));
  app.showView("summary");
  assert.match(elements.get("dashboard").innerHTML, /data-action="load-sample"/);
  t.getState().settings.laborBudget = 777;
  app.loadSampleData();
  assert.equal(t.getState().employees.length, 7);
  assert.equal(t.getState().settings.laborBudget, 777);
});

test("the checklist disappears once everything is done", () => {
  app.autoFillEmptySeats();
  app.showView("summary");
  assert.ok(!elements.get("dashboard").innerHTML.includes("getting-started"));
});

test("sample data never overwrites a store that has data", () => {
  t.getState().employees = [];
  app.loadSampleData();
  assert.equal(t.getState().employees.length, 0);
});
