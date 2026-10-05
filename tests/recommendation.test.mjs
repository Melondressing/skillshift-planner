import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, plain, MON_OPENING, MON_LUNCH_PREP, MON_LUNCH_PEAK, HOT, FRY } from "./helpers.mjs";

const t = setupApp();
const { app } = t;
beforeEach(() => t.reset());

test("compareLevelStep: meets, step short, emergency, and missing skill", () => {
  const sreq = { requiredSkillId: "sk_hot", minLevel: 2, minStep: 2, canUseLowerStepAsEmergency: true };
  const withSkill = (level, step) => ({ assignedSkills: { sk_hot: { level, step } } });

  assert.equal(app.compareLevelStep(withSkill(3, 1), sreq).status, "ok");
  assert.equal(app.compareLevelStep(withSkill(2, 2), sreq).status, "ok");
  assert.equal(app.compareLevelStep(withSkill(2, 1), sreq).status, "partial");
  // One level below with a high step (Level 1 tops out at Step 4) is an emergency option.
  assert.equal(app.compareLevelStep(withSkill(1, 4), sreq).status, "emergency");
  assert.equal(app.compareLevelStep(withSkill(1, 2), sreq).status, "bad");
  assert.equal(app.compareLevelStep(withSkill(1, 4), { ...sreq, canUseLowerStepAsEmergency: false }).status, "bad");
  assert.equal(app.compareLevelStep({ assignedSkills: {} }, sreq).status, "bad");
});

test("compareLevelStep: higher skill scores higher", () => {
  const sreq = { requiredSkillId: "sk_hot", minLevel: 2, minStep: 1 };
  const score = (level, step) => app.compareLevelStep({ assignedSkills: { sk_hot: { level, step } } }, sreq).score;
  assert.ok(score(4, 1) > score(3, 1));
  assert.ok(score(3, 1) > score(2, 2));
  assert.ok(score(2, 2) > score(2, 1));
});

test("isEmployeeAvailable: full, partial, outside hours, and day off", () => {
  const opening = t.req(MON_OPENING); // 09:00–10:30
  assert.equal(app.isEmployeeAvailable(t.employee("emp_minjun"), opening).status, "ok"); // 09:00–22:00
  assert.equal(app.isEmployeeAvailable(t.employee("emp_haeun"), opening).status, "partial"); // 10:00–22:30
  assert.equal(app.isEmployeeAvailable(t.employee("emp_soo"), opening).status, "bad"); // 11:00–22:00

  const minjun = t.employee("emp_minjun");
  minjun.availability.monday.available = false;
  assert.equal(app.isEmployeeAvailable(minjun, opening).status, "bad");
});

test("getRecommendations ranks a qualified, available cook first for the hot station", () => {
  const req = t.req(MON_LUNCH_PEAK);
  const recs = app.getRecommendations(req, t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)));

  const scores = recs.map((r) => r.score);
  assert.deepEqual(plain(scores), plain([...scores].sort((a, b) => b - a)), "sorted by score, highest first");

  const byEmp = Object.fromEntries(recs.map((r) => [r.employee.id, r.category]));
  assert.equal(recs[0].employee.id, "emp_minjun"); // Level 3 hot, peak-capable
  assert.equal(byEmp.emp_minjun, "fit");
  assert.equal(byEmp.emp_joon, "fit"); // Level 2 Step 2
  assert.equal(byEmp.emp_yuri, "emergency"); // Level 1 Step 4
  assert.equal(byEmp.emp_soo, "bad"); // no hot skill
  assert.equal(byEmp.emp_haeun, "bad"); // hall staff
});

test("getRecommendations excludes the given employee", () => {
  const recs = app.getRecommendations(t.req(MON_LUNCH_PEAK), t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)), "emp_minjun");
  assert.ok(!recs.some((r) => r.employee.id === "emp_minjun"));
});

test("getCandidateStatus: inactive staff are never recommended", () => {
  const minjun = t.employee("emp_minjun");
  minjun.active = false;
  const status = app.getCandidateStatus(minjun, t.req(MON_LUNCH_PEAK), t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)));
  assert.equal(status.category, "bad");
  assert.equal(status.score, -999);
});

test("getCandidateStatus: an overlapping assignment drops a fit candidate", () => {
  const req = t.req(MON_LUNCH_PEAK);
  const fry = t.sreq(MON_LUNCH_PEAK, FRY(MON_LUNCH_PEAK));
  const before = app.getCandidateStatus(t.employee("emp_minjun"), req, fry);
  assert.equal(before.category, "fit");

  const hotKey = t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_minjun");
  const after = app.getCandidateStatus(t.employee("emp_minjun"), req, fry);
  assert.notEqual(after.category, "fit");
  assert.ok(after.score < before.score - 80);

  // Ignoring the seat being replaced removes the conflict.
  const ignoring = app.getCandidateStatus(t.employee("emp_minjun"), req, t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)), hotKey);
  assert.equal(ignoring.category, "fit");
});

test("getCandidateStatus: going over max weekly hours is not a fit", () => {
  const minjun = t.employee("emp_minjun");
  minjun.maxWeeklyHours = 2; // lunch peak is 3h
  const status = app.getCandidateStatus(minjun, t.req(MON_LUNCH_PEAK), t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK)));
  assert.notEqual(status.category, "fit");
  assert.equal(status.projectedHours, 3);
});

test("hasOverlappingAssignment: back-to-back blocks do not overlap", () => {
  t.assign(MON_LUNCH_PREP, "sreq_monday_1_1_0", "emp_minjun"); // 10:30–11:30
  assert.equal(app.hasOverlappingAssignment("emp_minjun", t.req(MON_LUNCH_PEAK)), false); // 11:30–14:30
  assert.equal(app.hasOverlappingAssignment("emp_minjun", t.req(MON_OPENING)), false); // 09:00–10:30
  assert.equal(app.hasOverlappingAssignment("emp_minjun", t.req(MON_LUNCH_PREP)), true);
  assert.equal(app.hasOverlappingAssignment("emp_joon", t.req(MON_LUNCH_PREP)), false);
});
