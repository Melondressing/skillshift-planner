function employeeWorkBreakdown(employeeId) {
  return cached(`breakdown:${employeeId}`, () => computeWorkBreakdown(employeeId));
}
function computeWorkBreakdown(employeeId) {
  const employee = byId(state.employees, employeeId);
  const empty = {
    weekdayHours: 0,
    saturdayHours: 0,
    sundayHours: 0,
    weekdayCost: 0,
    saturdayCost: 0,
    sundayCost: 0,
    totalHours: 0,
    totalCost: 0,
  };
  if (!employee) return empty;
  return assignmentsOf(employeeId).reduce((acc, assignment) => {
    const req = getReqById(assignment.reqId);
    if (!req) return acc;
    const hours = durationHours(req.startTime, req.endTime);
    const cost = hours * getRate(employee, req.dayOfWeek);
    if (req.dayOfWeek === 'saturday') {
      acc.saturdayHours += hours;
      acc.saturdayCost += cost;
    } else if (req.dayOfWeek === 'sunday') {
      acc.sundayHours += hours;
      acc.sundayCost += cost;
    } else {
      acc.weekdayHours += hours;
      acc.weekdayCost += cost;
    }
    acc.totalHours += hours;
    acc.totalCost += cost;
    return acc;
  }, { ...empty });
}

function employeeWeeklyHours(employeeId) {
  return employeeWorkBreakdown(employeeId).totalHours;
}

function employeeWeeklyCost(employeeId) {
  return employeeWorkBreakdown(employeeId).totalCost;
}

function totalLaborCost() {
  return state.employees.reduce((total, emp) => total + employeeWeeklyCost(emp.id), 0);
}

// Hours and cost of the employees whose home Part is partId.
function partLabor(partId) {
  return state.employees
    .filter((emp) => emp.partId === partId)
    .reduce((acc, emp) => {
      const bd = employeeWorkBreakdown(emp.id);
      acc.hours += bd.totalHours;
      acc.cost += bd.totalCost;
      return acc;
    }, { hours: 0, cost: 0 });
}

function laborSummary() {
  const cost = totalLaborCost();
  const budget = num(state.settings.laborBudget);
  const ratio = budget ? (cost / budget) * 100 : 0;
  const targetRatio = num(state.settings.targetLaborRatio) / 100;
  const neededSales = targetRatio ? cost / targetRatio : 0;
  const status = ratio > 100 ? 'danger' : ratio >= 90 ? 'warn' : '';
  const budgetNote = ratio > 100
    ? t('dashboard.overBudget', { amount: money(cost - budget) })
    : t('dashboard.remainingBudget', { amount: money(budget - cost) });
  return { cost, budget, ratio, neededSales, status, budgetNote };
}
