import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "../scripts/load-app.mjs";
import { setupApp, plain, MON_LUNCH_PEAK, HOT } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;
beforeEach(() => {
  t.reset();
  t.getState().weekStart = "2026-10-05";
});

test("week helpers work on local Mondays", () => {
  assert.equal(app.mondayOf(new Date(2026, 9, 11)), "2026-10-05"); // Sunday
  assert.equal(app.mondayOf(new Date(2026, 9, 5)), "2026-10-05");
  assert.equal(app.addDays("2026-12-28", 7), "2027-01-04");
  assert.equal(app.weekRangeLabel("2026-10-05"), "10/5–10/11");
  assert.equal(app.dateForDay("sunday"), "2026-10-11");
});

test("switching weeks files this week's roster and brings it back", () => {
  const key = t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  app.switchWeek("2026-10-12");
  const state = t.getState();
  assert.equal(state.weekStart, "2026-10-12");
  assert.deepEqual(plain(state.schedule), {});
  assert.equal(state.savedWeeks["2026-10-05"][key], "emp_minjun");
  app.switchWeek("2026-10-05");
  assert.equal(state.schedule[key], "emp_minjun");
  assert.equal(state.savedWeeks["2026-10-05"], undefined);
  assert.deepEqual(Object.keys(state.savedWeeks), []); // the empty week is not kept
});

test("last week's roster fills only empty seats and is undoable", () => {
  const hot = t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const opening = t.assign("req_monday_0", "sreq_monday_0_0_0", "emp_yuri");
  app.switchWeek("2026-10-12");
  t.assign("req_monday_0", "sreq_monday_0_0_0", "emp_soo");
  const changes = app.copyPreviousWeek();
  const state = t.getState();
  assert.equal(changes.length, 1);
  assert.equal(state.schedule[hot], "emp_minjun");
  assert.equal(state.schedule[opening], "emp_soo");
  app.undoScheduleChanges(changes);
  assert.equal(state.schedule[hot], undefined);
});

test("deleting an employee clears them from saved weeks too", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  app.switchWeek("2026-10-12");
  app.removeAssignmentsWhere((key, employeeId) => employeeId === "emp_minjun");
  app.switchWeek("2026-10-05");
  assert.deepEqual(plain(t.getState().schedule), {});
});

test("the roster shows the week and dated day pills", () => {
  app.showView("roster");
  const html = elements.get("schedule").innerHTML;
  assert.match(html, /10\/5–10\/11/);
  assert.match(html, /월 <span class="pill-date">10\/5<\/span>/);
  assert.match(html, /data-action="week-shift" data-days="-7"/);
});

test("older saved data becomes the current week's roster", () => {
  const { app: fresh } = loadApp();
  const saved = fresh.createDefaultState();
  saved.appVersion = 4;
  delete saved.weekStart;
  delete saved.savedWeeks;
  saved.schedule = { [`${MON_LUNCH_PEAK}__${HOT(MON_LUNCH_PEAK)}__0`]: "emp_minjun" };
  const { getState, app: loaded } = loadApp({ localStorage: { skillshift_planner_v14: JSON.stringify(saved) } });
  assert.equal(getState().appVersion, 5);
  assert.equal(getState().weekStart, loaded.currentWeekStart());
  assert.equal(Object.keys(getState().schedule).length, 1);
  assert.deepEqual(plain(getState().savedWeeks), {});
});
