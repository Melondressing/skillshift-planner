function renderSchedule() {
  const el = document.getElementById('schedule');
  const views = {
    sheet: () => (isNarrowScreen() ? renderRosterCards() : renderRosterSheet()),
    confirmed: renderConfirmedRoster,
    member: renderScheduleMemberView,
    part: renderSchedulePartView,
  };
  if (!views[scheduleView]) scheduleView = 'sheet';
  el.innerHTML = `
    <div class="section-head">
      <div><h2>${t('tabs.schedule')}</h2><p>${t('schedule.subtitle')}</p></div>
      <div class="inline-actions">
        ${Object.keys(views).map((view) => `<button class="btn ${scheduleView === view ? '' : 'secondary'}" data-action="schedule-view" data-view="${view}">${t(`schedule.${view}`)}</button>`).join('')}
        <label class="small-text inline-check" title="${escapeHtml(t('schedule.autoFillBudgetHint'))}"><input type="checkbox" data-setting="autoFillWithinBudget" ${state.settings.autoFillWithinBudget ? 'checked' : ''} /> ${t('schedule.autoFillBudget')}</label>
        <button class="btn" type="button" title="${escapeHtml(t('schedule.autoFillHint'))}" data-action="auto-fill">${t('schedule.autoFill')}</button>
      </div>
    </div>
    ${lastBulkChange ? `<div class="card autofill-result no-print">
      <span>${t(lastBulkChange.textKey, lastBulkChange.vars)}</span>
      <div class="inline-actions">
        <button class="btn small" type="button" data-action="auto-fill-keep">${t('schedule.autoFillKeep')}</button>
        <button class="btn small secondary" type="button" data-action="auto-fill-undo">${t('schedule.autoFillUndo')}</button>
      </div>
    </div>` : ''}
    ${renderWeekNav()}
    ${scheduleView === 'sheet' ? renderDayPills(selectedScheduleDay, 'schedule-day', true) : ''}
    ${scheduleView === 'sheet' && getDayRequirements(selectedScheduleDay).length ? renderCopyDayControls('assignments', selectedScheduleDay) : ''}
    ${views[scheduleView]()}
    ${recommendationContext ? renderRecommendationPanel() : ''}
    ${replacementContext ? renderReplacementPanel() : ''}
  `;
}

function getAssignmentStatus(req, sreq, key) {
  const employeeId = state.schedule[key];
  if (!employeeId) return { code: 'unassigned', label: t('status.unassigned'), className: 'danger', detail: t('status.pickEmployee') };
  const employee = byId(state.employees, employeeId);
  if (!employee) return { code: 'missingEmployee', label: t('status.missingEmployee'), className: 'danger', detail: t('status.deletedEmployee') };
  const status = getRecommendations(req, sreq, '', key).find((rec) => rec.employee.id === employeeId);
  const className = { fit: 'ok', partial: 'warn', emergency: 'warn' }[status.category] || 'danger';
  return { code: status.category, label: t(`status.${status.category}`), className, detail: status.reasons.join(' · ') };
}

function employeeOptionsForRequirement(req, sreq, selected = '', ignoreKey = '') {
  const key = ignoreKey || assignmentKey(req.id, sreq.id, 0);
  const recommendations = getRecommendations(req, sreq, '', key)
    .filter((rec) => ['fit', 'partial', 'emergency'].includes(rec.category));
  const selectedEmployee = selected ? byId(state.employees, selected) : null;
  const selectedIncluded = recommendations.some((rec) => rec.employee.id === selected);
  const options = [`<option value="">${t('status.unassigned')}</option>`];
  if (selectedEmployee && !selectedIncluded) {
    options.push(`<option value="${selectedEmployee.id}" selected>${escapeHtml(selectedEmployee.name)} · ${t('status.currentBelow')}</option>`);
  }
  recommendations.forEach((rec) => {
    const mark = t(`status.${rec.category}`);
    options.push(`<option value="${rec.employee.id}" ${selected === rec.employee.id ? 'selected' : ''}>${escapeHtml(rec.employee.name)} · ${mark} · ${escapeHtml(partName(rec.employee.partId))}</option>`);
  });
  if (options.length === 1) options.push(`<option disabled>${t('status.noneFits')}</option>`);
  return options.join('');
}

