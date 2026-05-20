export function nowIso() {
  return new Date().toISOString();
}

export function todayCompact() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

export function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
