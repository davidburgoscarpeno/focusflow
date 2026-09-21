import { useEffect, useRef, useState } from 'react';

type Phase = 'focus' | 'short' | 'long';
const DEFAULTS: Record<Phase, number> = { focus: 25, short: 5, long: 15 };

function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PomodoroTool() {
  const [mins, setMins] = useState(DEFAULTS);
  const [phase, setPhase] = useState<Phase>('focus');
  const [round, setRound] = useState(0);
  const [left, setLeft] = useState(DEFAULTS.focus * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const remain = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remain);
      if (remain <= 0) {
        setRunning(false);
        const doneFocus = phase === 'focus';
        const newRound = doneFocus ? round + 1 : round;
        setRound(newRound);
        const next: Phase = doneFocus ? (newRound % 4 === 0 ? 'long' : 'short') : 'focus';
        setPhase(next);
        setLeft(mins[next] * 60);
        try { new AudioContext(); } catch {}
      }
    };
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [running, phase, round, mins]);

  function start() { endAt.current = Date.now() + left * 1000; setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setPhase('focus'); setRound(0); setLeft(mins.focus * 60); }
  function setDuration(p: Phase, v: string) {
    const n = Math.max(1, Math.min(120, parseInt(v) || DEFAULTS[p]));
    const nm = { ...mins, [p]: n };
    setMins(nm);
    if (!running && phase === p) setLeft(n * 60);
  }
  const label = phase === 'focus' ? 'Focus' : phase === 'short' ? 'Short break' : 'Long break';
  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700 }}>{label} {phase === 'focus' ? `- round ${round + 1}` : ''}</p>
      <p style={{ fontSize: '4rem', fontFamily: 'var(--font-mono)', margin: '8px 0' }} aria-live="polite">{fmt(left)}</p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        {!running ? <button onClick={start}>Start</button> : <button onClick={pause}>Pause</button>}
        <button className="secondary" onClick={reset}>Reset</button>
      </div>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        {(['focus', 'short', 'long'] as Phase[]).map((p) => (
          <label key={p}>{p === 'focus' ? 'Focus' : p === 'short' ? 'Break' : 'Long'} min<br />
            <input type="text" inputMode="numeric" style={{ maxWidth: 70 }} value={mins[p]} onChange={(e) => setDuration(p, e.target.value)} />
          </label>
        ))}
      </div>
    </div>
  );
}
