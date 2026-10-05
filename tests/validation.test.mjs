import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, MON_OPENING, MON_LUNCH_PEAK, HOT, FRY } from "./helpers.mjs";

const t = setupApp();
const { app } = t;
beforeEach(() => t.reset());

const issuesFor = (reqId) => app.calculateValidation().filter((i) => i.req?.id === reqId);
const types = (issues) => issues.map((i) => i.type);

test("every seat is flagged unassigned on an empty schedule", () => {
  const seats = app.getRequirementSeatRows().length;
  const unassigned = app.calculateValidation().filter((i) => i.type === "미배정");
  assert.ok(seats > 0);
  assert.equal(unassigned.length, seats);
  assert.ok(unassigned.every((i) => i.severity === "high"));
});

test("a qualified, available assignment clears that seat with no warnings", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const forSeat = issuesFor(MON_LUNCH_PEAK).filter((i) => i.sreq?.id === HOT(MON_LUNCH_PEAK));
  assert.equal(forSeat.length, 0, types(forSeat).join(", "));
});

test("assigning outside availability is flagged", () => {
  t.assign(MON_OPENING, "sreq_monday_0_0_0", "emp_soo"); // starts 11:00, opening is 09:00
  const issue = issuesFor(MON_OPENING).find((i) => i.type === "가능 시간 위반");
  assert.ok(issue);
  assert.equal(issue.severity, "high");

  t.reset();
  t.assign(MON_OPENING, "sreq_monday_0_1_0", "emp_haeun"); // starts 10:00: partial
  assert.equal(issuesFor(MON_OPENING).find((i) => i.type === "가능 시간 위반")?.severity, "medium");
});

test("skill gaps are flagged: missing skill is high, emergency cover is medium", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_soo"); // no hot skill
  assert.equal(issuesFor(MON_LUNCH_PEAK).find((i) => i.type === "Skill / Level 부족")?.severity, "high");

  t.reset();
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_yuri"); // Level 1 Step 4 vs Level 2
  assert.equal(issuesFor(MON_LUNCH_PEAK).find((i) => i.type === "Skill / Level 주의")?.severity, "medium");
});

test("the same person twice in one block is a double booking", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  t.assign(MON_LUNCH_PEAK, FRY(MON_LUNCH_PEAK), "emp_minjun");
  const dup = issuesFor(MON_LUNCH_PEAK).find((i) => i.type === "중복 배치");
  assert.ok(dup);
  assert.equal(dup.severity, "high");
});

test("an assignment to a deleted employee is flagged", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_gone");
  assert.ok(types(issuesFor(MON_LUNCH_PEAK)).includes("직원 없음"));
});

test("no available replacement is flagged", () => {
  const state = t.getState();
  state.employees = state.employees.filter((e) => e.id === "emp_minjun");
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  assert.ok(types(issuesFor(MON_LUNCH_PEAK)).includes("대체근무자 없음"));
});

test("going over max weekly hours is flagged", () => {
  t.employee("emp_minjun").maxWeeklyHours = 2;
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const over = app.calculateValidation().find((i) => i.type === "주간 최대시간 초과");
  assert.equal(over?.employee.id, "emp_minjun");
});

test("a seat with no requiredCount still counts as one seat", () => {
  delete t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)).requiredCount;
  const unassigned = app.calculateValidation().filter((i) => i.type === "미배정");
  assert.equal(unassigned.length, app.getRequirementSeatRows().length);
  assert.ok(unassigned.some((i) => i.sreq?.id === HOT(MON_LUNCH_PEAK)));
});
