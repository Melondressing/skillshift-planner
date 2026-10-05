import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, plain, MON_LUNCH_PEAK, HOT } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;
beforeEach(() => t.reset());

const dayReqs = (day) => app.getDayRequirements(day);

test("copying a day's blocks replaces the target days' blocks and their assignments", () => {
  const state = t.getState();
  state.requirements = state.requirements.filter((r) => r.dayOfWeek !== "wednesday");
  const tuesdayKey = t.assign("req_tuesday_2", "sreq_tuesday_2_0_0", "emp_minjun");
  dayReqs("monday")[0].label = "Changed opening";

  const result = app.copyDayRequirements("monday", ["tuesday", "wednesday", "monday"]);
  assert.deepEqual(plain(result), { blocks: 12, days: 2 });
  for (const day of ["tuesday", "wednesday"]) {
    const reqs = dayReqs(day);
    assert.equal(reqs.length, 6);
    assert.equal(reqs[0].label, "Changed opening");
    const seats = reqs.flatMap((r) => r.stationRequirements.map((s) => s.id));
    assert.equal(new Set(seats).size, seats.length);
    assert.ok(!seats.some((id) => id.includes("monday")));
  }
  assert.equal(state.schedule[tuesdayKey], undefined);
  assert.equal(dayReqs("monday").length, 6);
});

test("copying assignments fills the same seats on other days and can be undone", () => {
  const state = t.getState();
  const monday = t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const tuesdayHot = app.assignmentKey("req_tuesday_2", "sreq_tuesday_2_0_0", 0);
  const saturdayHot = app.assignmentKey("req_saturday_2", "sreq_saturday_2_0_0", 0);
  state.schedule[saturdayHot] = "emp_joon";

  const result = app.copyDayAssignments("monday", ["tuesday", "saturday"]);
  assert.equal(result.changes.length, 2);
  assert.equal(state.schedule[tuesdayHot], "emp_minjun");
  assert.equal(state.schedule[saturdayHot], "emp_minjun");
  assert.equal(state.schedule[monday], "emp_minjun");

  app.undoScheduleChanges(result.changes);
  assert.equal(state.schedule[tuesdayHot], undefined);
  assert.equal(state.schedule[saturdayHot], "emp_joon");
});

test("seats with no matching block on the target day are skipped and counted", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  t.req("req_tuesday_2").startTime = "12:00";
  const result = app.copyDayAssignments("monday", ["tuesday"]);
  assert.equal(result.changes.length, 0);
  assert.equal(result.unmatched, 1);
});

test("copied people who don't fit the target day are counted for a check", () => {
  t.employee("emp_minjun").availability.tuesday.available = false;
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const result = app.copyDayAssignments("monday", ["tuesday", "wednesday"]);
  assert.equal(result.changes.length, 2);
  assert.equal(result.needsCheck, 1);
});

test("the roster and requirements show copy controls for other days", () => {
  app.showView("roster");
  assert.match(elements.get("schedule").innerHTML, /data-action="copy-day-assignments" data-day="monday"/);
  assert.match(elements.get("requirements").innerHTML, /data-action="copy-day-requirements" data-day="monday"/);
  assert.ok(!elements.get("schedule").innerHTML.includes('data-copy-target="assignments" value="monday"'));
});
