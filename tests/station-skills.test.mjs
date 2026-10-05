import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp, MON_LUNCH_PEAK, HOT } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;
beforeEach(() => t.reset());

test("a new station gets its own skill with starter Level/Step steps", () => {
  const state = t.getState();
  const station = { id: "st_grill", partId: "part_kitchen", name: "그릴", requiredSkillIds: [], sortOrder: 9, active: true };
  state.stations.push(station);
  const skillId = app.createSkillForStation(station, "주방 그릴");
  assert.equal(app.byId(state.skills, skillId).stationId, "st_grill");
  assert.deepEqual([...station.requiredSkillIds], [skillId]);
  assert.ok(app.getSkillLevelTemplates(skillId).length > 0);
  assert.equal(app.getRequiredSkillId({ stationId: "st_grill" }), skillId);
});

test("staff cards list one proficiency select per station instead of five dropdowns", () => {
  app.showView("members");
  const html = elements.get("members").innerHTML;
  const selects = html.match(/data-action="member-skill-level" data-emp="emp_minjun"/g) || [];
  assert.equal(selects.length, t.getState().skills.length);
  assert.ok(!html.includes("memberSkillPart"));
  assert.match(html, /data-skill="sk_hot"[^>]*>[\s\S]*?<option value="3-1" selected>L3-S1<\/option>/);
});

test("choosing a level updates recommendations; choosing can't removes it", () => {
  const req = t.req(MON_LUNCH_PEAK);
  const sreq = t.sreq(MON_LUNCH_PEAK, HOT(MON_LUNCH_PEAK));
  const category = () => app.getCandidateStatus(t.employee("emp_soo"), req, sreq).category;
  assert.equal(category(), "bad");
  app.setEmployeeSkillLevel("emp_soo", "sk_hot", "2-1");
  assert.deepEqual({ ...t.employee("emp_soo").assignedSkills.sk_hot }, { note: "", level: 2, step: 1 });
  assert.equal(category(), "fit");
  app.setEmployeeSkillLevel("emp_soo", "sk_hot", "");
  assert.equal(t.employee("emp_soo").assignedSkills.sk_hot, undefined);
});

test("a level with no matching template stays selectable", () => {
  t.employee("emp_minjun").assignedSkills.sk_hot = { level: 7, step: 2, note: "" };
  const keys = app.levelStepChoices("sk_hot", { level: 7, step: 2 }).map((c) => c.key);
  assert.ok(keys.includes("7-2"));
  assert.equal(keys.at(-1), "7-2");
});

test("skill and step management is collapsed until opened", () => {
  app.showView("setup");
  assert.match(elements.get("skills").innerHTML, /data-action="toggle-advanced-skills" aria-expanded="false"/);
  assert.ok(!elements.get("skills").innerHTML.includes("add-level"));
});
