function renderLabor() {
  const employeeRows = state.employees.map((emp) => {
    const bd = employeeWorkBreakdown(emp.id);
    return `<tr>
      <td>${escapeHtml(emp.name)}</td>
      <td>${escapeHtml(partName(emp.partId))}</td>
      <td>${bd.weekdayHours.toFixed(1)}h</td>
      <td>${bd.saturdayHours.toFixed(1)}h</td>
      <td>${bd.sundayHours.toFixed(1)}h</td>
      <td><strong>${bd.totalHours.toFixed(1)}h</strong></td>
      <td>${money(bd.totalCost)}</td>
      <td>${emp.maxWeeklyHours}h</td>
    </tr>`;
  }).join('');
  const partRows = state.parts.map((part) => {
    const { hours, cost: partCost } = partLabor(part.id);
    return `<tr><td>${escapeHtml(part.name)}</td><td>${hours.toFixed(1)}h</td><td>${money(partCost)}</td></tr>`;
  }).join('');

  const el = document.getElementById('labor');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.labor')}</h2><p>${t('labor.subtitle')}</p></div></div>
    <div class="grid two" style="margin-top:14px;">
      <div class="card wide-card"><h3>${t('labor.byEmployee')}</h3><div class="table-wrap"><table><thead><tr><th>${t('labor.employee')}</th><th>${t('labor.part')}</th><th>${t('labor.weekday')}</th><th>${t('labor.saturday')}</th><th>${t('labor.sunday')}</th><th>${t('labor.total')}</th><th>${t('labor.labor')}</th><th>${t('labor.max')}</th></tr></thead><tbody>${employeeRows}</tbody></table></div></div>
      <div class="card"><h3>${t('labor.byPart')}</h3><div class="table-wrap"><table><thead><tr><th>${t('labor.part')}</th><th>${t('labor.total')}</th><th>${t('labor.labor')}</th></tr></thead><tbody>${partRows}</tbody></table></div></div>
    </div>
  `;
}

function renderValidation() {
  const issues = calculateValidation();
  const el = document.getElementById('validation');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.validation')}</h2><p>${t('validation.subtitle')}</p></div></div>
    <div class="grid">
      ${issues.map((issue) => `<div class="card issue ${issue.severity === 'high' ? 'high' : issue.severity === 'low' ? 'low' : ''}">
        <h3>${escapeHtml(issue.type)} <span class="badge ${issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warn' : 'info'}">${t(`validation.status${issue.severity[0].toUpperCase()}${issue.severity.slice(1)}`)}</span></h3>
        <p>${escapeHtml(issue.message)}</p>
        ${issue.req ? `<p class="small-text">${dayLabel(issue.req.dayOfWeek)} ${issue.req.startTime}–${issue.req.endTime} · ${escapeHtml(issue.req.label || '')}</p>` : ''}
        ${issue.sreq ? `<p class="small-text">${escapeHtml(partName(issue.sreq.partId))} / ${escapeHtml(stationName(issue.sreq.stationId))} · ${escapeHtml(t('issues.needs', { skill: `${requiredSkillName(issue.sreq)} L${issue.sreq.minLevel}-S${issue.sreq.minStep}` }))}</p>` : ''}
        ${issue.req ? `<button class="btn small" type="button" title="${escapeHtml(t('validation.fixHint'))}" data-action="fix-issue" data-req="${issue.req.id}" data-sreq="${issue.sreq?.id || ''}" data-slot="${issue.slotIndex ?? ''}">${t('validation.fix')}</button>` : ''}
      </div>`).join('') || `<div class="card"><h3>${t('validation.resultTitle')}</h3><span class="badge ok">${t('validation.noIssues')}</span></div>`}
    </div>
  `;
}

