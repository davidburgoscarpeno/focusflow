import { describe, it, expect } from 'vitest';
import { currentStreak, timeUntil, boxBreathingPhase, quadrantInfo } from '../src/tools/flowlib';
describe('streaks', () => {
  it('counts back from today', () => expect(currentStreak(['2026-09-20', '2026-09-21', '2026-09-22'], '2026-09-22')).toBe(3));
  it('survives today unchecked', () => expect(currentStreak(['2026-09-21'], '2026-09-22')).toBe(1));
  it('breaks on gap', () => expect(currentStreak(['2026-09-19', '2026-09-21'], '2026-09-22')).toBe(1));
  it('zero when nothing', () => expect(currentStreak([], '2026-09-22')).toBe(0));
});
describe('countdown', () => {
  const now = new Date('2026-09-22T12:00:00Z');
  it('computes remaining', () => {
    const t = timeUntil('2026-09-24T14:30:00Z', now);
    expect(t.days).toBe(2); expect(t.hours).toBe(2); expect(t.minutes).toBe(30); expect(t.past).toBe(false);
  });
  it('marks past', () => expect(timeUntil('2026-09-20T12:00:00Z', now).past).toBe(true));
});
describe('breathing', () => {
  it('cycles phases', () => {
    expect(boxBreathingPhase(0).phase).toBe('Breathe in');
    expect(boxBreathingPhase(5).phase).toBe('Hold');
    expect(boxBreathingPhase(9).phase).toBe('Breathe out');
    expect(boxBreathingPhase(16).phase).toBe('Breathe in');
  });
  it('counts down phase time', () => expect(boxBreathingPhase(1).phaseLeft).toBe(3));
});
describe('quadrants', () => {
  it('has all four', () => expect(['do', 'schedule', 'delegate', 'delete'].map((q) => quadrantInfo(q as any).title)).toEqual(['Do first', 'Schedule', 'Delegate', 'Delete']));
});
import { planBlocks, fmtMin } from '../src/tools/flowlib';
describe('time blocking', () => {
  it('inserts break after 50 min', () => {
    const b = planBlocks([{ name: 'a', minutes: 30 }, { name: 'b', minutes: 30 }, { name: 'c', minutes: 30 }], 540);
    expect(b[2].kind).toBe('break');
    expect(b.map((x) => x.kind)).toEqual(['task', 'task', 'break', 'task']);
  });
  it('skips empty tasks', () => expect(planBlocks([{ name: '', minutes: 30 }, { name: 'x', minutes: 10 }], 0).length).toBe(1));
  it('fmtMin', () => expect(fmtMin(545)).toBe('09:05'));
});
