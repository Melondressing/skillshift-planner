function handleClick(e) {
  const target = e.target.closest('[data-action], [data-tab]');
  if (!target) return;
  const tab = target.dataset.tab;
  if (tab) {
    showView(tab);
    return;
  }
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'add-part') addPart();
  if (action === 'delete-part') deletePart(target.dataset.id);
  if (action === 'add-station') addStation();
  if (action === 'delete-station') deleteStation(target.dataset.id);
  if (action === 'add-skill') addSkill();
  if (action === 'toggle-advanced-skills') { skillsAdvancedOpen = !skillsAdvancedOpen; render(); }
  if (action === 'select-skill') { selectedSkillId = target.dataset.id; render(); }
  if (action === 'delete-skill') deleteSkill(target.dataset.id);
  if (action === 'add-level') addLevel(target.dataset.skill);
  if (action === 'delete-level') deleteLevel(target.dataset.id);
  if (action === 'add-employee') addEmployee();
  if (action === 'delete-employee') deleteEmployee(target.dataset.id);
  if (action === 'toggle-employee') toggleEmployee(target.dataset.id);
  if (action === 'add-requirement') addRequirement();
  if (action === 'delete-requirement') deleteRequirement(target.dataset.id);
  if (action === 'add-station-req') addStationRequirement(target.dataset.id);
  if (action === 'delete-station-req') deleteStationRequirement(target.dataset.req, target.dataset.id);
  if (action === 'clone-station-req') cloneStationRequirement(target.dataset.req, target.dataset.id);
  if (action === 'schedule-view') { scheduleView = target.dataset.view; render(); }
  if (action === 'schedule-day') { selectedScheduleDay = target.dataset.day; recommendationContext = null; replacementContext = null; render(); }
  if (action === 'req-day') { selectedRequirementDay = target.dataset.day; render(); }
  if (action === 'export-roster-csv') exportRosterCsv();
  if (action === 'print-confirmed-roster') window.print();
  if (action === 'show-recommend') { recommendationContext = { reqId: target.dataset.req, sreqId: target.dataset.sreq, slotIndex: Number(target.dataset.slot) }; replacementContext = null; render(); }
  if (action === 'show-replace') { replacementContext = { reqId: target.dataset.req, sreqId: target.dataset.sreq, slotIndex: Number(target.dataset.slot) }; recommendationContext = null; render(); }
  if (action === 'close-panels') { recommendationContext = null; replacementContext = null; render(); }
  if (action === 'apply-recommend') { state.schedule[target.dataset.key] = target.dataset.emp; saveState(); recommendationContext = null; replacementContext = null; render(); toast(t('messages.scheduled')); }
  if (action === 'reset-all') resetState();
  if (action === 'load-sample') loadSampleData();
  if (action === 'export-json') exportJson();
  if (action === 'fix-issue') openIssueInRoster(target.dataset.req, target.dataset.sreq, target.dataset.slot === '' ? NaN : Number(target.dataset.slot));
  if (action === 'auto-fill') {
    const result = autoFillEmptySeats();
    if (!result.filled.length && !result.skipped && !result.overBudget) { toast(t('schedule.autoFillNothing')); return; }
    lastBulkChange = {
      textKey: result.overBudget ? 'schedule.autoFillResultBudget' : 'schedule.autoFillResult',
      vars: { filled: result.filled.length, skipped: result.skipped, overBudget: result.overBudget },
      changes: result.filled.map(({ key, employeeId }) => ({ key, before: '', after: employeeId })),
    };
    saveState();
    render();
    document.querySelector('.autofill-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (action === 'week-shift') { switchWeek(addDays(activeWeekStart(), num(target.dataset.days))); saveState(); render(); }
  if (action === 'week-today') { switchWeek(currentWeekStart()); saveState(); render(); }
  if (action === 'copy-previous-week') {
    const changes = copyPreviousWeek();
    lastBulkChange = { textKey: 'week.copiedPrevious', vars: { copied: changes.length }, changes };
    saveState();
    render();
  }
  if (action === 'auto-fill-keep') { lastBulkChange = null; render(); }
  if (action === 'auto-fill-undo' && lastBulkChange) { undoScheduleChanges(lastBulkChange.changes); lastBulkChange = null; saveState(); render(); toast(t('schedule.autoFillUndone')); }
  if (action === 'copy-day-assignments') {
    const targets = selectedCopyTargets('assignments');
    if (!targets.length) { toast(t('copy.pickDays')); return; }
    const result = copyDayAssignments(target.dataset.day, targets);
    if (!result.changes.length && !result.unmatched) { toast(t('copy.nothing')); return; }
    lastBulkChange = { textKey: 'copy.assignmentsResult', vars: { copied: result.changes.length, check: result.needsCheck, unmatched: result.unmatched }, changes: result.changes };
    saveState();
    render();
    document.querySelector('.autofill-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (action === 'copy-day-requirements') {
    const targets = selectedCopyTargets('requirements');
    if (!targets.length) { toast(t('copy.pickDays')); return; }
    const overwrites = state.requirements.some((req) => targets.includes(req.dayOfWeek));
    if (overwrites && !confirm(t('copy.requirementsConfirm', { days: targets.map(dayShort).join(', ') }))) return;
    const result = copyDayRequirements(target.dataset.day, targets);
    saveState();
    render();
    toast(t('copy.requirementsDone', result));
  }
  if (action === 'copy-company-code') { copyToClipboard(deriveCompanyCode(state.settings.companyName)); }
  if (action === 'copy-feedback-email') { copyToClipboard(state.settings.feedbackEmail || ''); }
  if (action === 'copy-feedback-link') { copyToClipboard(normalizeExternalUrl(state.settings.feedbackUrl) || ''); }
}

function handleChange(e) {
  const el = e.target;
  const action = el.dataset.action;
  if (el.dataset.setting) {
    if (el.dataset.setting === 'language') {
      setLanguage(el.value);
      return;
    }
    if (el.dataset.setting === 'theme') {
      setTheme(el.value);
      return;
    }
    if (el.type === 'checkbox' || el.dataset.settingType === 'boolean') {
      state.settings[el.dataset.setting] = el.checked;
      saveState();
      render();
      return;
    }
    if (el.type === 'number' || el.dataset.settingType === 'number') {
      state.settings[el.dataset.setting] = num(el.value);
    } else {
      state.settings[el.dataset.setting] = el.value;
    }
    saveState();
    render();
    return;
  }
  if (action === 'import-json') {
    importJson(el.files[0]);
    el.value = '';
    return;
  }
  if (action === 'member-part-filter') {
    selectedMemberPart = el.value || 'all';
    render();
    return;
  }
  if (action === 'new-skill-part') {
    refreshNewSkillStationControl();
    return;
  }
  if (action === 'member-skill-level') {
    setEmployeeSkillLevel(el.dataset.emp, el.dataset.skill, el.value);
    saveState();
    render();
    return;
  }
  if (action === 'req-part-select') {
    refreshRequirementStationControl(el.dataset.req);
    return;
  }
  if (action === 'assign-schedule') {
    if (el.value) state.schedule[el.dataset.key] = el.value;
    else delete state.schedule[el.dataset.key];
    saveState();
    render();
    return;
  }
  if (action?.startsWith('availability')) {
    const emp = byId(state.employees, el.dataset.emp);
    if (!emp) return;
    emp.availability = emp.availability || defaultAvailability();
    emp.availability[el.dataset.day] = emp.availability[el.dataset.day] || { available: false, startTime: '10:00', endTime: '22:00' };
    if (action === 'availability-check') emp.availability[el.dataset.day].available = el.checked;
    if (action === 'availability-start') emp.availability[el.dataset.day].startTime = el.value;
    if (action === 'availability-end') emp.availability[el.dataset.day].endTime = el.value;
    saveState();
    render();
  }
}

function addPart() {
  const name = document.getElementById('newPartName').value.trim();
  if (!name) return toast(t('messages.partNameRequired'));
  state.parts.push({ id: uid('part'), name, description: document.getElementById('newPartDesc').value.trim(), color: document.getElementById('newPartColor').value, sortOrder: state.parts.length + 1, active: true });
  saveState(); render(); toast(t('messages.partAdded'));
}
function deletePart(id) {
  if (!confirm(t('messages.partDeleteConfirm'))) return;
  state.parts = state.parts.filter((p) => p.id !== id);
  if (selectedMemberPart === id) selectedMemberPart = 'all';
  saveState(); render();
}
function addStation() {
  const name = document.getElementById('newStationName').value.trim();
  if (!name) return toast(t('messages.stationNameRequired'));
  const partId = document.getElementById('newStationPart').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  const station = { id: uid('st'), partId, name, description: document.getElementById('newStationDesc').value.trim(), requiredSkillIds: [], sortOrder: state.stations.length + 1, active: true };
  state.stations.push(station);
  createSkillForStation(station, `${partName(partId)} ${name}`);
  saveState(); render(); toast(t('messages.stationAdded'));
}
function deleteStation(id) {
  if (!confirm(t('messages.stationDeleteConfirm'))) return;
  state.stations = state.stations.filter((s) => s.id !== id);
  saveState(); render();
}
function makeLevelTemplate(skillId, stationId, levelNumber, stepNumber, description, sortOrder) {
  return {
    id: uid('lvl'),
    skillId,
    levelNumber,
    levelName: `Level ${levelNumber}`,
    stepNumber,
    stepName: `Step ${stepNumber}`,
    description,
    canDo: '',
    cannotDoYet: '',
    canWorkAlone: levelNumber >= 2,
    canWorkPeakTime: levelNumber >= 3,
    needsSupervisor: levelNumber < 2,
    allowedStations: [stationId].filter(Boolean),
    nextPromotionCriteria: '',
    sortOrder,
  };
}
function createStarterLevelsForSkill(skillId, stationId = '') {
  const base = [
    [1, 1, '기본 개념을 배우는 단계'],
    [1, 2, '반복 업무와 기본 흐름을 일부 수행할 수 있는 단계'],
    [1, 3, '대부분의 흐름을 알고 몇 가지 확인을 통해 업무 가능'],
    [1, 4, 'Level 2 직전 단계. 약간의 어시스트를 제외하면 대부분 수행 가능'],
    [2, 1, '일반 시간대 단독 업무가 가능한 단계'],
    [3, 1, '피크타임 핵심 업무가 가능한 단계'],
    [4, 1, '리더와 교육 담당이 가능한 단계'],
  ];
  return base.map(([levelNumber, stepNumber, description], index) =>
    makeLevelTemplate(skillId, stationId, levelNumber, stepNumber, description, state.levelTemplates.length + index + 1));
}

// Every station gets a skill with starter Level/Step steps, so staff can be
// marked as able to work a station without setting up skills separately.
function createSkillForStation(station, name) {
  const id = uid('sk');
  state.skills.push({ id, name, partId: station.partId, stationId: station.id, category: partName(station.partId), description: '', isCritical: true, usesLevelStep: true, active: true });
  state.levelTemplates.push(...createStarterLevelsForSkill(id, station.id));
  station.requiredSkillIds = Array.from(new Set([...(station.requiredSkillIds || []), id]));
  return id;
}

function addSkill() {
  const name = document.getElementById('newSkillName').value.trim();
  if (!name) return toast(t('messages.skillNameRequired'));
  const partId = document.getElementById('newSkillPart').value;
  const stationId = document.getElementById('newSkillStation').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  if (!stationId) return toast(t('messages.stationSelectRequired'));
  const station = byId(state.stations, stationId);
  if (!station) return toast(t('messages.stationSelectRequired'));
  selectedSkillId = createSkillForStation(station, name);
  saveState(); render(); toast(t('messages.skillAdded'));
}
function deleteSkill(id) {
  if (!confirm(t('messages.skillDeleteConfirm'))) return;
  state.skills = state.skills.filter((s) => s.id !== id);
  state.levelTemplates = state.levelTemplates.filter((l) => l.skillId !== id);
  state.employees.forEach((emp) => { if (emp.assignedSkills) delete emp.assignedSkills[id]; });
  selectedSkillId = state.skills[0]?.id || '';
  saveState(); render();
}
function addLevel(skillId = '') {
  const targetSkillId = skillId || selectedSkillId;
  if (!targetSkillId) return;
  const field = (name) => document.querySelector(`[data-level-skill="${targetSkillId}"][data-level-field="${name}"]`)?.value;
  const levelNumber = num(field('level'), 1);
  const stepNumber = num(field('step'), 1);
  const description = (field('desc') || '').trim() || '운영자가 설명을 작성하세요.';
  const skill = byId(state.skills, targetSkillId);
  const exists = state.levelTemplates.some((tpl) => tpl.skillId === targetSkillId && Number(tpl.levelNumber) === levelNumber && Number(tpl.stepNumber) === stepNumber);
  if (exists && !confirm(t('messages.levelExistsConfirm'))) return;
  state.levelTemplates.push(makeLevelTemplate(targetSkillId, skill?.stationId, levelNumber, stepNumber, description, state.levelTemplates.length + 1));
  saveState(); render(); toast(t('messages.levelAdded'));
}
function deleteLevel(id) {
  state.levelTemplates = state.levelTemplates.filter((l) => l.id !== id);
  saveState(); render();
}
function addEmployee() {
  const name = document.getElementById('newEmpName').value.trim();
  if (!name) return toast(t('messages.employeeNameRequired'));
  const partId = document.getElementById('newEmpPart').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  state.employees.push({
    id: uid('emp'), name, partId, role: document.getElementById('newEmpRole').value.trim() || 'Staff', employmentType: 'Casual', baseRate: num(document.getElementById('newEmpRate').value, 28),
    saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: num(document.getElementById('newEmpMax').value, 38), preferredWeeklyHours: 0,
    availability: defaultAvailability('10:00', '22:00'), active: true, notes: '', assignedSkills: {}
  });
  saveState(); render(); toast(t('messages.employeeAdded'));
}
function deleteEmployee(id) {
  if (!confirm(t('messages.employeeDeleteConfirm'))) return;
  state.employees = state.employees.filter((emp) => emp.id !== id);
  removeAssignmentsWhere((key, employeeId) => employeeId === id);
  saveState(); render();
}
function toggleEmployee(id) {
  const emp = byId(state.employees, id);
  if (!emp) return;
  emp.active = !emp.active;
  saveState(); render();
}
function refreshNewSkillStationControl() {
  const partSelect = document.getElementById('newSkillPart');
  const stationSelect = document.getElementById('newSkillStation');
  if (!partSelect || !stationSelect) return;
  stationSelect.innerHTML = stationOptions('', partSelect.value, true);
}
function refreshRequirementStationControl(reqId) {
  const partSelect = document.querySelector(`[data-req-field="part"][data-req="${reqId}"]`);
  const stationSelect = document.querySelector(`[data-req-field="station"][data-req="${reqId}"]`);
  if (!partSelect || !stationSelect) return;
  stationSelect.innerHTML = stationOptions('', partSelect.value, true);
}
function addRequirement() {
  const label = document.getElementById('newReqLabel').value.trim() || 'New Block';
  const dayOfWeek = document.getElementById('newReqDay').value;
  selectedRequirementDay = dayOfWeek;
  state.requirements.push({ id: uid('req'), dayOfWeek, startTime: document.getElementById('newReqStart').value, endTime: document.getElementById('newReqEnd').value, label, minTotalStaff: 0, recommendedTotalStaff: 0, isPeak: document.getElementById('newReqPeak').value === 'true', needsHandover: false, handoverMinutes: 0, notes: '', stationRequirements: [] });
  saveState(); render(); toast(t('messages.requirementAdded'));
}
function deleteRequirement(id) {
  if (!confirm(t('messages.requirementDeleteConfirm'))) return;
  state.requirements = state.requirements.filter((req) => req.id !== id);
  removeAssignmentsWhere((key) => parseAssignmentKey(key).reqId === id);
  saveState(); render();
}
function addStationRequirement(reqId) {
  const req = getReqById(reqId);
  if (!req) return;
  const selectedPart = document.querySelector(`[data-req-field="part"][data-req="${reqId}"]`).value;
  const station = document.querySelector(`[data-req-field="station"][data-req="${reqId}"]`).value;
  if (!station) return toast(t('messages.stationSelectRequired'));
  const part = byId(state.stations, station)?.partId || selectedPart;
  const level = num(document.querySelector(`[data-req-field="level"][data-req="${reqId}"]`).value, 1);
  const step = num(document.querySelector(`[data-req-field="step"][data-req="${reqId}"]`).value, 1);
  const skill = getRequiredSkillId({ stationId: station }) || '';
  req.stationRequirements.push({ id: uid('sreq'), partId: part, stationId: station, requiredSkillId: skill, requiredCount: 1, minLevel: level, minStep: step, needsLeader: false, canUseLowerStepAsEmergency: true });
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  saveState(); render(); toast(t('messages.stationReqAdded'));
}

function cloneStationRequirement(reqId, sreqId) {
  const req = getReqById(reqId);
  const source = req?.stationRequirements.find((r) => r.id === sreqId);
  if (!req || !source) return;
  req.stationRequirements.push({ ...source, id: uid('sreq'), requiredCount: 1 });
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  saveState(); render(); toast(t('messages.stationReqCloned'));
}

function deleteStationRequirement(reqId, sreqId) {
  const req = getReqById(reqId);
  if (!req) return;
  req.stationRequirements = req.stationRequirements.filter((r) => r.id !== sreqId);
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  removeAssignmentsWhere((key) => { const parsed = parseAssignmentKey(key); return parsed.reqId === reqId && parsed.stationReqId === sreqId; });
  saveState(); render();
}

function exportRosterCsv() {
  const rows = [['Date','Day','Time','Block','Part','Station','Required Skill','Min Level','Min Step','Employee','Status']];
  getRequirementSeatRows().forEach(({ req, sreq, key }) => {
    const status = getAssignmentStatus(req, sreq, key);
    rows.push([
      dateForDay(req.dayOfWeek),
      dayLabel(req.dayOfWeek),
      `${req.startTime}-${req.endTime}`,
      req.label,
      partName(sreq.partId),
      stationName(sreq.stationId),
      requiredSkillName(sreq),
      `Level ${sreq.minLevel}`,
      `Step ${sreq.minStep}`,
      state.schedule[key] ? employeeName(state.schedule[key]) : '',
      status.label,
    ]);
  });
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skillshift-roster-${activeWeekStart()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skillshift-planner-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = migrateState(parsed);
      saveState();
      render();
      toast(t('messages.jsonImported'));
    } catch (err) {
      alert(t('messages.invalidJson'));
    }
  };
  reader.readAsText(file);
}
