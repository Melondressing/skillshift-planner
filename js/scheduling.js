function isEmployeeAvailable(employee, req) {
  const av = employee.availability?.[req.dayOfWeek];
  if (!av || !av.available) return { status: 'bad', reason: t('reasons.dayUnavailable', { day: dayLabel(req.dayOfWeek) }) };
  const reqStart = toMinutes(req.startTime);
  const reqEnd = toMinutes(req.endTime);
  const avStart = toMinutes(av.startTime);
  const avEnd = toMinutes(av.endTime);
  if (avStart <= reqStart && avEnd >= reqEnd) return { status: 'ok', reason: t('reasons.available', { start: av.startTime, end: av.endTime }) };
  if (avEnd > reqStart && avStart < reqEnd) return { status: 'partial', reason: t('reasons.partialAvailable', { start: av.startTime, end: av.endTime }) };
  return { status: 'bad', reason: t('reasons.timeUnavailable', { start: av.startTime, end: av.endTime }) };
}

function hasOverlappingAssignment(employeeId, req, ignoreKey = '') {
  return assignmentsOf(employeeId).some((assignment) => {
    if (assignment.key === ignoreKey) return false;
    const other = getReqById(assignment.reqId);
    if (!other || other.dayOfWeek !== req.dayOfWeek) return false;
    return toMinutes(other.startTime) < toMinutes(req.endTime) && toMinutes(other.endTime) > toMinutes(req.startTime);
  });
}

function highestStepForSkillLevel(skillId, levelNumber) {
  const steps = state.levelTemplates
    .filter((tpl) => tpl.skillId === skillId && Number(tpl.levelNumber) === Number(levelNumber))
    .map((tpl) => Number(tpl.stepNumber));
  return steps.length ? Math.max(...steps) : 4;
}

function compareLevelStep(employee, stationReq) {
  const requiredSkillId = getRequiredSkillId(stationReq);
  const assigned = employee.assignedSkills?.[requiredSkillId];
  if (!assigned) return { status: 'bad', reason: t('reasons.noSkill'), score: -100 };
  const level = num(assigned.level);
  const step = num(assigned.step);
  const minLevel = num(stationReq.minLevel);
  const minStep = num(stationReq.minStep);

  if (level > minLevel || (level === minLevel && step >= minStep)) {
    return { status: 'ok', reason: t('reasons.meets', { level, step }), score: 50 + (level - minLevel) * 10 + (step - minStep) };
  }
  if (level === minLevel && step < minStep) {
    return { status: 'partial', reason: t('reasons.stepShort', { step, minStep }), score: 20 - (minStep - step) };
  }
  if (stationReq.canUseLowerStepAsEmergency && level === minLevel - 1) {
    const maxStep = highestStepForSkillLevel(requiredSkillId, level);
    if (step >= Math.max(3, maxStep - 1)) {
      return { status: 'emergency', reason: t('reasons.emergency', { level, step }), score: 8 };
    }
  }
  return { status: 'bad', reason: t('reasons.tooLow', { level, step, minLevel, minStep }), score: -40 };
}

function getCandidateStatus(employee, req, stationReq, ignoreKey = '') {
  if (!employee.active) return { category: 'bad', score: -999, reasons: [t('reasons.inactive')] };
  const reasons = [];
  let score = 0;

  const availability = isEmployeeAvailable(employee, req);
  reasons.push(availability.reason);
  if (availability.status === 'ok') score += 40;
  if (availability.status === 'partial') score += 5;
  if (availability.status === 'bad') score -= 120;

  const skill = compareLevelStep(employee, stationReq);
  reasons.push(skill.reason);
  score += skill.score;

  if (req.isPeak) {
    const template = getEmployeeLevelTemplate(employee, getRequiredSkillId(stationReq));
    if (template?.canWorkPeakTime) {
      score += 8;
      reasons.push(t('reasons.peakOk'));
    } else if (skill.status === 'ok') {
      reasons.push(t('reasons.peakCheck'));
      score -= 5;
    }
  }

  const overlapping = hasOverlappingAssignment(employee.id, req, ignoreKey);
  if (overlapping) {
    score -= 90;
    reasons.push(t('reasons.overlap'));
  }

  // An employee already sitting in the seat being checked has its hours counted once.
  const alreadyInSeat = Boolean(ignoreKey) && state.schedule[ignoreKey] === employee.id;
  const projectedHours = employeeWeeklyHours(employee.id) + (alreadyInSeat ? 0 : durationHours(req.startTime, req.endTime));
  const overMaxHours = projectedHours > num(employee.maxWeeklyHours, 999);
  if (overMaxHours) {
    score -= 60;
    reasons.push(t('reasons.overMax', { hours: projectedHours.toFixed(1), max: employee.maxWeeklyHours }));
  } else {
    score += 5;
    reasons.push(t('reasons.weekly', { hours: projectedHours.toFixed(1), max: employee.maxWeeklyHours }));
  }

  const addedCost = durationHours(req.startTime, req.endTime) * getRate(employee, req.dayOfWeek);
  reasons.push(t('reasons.addedCost', { amount: money(addedCost) }));

  let category = 'bad';
  if (availability.status === 'ok' && skill.status === 'ok' && !overlapping && !overMaxHours) category = 'fit';
  else if (availability.status !== 'bad' && (skill.status === 'partial' || skill.status === 'ok') && score > 0) category = 'partial';
  else if (availability.status !== 'bad' && skill.status === 'emergency' && score > -20) category = 'emergency';

  return { category, score, reasons, addedCost, projectedHours, availability, skill };
}