function getDayRequirements(dayKey) {
  return state.requirements
    .filter((req) => req.dayOfWeek === dayKey)
    .sort((a,b)=>toMinutes(a.startTime)-toMinutes(b.startTime));
}

function stationSortValue(stationId) {
  return num(byId(state.stations, stationId)?.sortOrder, 999);
}

function partSortValue(partId) {
  return num(byId(state.parts, partId)?.sortOrder, 999);
}

function getHorizontalRosterData(dayKey) {
  const reqs = getDayRequirements(dayKey);
  const rowMap = new Map();

  reqs.forEach((req) => {
    const localCounts = {};
    (req.stationRequirements || [])
      .slice()
      .sort((a, b) =>
        partSortValue(a.partId) - partSortValue(b.partId) ||
        stationSortValue(a.stationId) - stationSortValue(b.stationId) ||
        stationName(a.stationId).localeCompare(stationName(b.stationId))
      )
      .forEach((sreq) => {
        for (let slotIndex = 0; slotIndex < seatCount(sreq); slotIndex += 1) {
          const pairKey = `${sreq.partId}__${sreq.stationId}`;
          const occurrence = localCounts[pairKey] || 0;
          localCounts[pairKey] = occurrence + 1;
          const rowId = `${pairKey}__${occurrence}`;
          if (!rowMap.has(rowId)) {
            rowMap.set(rowId, {
              id: rowId,
              partId: sreq.partId,
              stationId: sreq.stationId,
              occurrence,
              cells: {},
            });
          }
          rowMap.get(rowId).cells[req.id] = { req, sreq, slotIndex, key: assignmentKey(req.id, sreq.id, slotIndex) };
        }
      });
  });

  const rows = [...rowMap.values()].sort((a,b) =>
    partSortValue(a.partId) - partSortValue(b.partId) ||
    stationSortValue(a.stationId) - stationSortValue(b.stationId) ||
    a.occurrence - b.occurrence
  );
  return { reqs, rows };
}

// The employee picker, status badge and recommend/replace buttons for one seat.
function renderSeatControls({ req, sreq, slotIndex, key }, status) {
  const selected = state.schedule[key] || '';
  return `<select class="matrix-select" data-action="assign-schedule" data-key="${key}">${employeeOptionsForRequirement(req, sreq, selected, key)}</select>
    <div class="cell-meta"><span class="badge ${status.className}">${status.label}</span></div>
    <div class="matrix-actions">
      <button class="link-btn" data-action="show-recommend" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}">${t('schedule.recommend')}</button>
      <button class="link-btn" data-action="show-replace" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}" ${selected ? '' : 'disabled'}>${t('schedule.replace')}</button>
    </div>`;
}

function renderRosterCell(cell) {
  if (!cell) return '<td class="empty-cell"><span>—</span></td>';
  const status = getAssignmentStatus(cell.req, cell.sreq, cell.key);
  return `<td class="matrix-cell ${status.className}">${renderSeatControls(cell, status)}</td>`;
}

const NARROW_SCREEN_QUERY = '(max-width: 720px)';
function isNarrowScreen() {
  return Boolean(window.matchMedia?.(NARROW_SCREEN_QUERY).matches);
}

