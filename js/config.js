const STORE_KEY = 'skillshift_planner_v14';
const STORE_PREFIX = 'skillshift_planner_';
const APP_STATE_VERSION = 5;

// Each step upgrades saved data to `version`. Steps run in order for anything
// older, so add a new entry (instead of resetting) whenever the shape changes.
const STATE_MIGRATIONS = [
  // v1–v3 → v4: same data shape; only the built-in sample roster changed.
  { version: 4, migrate: (saved) => saved },
  // v5: the roster belongs to a dated week; older rosters become this week's.
  { version: 5, migrate: (saved) => ({ ...saved, weekStart: saved.weekStart || currentWeekStart(), savedWeeks: saved.savedWeeks || {} }) },
];

const DAYS = [
  { key: 'monday', ko: { label: '월요일', short: '월' }, en: { label: 'Monday', short: 'Mon' } },
  { key: 'tuesday', ko: { label: '화요일', short: '화' }, en: { label: 'Tuesday', short: 'Tue' } },
  { key: 'wednesday', ko: { label: '수요일', short: '수' }, en: { label: 'Wednesday', short: 'Wed' } },
  { key: 'thursday', ko: { label: '목요일', short: '목' }, en: { label: 'Thursday', short: 'Thu' } },
  { key: 'friday', ko: { label: '금요일', short: '금' }, en: { label: 'Friday', short: 'Fri' } },
  { key: 'saturday', ko: { label: '토요일', short: '토' }, en: { label: 'Saturday', short: 'Sat' } },
  { key: 'sunday', ko: { label: '일요일', short: '일' }, en: { label: 'Sunday', short: 'Sun' } },
];

// The four steps of building a roster. Each step shows one or more panels
// stacked; settings (gear) and the roadmap are reachable but not numbered.
const STEPS = [
  { id: 'setup', labelKey: 'steps.setup', panels: ['parts', 'skills'] },
  { id: 'members', labelKey: 'steps.members', panels: ['members'] },
  { id: 'roster', labelKey: 'steps.roster', panels: ['requirements', 'schedule'] },
  { id: 'summary', labelKey: 'steps.summary', panels: ['dashboard', 'labor', 'validation'] },
];
const EXTRA_VIEWS = [
  { id: 'settings', labelKey: 'steps.settings', panels: ['settings'] },
  { id: 'roadmap', labelKey: 'tabs.roadmap', panels: ['roadmap'] },
];