function getEmployeeLevelTemplate(employee, skillId) {
  const assigned = employee.assignedSkills?.[skillId];
  if (!assigned) return null;
  return state.levelTemplates.find((tpl) =>
    tpl.skillId === skillId &&
    Number(tpl.levelNumber) === Number(assigned.level) &&
    Number(tpl.stepNumber) === Number(assigned.step)
  );
}

function getRecommendations(req, stationReq, excludeEmployeeId = '', ignoreKey = '') {
  const all = cached(`recs:${req.id}:${stationReq.id}:${ignoreKey}`, () => state.employees
    .map((emp) => ({ employee: emp, ...getCandidateStatus(emp, req, stationReq, ignoreKey) }))
    .sort((a, b) => b.score - a.score));
  return excludeEmployeeId ? all.filter((rec) => rec.employee.id !== excludeEmployeeId) : all;
}

// Fills empty seats with fully fitting ('fit') employees. Peak seats go
// first, then the hardest seats (fewest fitting employees), so scarce skills
// and the budget are not used up on easy seats. Every seat, busy or quiet,
// keeps the same minimum Level/Step; among the employees who meet it the pick
// is the cheapest, then the least busy this week. With
// `withinBudget` a seat is left empty rather than pushing the week's labor
// cost past the budget. A seat's candidates only change for the employee just
// placed, so only that employee is re-checked. Returns what was filled so it
// can be undone: `skipped` seats had nobody who fits, `overBudget` seats were
// left because of the budget.
function autoFillEmptySeats({ withinBudget = Boolean(state.settings.autoFillWithinBudget) } = {}) {
  const filled = [];
  let skipped = 0;
  let overBudget = 0;
  // Totals are re-read after every placement; keep them cached in between.
  const outerCache = renderCache;
  renderCache = new Map();
  try {
    const budget = withinBudget ? num(state.settings.laborBudget) : 0;
    let cost = totalLaborCost();
    const reqs = [...state.requirements].sort((a, b) =>
      dayIndex(a.dayOfWeek) - dayIndex(b.dayOfWeek) || toMinutes(a.startTime) - toMinutes(b.startTime));
    const seats = [];
    reqs.forEach((req) => {
      req.stationRequirements.forEach((sreq) => {
        for (let i = 0; i < seatCount(sreq); i += 1) {
          const key = assignmentKey(req.id, sreq.id, i);
          if (state.schedule[key]) continue;
          const fits = new Map();
          state.employees.forEach((employee) => {
            const status = getCandidateStatus(employee, req, sreq, key);
            if (status.category === 'fit') fits.set(employee.id, status);
          });
          if (fits.size) seats.push({ key, req, sreq, fits, order: seats.length });
          else skipped += 1;
        }
      });
    });
    const rank = (a, b) => a.addedCost - b.addedCost
      || a.projectedHours / num(a.employee.maxWeeklyHours, 999) - b.projectedHours / num(b.employee.maxWeeklyHours, 999);
    const harder = (a, b) => Number(Boolean(b.req.isPeak)) - Number(Boolean(a.req.isPeak))
      || a.fits.size - b.fits.size
      || a.order - b.order;
    while (seats.length) {
      let pick = 0;
      seats.forEach((seat, i) => { if (harder(seat, seats[pick]) < 0) pick = i; });
      const [seat] = seats.splice(pick, 1);
      const affordable = [...seat.fits]
        .map(([id, status]) => ({ employee: byId(state.employees, id), ...status }))
        .filter((rec) => !budget || cost + rec.addedCost <= budget)
        .sort(rank);
      if (!affordable.length) { overBudget += 1; continue; }
      const best = affordable[0];
      state.schedule[seat.key] = best.employee.id;
      filled.push({ key: seat.key, employeeId: best.employee.id });
      cost += best.addedCost;
      renderCache.clear();
      for (let i = seats.length - 1; i >= 0; i -= 1) {
        const other = seats[i];
        const status = getCandidateStatus(best.employee, other.req, other.sreq, other.key);
        if (status.category === 'fit') other.fits.set(best.employee.id, status);
        else other.fits.delete(best.employee.id);
        if (!other.fits.size) { seats.splice(i, 1); skipped += 1; }
      }
    }
  } finally {
    renderCache = outerCache;
  }
  return { filled, skipped, overBudget };
}

