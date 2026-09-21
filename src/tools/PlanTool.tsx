import { useMemo, useState } from 'react';
import { planBlocks, fmtMin } from './flowlib';

export default function PlanTool() {
  const [rows, setRows] = useState([{ name: '', minutes: 25 }, { name: '', minutes: 25 }, { name: '', minutes: 25 }]);
  const [start, setStart] = useState('09:00');
  const startMin = (() => { const [h, m] = start.split(':').map(Number); return (h || 0) * 60 + (m || 0); })();
  const blocks = useMemo(() => planBlocks(rows, startMin), [rows, startMin]);
  const set = (i: number, k: 'name' | 'minutes', v: string) => {
    const n = [...rows];
    if (k === 'name') n[i].name = v; else n[i].minutes = parseInt(v) || 0;
    setRows(n);
  };
  return (
    <div className="panel">
      <label>Start time</label>
      <input type="time" value={start} onChange={(e) => setStart(e.target.value)} style={{ width: 'auto' }} />
      {rows.map((r, i) => (
        <div key={i} className="btn-row" style={{ marginTop: 8 }}>
          <input type="text" value={r.name} onChange={(e) => set(i, 'name', e.target.value)} placeholder={`Task ${i + 1}`} style={{ flex: 1 }} />
          <input type="number" value={r.minutes} onChange={(e) => set(i, 'minutes', e.target.value)} style={{ maxWidth: 80 }} min={5} step={5} />
          <span style={{ fontSize: '.85rem' }}>min</span>
        </div>))}
      <div className="btn-row" style={{ marginTop: 8 }}>
        <button className="secondary" onClick={() => setRows([...rows, { name: '', minutes: 25 }])}>Add task</button>
      </div>
      {blocks.length > 0 && (
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table><thead><tr><th>Time</th><th>Block</th></tr></thead>
            <tbody>{blocks.map((b, i) => (
              <tr key={i} style={{ opacity: b.kind === 'break' ? 0.6 : 1 }}>
                <td>{fmtMin(b.startMin)} - {fmtMin(b.endMin)}</td><td>{b.label}</td>
              </tr>))}</tbody></table>
        </div>)}
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>A 10-minute break is inserted automatically after every 50 minutes of work.</p>
    </div>
  );
}
