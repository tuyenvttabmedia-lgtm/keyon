export type AlertRecord = {
  id: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
  at: string;
};

const alerts: AlertRecord[] = [];
const MAX = 100;

export function fireAlert(input: {
  level?: AlertRecord["level"];
  source: string;
  message: string;
}): AlertRecord {
  const row: AlertRecord = {
    id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    level: input.level ?? "warn",
    source: input.source,
    message: input.message,
    at: new Date().toISOString(),
  };
  alerts.unshift(row);
  if (alerts.length > MAX) alerts.pop();
  return row;
}

export function listAlerts(take = 20) {
  return alerts.slice(0, take);
}

export function clearAlerts() {
  alerts.length = 0;
}
