import { useEffect, useRef, useState } from 'react';
import { quadrantInfo, currentStreak, timeUntil, boxBreathingPhase, type Quadrant } from './flowlib';

function useLocal<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v: T) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}
const QUADS: Quadrant[] = ['do', 'schedule', 'delegate', 'delete'];
export function EisenhowerTool() {
  const [tasks, setTasks] = useLocal<Record<Quadrant, string[]>>('ff-eisenhower', { do: [], schedule: [], delegate: [], delete: [] });
  const [text, setText] = useState(''); const [q, setQ] = useState<Quadrant>('do');
  const add = () => {
    if (!text.trim()) return;
    setTasks({ ...tasks, [q]: [...tasks[q], text.trim()] });
    setText('');
  };
  const del = (quad: Quadrant, i: number) => setTasks({ ...tasks, [quad]: tasks[quad].filter((_, j) => j !== i) });
  return (
    <div className="panel">
      <div className="btn-row">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="New task..." style={{ flex: 1 }} />
        <select value={q} onChange={(e) => setQ(e.target.value as Quadrant)} style={{ width: 'auto' }}>
          {QUADS.map((k) => <option key={k} value={k}>{quadrantInfo(k).title}</option>)}
        </select>
        <button onClick={add}>Add</button>
      </div>
      <div className="tool-grid" style={{ marginTop: 12 }}>
        {QUADS.map((k) => (
          <div key={k} className="tool-card">
            <h3>{quadrantInfo(k).title}</h3>
            <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{quadrantInfo(k).hint}</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tasks[k].map((t, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 6 }}>
                  <span>{t}</span>
                  <button className="secondary" onClick={() => del(k, i)} aria-label="Remove">x</button>
                </li>))}
            </ul>
          </div>))}
      </div>
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Saved in your browser only - nothing is uploaded.</p>
    </div>
  );
}
export function HabitTool() {
  const [habits, setHabits] = useLocal<string[]>('ff-habits', []);
  const [checks, setChecks] = useLocal<Record<string, string[]>>('ff-checks', {});
  const [name, setName] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const toggle = (h: string) => {
    const days = checks[h] || [];
    setChecks({ ...checks, [h]: days.includes(today) ? days.filter((d) => d !== today) : [...days, today] });
  };
  return (
    <div className="panel">
      <div className="btn-row">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { setHabits([...habits, name.trim()]); setName(''); } }} placeholder="New habit (e.g. read 20 min)" style={{ flex: 1 }} />
        <button onClick={() => { if (name.trim()) { setHabits([...habits, name.trim()]); setName(''); } }}>Add</button>
      </div>
      {habits.length === 0 && <p>Add your first habit above.</p>}
      {habits.map((h) => {
        const days = checks[h] || [];
        const done = days.includes(today);
        return (
          <div key={h} className="tool-card" style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div><h3 style={{ margin: 0 }}>{h}</h3><p style={{ margin: 0, fontSize: '.85rem' }}>Streak: {currentStreak(days, today)} day{currentStreak(days, today) === 1 ? '' : 's'} | Total: {days.length}</p></div>
            <div className="btn-row">
              <button className={done ? 'secondary' : ''} onClick={() => toggle(h)}>{done ? 'Done today ✓' : 'Mark today'}</button>
              <button className="secondary" onClick={() => { const c = { ...checks }; delete c[h]; setChecks(c); setHabits(habits.filter((x) => x !== h)); }}>Remove</button>
            </div>
          </div>);
      })}
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Streaks stay alive until you miss a full day. Data stays in your browser.</p>
    </div>
  );
}
export function CountdownTool() {
  const [target, setTarget] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const t = target ? timeUntil(target, now) : null;
  return (
    <div className="panel">
      <label>Deadline date and time</label>
      <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
      {t && <div className="tool-grid" style={{ marginTop: 12 }}>
        <div className="tool-card"><h3>{t.days}</h3><p>days</p></div>
        <div className="tool-card"><h3>{t.hours}</h3><p>hours</p></div>
        <div className="tool-card"><h3>{t.minutes}</h3><p>minutes</p></div>
        <div className="tool-card"><h3>{t.seconds}</h3><p>seconds</p></div>
      </div>}
      {t && <p style={{ marginTop: 8 }}>{t.past ? 'This deadline has passed - shown as time since.' : 'Time remaining.'}</p>}
    </div>
  );
}
export function BreathingTool() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed((Date.now() - startRef.current) / 1000), 200);
    return () => clearInterval(id);
  }, [running]);
  const b = boxBreathingPhase(elapsed);
  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <div className="tool-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '2rem', margin: 0 }}>{running ? b.phase : 'Box breathing'}</h3>
        {running && <p style={{ fontSize: '1.4rem' }}>{b.phaseLeft}s</p>}
        <p style={{ color: 'var(--text-muted)' }}>4 seconds in, 4 hold, 4 out, 4 hold. Repeat for 2-5 minutes.</p>
      </div>
      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 12 }}>
        <button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</button>
        <button className="secondary" onClick={() => { setRunning(false); setElapsed(0); }}>Reset</button>
      </div>
    </div>
  );
}
