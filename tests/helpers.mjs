import { loadApp } from "../scripts/load-app.mjs";

// Values created inside the app's VM have their own prototypes; round-trip
// through JSON before deep comparisons.
export const plain = (value) => JSON.parse(JSON.stringify(value));

// Loads app.js once and returns helpers that reset to the built-in default
// roster (fixed ids, empty schedule) before each test.
export function setupApp() {
  const loaded = loadApp();
  const { app } = loaded;
  return {
    ...loaded,
    reset() {
      loaded.setState(app.createDefaultState());
      return loaded.getState();
    },
    employee: (id) => app.byId(loaded.getState().employees, id),
    req: (id) => app.getReqById(id),
    sreq: (reqId, sreqId) => app.getStationReq(reqId, sreqId),
    assign(reqId, sreqId, employeeId, slotIndex = 0) {
      const key = app.assignmentKey(reqId, sreqId, slotIndex);
      loaded.getState().schedule[key] = employeeId;
      return key;
    },
  };
}

// Default roster ids used across tests.
export const MON_OPENING = "req_monday_0"; // 09:00–10:30
export const MON_LUNCH_PREP = "req_monday_1"; // 10:30–11:30
export const MON_LUNCH_PEAK = "req_monday_2"; // 11:30–14:30, peak
export const SAT_LUNCH_PEAK = "req_saturday_2"; // 11:30–14:30, peak
export const HOT = (reqId) => `sreq_${reqId.slice(4)}_0_0`; // hot station in lunch peak, min Level 2 Step 1
export const FRY = (reqId) => `sreq_${reqId.slice(4)}_1_0`; // fry station in lunch peak, min Level 2 Step 1
