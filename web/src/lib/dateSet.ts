export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseIsoDate(iso: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

/** Adds or removes every date from startIso to endIso (inclusive, either order) from the set, returning a new Set. */
export function applyDateRange(
  dates: Set<string>,
  startIso: string,
  endIso: string,
  add: boolean,
): Set<string> {
  const next = new Set(dates);
  const [a, b] = [new Date(startIso), new Date(endIso)].sort(
    (x, y) => x.getTime() - y.getTime(),
  );
  for (const d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
    const iso = isoDate(d.getFullYear(), d.getMonth(), d.getDate());
    if (add) next.add(iso);
    else next.delete(iso);
  }
  return next;
}

/** Groups sorted ISO dates into contiguous runs, e.g. ["10-03","10-04","10-10"] -> [["10-03","10-04"],["10-10"]]. */
export function groupRuns(sortedIsoDates: string[]): string[][] {
  const runs: string[][] = [];
  let run: string[] = [];
  for (const iso of sortedIsoDates) {
    if (run.length === 0) {
      run = [iso];
      continue;
    }
    const prev = new Date(run[run.length - 1]);
    prev.setDate(prev.getDate() + 1);
    const expected = isoDate(prev.getFullYear(), prev.getMonth(), prev.getDate());
    if (expected === iso) {
      run.push(iso);
    } else {
      runs.push(run);
      run = [iso];
    }
  }
  if (run.length) runs.push(run);
  return runs;
}
