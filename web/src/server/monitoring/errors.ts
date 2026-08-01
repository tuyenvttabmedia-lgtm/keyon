/** Process-local error counters for Monitoring (Outer Layer). */
const state = {
  total: 0,
  by_status: {} as Record<string, number>,
  by_code: {} as Record<string, number>,
  last_at: null as string | null,
};

export function recordError(status: number, code?: string) {
  state.total++;
  const s = String(status);
  state.by_status[s] = (state.by_status[s] ?? 0) + 1;
  if (code) state.by_code[code] = (state.by_code[code] ?? 0) + 1;
  state.last_at = new Date().toISOString();
}

export function errorStats() {
  const windowTotal = state.total;
  const serverErrors = (state.by_status["500"] ?? 0) + (state.by_status["503"] ?? 0);
  return {
    total: windowTotal,
    by_status: { ...state.by_status },
    by_code: { ...state.by_code },
    error_rate_5xx: windowTotal === 0 ? 0 : serverErrors / windowTotal,
    last_at: state.last_at,
  };
}

/** Test helper */
export function resetErrorStats() {
  state.total = 0;
  state.by_status = {};
  state.by_code = {};
  state.last_at = null;
}
