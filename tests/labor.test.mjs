import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, plain, MON_LUNCH_PEAK, SAT_LUNCH_PEAK, HOT, FRY } from "./helpers.mjs";

const t = setupApp();
const { app } = t;
beforeEach(() => t.reset());

const budgetIssue = () => app.calculateValidation().find((i) => i.kind === "overBudget");

test("durationHours handles normal, zero-length and reversed blocks", () => {
  assert.equal(app.durationHours("11:30", "14:30"), 3);
  assert.equal(app.durationHours("09:00", "10:30"), 1.5);
  assert.equal(app.durationHours("10:00", "10:00"), 0);
  assert.equal(app.durationHours("14:00", "10:00"), 0);
});

test("getRate applies weekend multipliers", () => {
  const minjun = t.employee("emp_minjun"); // $31, Sat x1.25, Sun x1.5
  assert.equal(app.getRate(minjun, "monday"), 31);
  assert.equal(app.getRate(minjun, "saturday"), 38.75);
  assert.equal(app.getRate(minjun, "sunday"), 46.5);
});

test("weekly hours and cost split weekday and weekend work", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun"); // 3h x $31
  t.assign(SAT_LUNCH_PEAK, HOT(SAT_LUNCH_PEAK), "emp_minjun"); // 3h x $38.75

  assert.equal(app.employeeWeeklyHours("emp_minjun"), 6);
  assert.equal(app.employeeWeeklyCost("emp_minjun"), 93 + 116.25);
  assert.deepEqual(plain(app.employeeWorkBreakdown("emp_minjun")), {
    weekdayHours: 3,
    saturdayHours: 3,
    sundayHours: 0,
    weekdayCost: 93,
    saturdayCost: 116.25,
    sundayCost: 0,
    totalHours: 6,
    totalCost: 209.25,
  });
});

test("totalLaborCost sums every employee", () => {
  assert.equal(app.totalLaborCost(), 0);
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun"); // 3 x 31
  t.assign(MON_LUNCH_PEAK, FRY(MON_LUNCH_PEAK), "emp_joon"); // 3 x 29
  assert.equal(app.totalLaborCost(), 93 + 87);
});

test("labor cost over budget is flagged, under budget is not", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun"); // $93
  t.getState().settings.laborBudget = 100;
  assert.equal(budgetIssue(), undefined);

  t.getState().settings.laborBudget = 90;
  assert.equal(budgetIssue()?.severity, "high");

  // A budget of 0 means no budget is set.
  t.getState().settings.laborBudget = 0;
  assert.equal(budgetIssue(), undefined);
});

test("summary step shows budget usage", () => {
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun"); // $93
  t.getState().settings.laborBudget = 186;
  app.renderDashboard();
  assert.match(t.elements.get("dashboard").innerHTML, /50\.0%/);
});
