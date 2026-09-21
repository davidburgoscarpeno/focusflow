export type Quadrant = 'do' | 'schedule' | 'delegate' | 'delete';
export function quadrantInfo(q: Quadrant): { title: string; hint: string } {
  return {
    do: { title: 'Do first', hint: 'Urgent and important' },
    schedule: { title: 'Schedule', hint: 'Important, not urgent' },
    delegate: { title: 'Delegate', hint: 'Urgent, not important' },
    delete: { title: 'Delete', hint: 'Neither urgent nor important' },
  }[q];
}
function localIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function currentStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date(today + 'T00:00:00');
  if (!set.has(today)) d.setDate(d.getDate() - 1); // today not checked yet: streak can continue from yesterday
  while (set.has(localIso(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
export function timeUntil(targetIso: string, now: Date): { days: number; hours: number; minutes: number; seconds: number; past: boolean } {
  const diff = new Date(targetIso).getTime() - now.getTime();
  const abs = Math.abs(diff);
  return {
    days: Math.floor(abs / 86400000),
    hours: Math.floor((abs % 86400000) / 3600000),
    minutes: Math.floor((abs % 3600000) / 60000),
    seconds: Math.floor((abs % 60000) / 1000),
    past: diff < 0,
  };
}
export function boxBreathingPhase(elapsedSec: number, phaseSec = 4): { phase: string; intoPhase: number; phaseLeft: number } {
  const names = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];
  const pos = elapsedSec % (phaseSec * 4);
  const idx = Math.floor(pos / phaseSec);
  return { phase: names[idx], intoPhase: Math.floor(pos % phaseSec), phaseLeft: phaseSec - Math.floor(pos % phaseSec) };
}

export interface Block { label: string; startMin: number; endMin: number; kind: 'task' | 'break' }
export function planBlocks(tasks: { name: string; minutes: number }[], startMin: number, breakEvery = 50, breakLen = 10): Block[] {
  const blocks: Block[] = [];
  let cursor = startMin, sinceBreak = 0;
  for (const t of tasks) {
    if (!t.name.trim() || t.minutes <= 0) continue;
    if (sinceBreak >= breakEvery) { blocks.push({ label: 'Break', startMin: cursor, endMin: cursor + breakLen, kind: 'break' }); cursor += breakLen; sinceBreak = 0; }
    blocks.push({ label: t.name.trim(), startMin: cursor, endMin: cursor + t.minutes, kind: 'task' });
    cursor += t.minutes; sinceBreak += t.minutes;
  }
  return blocks;
}
export function fmtMin(m: number): string {
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
