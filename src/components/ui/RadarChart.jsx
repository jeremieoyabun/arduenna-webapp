export const RadarChart = ({ data, color, size = 160 }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  // Expand viewBox by 32% on each side to give labels room without clipping
  const padding = size * 0.32;
  const vbSize = size + padding * 2;
  const cx = vbSize / 2, cy = vbSize / 2, r = size * 0.38;
  const angleStep = (Math.PI * 2) / labels.length;
  const getPoint = (i, val) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  };
  const fontSize = Math.max(13, size * 0.068);
  return (
    <svg viewBox={`0 0 ${vbSize} ${vbSize}`} style={{ width: "100%", maxWidth: size + padding * 2 }} role="img" aria-label="Aromatic profile radar chart">
      {[25, 50, 75, 100].map((level) => (
        <polygon key={level} points={labels.map((_, i) => getPoint(i, level).join(",")).join(" ")}
          fill="none" stroke="var(--border-medium)" strokeWidth="1.2" />
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100)[0]} y2={getPoint(i, 100)[1]}
          stroke="var(--border-medium)" strokeWidth="1.2" />
      ))}
      <polygon points={values.map((v, i) => getPoint(i, v).join(",")).join(" ")}
        fill={color + "28"} stroke={color} strokeWidth="2.5" />
      {values.map((v, i) => {
        const [px, py] = getPoint(i, v);
        return <circle key={i} cx={px} cy={py} r="3.5" fill={color} />;
      })}
      {labels.map((label, i) => {
        const [px, py] = getPoint(i, 120);
        return (
          <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-primary)" fontSize={fontSize} fontFamily="var(--font-body)" fontWeight="600"
            style={{ textTransform: "capitalize" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
};
