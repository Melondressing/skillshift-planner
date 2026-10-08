// Screen brightness is a per-device preference, kept outside the roster data so
// it survives a reset and is not part of backups. index.html applies it before
// first paint. The soft light theme is the default; 'auto' follows
// prefers-color-scheme.
const THEME_KEY = 'skillshift_theme';
const THEME_COLORS = { light: '#f7f5f1', dark: '#272e39' };

function currentTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' || value === 'auto' ? value : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme() {
  const theme = currentTheme();
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const auto = (meta.media || '').includes('dark') ? 'dark' : 'light';
    meta.content = THEME_COLORS[theme === 'auto' ? auto : theme];
  });
}

function setTheme(theme) {
  try {
    if (theme === 'dark' || theme === 'auto') localStorage.setItem(THEME_KEY, theme);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage can be blocked; the choice then lasts until the page reloads.
    document.documentElement.dataset.theme = theme;
  }
  applyTheme();
  render();
}

function setLanguage(lang) {
  state.settings.language = lang === 'en' ? 'en' : 'ko';
  saveState();
  render();
  toast(t('messages.languageSaved'));
}

function syncDocumentLanguage() {
  document.documentElement.lang = currentLanguage();
  document.title = `SkillShift Planner · ${t(findView(activeTab).labelKey)}`;
  const subtitle = document.getElementById('headerSubtitle');
  if (subtitle) subtitle.textContent = t('header.subtitle');
  renderSaveStatus();
}

let lastSavedAt = null;
function renderSaveStatus() {
  const el = document.getElementById('saveStatus');
  if (!el) return;
  el.textContent = lastSavedAt
    ? t('common.autoSavedAt', { time: lastSavedAt.toLocaleTimeString(currentLanguage(), { hour: '2-digit', minute: '2-digit' }) })
    : t('common.autoSaved');
}

let state = loadState();
let activeTab = 'summary';
let selectedSkillId = state.skills[0]?.id || '';
let scheduleView = 'sheet';
let selectedScheduleDay = 'monday';
let selectedRequirementDay = 'monday';
let selectedMemberPart = 'all';
let skillsAdvancedOpen = false;
let recommendationContext = null;
let replacementContext = null;
// The last bulk roster change (auto-fill or day copy), kept so it can be undone.
let lastBulkChange = null;

// Derived data (assignments, labor, recommendations, validation) shared by
// every panel in one render pass. It only exists while render() runs, so
// handlers that change state always compute fresh values.
let renderCache = null;
function cached(name, compute) {
  if (!renderCache) return compute();
  if (!renderCache.has(name)) renderCache.set(name, compute());
  return renderCache.get(name);
}

