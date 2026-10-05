import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, plain, MON_OPENING, MON_LUNCH_PEAK, HOT, FRY } from "./helpers.mjs";

const t = setupApp();
const { app } = t;
beforeEach(() => t.reset());

const HANGUL = /[가-힣]/;
const TABS = ["dashboard", "parts", "skills", "members", "requirements", "schedule", "labor", "validation", "settings", "roadmap"];

// Every leaf path in a translation tree; arrays count as one leaf with their length.
function shape(node, prefix = "") {
  if (Array.isArray(node)) return [`${prefix}[${node.length}]`];
  if (node && typeof node === "object") return Object.keys(node).sort().flatMap((key) => shape(node[key], prefix ? `${prefix}.${key}` : key));
  return [prefix];
}

// Replace every user-entered name in the default roster with ASCII, so any
// Hangul left in the rendered page must come from the app's own UI text.
function asciiData(state) {
  for (const list of [state.parts, state.stations, state.skills, state.employees, state.levelTemplates]) {
    list.forEach((item, i) => {
      if ("name" in item) item.name = `${item.id}`;
      if ("description" in item) item.description = `desc ${i}`;
      if ("role" in item) item.role = "role";
      for (const field of ["levelName", "stepName", "canDo", "cannotDo", "nextPromotionCriteria"]) if (field in item) item[field] = field;
    });
  }
  state.requirements.forEach((req) => { req.label = `block ${req.id}`; });
  state.settings.weekLabel = "week";
  return state;
}

function hangulIn(html) {
  return [...new Set(html.match(/[^<>]*[가-힣][^<>]*/g) || [])];
}

test("Korean and English tables have the same keys", () => {
  const { ko, en } = plain(t.i18n());
  assert.deepEqual(shape(en), shape(ko));
});

test("English UI shows no Korean once the data itself is in English", () => {
  const state = asciiData(t.getState());
  state.settings.language = "en";
  t.assign(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK), "emp_soo"); // missing skill
  t.assign(MON_LUNCH_PEAK, FRY(MON_LUNCH_PEAK), "emp_soo"); // double booked
  t.assign(MON_OPENING, "sreq_monday_0_0_0", "emp_gone"); // deleted employee
  t.employee("emp_soo").maxWeeklyHours = 1;
  state.settings.laborBudget = 1;

  state.settings.language = "ko";
  app.render();
  assert.ok(HANGUL.test(t.elements.get("validation").innerHTML), "Korean UI should still render Korean");

  state.settings.language = "en";
  app.render();
  for (const id of TABS) {
    assert.deepEqual(hangulIn(t.elements.get(id).innerHTML), [], `tab ${id}`);
  }

  const req = t.req(MON_LUNCH_PEAK);
  const sreq = t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK));
  const recs = app.getRecommendations(req, sreq).map((rec) => ({ ...rec, costDiff: 0 }));
  assert.deepEqual(hangulIn(app.renderRecommendationGroups(recs, "k", true)), []);
  assert.deepEqual(hangulIn(app.employeeOptionsForRequirement(req, sreq, "emp_soo")), []);
  for (const issue of app.calculateValidation()) {
    assert.ok(!HANGUL.test(app.issueTypeLabel(issue.type) + issue.message), issue.message);
  }
});

test("issue types are stable keys whatever the language", () => {
  const ko = app.calculateValidation().map((i) => i.type);
  t.getState().settings.language = "en";
  const en = app.calculateValidation().map((i) => i.type);
  assert.deepEqual(en, ko);
  assert.ok(ko.length > 0 && ko.every((type) => /^[a-zA-Z]+$/.test(type)), ko.join(", "));
});

test("issue labels keep the Korean wording and have English text", () => {
  assert.equal(app.issueTypeLabel("unassigned"), "미배정");
  assert.equal(app.issueTypeLabel("skillShort"), "Skill / Level 부족");
  t.getState().settings.language = "en";
  assert.equal(app.issueTypeLabel("unassigned"), "Unassigned");
  assert.equal(app.issueTypeLabel("overBudget"), "Over labor budget");
});

test("roster row summary counts unassigned seats in English too", () => {
  t.getState().settings.language = "en";
  const { reqs, rows } = app.getHorizontalRosterData("monday");
  const row = rows[0];
  const status = app.getAssignmentStatus(row.cells[reqs[0].id].req, row.cells[reqs[0].id].sreq, row.cells[reqs[0].id].key);
  assert.equal(status.kind, "unassigned");
  assert.equal(status.label, "Unassigned");
  assert.match(app.summarizeHorizontalRow(row, reqs).label, /^Unassigned\/at risk [1-9]/);
});
