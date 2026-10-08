function renderParts() {
  const el = document.getElementById('parts');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.parts')}</h2><p>${t('parts.subtitle')}</p></div></div>
    <div class="grid two">
      <div class="card">
        <h3>${t('parts.partAddTitle')}</h3>
        <div class="form-row compact">
          <label>${t('parts.partName')}<input id="newPartName" placeholder="${escapeHtml(t('ui.phPartName'))}" /></label>
          <label>${t('parts.description')}<input id="newPartDesc" placeholder="${escapeHtml(t('ui.phPartDesc'))}" /></label>
          <label>${t('parts.color')}<input id="newPartColor" type="color" value="#2563eb" /></label>
          <button class="btn" data-action="add-part">${t('common.add')}</button>
        </div>
        <div class="table-wrap"><table><thead><tr><th>${t('parts.partHeader')}</th><th>${t('parts.description')}</th><th>${t('parts.statusHeader')}</th><th></th></tr></thead><tbody>
          ${state.parts.slice().sort((a,b)=>a.sortOrder-b.sortOrder).map((part) => `
            <tr>
              <td><span class="badge dark" style="background:${escapeHtml(part.color)}">${escapeHtml(part.name)}</span></td>
              <td>${escapeHtml(part.description)}</td>
              <td>${part.active ? `<span class="badge ok">${t('common.active')}</span>` : `<span class="badge">${t('common.inactive')}</span>`}</td>
              <td><button class="btn small danger" data-action="delete-part" data-id="${part.id}">${t('common.delete')}</button></td>
            </tr>`).join('')}
        </tbody></table></div>
      </div>
      <div class="card">
        <h3>${t('parts.stationAddTitle')}</h3>
        <div class="form-row compact">
          <label>${t('parts.partHeader')}<select id="newStationPart">${partOptions()}</select></label>
          <label>${t('parts.stationName')}<input id="newStationName" placeholder="${escapeHtml(t('ui.phStationName'))}" /></label>
          <label>${t('parts.description')}<input id="newStationDesc" placeholder="${escapeHtml(t('ui.phStationDesc'))}" /></label>
          <button class="btn" data-action="add-station">${t('common.add')}</button>
        </div>
        <div class="table-wrap"><table><thead><tr><th>${t('parts.partHeader')}</th><th>${t('parts.stationHeader')}</th><th>${t('parts.description')}</th><th></th></tr></thead><tbody>
          ${state.stations.slice().sort(sortStations).map((station) => `
            <tr>
              <td>${escapeHtml(partName(station.partId))}</td>
              <td><span class="badge info">${escapeHtml(station.name)}</span></td>
              <td>${escapeHtml(station.description)}</td>
              <td><button class="btn small danger" data-action="delete-station" data-id="${station.id}">${t('common.delete')}</button></td>
            </tr>`).join('')}
        </tbody></table></div>
      </div>
    </div>
  `;
}

function partOptions(selected = '') {
  return state.parts.map((part) => `<option value="${part.id}" ${selected === part.id ? 'selected' : ''}>${escapeHtml(part.name)}</option>`).join('');
}

function memberPartFilterOptions() {
  return `<option value="all" ${selectedMemberPart === 'all' ? 'selected' : ''}>${t('common.all')}</option>` +
    state.parts
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((part) => `<option value="${part.id}" ${selectedMemberPart === part.id ? 'selected' : ''}>${escapeHtml(part.name)}</option>`)
      .join('');
}
function stationOptions(selected = '', partFilter = '', compact = false) {
  return state.stations
    .filter((st) => !partFilter || st.partId === partFilter)
    .sort(sortStations)
    .map((st) => {
      const label = compact ? st.name : `${partName(st.partId)} / ${st.name}`;
      return `<option value="${st.id}" ${selected === st.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
}
function firstStationForPart(partId) {
  return state.stations.filter((st) => st.partId === partId).sort(sortStations)[0]?.id || '';
}
function getSkillLevelTemplates(skillId) {
  return state.levelTemplates
    .filter((tpl) => tpl.skillId === skillId)
    .sort((a, b) => Number(a.levelNumber) - Number(b.levelNumber) || Number(a.stepNumber) - Number(b.stepNumber));
}
// Level/Step choices for a skill, e.g. [{ level: 1, step: 1 }, …], plus the
// employee's current value when no template matches it.
function levelStepChoices(skillId, current = null) {
  const seen = new Set();
  const choices = [];
  const add = (level, step) => {
    const key = `${level}-${step}`;
    if (seen.has(key)) return;
    seen.add(key);
    choices.push({ level, step, key });
  };
  getSkillLevelTemplates(skillId).forEach((tpl) => add(num(tpl.levelNumber), num(tpl.stepNumber)));
  if (!choices.length) add(1, 1);
  if (current) add(num(current.level), num(current.step));
  return choices.sort((a, b) => a.level - b.level || a.step - b.step);
}

// Skills grouped under the station they belong to, stations in part order.
// Skills whose station no longer exists come last.
function skillsByStation() {
  const groups = state.stations.slice().sort(sortStations)
    .map((station) => ({ station, skills: state.skills.filter((skill) => skill.stationId === station.id) }))
    .filter((group) => group.skills.length);
  const orphans = state.skills.filter((skill) => !byId(state.stations, skill.stationId));
  if (orphans.length) groups.push({ station: null, skills: orphans });
  return groups;
}

function renderMemberStationSkills(emp) {
  const groups = skillsByStation();
  if (!groups.length) return `<p class="muted small-text">${t('members.noStationsYet')}</p>`;
  let lastPart = null;
  return `<div class="station-skill-list">${groups.map(({ station, skills }) => {
    const partId = station?.partId || '';
    const partHead = partId !== lastPart ? `<div class="station-skill-part">${escapeHtml(station ? partName(partId) : t('members.otherSkills'))}</div>` : '';
    lastPart = partId;
    return partHead + skills.map((skill) => {
      const current = emp.assignedSkills?.[skill.id] || null;
      const value = current ? `${num(current.level)}-${num(current.step)}` : '';
      const label = station ? (skills.length > 1 ? `${station.name} · ${skill.name}` : station.name) : skill.name;
      return `<label class="station-skill-row ${current ? 'has-skill' : ''}">
        <span>${escapeHtml(label)}</span>
        <select data-action="member-skill-level" data-emp="${emp.id}" data-skill="${skill.id}" aria-label="${escapeHtml(label)}">
          <option value="">${t('members.cannotDo')}</option>
          ${levelStepChoices(skill.id, current).map((c) => `<option value="${c.key}" ${c.key === value ? 'selected' : ''}>L${c.level}-S${c.step}</option>`).join('')}
        </select>
      </label>`;
    }).join('');
  }).join('')}</div>`;
}

// Sets (or clears, with an empty value) one employee's Level/Step for a skill.
function setEmployeeSkillLevel(empId, skillId, value) {
  const emp = byId(state.employees, empId);
  if (!emp || !byId(state.skills, skillId)) return;
  emp.assignedSkills = emp.assignedSkills || {};
  if (!value) {
    delete emp.assignedSkills[skillId];
    return;
  }
  const [level, step] = String(value).split('-').map((n) => num(n, 1));
  emp.assignedSkills[skillId] = { note: '', ...emp.assignedSkills[skillId], level, step };
}

function compareSkills(a, b) {
  return partName(a.partId).localeCompare(partName(b.partId)) || stationName(a.stationId).localeCompare(stationName(b.stationId)) || a.name.localeCompare(b.name);
}
function sortStations(a, b) {
  const pa = byId(state.parts, a.partId)?.sortOrder || 0;
  const pb = byId(state.parts, b.partId)?.sortOrder || 0;
  return pa - pb || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

function renderSkills() {
  const el = document.getElementById('skills');
  if (!skillsAdvancedOpen) {
    el.innerHTML = `
      <div class="card advanced-toggle">
        <div>
          <h3>${t('skills.advancedTitle')}</h3>
          <p class="small-text">${t('skills.advancedHelp')}</p>
        </div>
        <button class="btn secondary small" type="button" data-action="toggle-advanced-skills" aria-expanded="false">${t('skills.advancedOpen')}</button>
      </div>`;
    return;
  }
  if (!state.skills.some((skill) => skill.id === selectedSkillId)) selectedSkillId = state.skills[0]?.id || '';
  const selectedSkill = byId(state.skills, selectedSkillId);
  const selectedTemplates = selectedSkill ? getSkillLevelTemplates(selectedSkill.id) : [];
  const groupedLevels = selectedTemplates.reduce((acc, tpl) => {
    const levelKey = String(tpl.levelNumber);
    if (!acc[levelKey]) acc[levelKey] = [];
    acc[levelKey].push(tpl);
    return acc;
  }, {});
  const levelKeys = Object.keys(groupedLevels).sort((a, b) => Number(a) - Number(b));

  const sortedSkills = state.skills.slice().sort(compareSkills);

  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('skills.advancedTitle')}</h2>
        <p>${t('skills.subtitle')}</p>
      </div>
      <button class="btn secondary small" type="button" data-action="toggle-advanced-skills" aria-expanded="true">${t('skills.advancedClose')}</button>
    </div>

    <div class="card req-guide">
      <strong>${t('skills.guideTitle')}</strong>
      <p class="small-text">${t('skills.guideText')}</p>
    </div>

    <div class="skills-split">
      <section class="card skills-list-card">
        <h3>${t('skills.addSkillTitle')}</h3>
        <div class="form-row compact skill-add-row">
          <label>${t('parts.partHeader')}<select id="newSkillPart" data-action="new-skill-part">${partOptions()}</select></label>
          <label>${t('parts.stationHeader')}<select id="newSkillStation">${stationOptions('', state.parts[0]?.id || '', true)}</select></label>
          <label>${t('ui.skillName')}<input id="newSkillName" placeholder="${escapeHtml(t('ui.phSkillName'))}" /></label>
          <button class="btn" data-action="add-skill">${t('common.add')}</button>
        </div>

        <div class="table-wrap skills-table-wrap">
          <table class="skills-list-table">
            <thead>
              <tr>
                <th>${t('parts.partHeader')}</th>
                <th>${t('parts.stationHeader')}</th>
                <th>${t('requirements.skill')}</th>
                <th>${t('ui.stepCount')}</th>
                <th>${t('ui.kind')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${sortedSkills.map((skill) => {
                const isSelected = skill.id === selectedSkillId;
                const count = getSkillLevelTemplates(skill.id).length;
                return `
                  <tr class="${isSelected ? 'selected-skill-row' : ''}">
                    <td>${escapeHtml(partName(skill.partId))}</td>
                    <td>${escapeHtml(stationName(skill.stationId))}</td>
                    <td>
                      <button class="link-btn skill-name-button" data-action="select-skill" data-id="${skill.id}">${escapeHtml(skill.name)}</button>
                    </td>
                    <td><span class="badge ${count ? 'info' : 'warn'}">${t('ui.stepsCount', { n: count })}</span></td>
                    <td><span class="badge ${skill.isCritical ? 'danger' : ''}">${skill.isCritical ? t('ui.critical') : t('ui.normal')}</span></td>
                    <td class="inline-actions nowrap">
                      <button class="btn small secondary" data-action="select-skill" data-id="${skill.id}">${t('ui.select')}</button>
                      <button class="btn small danger" data-action="delete-skill" data-id="${skill.id}">${t('common.delete')}</button>
                    </td>
                  </tr>`;
              }).join('') || `<tr><td colspan="6" class="muted">${t('skills.noSkills')}</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card skill-detail-card">
        ${selectedSkill ? `
          <div class="skill-detail-head">
            <div>
              <h3>${escapeHtml(selectedSkill.name)}</h3>
              <p class="small-text">${escapeHtml(partName(selectedSkill.partId))} / ${escapeHtml(stationName(selectedSkill.stationId))} · ${t('skills.subtitle')}</p>
            </div>
            <span class="badge dark">${t('common.selected')}</span>
          </div>

          <h4>${t('skills.addStepTitle')}</h4>
          <div class="level-add-row clean">
              <label>Level<input data-level-skill="${selectedSkill.id}" data-level-field="level" type="number" value="1" min="0" /></label>
            <label>Step<input data-level-skill="${selectedSkill.id}" data-level-field="step" type="number" value="1" min="0" /></label>
            <label>${t('ui.description')}<input data-level-skill="${selectedSkill.id}" data-level-field="desc" placeholder="${escapeHtml(t('ui.phLevelDesc'))}" /></label>
            <button class="btn small" data-action="add-level" data-skill="${selectedSkill.id}">${t('skills.addLevel')}</button>
          </div>

          <div class="level-summary">
            ${levelKeys.length ? levelKeys.map((levelKey) => {
              const items = groupedLevels[levelKey].sort((a, b) => Number(a.stepNumber) - Number(b.stepNumber));
              return `
                <div class="level-group-card">
                  <div class="level-group-head">
                    <strong>Level ${escapeHtml(levelKey)}</strong>
                    <span class="small-text">${items.length} step${items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div class="table-wrap tight no-border">
                    <table class="compact-table level-detail-table">
                      <thead><tr><th>Step</th><th>${t('ui.description')}</th><th>${t('ui.canDo')}</th><th>${t('ui.manage')}</th></tr></thead>
                      <tbody>
                        ${items.map((tpl) => `
                          <tr>
                            <td><span class="badge info">L${tpl.levelNumber} / S${tpl.stepNumber}</span></td>
                            <td>${escapeHtml(tpl.description || '')}</td>
                            <td>${escapeHtml(tpl.canDo || '') || '<span class="muted">-</span>'}</td>
                            <td><button class="btn small danger" data-action="delete-level" data-id="${tpl.id}">${t('common.delete')}</button></td>
                          </tr>`).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>`;
            }).join('') : `<div class="empty-detail"><p class="muted">${t('skills.noSkillSteps')}</p></div>`}
          </div>
        ` : `
          <div class="empty-detail"><h3>${t('skills.noSkillSelected')}</h3><p class="muted">${t('skills.noSkillSelectedText')}</p></div>
        `}
      </section>
    </div>
  `;
}

function renderMembers() {
  const el = document.getElementById('members');
  if (selectedMemberPart !== 'all' && !state.parts.some((part) => part.id === selectedMemberPart)) selectedMemberPart = 'all';
  const visibleParts = state.parts
    .slice()
    .sort((a,b)=>a.sortOrder-b.sortOrder)
    .filter((part) => selectedMemberPart === 'all' || part.id === selectedMemberPart);
  const grouped = visibleParts
    .map((part) => ({ part, employees: state.employees.filter((emp) => emp.partId === part.id).sort((a,b)=>a.name.localeCompare(b.name)) }))
    .filter((group) => group.employees.length || group.part.active);
  const addPartDefault = selectedMemberPart === 'all' ? '' : selectedMemberPart;

  el.innerHTML = `
    <div class="section-head">
      <div><h2>${t('tabs.members')}</h2><p>${t('members.subtitle')}</p></div>
      <label class="filter-label">${t('members.partFilter')}
        <select data-action="member-part-filter">${memberPartFilterOptions()}</select>
      </label>
    </div>
    <div class="card">
      <h3>${t('members.addEmployeeTitle')}</h3>
      <div class="form-row">
        <label>${t('members.name')}<input id="newEmpName" placeholder="${escapeHtml(t('ui.phEmpName'))}" /></label>
        <label>${t('members.part')}<select id="newEmpPart">${partOptions(addPartDefault)}</select></label>
        <label>${t('members.role')}<input id="newEmpRole" placeholder="${escapeHtml(t('ui.phRole'))}" /></label>
        <label>${t('members.rate')}<input id="newEmpRate" type="number" value="28" /></label>
        <label>${t('members.maxHours')}<input id="newEmpMax" type="number" value="38" /></label>
        <button class="btn" data-action="add-employee">${t('members.addEmployee')}</button>
      </div>
    </div>
    ${grouped.map(({ part, employees }) => `
      <h3 class="group-title"><span class="badge dark" style="background:${escapeHtml(part.color)}">${escapeHtml(part.name)}</span> ${t('ui.people', { n: employees.length })}</h3>
      <div class="grid">
        ${employees.map(renderEmployeeCard).join('') || `<p class="muted">${t('members.noEmployeesHere')}</p>`}
      </div>
    `).join('') || `<div class="card"><p class="muted">${t('members.noEmployeesVisible')}</p></div>`}
  `;
}

function renderEmployeeCard(emp) {
  const breakdown = employeeWorkBreakdown(emp.id);
  const hours = breakdown.totalHours;
  const cost = breakdown.totalCost;
  const usage = emp.maxWeeklyHours ? (hours / emp.maxWeeklyHours) * 100 : 0;
  const skillBadges = Object.entries(emp.assignedSkills || {}).map(([skillId, value]) => `<span class="badge info">${escapeHtml(skillName(skillId))} L${value.level}-S${value.step}</span>`).join('') || `<span class="badge">${t('common.noData')}</span>`;
  return `
    <div class="card member-card">
      <div>
        <h3>${escapeHtml(emp.name)}</h3>
        <p class="small-text">${escapeHtml(partName(emp.partId))} · ${escapeHtml(emp.role)} · ${money(emp.baseRate)}/h</p>
        <div>${skillBadges}</div>
        <p class="small-text">${t('members.weekHours')} ${hours.toFixed(1)}h · ${money(cost)} · ${t('members.max')} ${emp.maxWeeklyHours}h</p>
        <div class="work-breakdown mini">
          <span>${t('members.weekday')} ${breakdown.weekdayHours.toFixed(1)}h</span>
          <span>${t('members.saturday')} ${breakdown.saturdayHours.toFixed(1)}h</span>
          <span>${t('members.sunday')} ${breakdown.sundayHours.toFixed(1)}h</span>
        </div>
        <div class="progress ${usage > 100 ? 'danger' : usage > 90 ? 'warn' : ''}"><div style="width:${Math.min(usage,120)}%"></div></div>
        <div class="inline-actions" style="margin-top:10px;">
          <button class="btn small danger" data-action="delete-employee" data-id="${emp.id}">${t('common.delete')}</button>
          <button class="btn small secondary" data-action="toggle-employee" data-id="${emp.id}">${emp.active ? t('members.deactivate') : t('members.activate')}</button>
        </div>
      </div>
      <div>
        <h4>${t('members.availability')}</h4>
        <div class="availability-grid">
          ${DAYS.map((day) => {
            const av = emp.availability?.[day.key] || { available: false, startTime: '10:00', endTime: '22:00' };
            return `<div class="day-box">
              <label><input type="checkbox" ${av.available ? 'checked' : ''} data-action="availability-check" data-emp="${emp.id}" data-day="${day.key}" /> ${dayShort(day.key)}</label>
              <input type="time" value="${av.startTime || '10:00'}" data-action="availability-start" data-emp="${emp.id}" data-day="${day.key}" />
              <input type="time" value="${av.endTime || '22:00'}" data-action="availability-end" data-emp="${emp.id}" data-day="${day.key}" />
            </div>`;
          }).join('')}
        </div>
      </div>
      <div>
        <h4>${t('members.skillLevelStep')}</h4>
        <p class="small-text">${t('members.skillStepHelp')}</p>
        ${renderMemberStationSkills(emp)}
      </div>
    </div>
  `;
}

function renderDayPills(selectedDay, actionName, withDates = false) {
  return `<div class="day-pills">
    ${DAYS.map((day) => `<button class="day-pill ${selectedDay === day.key ? 'active' : ''}" data-action="${actionName}" data-day="${day.key}">${dayShort(day.key)}${withDates ? ` <span class="pill-date">${shortDate(dateForDay(day.key))}</span>` : ''}</button>`).join('')}
  </div>`;
}

function renderRequirements() {
  const el = document.getElementById('requirements');
  const visibleDay = selectedRequirementDay || 'monday';
  const visibleReqs = getDayRequirements(visibleDay);
  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('tabs.requirements')}</h2>
        <p>${t('requirements.subtitle')}</p>
      </div>
    </div>
    <div class="card req-guide">
      <strong>${t('requirements.guideTitle')}</strong>
      <p class="small-text">${t('requirements.guideText')}</p>
    </div>
    <div class="card req-toolbar">
      <div>
        <h3>${t('requirements.daySelect')}</h3>
        ${renderDayPills(visibleDay, 'req-day')}
        ${visibleReqs.length ? renderCopyDayControls('requirements', visibleDay) : ''}
      </div>
      <div>
        <h3>${t('requirements.addBlockTitle')}</h3>
        <div class="req-block-row">
          <label>${t('requirements.day')}<select id="newReqDay">${DAYS.map(d => `<option value="${d.key}" ${d.key === visibleDay ? 'selected' : ''}>${dayLabel(d.key)}</option>`).join('')}</select></label>
          <label>${t('requirements.start')}<input id="newReqStart" type="time" value="10:00" /></label>
          <label>${t('requirements.end')}<input id="newReqEnd" type="time" value="12:00" /></label>
          <label>${t('requirements.label')}<input id="newReqLabel" placeholder="${escapeHtml(t('ui.phBlockLabel'))}" /></label>
          <label>${t('requirements.peak')}<select id="newReqPeak"><option value="false">${t('ui.no')}</option><option value="true">${t('ui.yes')}</option></select></label>
          <button class="btn" data-action="add-requirement">${t('requirements.addBlock')}</button>
        </div>
      </div>
    </div>
    <div class="req-day-board">
      <h3 class="group-title">${dayLabel(visibleDay)} ${t('tabs.requirements')}</h3>
      ${visibleReqs.map(renderRequirementCard).join('') || `<div class="card"><p class="muted">${t('requirements.noBlocks')}</p></div>`}
    </div>
  `;
}

function renderRequirementCard(req) {
  const rows = getRequirementSeatRows().filter((row) => row.req.id === req.id);
  const seats = rows.length;
  const grouped = rows.reduce((acc, row) => {
    const key = `${row.sreq.partId}__${row.sreq.stationId}__${row.sreq.minLevel}__${row.sreq.minStep}`;
    if (!acc[key]) acc[key] = { ...row, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});
  const summary = Object.values(grouped).map((g) => `${partName(g.sreq.partId)} / ${stationName(g.sreq.stationId)} × ${g.count}`).join(' · ') || t('ui.noSeatsSummary');
  return `
    <div class="card req-card simple-req-card">
      <div class="req-card-head">
        <div>
          <h3>${escapeHtml(req.label)} <span class="badge ${req.isPeak ? 'danger' : 'info'}">${req.startTime}–${req.endTime}</span></h3>
          <p class="small-text">${t('requirements.requiredSeats')} ${seats} · ${escapeHtml(summary)}</p>
        </div>
        <button class="btn small danger" data-action="delete-requirement" data-id="${req.id}">${t('requirements.deleteBlock')}</button>
      </div>
      <div class="req-seat-add-row">
        <label>${t('requirements.part')}<select data-action="req-part-select" data-req-field="part" data-req="${req.id}">${partOptions()}</select></label>
        <label>${t('requirements.station')}<select data-req-field="station" data-req="${req.id}">${stationOptions('', state.parts[0]?.id || '', true)}</select></label>
        <label>${t('requirements.min')} Level<input type="number" value="1" min="0" data-req-field="level" data-req="${req.id}" /></label>
        <label>${t('requirements.min')} Step<input type="number" value="1" min="0" data-req-field="step" data-req="${req.id}" /></label>
        <button class="btn small" data-action="add-station-req" data-id="${req.id}">${t('requirements.seatAdd')}</button>
      </div>
      <div class="req-seat-table">
        <table class="simple-table compact-table"><thead><tr><th>#</th><th>${t('requirements.part')}</th><th>${t('requirements.station')}</th><th>${t('requirements.skill')}</th><th>${t('requirements.min')}</th><th>${t('common.delete')}</th></tr></thead><tbody>
          ${rows.map((row, idx) => `<tr>
            <td>${idx + 1}</td>
            <td>${escapeHtml(partName(row.sreq.partId))}</td>
            <td><strong>${escapeHtml(stationName(row.sreq.stationId))}</strong></td>
            <td>${escapeHtml(requiredSkillName(row.sreq))}</td>
            <td>L${row.sreq.minLevel}-S${row.sreq.minStep}</td>
            <td class="inline-actions"><button class="btn small secondary" data-action="clone-station-req" data-req="${req.id}" data-id="${row.sreq.id}">${t('requirements.cloneSeat')}</button><button class="btn small danger" data-action="delete-station-req" data-req="${req.id}" data-id="${row.sreq.id}">${t('common.delete')}</button></td>
          </tr>`).join('') || `<tr><td colspan="6" class="muted">${t('requirements.noSeats')}</td></tr>`}
        </tbody></table>
      </div>
    </div>
  `;
}
