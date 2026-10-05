import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupApp } from "./helpers.mjs";

const t = setupApp();
const { app, elements } = t;
beforeEach(() => {
  t.reset();
  app.autoFillEmptySeats();
  t.assign("req_monday_0", "sreq_monday_0_0_0", "emp_soo"); // creates availability issues too
});

// Every piece of user data in the state (names, notes, descriptions...).
function dataStrings(value, out = new Set()) {
  if (typeof value === "string") out.add(value);
  else if (value && typeof value === "object") Object.values(value).forEach((v) => dataStrings(v, out));
  return out;
}

function renderAll(lang) {
  t.getState().settings.language = lang;
  const panels = { setup: ["parts", "skills"], members: ["members"], roster: ["requirements", "schedule"], summary: ["dashboard", "labor", "validation"], settings: ["settings"], roadmap: ["roadmap"] };
  let html = "";
  for (const [view, ids] of Object.entries(panels)) {
    app.showView(view);
    html += ids.map((id) => elements.get(id).innerHTML).join("\n");
  }
  app.openIssueInRoster("req_monday_0", "sreq_monday_0_0_0", 0);
  html += elements.get("schedule").innerHTML;
  return html;
}

test("the English UI has no Korean apart from the user's own data", () => {
  let html = renderAll("en");
  const data = [...dataStrings(t.getState())].filter((s) => /[가-힣]/.test(s)).sort((a, b) => b.length - a.length);
  for (const value of data) html = html.split(value).join("").split(app.escapeHtml(value)).join("");
  const leftovers = [...new Set(html.match(/[가-힣][가-힣\s/·:()]*/g) || [])];
  assert.ok(html.length > 20000);
  assert.deepEqual(leftovers, []);
});

test("the Korean UI uses Korean terms for parts, stations and seats", () => {
  const html = renderAll("ko");
  for (const word of [">Part<", ">Station<", ">Seat<", "Score ", ">Peak<", "Status / Required", " assignments", ">No<", "Unknown"]) {
    assert.ok(!html.includes(word), word);
  }
  assert.match(html, /스테이션/);
});
