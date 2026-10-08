const PANEL_RENDERERS = {
  dashboard: () => renderDashboard(),
  parts: () => renderParts(),
  skills: () => renderSkills(),
  members: () => renderMembers(),
  requirements: () => renderRequirements(),
  schedule: () => renderSchedule(),
  labor: () => renderLabor(),
  validation: () => renderValidation(),
  settings: () => renderSettings(),
  roadmap: () => renderRoadmap(),
};

// Draws only the panels of the current view; hidden panels are emptied so
// no stale inputs linger in the page.
function render() {
  renderCache = new Map();
  try {
    syncDocumentLanguage();
    applyTheme();
    renderTabs();
    const visible = findView(activeTab).panels;
    Object.entries(PANEL_RENDERERS).forEach(([id, draw]) => {
      if (visible.includes(id)) draw();
      else document.getElementById(id).innerHTML = '';
    });
  } finally {
    renderCache = null;
  }
}

function showView(id) {
  activeTab = findView(id).id;
  render();
}

function findView(id) {
  return [...STEPS, ...EXTRA_VIEWS].find((view) => view.id === id) || STEPS[STEPS.length - 1];
}

function renderTabs() {
  const tabs = document.getElementById('tabs');
  const isSettings = activeTab === 'settings' || activeTab === 'roadmap';
  tabs.innerHTML = `${STEPS.map((step, i) => `<button class="tab-btn ${activeTab === step.id ? 'active' : ''}" data-tab="${step.id}"${activeTab === step.id ? ' aria-current="page"' : ''}><span class="step-num" aria-hidden="true">${i + 1}</span>${t(step.labelKey)}</button>`).join('')}
    <button class="tab-btn gear ${isSettings ? 'active' : ''}" data-tab="settings" title="${t('steps.settings')}" aria-label="${t('steps.settings')}">⚙</button>`;
  const panels = findView(activeTab).panels;
  document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panels.includes(panel.id)));
}

function metricCard(label, value, sub = '', status = '') {
  return `<div class="card metric ${status}"><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div>`;
}

function renderDashboard() {
  const el = document.getElementById('dashboard');
  const totalHours = state.employees.reduce((sum, emp) => sum + employeeWeeklyHours(emp.id), 0);
  const { cost, budget, ratio, neededSales, status, budgetNote } = laborSummary();
  const budgetStatus = status || 'ok';
  const issues = calculateValidation();
  const highIssues = issues.filter((i) => i.severity === 'high').length;
  const missing = issues.filter((i) => i.kind === 'unassigned').length;
  const skillIssues = issues.filter((i) => i.kind === 'skillShort' || i.kind === 'skillCaution').length;
  const replacementIssues = issues.filter((i) => i.kind === 'noReplacement').length;
  const assignedSlots = getAssignments().length;
  const totalSlots = getRequirementSeatRows().length;
  const completion = totalSlots ? (assignedSlots / totalSlots) * 100 : 0;

  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('steps.summary')}</h2>
        <p>${t('dashboard.subtitle')}</p>
      </div>
      <div class="inline-actions">
        <label class="small-text">${t('dashboard.budgetEdit')} <input type="number" value="${state.settings.laborBudget}" data-setting="laborBudget" /></label>
        <label class="small-text">${t('dashboard.ratioEdit')} <input type="number" value="${state.settings.targetLaborRatio}" data-setting="targetLaborRatio" /></label>
      </div>
    </div>
    ${renderGettingStarted()}
    <div class="grid four">
      ${metricCard(t('dashboard.assignedHours'), `${totalHours.toFixed(1)}h`, t('dashboard.currentSchedule'))}
      ${metricCard(t('dashboard.totalCost'), money(cost), t('dashboard.budgetTarget', { amount: money(budget) }), budgetStatus)}
      ${metricCard(t('dashboard.ratio'), `${ratio.toFixed(1)}%`, ratio > 100 ? t('dashboard.goalExceeded') : t('dashboard.goalMet'), budgetStatus)}
      ${metricCard(t('dashboard.neededSales'), money(neededSales), t('dashboard.budgetRatioBase', { ratio: state.settings.targetLaborRatio }))}
      ${metricCard(t('dashboard.completion'), `${completion.toFixed(1)}%`, t('dashboard.slotsAssigned', { assigned: assignedSlots, total: totalSlots }))}
      ${metricCard(t('dashboard.highRisk'), highIssues, t('dashboard.immediateReview'), highIssues ? 'danger' : 'ok')}
      ${metricCard(t('dashboard.unassigned'), missing, t('dashboard.stationSlotBase'), missing ? 'warn' : 'ok')}
      ${metricCard(t('dashboard.skillReplacement'), `${skillIssues}/${replacementIssues}`, t('dashboard.skillReplacementHint'))}
    </div>
    <div class="card" style="margin-top:14px;">
      <h3>${t('dashboard.budgetProgress')}</h3>
      <div class="progress ${budgetStatus}"><div style="width:${Math.min(ratio, 120)}%"></div></div>
      <p class="small-text">${budgetNote}</p>
    </div>
  `;
}

// The four things a new store has to do, in order, and whether each is done.
function getSetupProgress() {
  return [
    { key: 'stations', view: 'setup', done: state.parts.length > 0 && state.stations.length > 0 },
    { key: 'staff', view: 'members', done: state.employees.some((emp) => Object.keys(emp.assignedSkills || {}).length) },
    { key: 'requirements', view: 'roster', done: state.requirements.some((req) => req.stationRequirements?.length) },
    { key: 'assign', view: 'roster', done: getAssignments().length > 0 },
  ];
}

function isEmptyStore() {
  return !state.parts.length && !state.stations.length && !state.employees.length && !state.requirements.length;
}

function renderGettingStarted() {
  const steps = getSetupProgress();
  if (steps.every((step) => step.done)) return '';
  const next = steps.find((step) => !step.done);
  return `<div class="card getting-started">
    <h3>${t('start.title')}</h3>
    <ol class="start-steps">
      ${steps.map((step) => `<li class="${step.done ? 'done' : ''} ${step === next ? 'next' : ''}">
        <span class="start-check" aria-hidden="true">${step.done ? '✓' : ''}</span>
        <span><strong>${t(`start.${step.key}`)}</strong><br><span class="small-text">${t(`start.${step.key}Help`)}</span></span>
        ${step.done ? `<span class="badge ok">${t('start.doneLabel')}</span>` : `<button class="btn small ${step === next ? '' : 'secondary'}" type="button" data-tab="${step.view}">${t('start.go')}</button>`}
      </li>`).join('')}
    </ol>
    ${isEmptyStore() ? `<div class="inline-actions"><button class="btn secondary" type="button" data-action="load-sample">${t('start.sample')}</button><span class="small-text">${t('start.sampleHelp')}</span></div>` : ''}
  </div>`;
}

// Fills an empty store with the built-in example roster, keeping settings.
function loadSampleData() {
  if (!isEmptyStore()) return;
  state = { ...createDefaultState(), settings: { ...state.settings } };
  selectedSkillId = state.skills[0]?.id || '';
  saveState();
  render();
}

function issueBadge(issue) {
  const cls = issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warn' : 'info';
  return `<span class="badge ${cls}">${escapeHtml(issue.type)} · ${escapeHtml(issue.message)}</span>`;
}