// Dates are local calendar days written as YYYY-MM-DD.
function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseIsoDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d);
}
function addDays(iso, days) {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}
function mondayOf(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return toIsoDate(monday);
}
function currentWeekStart() {
  return mondayOf(new Date());
}
function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
// The Monday of the week the current roster (state.schedule) belongs to.
function activeWeekStart() {
  return isIsoDate(state.weekStart) ? state.weekStart : currentWeekStart();
}
function shortDate(iso) {
  const date = parseIsoDate(iso);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
function dateForDay(dayKey) {
  return addDays(activeWeekStart(), Math.max(0, dayIndex(dayKey)));
}
function weekRangeLabel(weekStart = activeWeekStart()) {
  return `${shortDate(weekStart)}–${shortDate(addDays(weekStart, 6))}`;
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function defaultAvailability(start = '10:00', end = '22:00', weekdaysOnly = false) {
  return DAYS.reduce((acc, day) => {
    const isWeekend = day.key === 'saturday' || day.key === 'sunday';
    acc[day.key] = {
      available: weekdaysOnly ? !isWeekend : true,
      startTime: start,
      endTime: end,
    };
    return acc;
  }, {});
}

function createDefaultState() {
  const parts = [
    { id: 'part_kitchen', name: '주방', description: '조리와 마감이 이루어지는 파트', color: '#ef4444', sortOrder: 1, active: true },
    { id: 'part_hall', name: '홀', description: '고객 응대와 서빙이 이루어지는 파트', color: '#3b82f6', sortOrder: 2, active: true },
  ];

  const stations = [
    { id: 'st_prep', partId: 'part_kitchen', name: '준비', description: '재료 준비 / 미장', requiredSkillIds: ['sk_prep'], sortOrder: 1, active: true },
    { id: 'st_hot', partId: 'part_kitchen', name: '화구', description: '메인 조리', requiredSkillIds: ['sk_hot'], sortOrder: 2, active: true },
    { id: 'st_fry', partId: 'part_kitchen', name: '프라이', description: '튀김 / 소분', requiredSkillIds: ['sk_fry'], sortOrder: 3, active: true },
    { id: 'st_pass', partId: 'part_kitchen', name: '패스', description: '플레이트 / 출고', requiredSkillIds: ['sk_pass'], sortOrder: 4, active: true },
    { id: 'st_dish', partId: 'part_kitchen', name: '세척', description: '설거지 / 정리', requiredSkillIds: ['sk_dish'], sortOrder: 5, active: true },
    { id: 'st_floor', partId: 'part_hall', name: '플로어', description: '홀 서비스', requiredSkillIds: ['sk_floor'], sortOrder: 1, active: true },
    { id: 'st_cashier', partId: 'part_hall', name: '캐셔', description: '주문 / 계산', requiredSkillIds: ['sk_cashier'], sortOrder: 2, active: true },
    { id: 'st_runner', partId: 'part_hall', name: '러너', description: '서빙 보조', requiredSkillIds: ['sk_runner'], sortOrder: 3, active: true },
  ];

  const skills = [
    { id: 'sk_prep', name: '주방 준비', partId: 'part_kitchen', stationId: 'st_prep', category: 'Kitchen', description: '재료 준비와 미장 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_hot', name: '주방 화구', partId: 'part_kitchen', stationId: 'st_hot', category: 'Kitchen', description: '메인 화구 조리 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_fry', name: '주방 프라이', partId: 'part_kitchen', stationId: 'st_fry', category: 'Kitchen', description: '프라이와 튀김 작업 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_pass', name: '주방 패스', partId: 'part_kitchen', stationId: 'st_pass', category: 'Kitchen', description: '패스와 플레이트 출고 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_dish', name: '주방 세척', partId: 'part_kitchen', stationId: 'st_dish', category: 'Kitchen', description: '설거지와 마감 정리 가능', isCritical: false, usesLevelStep: true, active: true },
    { id: 'sk_floor', name: '홀 플로어', partId: 'part_hall', stationId: 'st_floor', category: 'Hall', description: '홀 서빙과 테이블 정리 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_cashier', name: '홀 캐셔', partId: 'part_hall', stationId: 'st_cashier', category: 'Hall', description: '주문 접수와 계산 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_runner', name: '홀 러너', partId: 'part_hall', stationId: 'st_runner', category: 'Hall', description: '서빙 보조와 전달 가능', isCritical: false, usesLevelStep: true, active: true },
  ];

  const levelTemplates = [];
  skills.forEach((skill) => {
    const base = [
      [1, 'Level 1', 1, 'Step 1', '기본 개념을 배우는 단계', '기본 보조 업무', '단독 업무와 피크타임 대응', false, false, true],
      [1, 'Level 1', 2, 'Step 2', '반복 업무와 기본 흐름을 일부 수행할 수 있는 단계', '간단한 반복 업무', '조리/응대 상태 최종 판단', false, false, true],
      [1, 'Level 1', 3, 'Step 3', '대부분의 흐름을 알고 몇 가지 확인을 통해 업무 가능', '일반 시간대 보조 및 일부 단독 업무', '피크타임 단독 업무', false, false, true],
      [1, 'Level 1', 4, 'Step 4', 'Level 2 직전 단계. 약간의 어시스트를 제외하면 대부분 수행 가능', '일반 시간대 주요 업무', '복잡한 피크타임 판단', false, false, false],
      [2, 'Level 2', 1, 'Step 1', '일반 시간대 단독 업무가 가능한 단계', '일반 운영', '고강도 피크타임 전체 통제', true, false, false],
      [2, 'Level 2', 2, 'Step 2', '일반 업무와 일부 피크타임 대응이 가능한 단계', '일반 운영과 일부 피크 대응', '리더 역할', true, true, false],
      [3, 'Level 3', 1, 'Step 1', '피크타임 핵심 업무가 가능한 단계', '피크타임 핵심 업무', '신입 교육과 전체 운영 판단', true, true, false],
      [4, 'Level 4', 1, 'Step 1', '리더와 교육 담당이 가능한 단계', '리더/트레이닝/문제 해결', '상위 관리 업무', true, true, false],
    ];
    base.forEach(([levelNumber, levelName, stepNumber, stepName, description, canDo, cannotDoYet, canWorkAlone, canWorkPeakTime, needsSupervisor], index) => {
      levelTemplates.push({
        id: `lvl_${skill.id}_${levelNumber}_${stepNumber}`,
        skillId: skill.id,
        levelNumber,
        levelName,
        stepNumber,
        stepName,
        description,
        canDo,
        cannotDoYet,
        canWorkAlone,
        canWorkPeakTime,
        needsSupervisor,
        allowedStations: [skill.stationId].filter(Boolean),
        nextPromotionCriteria: '운영자가 직접 승급 조건을 작성하세요.',
        sortOrder: index + 1,
      });
    });
  });

  const employees = [
    {
      id: 'emp_minjun', name: '민준', partId: 'part_kitchen', role: '주방 메인', employmentType: 'Full-time', baseRate: 31,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 40, preferredWeeklyHours: 38,
      availability: defaultAvailability('09:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_prep: { level: 2, step: 1, note: '' }, sk_hot: { level: 3, step: 1, note: '' }, sk_fry: { level: 2, step: 2, note: '' }, sk_pass: { level: 2, step: 1, note: '' }
      }
    },
    {
      id: 'emp_yuri', name: '유리', partId: 'part_kitchen', role: '주방 프렙', employmentType: 'Part-time', baseRate: 27,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 30, preferredWeeklyHours: 24,
      availability: defaultAvailability('09:00', '18:00'), active: true, notes: '', assignedSkills: {
        sk_prep: { level: 3, step: 1, note: '' }, sk_dish: { level: 3, step: 1, note: '' }, sk_hot: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_joon', name: '준', partId: 'part_kitchen', role: '주방 라인', employmentType: 'Casual', baseRate: 29,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 35, preferredWeeklyHours: 30,
      availability: defaultAvailability('10:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_hot: { level: 2, step: 2, note: '' }, sk_fry: { level: 3, step: 1, note: '' }, sk_pass: { level: 2, step: 2, note: '' }
      }
    },
    {
      id: 'emp_soo', name: '수', partId: 'part_kitchen', role: '주방 디시', employmentType: 'Part-time', baseRate: 26,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 28, preferredWeeklyHours: 22,
      availability: defaultAvailability('11:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_dish: { level: 3, step: 1, note: '' }, sk_prep: { level: 2, step: 1, note: '' }, sk_fry: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_haeun', name: '하은', partId: 'part_hall', role: '홀 플로어', employmentType: 'Casual', baseRate: 27,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 35, preferredWeeklyHours: 28,
      availability: defaultAvailability('10:00', '22:30'), active: true, notes: '', assignedSkills: {
        sk_floor: { level: 3, step: 1, note: '' }, sk_runner: { level: 2, step: 2, note: '' }, sk_cashier: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_jiho', name: '지호', partId: 'part_hall', role: '홀 캐셔', employmentType: 'Full-time', baseRate: 28,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 40, preferredWeeklyHours: 38,
      availability: defaultAvailability('10:00', '23:00'), active: true, notes: '', assignedSkills: {
        sk_cashier: { level: 3, step: 1, note: '' }, sk_floor: { level: 2, step: 2, note: '' }, sk_runner: { level: 2, step: 1, note: '' }
      }
    },
    {
      id: 'emp_sora', name: '소라', partId: 'part_hall', role: '홀 러너', employmentType: 'Part-time', baseRate: 26,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 32, preferredWeeklyHours: 26,
      availability: defaultAvailability('11:00', '22:30'), active: true, notes: '', assignedSkills: {
        sk_runner: { level: 3, step: 1, note: '' }, sk_floor: { level: 2, step: 2, note: '' }, sk_cashier: { level: 1, step: 4, note: '' }
      }
    },
  ];

  const requirements = [];
  DAYS.forEach((day) => {
    const slots = [
      { label: 'Opening', startTime: '09:00', endTime: '10:30', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 1, 3]] },
      { label: 'Lunch Prep', startTime: '10:30', endTime: '11:30', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_kitchen', 'st_hot', 'sk_hot', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3]] },
      { label: 'Lunch Peak', startTime: '11:30', endTime: '14:30', isPeak: true, reqs: [['part_kitchen', 'st_hot', 'sk_hot', 1, 2, 1], ['part_kitchen', 'st_fry', 'sk_fry', 1, 2, 1], ['part_kitchen', 'st_pass', 'sk_pass', 1, 2, 1], ['part_hall', 'st_floor', 'sk_floor', 2, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 2, 1], ['part_hall', 'st_runner', 'sk_runner', 1, 1, 3]] },
      { label: 'Afternoon', startTime: '14:30', endTime: '17:00', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3]] },
      { label: 'Dinner Peak', startTime: '17:00', endTime: '20:30', isPeak: true, reqs: [['part_kitchen', 'st_hot', 'sk_hot', 1, 2, 1], ['part_kitchen', 'st_fry', 'sk_fry', 1, 2, 1], ['part_kitchen', 'st_pass', 'sk_pass', 1, 2, 1], ['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 2, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 2, 1], ['part_hall', 'st_runner', 'sk_runner', 1, 1, 3]] },
      { label: 'Closing', startTime: '20:30', endTime: '22:00', isPeak: false, reqs: [['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 1, 3]] },
    ];
    slots.forEach((slot, index) => {
      requirements.push({
        id: `req_${day.key}_${index}`,
        dayOfWeek: day.key,
        startTime: slot.startTime,
        endTime: slot.endTime,
        label: slot.label,
        minTotalStaff: slot.reqs.reduce((sum, req) => sum + req[3], 0),
        recommendedTotalStaff: slot.reqs.reduce((sum, req) => sum + req[3], 0),
        isPeak: slot.isPeak,
        needsHandover: false,
        handoverMinutes: 0,
        notes: '',
        stationRequirements: slot.reqs.flatMap(([partId, stationId, requiredSkillId, requiredCount, minLevel, minStep], idx) =>
          Array.from({ length: requiredCount }, (_, seatIdx) => ({
            id: `sreq_${day.key}_${index}_${idx}_${seatIdx}`,
            partId,
            stationId,
            requiredCount: 1,
            requiredSkillId,
            minLevel,
            minStep,
            needsLeader: stationId === 'st_leader',
            canUseLowerStepAsEmergency: true,
          }))
        ),
      });
    });
  });

  return {
    appVersion: APP_STATE_VERSION,
    settings: {
      language: 'ko',
      companyName: '',
      employeePortalEnabled: true,
      laborBudget: 4000,
      autoFillWithinBudget: true,
      targetLaborRatio: 28,
      currency: '$',
      weekLabel: '주방/홀 기본 스케줄',
      feedbackEmail: 'kitchenworklog@gmail.com',
      feedbackUrl: '',
    },
    parts,
    stations,
    skills,
    levelTemplates,
    employees,
    requirements,
    weekStart: '',
    schedule: {},
    savedWeeks: {},
    trainingRecords: [],
    promotionChecklists: [],
    attendanceRecords: [],
    scheduleDrafts: [],
    invitations: [],
    portalRequests: [],
  };
}

function createBlankState(settings = createDefaultState().settings) {
  return {
    appVersion: APP_STATE_VERSION,
    settings: {
      ...settings,
      companyName: String(settings.companyName || '').trim(),
      feedbackEmail: 'kitchenworklog@gmail.com',
      feedbackUrl: '',
    },
    parts: [],
    stations: [],
    skills: [],
    levelTemplates: [],
    employees: [],
    requirements: [],
    weekStart: currentWeekStart(),
    schedule: {},
    savedWeeks: {},
    trainingRecords: [],
    promotionChecklists: [],
    attendanceRecords: [],
    scheduleDrafts: [],
    invitations: [],
    portalRequests: [],
  };
}

function mergeState(parsed = {}) {
  const defaults = createDefaultState();
  const asArray = (value) => (Array.isArray(value) ? value : []);
  const listOr = (value, fallback) => (Array.isArray(value) ? value : fallback);
  const asObject = (value, fallback) => (value && typeof value === 'object' && !Array.isArray(value) ? value : fallback);
  const settings = {
    ...defaults.settings,
    ...asObject(parsed.settings, {}),
  };
  settings.companyName = String(settings.companyName || '').trim();
  settings.employeePortalEnabled = Boolean(settings.employeePortalEnabled);
  settings.feedbackEmail = 'kitchenworklog@gmail.com';
  settings.feedbackUrl = '';
  return {
    ...defaults,
    ...parsed,
    appVersion: Math.max(Number(parsed.appVersion || 0), defaults.appVersion),
    settings,
    parts: listOr(parsed.parts, defaults.parts),
    stations: listOr(parsed.stations, defaults.stations),
    skills: listOr(parsed.skills, defaults.skills),
    levelTemplates: listOr(parsed.levelTemplates, defaults.levelTemplates),
    employees: listOr(parsed.employees, defaults.employees),
    requirements: listOr(parsed.requirements, defaults.requirements).map((req) => ({
      ...req,
      stationRequirements: asArray(req?.stationRequirements),
    })),
    weekStart: isIsoDate(parsed.weekStart) ? parsed.weekStart : currentWeekStart(),
    schedule: asObject(parsed.schedule, {}),
    savedWeeks: Object.fromEntries(Object.entries(asObject(parsed.savedWeeks, {}))
      .filter(([week, schedule]) => isIsoDate(week) && schedule && typeof schedule === 'object')),
    trainingRecords: asArray(parsed.trainingRecords),
    promotionChecklists: asArray(parsed.promotionChecklists),
    attendanceRecords: asArray(parsed.attendanceRecords),
    scheduleDrafts: asArray(parsed.scheduleDrafts),
    invitations: asArray(parsed.invitations),
    portalRequests: asArray(parsed.portalRequests),
  };
}

function clearStoredState() {
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORE_PREFIX)) localStorage.removeItem(key);
  }
}

function migrateState(saved = {}) {
  const from = Number(saved?.appVersion || 0);
  const upgraded = STATE_MIGRATIONS
    .filter((step) => step.version > from && step.version <= APP_STATE_VERSION)
    .reduce((acc, step) => ({ ...step.migrate(acc), appVersion: step.version }), saved);
  return mergeState(upgraded);
}

// Data saved by builds that used an older storage key (e.g. skillshift_planner_v13).
function findLegacyStoredState() {
  let best = null;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const match = key && key !== STORE_KEY && key.startsWith(STORE_PREFIX) && key.slice(STORE_PREFIX.length).match(/^v(\d+)$/);
    if (match && (!best || Number(match[1]) > best.n)) best = { key, n: Number(match[1]) };
  }
  return best ? localStorage.getItem(best.key) : null;
}

function makeFreshState() {
  const fresh = mergeState(createDefaultState());
  localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
  return fresh;
}

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORE_KEY) ?? findLegacyStoredState();
    if (!raw) return makeFreshState();
    const migrated = migrateState(JSON.parse(raw));
    localStorage.setItem(STORE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch (err) {
    console.error(err);
    // Keep unreadable data around instead of silently discarding it.
    if (raw) localStorage.setItem(`${STORE_KEY}_unreadable`, raw);
    return makeFreshState();
  }
}

// Every change is saved right away; the header shows when it last happened.
function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  lastSavedAt = new Date();
  renderSaveStatus();
}

function resetState() {
  if (!confirm(t('messages.resetConfirm'))) return;
  const preservedSettings = { ...state.settings };
  clearStoredState();
  state = createBlankState(preservedSettings);
  selectedSkillId = state.skills[0]?.id || '';
  selectedMemberPart = 'all';
  selectedScheduleDay = 'monday';
  selectedRequirementDay = 'monday';
  scheduleView = 'sheet';
  recommendationContext = null;
  replacementContext = null;
  lastBulkChange = null;
  saveState();
  render();
  toast(t('messages.resetDone'));
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 1600);
}
