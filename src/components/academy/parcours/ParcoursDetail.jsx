import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";
import { ModuleCard } from "../ui/ModuleCard";

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          style={{
            background: "none", border: "none", padding: "4px 0",
            cursor: "pointer", color: "var(--text-primary)", display: "flex",
            alignItems: "center",
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
