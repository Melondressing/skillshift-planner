import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, plain, MON_OPENING, MON_LUNCH_PEAK, HOT } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;

beforeEach(() => t.reset());

test("seat issues carry their slot and render a fix button", () => {
  const issue = app.calculateValidation().find((i) => i.kind === "unassigned");
  assert.equal(issue.slotIndex, 0);
  app.renderValidation();
  const html = elements.get("validation").innerHTML;
  assert.match(html, new RegExp(`data-action="fix-issue" data-req="${issue.req.id}" data-sreq="${issue.sreq.id}" data-slot="0"`));
});

test("fixing an empty seat opens the roster on that day with recommendations", () => {
  const sreq = HOT(MON_LUNCH_PEAK).replace("monday", "saturday");
  app.openIssueInRoster("req_saturday_2", sreq, 0);
  app.render();
  const html = elements.get("schedule").innerHTML;
  assert.match(html, /추천 직원 · 토요일 11:30–14:30/);
  assert.match(elements.get("tabs").innerHTML, /tab-btn active" data-tab="roster"/);
});

test("fixing an assigned seat opens the replacement panel", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_yuri"); // below the required level
  app.openIssueInRoster(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), 0);
  assert.match(elements.get("schedule").innerHTML, /대체근무자 추천 · 유리 대체/);
});

test("auto-fill only places fully fitting staff, without double-booking", () => {
  const { filled, skipped } = app.autoFillEmptySeats({ withinBudget: false });
  assert.ok(filled.length > 0);
  const total = app.getRequirementSeatRows().length;
  assert.equal(filled.length + skipped, total);
  for (const { key, employeeId } of filled) {
    const { reqId, stationReqId } = app.parseAssignmentKey(key);
    const req = t.req(reqId);
    const status = app.getCandidateStatus(t.employee(employeeId), req, t.sreq(reqId, stationReqId), key);
    assert.equal(status.category, "fit", `${key} -> ${employeeId}`);
  }
  const issues = app.calculateValidation();
  assert.equal(issues.filter((i) => i.kind === "doubleBooked").length, 0);
  assert.equal(issues.filter((i) => i.kind === "overMaxHours").length, 0);
  assert.equal(issues.filter((i) => i.kind === "unassigned").length, skipped);
});

test("auto-fill keeps existing assignments and undo only removes what it added", () => {
  const manual = t.assign(MON_OPENING, `sreq_monday_0_0_0`, "emp_yuri");
  const result = app.autoFillEmptySeats({ withinBudget: false });
  assert.equal(t.getState().schedule[manual], "emp_yuri");
  assert.ok(!result.filled.some((f) => f.key === manual));
  const changed = result.filled[0];
  t.getState().schedule[changed.key] = "emp_soo"; // edited by hand after auto-fill
  app.undoAutoFill(result);
  assert.deepEqual(plain(t.getState().schedule), { [manual]: "emp_yuri", [changed.key]: "emp_soo" });
});

test("an assigned employee's own seat is not counted twice toward weekly hours", () => {
  const key = t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const status = app.getCandidateStatus(t.employee("emp_minjun"), t.req(MON_LUNCH_PEAK), t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)), key);
  assert.equal(status.projectedHours, 3);
});

test("auto-fill stays within the labor budget by default and reports what the budget left empty", () => {
  assert.equal(t.getState().settings.autoFillWithinBudget, true);
  const result = app.autoFillEmptySeats();
  assert.ok(result.filled.length > 0);
  assert.ok(result.overBudget > 0);
  assert.ok(app.totalLaborCost() <= t.getState().settings.laborBudget);
  const total = app.getRequirementSeatRows().length;
  assert.equal(result.filled.length + result.skipped + result.overBudget, total);
  assert.equal(app.calculateValidation().filter((i) => i.kind === "overBudget").length, 0);
});

test("with the budget switched off auto-fill may exceed it, as before", () => {
  t.getState().settings.autoFillWithinBudget = false;
  const result = app.autoFillEmptySeats();
  assert.equal(result.overBudget, 0);
  assert.ok(app.totalLaborCost() > t.getState().settings.laborBudget);
});

test("when the budget only covers one seat, auto-fill spends it on a peak seat", () => {
  t.getState().settings.laborBudget = 100;
  const { filled } = app.autoFillEmptySeats();
  assert.equal(filled.length, 1);
  const { reqId } = app.parseAssignmentKey(filled[0].key);
  assert.equal(Boolean(t.req(reqId).isPeak), true);
});

test("a budget that is already used up leaves every empty seat alone", () => {
  t.getState().settings.laborBudget = 1;
  const result = app.autoFillEmptySeats();
  assert.equal(result.filled.length, 0);
  assert.deepEqual(plain(t.getState().schedule), {});
});

test("the roster shows the budget switch and the budget-aware result message", () => {
  app.showView("roster");
  assert.match(elements.get("schedule").innerHTML, /data-setting="autoFillWithinBudget" checked/);
  assert.match(app.t("schedule.autoFillResultBudget", { filled: 5, skipped: 2, overBudget: 3 }), /3자리는 인건비 예산/);
});
