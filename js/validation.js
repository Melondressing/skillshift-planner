function calculateValidation() {
  return cached('validation', computeValidation);
}
function computeValidation() {
  const issues = [];
  // kind is a stable code for logic; type is its label in the current language.
  const issue = (kind, fields) => issues.push({ kind, type: t(`issues.${kind}`), ...fields });
  const assignmentsByReq = getAssignments().reduce((acc, a) => {
    (acc[a.reqId] ||= []).push(a);
    return acc;
  }, {});

  state.requirements.forEach((req) => {
    req.stationRequirements.forEach((sreq) => {
      for (let i = 0; i < seatCount(sreq); i += 1) {
        const key = assignmentKey(req.id, sreq.id, i);
        const employeeId = state.schedule[key];
        const seat = { req, sreq, slotIndex: i };
        if (!employeeId) {
          issue('unassigned', { ...seat, severity: 'high', message: t('issues.unassignedMsg', { when: `${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime}`, part: partName(sreq.partId), station: stationName(sreq.stationId) }) });
          continue;
        }
        const employee = byId(state.employees, employeeId);
        if (!employee) {
          issue('missingEmployee', { ...seat, severity: 'high', message: t('issues.missingEmployeeMsg') });
          continue;
        }
        const availability = isEmployeeAvailable(employee, req);
        if (availability.status !== 'ok') {
          issue('availability', { ...seat, severity: availability.status === 'partial' ? 'medium' : 'high', employee, message: `${employee.name}: ${availability.reason}` });
        }
        const skill = compareLevelStep(employee, sreq);
        if (skill.status === 'bad') {
          issue('skillShort', { ...seat, severity: 'high', employee, message: `${employee.name}: ${skill.reason}` });
        } else if (skill.status !== 'ok') {
          issue('skillCaution', { ...seat, severity: 'medium', employee, message: `${employee.name}: ${skill.reason}` });
        }
        const replacements = getRecommendations(req, sreq, employee.id, key).filter((r) => ['fit', 'partial', 'emergency'].includes(r.category));
        if (!replacements.length) {
          issue('noReplacement', { ...seat, severity: 'medium', employee, message: t('issues.noReplacementMsg', { name: employee.name }) });
        }
      }
    });

    const duplicates = (assignmentsByReq[req.id] || []).reduce((acc, a) => {
      acc[a.employeeId] = (acc[a.employeeId] || 0) + 1;
      return acc;
    }, {});
    Object.entries(duplicates).forEach(([employeeId, count]) => {
      if (count > 1) {
        issue('doubleBooked', { severity: 'high', req, message: t('issues.doubleBookedMsg', { name: employeeName(employeeId), count }) });
      }
    });
  });

  state.employees.forEach((emp) => {
    const hours = employeeWeeklyHours(emp.id);
    if (hours > num(emp.maxWeeklyHours, 999)) {
      issue('overMaxHours', { severity: 'high', employee: emp, message: t('issues.overMaxMsg', { name: emp.name, hours: hours.toFixed(1), max: emp.maxWeeklyHours }) });
    }
  });

  const totalCost = totalLaborCost();
  if (state.settings.laborBudget && totalCost > state.settings.laborBudget) {
    issue('overBudget', { severity: 'high', message: t('issues.overBudgetMsg', { cost: money(totalCost), budget: money(state.settings.laborBudget) }) });
  }

  return issues;
}