function renderRoadmap() {
  const items = textFor(currentLanguage(), 'roadmap.items') || textFor('ko', 'roadmap.items') || [];
  document.getElementById('roadmap').innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.roadmap')}</h2><p>${t('roadmap.subtitle')}</p></div></div>
    <div class="roadmap-list">${items.map(([title, text]) => `<div class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`).join('')}</div>
  `;
}

function renderSettings() {
  const el = document.getElementById('settings');
  const lang = currentLanguage();
  const theme = currentTheme();
  const companyName = String(state.settings.companyName || '').trim();
  const companyCode = deriveCompanyCode(companyName);
  const employeePortalEnabled = Boolean(state.settings.employeePortalEnabled);
  const feedbackEmail = String(state.settings.feedbackEmail || '').trim();
  const feedbackUrl = normalizeExternalUrl(state.settings.feedbackUrl);
  const feedbackEmailHref = mailtoLink(feedbackEmail);
  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('settings.title')}</h2>
        <p>${t('settings.subtitle')}</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h3>${t('settings.languageLabel')}</h3>
        <p class="small-text">${t('settings.languageHelp')}</p>
        <label class="small-text" style="display:grid; gap:6px; max-width: 260px;">
          ${t('settings.current')}
          <select data-setting="language">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>${t('common.korean')}</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>${t('common.english')}</option>
          </select>
        </label>
      </div>
      <div class="card">
        <h3>${t('settings.themeLabel')}</h3>
        <p class="small-text">${t('settings.themeHelp')}</p>
        <label class="small-text" style="display:grid; gap:6px; max-width: 260px;">
          ${t('settings.themeLabel')}
          <select data-setting="theme">
            ${['light', 'dark', 'auto'].map((value) => `<option value="${value}" ${theme === value ? 'selected' : ''}>${t(`settings.theme${value[0].toUpperCase()}${value.slice(1)}`)}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="card">
        <h3>${t('settings.laborTitle')}</h3>
        <p class="small-text">${t('settings.budgetHelp')}</p>
        <div class="form-row compact" style="grid-template-columns: 1fr 1fr;">
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.budgetLabel')}
            <input type="number" min="0" step="1" value="${state.settings.laborBudget}" data-setting="laborBudget" />
          </label>
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.ratioLabel')}
            <input type="number" min="0" step="0.1" value="${state.settings.targetLaborRatio}" data-setting="targetLaborRatio" />
          </label>
        </div>
        <p class="small-text">${t('settings.ratioHelp')}</p>
      </div>
    </div>
    <div class="section-head" style="margin-top: 24px;">
      <div>
        <h2>${t('settings.accessTitle')}</h2>
        <p>${t('settings.accessHelp')}</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h3>${t('settings.companyNameLabel')}</h3>
        <p class="small-text">${t('settings.companyNameHelp')}</p>
        <label class="small-text" style="display:grid; gap:6px; max-width: 320px;">
          ${t('settings.companyNameLabel')}
          <input type="text" value="${escapeHtml(companyName)}" placeholder="${escapeHtml(t('settings.companyNamePlaceholder'))}" data-setting="companyName" />
        </label>
        <label class="small-text" style="display:grid; gap:6px; margin-top: 12px;">
          ${t('settings.companyCodeLabel')}
          <div class="copy-field">
            <input type="text" readonly value="${escapeHtml(companyCode)}" aria-readonly="true" />
            ${companyCode ? `<button class="btn secondary small" type="button" data-action="copy-company-code">${t('common.copy')}</button>` : `<button class="btn secondary small" type="button" disabled>${t('common.copy')}</button>`}
          </div>
          <span class="small-text">${t('settings.companyCodeHelp')}</span>
        </label>
      </div>
      <div class="card">
        <h3>${t('settings.employeePortalLabel')}</h3>
        <p class="small-text">${t('settings.employeePortalHelp')}</p>
        <label class="small-text" style="display:flex; align-items:center; gap:10px; margin-top: 12px;">
          <input type="checkbox" data-setting="employeePortalEnabled" ${employeePortalEnabled ? 'checked' : ''} />
          <span>${employeePortalEnabled ? t('settings.portalEnabled') : t('settings.portalDisabled')}</span>
        </label>
        <h4 style="margin-top: 18px;">${t('settings.inviteCodeLabel')}</h4>
        <p class="small-text">${t('settings.inviteCodeHelp')}</p>
        <p class="small-text">${t('settings.authNote')}</p>
      </div>
    </div>
    <div class="section-head" style="margin-top: 24px;">
      <div>
        <h2>${t('settings.supportTitle')}</h2>
        <p>${t('settings.supportSubtitle')}</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h3>${t('settings.adTitle')}</h3>
        <p class="small-text">${t('settings.adHelp')}</p>
        <div class="ad-slot">
          <div>
            <strong>${t('settings.adPlaceholder')}</strong>
            <p class="small-text" style="margin: 8px 0 0;">${t('settings.adNote')}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>${t('settings.feedbackTitle')}</h3>
        <p class="small-text">${t('settings.feedbackHelp')}</p>
        <div class="feedback-block" style="margin-top: 8px;">
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.feedbackEmailLabel')}
            <div class="copy-field">
              <input type="text" readonly value="${escapeHtml(feedbackEmail)}" aria-readonly="true" />
              <button class="btn secondary small" type="button" data-action="copy-feedback-email">${t('common.copy')}</button>
            </div>
            <span class="small-text">${t('settings.feedbackEmailHelp')}</span>
          </label>
          <label class="small-text" style="display:grid; gap:6px; margin-top: 12px;">
            ${t('settings.feedbackUrlLabel')}
            <div class="copy-field">
              <input type="text" readonly value="${escapeHtml(feedbackUrl)}" aria-readonly="true" />
              ${feedbackUrl ? `<button class="btn secondary small" type="button" data-action="copy-feedback-link">${t('common.copy')}</button>` : `<button class="btn secondary small" type="button" disabled>${t('common.copy')}</button>`}
            </div>
            <span class="small-text">${t('settings.feedbackUrlHelp')}</span>
          </label>
        </div>
        <div class="inline-actions" style="margin-top: 12px;">
          ${feedbackEmailHref ? `<a class="btn" href="${escapeHtml(feedbackEmailHref)}">${t('settings.feedbackOpenEmail')}</a>` : `<button class="btn" type="button" disabled>${t('settings.feedbackOpenEmail')}</button>`}
          ${feedbackUrl ? `<a class="btn secondary" href="${escapeHtml(feedbackUrl)}" target="_blank" rel="noopener noreferrer">${t('settings.feedbackOpenLink')}</a>` : `<button class="btn secondary" type="button" disabled>${t('settings.feedbackOpenLink')}</button>`}
        </div>
      </div>
    </div>
    <div class="card" style="margin-top: 24px;">
      <h3>${t('settings.backupTitle')}</h3>
      <p class="small-text">${t('settings.backupHelp')}</p>
      <div class="inline-actions">
        <button class="btn secondary" type="button" data-action="export-json">${t('common.exportJson')}</button>
        <label class="btn secondary file-label">${t('common.importJson')}<input type="file" accept="application/json,.json" data-action="import-json" /></label>
      </div>
    </div>
    <div class="card danger-zone" style="margin-top: 24px;">
      <h3>${t('settings.dataTitle')}</h3>
      <p class="small-text">${t('settings.resetHelp')}</p>
      <button class="btn danger" type="button" data-action="reset-all">${t('common.resetAll')}</button>
    </div>
    <p class="small-text" style="margin-top: 16px;"><button class="btn secondary small" type="button" data-tab="roadmap">${t('settings.roadmapLink')}</button></p>
  `;
}