// Removes assignments matching `drop(key, employeeId)` from this week and
// every saved week.
function removeAssignmentsWhere(drop) {
  [state.schedule, ...Object.values(state.savedWeeks || {})].forEach((schedule) => {
    Object.keys(schedule).forEach((key) => { if (drop(key, schedule[key])) delete schedule[key]; });
  });
}

// Moves to another week: this week's roster is filed away and the target
// week's roster (empty if it has none yet) becomes the current one.
function switchWeek(weekStart) {
  if (!isIsoDate(weekStart)) return;
  const current = activeWeekStart();
  if (weekStart === current) return;
  state.savedWeeks = state.savedWeeks || {};
  if (Object.keys(state.schedule).length) state.savedWeeks[current] = state.schedule;
  else delete state.savedWeeks[current];
  state.schedule = state.savedWeeks[weekStart] || {};
  delete state.savedWeeks[weekStart];
  state.weekStart = weekStart;
  lastBulkChange = null;
  recommendationContext = null;
  replacementContext = null;
}

function previousWeekSchedule() {
  return state.savedWeeks?.[addDays(activeWeekStart(), -7)] || null;
}

// Fills this week's empty seats with last week's assignments.
function copyPreviousWeek() {
  const previous = previousWeekSchedule() || {};
  const seats = new Set(getRequirementSeatRows().map((row) => row.key));
  const changes = [];
  Object.entries(previous).forEach(([key, employeeId]) => {
    if (!employeeId || state.schedule[key] || !seats.has(key)) return;
    state.schedule[key] = employeeId;
    changes.push({ key, before: '', after: employeeId });
  });
  return changes;
}

function renderWeekNav() {
  const week = activeWeekStart();
  const thisWeek = currentWeekStart();
  const previous = previousWeekSchedule();
  return `<div class="week-nav no-print">
    <button class="btn small secondary" type="button" data-action="week-shift" data-days="-7" aria-label="${t('week.previous')}">◀</button>
    <strong class="week-range">${weekRangeLabel(week)}</strong>
    <button class="btn small secondary" type="button" data-action="week-shift" data-days="7" aria-label="${t('week.next')}">▶</button>
    ${week !== thisWeek ? `<button class="btn small secondary" type="button" data-action="week-today">${t('week.thisWeek')}</button>` : `<span class="badge info">${t('week.thisWeek')}</span>`}
    ${previous && Object.keys(previous).length ? `<button class="btn small secondary" type="button" data-action="copy-previous-week">${t('week.copyPrevious')}</button>` : ''}
  </div>`;
}

// Restores each seat to what it was before a bulk change, unless it has
// been edited by hand since.
function undoScheduleChanges(changes) {
  changes.forEach(({ key, before, after }) => {
    if (state.schedule[key] !== after) return;
    if (before) state.schedule[key] = before;
    else delete state.schedule[key];
  });
}

// Removes auto-filled assignments that haven't been changed since.
function undoAutoFill(result) {
  undoScheduleChanges(result.filled.map(({ key, employeeId }) => ({ key, before: '', after: employeeId })));
}

