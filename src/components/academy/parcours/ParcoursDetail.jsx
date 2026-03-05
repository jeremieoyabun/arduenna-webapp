import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";
import { ModuleCard } from "../ui/ModuleCard";

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ParcoursDetail = ({ parcoursId, onBack, onSelectModule, getModulePercent, isLocked, isCompleted }) => {
  const parcours = parcoursData.find(p => p.id === parcoursId);
  const modules = modulesData
    .filter(m => m.parcoursId === parcoursId)
    .sort((a, b) => a.order - b.order);

  if (!parcours) return null;

  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border-light)",
        background: "var(--bg-surface)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={onBack}
          aria-label="Retour"
          style={{
            background: "var(--bg-muted)", border: "1px solid var(--border-light)",
            borderRadius: 10, padding: 0,
            cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40,
          }}
        >
          <BackIcon />
        </button>
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontWeight: 600, fontStyle: "italic",
            color: "var(--text-primary)",
          }}>
            {parcours.titleFr}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: "var(--text-tertiary)", marginTop: 1,
          }}>
            {parcours.descFr}
          </div>
        </div>
      </div>

      {/* Modules list */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-tertiary)", textTransform: "uppercase",
          letterSpacing: 1.5, marginBottom: 14,
        }}>
          {modules.length} modules
        </div>

        {modules.map(module => {
          const locked = isLocked(parcoursId, module.order);
          const completed = isCompleted(parcoursId, module.id);
          const percent = getModulePercent(parcoursId, module.id);
          return (
            <ModuleCard
              key={module.id}
              module={module}
              percent={percent}
              locked={locked}
              completed={completed}
              onClick={() => !locked && onSelectModule(module.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
