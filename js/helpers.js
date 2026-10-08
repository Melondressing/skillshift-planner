function byId(list, id) { return list.find((item) => item.id === id); }
function partName(id) { return byId(state.parts, id)?.name || t('ui.unknownPart'); }
function stationName(id) { return byId(state.stations, id)?.name || t('ui.unknownStation'); }
function skillName(id) { return byId(state.skills, id)?.name || t('ui.unknownSkill'); }
function employeeName(id) { return byId(state.employees, id)?.name || t('ui.unassigned'); }
function dayLabel(key) { return DAYS.find((d) => d.key === key)?.[currentLanguage()]?.label || key; }
function dayShort(key) { return DAYS.find((d) => d.key === key)?.[currentLanguage()]?.short || key; }
function money(value) { return `${state.settings.currency}${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`; }
function num(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function normalizeExternalUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  return `https://${raw}`;
}
function deriveCompanyCode(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const slug = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug) return slug;
  let hash = 0;
  for (const char of raw) {
    hash = Math.imul(31, hash) + char.codePointAt(0);
    hash |= 0;
  }
  return `c-${Math.abs(hash).toString(36)}`;
}
function mailtoLink(email) {
  const raw = String(email ?? '').trim();
  return raw ? `mailto:${raw}` : '';
}
async function copyToClipboard(text) {
  const value = String(text ?? '').trim();
  if (!value) {
    toast(t('messages.copyFailed'));
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!ok) throw new Error('copy failed');
    }
    toast(t('messages.copied'));
  } catch (err) {
    console.error(err);
    toast(t('messages.copyFailed'));
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toMinutes(time) {
  if (!time || !time.includes(':')) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function durationHours(start, end) {
  return Math.max(0, (toMinutes(end) - toMinutes(start)) / 60);
}

function getRate(employee, dayKey) {
  const base = num(employee.baseRate);
  if (dayKey === 'saturday') return base * num(employee.saturdayMultiplier, 1);
  if (dayKey === 'sunday') return base * num(employee.sundayMultiplier, 1);
  return base;
}

function assignmentKey(reqId, stationReqId, slotIndex) {
  return `${reqId}__${stationReqId}__${slotIndex}`;
}

function parseAssignmentKey(key) {
  const [reqId, stationReqId, slotIndex] = key.split('__');
  return { reqId, stationReqId, slotIndex: Number(slotIndex) };
}

function getAssignments() {
  return cached('assignments', () => Object.entries(state.schedule)
    .filter(([, employeeId]) => employeeId)
    .map(([key, employeeId]) => ({ key, employeeId, ...parseAssignmentKey(key) })));
}

function assignmentsOf(employeeId) {
  const byEmployee = cached('assignmentsByEmployee', () => getAssignments().reduce((acc, a) => {
    (acc[a.employeeId] ||= []).push(a);
    return acc;
  }, {}));
  return byEmployee[employeeId] || [];
}

function getReqById(reqId) {
  if (!renderCache) return state.requirements.find((req) => req.id === reqId);
  return cached('reqById', () => new Map(state.requirements.map((req) => [req.id, req]))).get(reqId);
}
function getStationReq(reqId, stationReqId) { return getReqById(reqId)?.stationRequirements.find((s) => s.id === stationReqId); }
function getRequiredSkillId(stationReq) {
  if (stationReq?.requiredSkillId) return stationReq.requiredSkillId;
  const station = byId(state.stations, stationReq?.stationId);
  if (station?.requiredSkillIds?.length) return station.requiredSkillIds[0];
  return state.skills.find((skill) => skill.stationId === stationReq?.stationId)?.id || '';
}
function requiredSkillName(stationReq) {
  const skillId = getRequiredSkillId(stationReq);
  return skillId ? skillName(skillId) : t('ui.noLinkedSkill');
}
function seatCount(sreq) {
  return Math.max(1, Number(sreq.requiredCount || 1));
}
function dayIndex(key) {
  return DAYS.findIndex((d) => d.key === key);
}
function getRequirementSeatRows() {
  return cached('seatRows', buildRequirementSeatRows);
}
function buildRequirementSeatRows() {
  const rows = [];
  state.requirements.forEach((req) => {
    (req.stationRequirements || []).forEach((sreq) => {
      for (let slotIndex = 0; slotIndex < seatCount(sreq); slotIndex += 1) {
        rows.push({ req, sreq, slotIndex, key: assignmentKey(req.id, sreq.id, slotIndex) });
      }
    });
  });
  return rows.sort((a, b) =>
    (dayIndex(a.req.dayOfWeek) - dayIndex(b.req.dayOfWeek)) ||
    (toMinutes(a.req.startTime) - toMinutes(b.req.startTime)) ||
    partName(a.sreq.partId).localeCompare(partName(b.sreq.partId)) ||
    stationName(a.sreq.stationId).localeCompare(stationName(b.sreq.stationId)) ||
    a.slotIndex - b.slotIndex
  );
}