// Seats of one time block keyed by part/station and how many times that
// station appears in the block, e.g. "part_hall__st_floor__1" for the 2nd
// floor seat. Used to line up the same seat across days.
function seatsByStation(req) {
  const counts = {};
  const seats = new Map();
  (req.stationRequirements || []).forEach((sreq) => {
    for (let slotIndex = 0; slotIndex < seatCount(sreq); slotIndex += 1) {
      const pair = `${sreq.partId}__${sreq.stationId}`;
      const occurrence = counts[pair] || 0;
      counts[pair] = occurrence + 1;
      seats.set(`${pair}__${occurrence}`, { req, sreq, slotIndex, key: assignmentKey(req.id, sreq.id, slotIndex) });
    }
  });
  return seats;
}

// Copies one day's time blocks (and their seats) to other days, replacing
// the blocks and assignments those days had.
function copyDayRequirements(fromDay, toDays) {
  const source = getDayRequirements(fromDay);
  const targets = toDays.filter((day) => day !== fromDay);
  const removedIds = new Set(state.requirements.filter((req) => targets.includes(req.dayOfWeek)).map((req) => req.id));
  state.requirements = state.requirements.filter((req) => !removedIds.has(req.id));
  removeAssignmentsWhere((key) => removedIds.has(parseAssignmentKey(key).reqId));
  targets.forEach((day) => {
    source.forEach((req) => {
      state.requirements.push({
        ...req,
        id: uid('req'),
        dayOfWeek: day,
        stationRequirements: req.stationRequirements.map((sreq) => ({ ...sreq, id: uid('sreq') })),
      });
    });
  });
  return { blocks: source.length * targets.length, days: targets.length };
}

// Copies who works which seat on one day to the same seats (same time block
// and station) on other days. Empty source seats leave the target alone.
function copyDayAssignments(fromDay, toDays) {
  const sourceByPhase = new Map(getDayRequirements(fromDay).map((req) => [phaseKeyFromReq(req), seatsByStation(req)]));
  const changes = [];
  let unmatched = 0;
  toDays.filter((day) => day !== fromDay).forEach((day) => {
    const targetByPhase = new Map(getDayRequirements(day).map((req) => [phaseKeyFromReq(req), seatsByStation(req)]));
    sourceByPhase.forEach((sourceSeats, phase) => {
      const targetSeats = targetByPhase.get(phase);
      sourceSeats.forEach((seat, seatId) => {
        const employeeId = state.schedule[seat.key];
        if (!employeeId) return;
        const target = targetSeats?.get(seatId);
        if (!target) { unmatched += 1; return; }
        const before = state.schedule[target.key] || '';
        if (before === employeeId) return;
        state.schedule[target.key] = employeeId;
        changes.push({ key: target.key, before, after: employeeId });
      });
    });
  });
  const needsCheck = changes.filter(({ key, after }) => {
    const { reqId, stationReqId } = parseAssignmentKey(key);
    const employee = byId(state.employees, after);
    return !employee || getCandidateStatus(employee, getReqById(reqId), getStationReq(reqId, stationReqId), key).category !== 'fit';
  }).length;
  return { changes, unmatched, needsCheck };
}

function selectedCopyTargets(kind) {
  return [...document.querySelectorAll(`[data-copy-target="${kind}"]:checked`)].map((el) => el.value);
}

function renderCopyDayControls(kind, fromDay) {
  return `<div class="copy-day-row no-print">
    <span class="small-text">${t(`copy.${kind}Label`, { day: dayLabel(fromDay) })}</span>
    <div class="copy-day-targets">
      ${DAYS.filter((day) => day.key !== fromDay).map((day) => `<label class="copy-day-chip"><input type="checkbox" data-copy-target="${kind}" value="${day.key}" /> ${dayShort(day.key)}</label>`).join('')}
    </div>
    <button class="btn small secondary" type="button" data-action="copy-day-${kind}" data-day="${fromDay}">${t('copy.button')}</button>
  </div>`;
}

// Opens the roster on the issue's day with the recommendation panel (empty
// seat) or the replacement panel (seat with a problem assignment).
function openIssueInRoster(reqId, sreqId, slotIndex) {
  const req = getReqById(reqId);
  if (!req) return;
  activeTab = 'roster';
  scheduleView = 'sheet';
  selectedScheduleDay = req.dayOfWeek;
  recommendationContext = null;
  replacementContext = null;
  if (sreqId && Number.isInteger(slotIndex)) {
    const context = { reqId, sreqId, slotIndex };
    if (state.schedule[assignmentKey(reqId, sreqId, slotIndex)]) replacementContext = context;
    else recommendationContext = context;
  }
  render();
  document.querySelector('.recommend-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
