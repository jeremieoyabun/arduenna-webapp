export const RadarChart = ({ data, color, size = 160 }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angleStep = (Math.PI * 2) / labels.length;
  const getPoint = (i, val) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }} role="img" aria-label="Aromatic profile radar chart">
      {[25, 50, 75, 100].map((level) => (
        <polygon key={level} points={labels.map((_, i) => getPoint(i, level).join(",")).join(" ")}
          fill="none" stroke="var(--border-medium)" strokeWidth="0.5" />
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100)[0]} y2={getPoint(i, 100)[1]}
          stroke="var(--border-light)" strokeWidth="0.5" />
      ))}
      <polygon points={values.map((v, i) => getPoint(i, v).join(",")).join(" ")}
        fill={color + "22"} stroke={color} strokeWidth="1.5" />
      {values.map((v, i) => {
        const [px, py] = getPoint(i, v);
        return <circle key={i} cx={px} cy={py} r="2.5" fill={color} />;
      })}
      {labels.map((label, i) => {
        const [px, py] = getPoint(i, 115);
        return (
          <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-secondary)" fontSize="7" fontFamily="var(--font-body)" style={{ textTransform: "capitalize" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
};
