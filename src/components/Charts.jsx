import { useRef, useEffect } from 'react';

// Mini line chart using canvas
export function LineChart({ data, color = '#2563eb', height = 120, showDots = true, fill = true, animated = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const values = data.map(d => d.value);
    const max = Math.max(...values) * 1.1;
    const min = Math.min(...values) * 0.9;
    const range = max - min || 1;

    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartW,
      y: padding.top + chartH - ((d.value - min) / range) * chartH,
    }));

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      const val = max - (range / 4) * i;
      ctx.fillText(Math.round(val), padding.left - 8, y + 4);
    }

    // X labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) {
        ctx.fillText(d.label, points[i].x, h - 8);
      }
    });

    // Fill area
    if (fill) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, color + '25');
      gradient.addColorStop(1, color + '05');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Dots
    if (showDots) {
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [data, color, fill, showDots]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} className="rounded-xl" />;
}

// Bar chart
export function BarChart({ data, height = 200 }) {
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-3 justify-between" style={{ height: `${height}px` }}>
      {data.map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        const barColor = d.value > 80 ? 'from-red-400 to-red-500' : d.value > 50 ? 'from-amber-400 to-amber-500' : 'from-green-400 to-green-500';
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-semibold text-slate-600">{d.value}%</span>
            <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-100" style={{ height: `${height - 50}px` }}>
              <div
                className={`absolute bottom-0 w-full bg-gradient-to-t ${barColor} rounded-t-lg transition-all duration-1000 ease-out`}
                style={{ height: `${pct}%`, animationDelay: `${i * 100}ms` }}
              ></div>
            </div>
            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Sparkline for small inline charts
export function Sparkline({ data, color = '#2563eb', width = 120, height = 40 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - 4 - ((v - min) / range) * (height - 8),
    }));

    ctx.clearRect(0, 0, width, height);

    // fill
    ctx.beginPath();
    ctx.moveTo(0, height);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(width, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '20');
    gradient.addColorStop(1, color + '05');
    ctx.fillStyle = gradient;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // end dot
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [data, color, width, height]);

  return <canvas ref={canvasRef} style={{ width: `${width}px`, height: `${height}px` }} />;
}

// Donut chart
export function DonutChart({ value, max, color = '#2563eb', size = 100, label }) {
  const pct = (value / max) * 100;
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-900">{Math.round(pct)}%</span>
        </div>
      </div>
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
    </div>
  );
}