// Phone layout of the roster sheet: one card per time block, one row per seat.
function renderRosterCards() {
  const reqs = getDayRequirements(selectedScheduleDay);
  return `<div class="roster-cards">
    <div class="section-head">
      <h3>${dayLabel(selectedScheduleDay)} ${t('schedule.sheet')}</h3>
      <button class="btn small secondary" data-action="export-roster-csv">${t('schedule.csv')}</button>
    </div>
    ${reqs.map((req) => {
      const seats = [...seatsByStation(req).values()].sort((a, b) =>
        partSortValue(a.sreq.partId) - partSortValue(b.sreq.partId) ||
        stationSortValue(a.sreq.stationId) - stationSortValue(b.sreq.stationId));
      return `<div class="card roster-block-card">
        <h4>${req.startTime}–${req.endTime} · ${escapeHtml(req.label)} ${req.isPeak ? `<span class="badge danger">${t('schedule.peak')}</span>` : ''}</h4>
        ${seats.map((seat) => {
          const status = getAssignmentStatus(seat.req, seat.sreq, seat.key);
          const occurrence = seats.filter((s) => s.sreq.partId === seat.sreq.partId && s.sreq.stationId === seat.sreq.stationId).indexOf(seat);
          return `<div class="roster-seat-row ${status.className}">
            <div class="roster-seat-name"><strong>${escapeHtml(stationName(seat.sreq.stationId))}${occurrence ? ` #${occurrence + 1}` : ''}</strong><span class="small-text">${escapeHtml(partName(seat.sreq.partId))}</span></div>
            <div class="roster-seat-controls">${renderSeatControls(seat, status)}</div>
          </div>`;
        }).join('') || `<p class="muted small-text">${t('requirements.noSeats')}</p>`}
      </div>`;
    }).join('') || `<div class="card"><p class="muted">${t('schedule.noRequirementDay')}</p></div>`}
  </div>`;
}

function summarizeHorizontalRow(row, reqs) {
  const statuses = reqs
    .map((req) => row.cells[req.id])
    .filter(Boolean)
    .map((cell) => getAssignmentStatus(cell.req, cell.sreq, cell.key));
  if (!statuses.length) return { label: t('status.notApplicable'), className: 'info', detail: '' };
  const missing = statuses.filter((s) => s.code === 'unassigned').length;
  const danger = statuses.filter((s) => s.className === 'danger').length;
  const warn = statuses.filter((s) => s.className === 'warn').length;
  const ok = statuses.filter((s) => s.className === 'ok').length;
  const requirementSamples = reqs
    .map((req) => row.cells[req.id])
    .filter(Boolean)
    .map((cell) => `${requiredSkillName(cell.sreq)} L${cell.sreq.minLevel}-S${cell.sreq.minStep}`);
  const uniqueReqs = [...new Set(requirementSamples)];
  if (missing || danger) return { label: t('status.riskCount', { n: missing || danger }), className: 'danger', detail: uniqueReqs.join(' · ') };
  if (warn) return { label: t('status.warnCount', { n: warn }), className: 'warn', detail: uniqueReqs.join(' · ') };
  return { label: t('status.okCount', { n: ok }), className: 'ok', detail: uniqueReqs.join(' · ') };
}

function renderRosterSheet() {
  const { reqs, rows } = getHorizontalRosterData(selectedScheduleDay);
  return `
    <div class="card sheet-card horizontal-roster-card">
      <div class="section-head">
        <div>
          <h3>${dayLabel(selectedScheduleDay)} ${t('schedule.sheet')}</h3>
          <p class="small-text">${t('schedule.rosterHint')}</p>
        </div>
        <button class="btn small secondary" data-action="export-roster-csv">${t('schedule.csv')}</button>
      </div>
      <div class="table-wrap roster-wrap horizontal-roster-wrap">
        <table class="horizontal-roster-table">
          <thead>
            <tr>
              <th class="sticky-col col-part">${t('schedule.partHeader')}</th>
              <th class="sticky-col col-station">${t('schedule.stationHeader')}</th>
              <th class="sticky-col col-seat">${t('schedule.seatHeader')}</th>
              ${reqs.map((req) => `<th class="time-col"><strong>${req.startTime}–${req.endTime}</strong><br><span>${escapeHtml(req.label)}</span>${req.isPeak ? `<br><span class="badge danger">${t('schedule.peak')}</span>` : ''}</th>`).join('')}
              <th class="status-col">${t('schedule.statusRequired')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => {
              const summary = summarizeHorizontalRow(row, reqs);
              return `<tr>
                <td class="sticky-col col-part"><strong>${escapeHtml(partName(row.partId))}</strong></td>
                <td class="sticky-col col-station">${escapeHtml(stationName(row.stationId))}</td>
                <td class="sticky-col col-seat">#${row.occurrence + 1}</td>
                ${reqs.map((req) => renderRosterCell(row.cells[req.id])).join('')}
                <td class="status-col"><span class="badge ${summary.className}">${summary.label}</span><div class="status-detail wide">${escapeHtml(summary.detail)}</div></td>
              </tr>`;
            }).join('') || `<tr><td colspan="${4 + reqs.length}" class="muted">${t('schedule.noRequirementDay')}</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function phaseKeyFromReq(req) {
  return `${req.startTime}__${req.endTime}__${req.label || ''}`;
}

function getConfirmedRosterData() {
  const requirements = state.requirements.slice().sort((a, b) =>
    toMinutes(a.startTime) - toMinutes(b.startTime) ||
    (a.label || '').localeCompare(b.label || '')
  );
  const phaseMap = new Map();
  requirements.forEach((req) => {
    const key = phaseKeyFromReq(req);
    if (!phaseMap.has(key)) {
      phaseMap.set(key, {
        key,
        startTime: req.startTime,
        endTime: req.endTime,
        label: req.label || '',
      });
    }
  });
  const phases = [...phaseMap.values()].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime) || a.label.localeCompare(b.label));
  phases.forEach((phase, index) => { phase.phaseNo = index + 1; });

  const reqByDayPhase = new Map();
  state.requirements.forEach((req) => {
    reqByDayPhase.set(`${req.dayOfWeek}__${phaseKeyFromReq(req)}`, req);
  });

  const activePartIds = new Set();
  state.requirements.forEach((req) => {
    (req.stationRequirements || []).forEach((sreq) => activePartIds.add(sreq.partId));
  });

  const partsForPrint = state.parts
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((part) => activePartIds.has(part.id));

  const sections = partsForPrint.map((part) => {
    const rows = [];
    phases.forEach((phase) => {
      const row = { phase, cells: {}, hasContent: false };
      DAYS.forEach((day) => {
        const req = reqByDayPhase.get(`${day.key}__${phase.key}`);
        if (!req) {
          row.cells[day.key] = null;
          return;
        }
        const localCounts = {};
        const items = [];
        (req.stationRequirements || [])
          .slice()
          .sort((a, b) => stationSortValue(a.stationId) - stationSortValue(b.stationId) || stationName(a.stationId).localeCompare(stationName(b.stationId)))
          .forEach((sreq) => {
            if (sreq.partId !== part.id) return;
            for (let slotIndex = 0; slotIndex < seatCount(sreq); slotIndex += 1) {
              const pairKey = `${sreq.partId}__${sreq.stationId}`;
              const occurrence = localCounts[pairKey] || 0;
              localCounts[pairKey] = occurrence + 1;
              const assignmentKeyValue = assignmentKey(req.id, sreq.id, slotIndex);
              const employeeId = state.schedule[assignmentKeyValue] || '';
              items.push({ req, sreq, slotIndex, occurrence, key: assignmentKeyValue, employeeId });
              row.hasContent = true;
            }
          });
        row.cells[day.key] = items;
      });
      if (row.hasContent) rows.push(row);
    });
    return { key: part.id, label: part.name, color: part.color, rows };
  });

  return { phases, sections };
}

function renderConfirmedCell(items) {
  if (items === null) return '<td class="confirmed-empty"></td>';
  if (!items || !items.length) return '<td class="confirmed-blank"></td>';
  return `<td class="confirmed-phase-assignments">
    <div class="confirmed-cell-list">
      ${items.map((item) => {
        const station = stationName(item.sreq.stationId);
        const employee = item.employeeId ? employeeName(item.employeeId) : '';
        const status = getAssignmentStatus(item.req, item.sreq, item.key);
        const className = employee ? status.className : 'missing-name';
        const occurrenceLabel = item.occurrence ? ` #${item.occurrence + 1}` : '';
        return `<div class="confirmed-line ${className}"><span class="work-name">${escapeHtml(station)}${occurrenceLabel} :</span> <span class="employee-name">${escapeHtml(employee)}</span></div>`;
      }).join('')}
    </div>
  </td>`;
}

function renderConfirmedRoster() {
  const { sections } = getConfirmedRosterData();
  return `
    <div class="card sheet-card confirmed-print-card">
      <div class="section-head no-print">
        <div>
          <h3>${t('schedule.weeklyRoster')}</h3>
          <p class="small-text">${t('schedule.confirmedHint')}</p>
        </div>
        <div class="inline-actions">
          <button class="btn small secondary" data-action="export-roster-csv">${t('schedule.csv')}</button>
          <button class="btn small secondary" data-action="print-confirmed-roster">${t('schedule.print')}</button>
        </div>
      </div>
      <div class="confirmed-print-title print-only">
        <h2>${t('schedule.weeklyRoster')} · ${weekRangeLabel()}</h2>
        <p>SkillShift Planner</p>
      </div>
      <div class="confirmed-sections">
        ${sections.map((section) => `
          <div class="confirmed-section">
            <div class="confirmed-category-title" style="background:${escapeHtml(section.color || '#111827')}">${escapeHtml(section.label)}</div>
            <div class="table-wrap roster-wrap confirmed-week-wrap">
              <table class="confirmed-week-matrix compact-confirmed-matrix">
                <thead>
                  <tr>
                    <th class="phase-column">${t('schedule.phase')} / ${t('schedule.time')}</th>
                    ${DAYS.map((day) => `<th>${dayLabel(day.key)} ${shortDate(dateForDay(day.key))}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${section.rows.map((row) => `
                    <tr>
                      <td class="phase-cell"><strong>${t('schedule.phase')} ${row.phase.phaseNo}</strong><br><span>${row.phase.startTime}–${row.phase.endTime}</span><br><em>${escapeHtml(row.phase.label)}</em></td>
                      ${DAYS.map((day) => renderConfirmedCell(row.cells[day.key])).join('')}
                    </tr>
                  `).join('') || `<tr><td colspan="8" class="muted">${t('schedule.noPartWork')}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `).join('') || `<p class="muted">${t('schedule.noRequirements')}</p>`}
      </div>
    </div>
  `;
}
function renderRecommendationPanel() {
  const { reqId, sreqId, slotIndex } = recommendationContext;
  const req = getReqById(reqId);
  const sreq = getStationReq(reqId, sreqId);
  if (!req || !sreq) return '';
  const key = assignmentKey(reqId, sreqId, slotIndex);
  const recs = getRecommendations(req, sreq, '', key);
  return `<div class="card recommend-panel">
    <div class="section-head"><div><h3>${escapeHtml(t('recs.title', { where: `${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime} / ${partName(sreq.partId)} / ${stationName(sreq.stationId)}` }))}</h3><p class="small-text">${escapeHtml(t('ui.needs', { skill: `${requiredSkillName(sreq)} L${sreq.minLevel}-S${sreq.minStep}` }))}</p></div><button class="btn small secondary" data-action="close-panels">${t('common.close')}</button></div>
    ${renderRecommendationGroups(recs, key)}
  </div>`;
}

function renderReplacementPanel() {
  const { reqId, sreqId, slotIndex } = replacementContext;
  const req = getReqById(reqId);
  const sreq = getStationReq(reqId, sreqId);
  const key = assignmentKey(reqId, sreqId, slotIndex);
  const original = state.schedule[key];
  if (!req || !sreq || !original) return '';
  const originalEmp = byId(state.employees, original);
  const originalCost = originalEmp ? durationHours(req.startTime, req.endTime) * getRate(originalEmp, req.dayOfWeek) : 0;
  const recs = getRecommendations(req, sreq, original, key).map((rec) => ({ ...rec, costDiff: rec.addedCost - originalCost }));
  return `<div class="card recommend-panel">
    <div class="section-head"><div><h3>${escapeHtml(t('recs.replaceTitle', { name: employeeName(original) }))}</h3><p class="small-text">${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime} / ${escapeHtml(partName(sreq.partId))} / ${escapeHtml(stationName(sreq.stationId))} · ${t('recs.originalCost', { amount: money(originalCost) })}</p></div><button class="btn small secondary" data-action="close-panels">${t('common.close')}</button></div>
    ${renderRecommendationGroups(recs, key, true)}
  </div>`;
}

function renderRecommendationGroups(recs, key, isReplacement = false) {
  return ['fit', 'partial', 'emergency', 'bad'].map((cat) => {
    const group = recs.filter((r) => r.category === cat).slice(0, cat === 'bad' ? 5 : 8);
    if (!group.length) return '';
    const cls = cat === 'fit' ? 'ok' : cat === 'partial' ? 'warn' : cat === 'emergency' ? 'info' : 'danger';
    return `<div style="margin-top:12px;"><h4><span class="badge ${cls}">${t(`recs.${cat}`)}</span></h4><div class="grid two">
      ${group.map((rec) => `<div class="card soft">
        <h4>${escapeHtml(rec.employee.name)} <span class="badge">${t('recs.score', { n: rec.score.toFixed(0) })}</span></h4>
        <p class="small-text">${escapeHtml(partName(rec.employee.partId))} · ${money(rec.employee.baseRate)}/h · ${t('recs.weekProjected', { hours: rec.projectedHours.toFixed(1) })}</p>
        ${isReplacement ? `<p class="small-text">${t('recs.costDiff')} <strong>${rec.costDiff >= 0 ? '+' : ''}${money(rec.costDiff)}</strong></p>` : ''}
        <p class="small-text">${rec.reasons.map(escapeHtml).join('<br>')}</p>
        ${cat !== 'bad' ? `<button class="btn small" data-action="apply-recommend" data-key="${key}" data-emp="${rec.employee.id}">${t('recs.apply')}</button>` : ''}
      </div>`).join('')}
    </div></div>`;
  }).join('');
}

function renderScheduleMemberView() {
  return `<div class="grid">${state.employees.map((emp) => {
    const assignments = assignmentsOf(emp.id).slice().sort((a,b) => {
      const ra = getReqById(a.reqId); const rb = getReqById(b.reqId);
      return dayIndex(ra?.dayOfWeek) - dayIndex(rb?.dayOfWeek) || toMinutes(ra?.startTime) - toMinutes(rb?.startTime);
    });
    return `<div class="card"><h3>${escapeHtml(emp.name)} <span class="badge info">${employeeWeeklyHours(emp.id).toFixed(1)}h</span> <span class="badge">${money(employeeWeeklyCost(emp.id))}</span></h3>
      ${assignments.map((a) => {
        const req = getReqById(a.reqId); const sreq = getStationReq(a.reqId, a.stationReqId);
        return `<span class="badge ${req?.isPeak ? 'danger' : 'info'}">${dayLabel(req?.dayOfWeek)} ${req?.startTime}–${req?.endTime} · ${stationName(sreq?.stationId)}</span>`;
      }).join('') || `<p class="muted">${t('ui.noAssignments')}</p>`}
    </div>`;
  }).join('')}</div>`;
}

function renderSchedulePartView() {
  return state.parts.map((part) => {
    const partAssignments = getAssignments().filter((a) => {
      const sreq = getStationReq(a.reqId, a.stationReqId);
      return sreq?.partId === part.id;
    });
    const cost = partAssignments.reduce((sum, a) => {
      const emp = byId(state.employees, a.employeeId); const req = getReqById(a.reqId);
      return emp && req ? sum + durationHours(req.startTime, req.endTime) * getRate(emp, req.dayOfWeek) : sum;
    }, 0);
    return `<div class="card" style="margin-bottom:14px;"><h3><span class="badge dark" style="background:${escapeHtml(part.color)}">${escapeHtml(part.name)}</span> ${t('ui.assignmentsCount', { n: partAssignments.length })} · ${money(cost)}</h3>
      ${partAssignments.map((a) => {
        const req = getReqById(a.reqId); const sreq = getStationReq(a.reqId, a.stationReqId);
        return `<span class="badge ${req?.isPeak ? 'danger' : 'info'}">${dayLabel(req?.dayOfWeek)} ${req?.startTime}–${req?.endTime} · ${stationName(sreq?.stationId)} · ${employeeName(a.employeeId)}</span>`;
      }).join('') || `<p class="muted">${t('ui.noAssignments')}</p>`}
    </div>`;
  }).join('');
}
