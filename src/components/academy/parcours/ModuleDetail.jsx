import { modulesData } from "../../../data/academy/modules";
import { lessonsData } from "../../../data/academy/lessons";
import { ProgressRing } from "../ui/ProgressRing";

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const LESSON_TYPE_LABELS = {
  swipe: "Découverte",
  mcq: "Quiz",
  truefalse: "Vrai/Faux",
};

const LESSON_TYPE_ICONS = {
  swipe: "📖",
  mcq: "❓",
  truefalse: "✓✗",
};

export const ModuleDetail = ({ moduleId, parcoursId, onBack, onStart, getModulePercent, isCompleted }) => {
  const module = modulesData.find(m => m.id === moduleId);
  const lessons = lessonsData[moduleId] || [];
  const percent = getModulePercent(parcoursId, moduleId);
  const completed = isCompleted(parcoursId, moduleId);

  if (!module) return null;

  // Count steps by type for the summary
  const swipeCount = lessons.filter(l => l.type === "swipe").length;
  const mcqCount = lessons.filter(l => l.type === "mcq").length;
  const tfCount = lessons.filter(l => l.type === "truefalse").length;

  const isStarted = percent > 0 && !completed;

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
            {module.titleFr}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: "var(--text-tertiary)", marginTop: 1,
          }}>
            {module.lessonCount} activités · {module.duration}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Progress / completed state */}
        <div style={{
          background: "var(--bg-surface)",
          borderRadius: 12,
          padding: "20px",
          border: "1px solid var(--border-light)",
          boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <ProgressRing percent={completed ? 100 : percent} size={56} stroke={4} />
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 600, color: "var(--text-primary)", marginBottom: 3,
            }}>
              {completed ? "Module terminé !" : isStarted ? "En cours" : "Non commencé"}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              color: "var(--text-tertiary)",
            }}>
              {module.descFr}
            </div>
          </div>
        </div>

        {/* Lesson breakdown */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-tertiary)", textTransform: "uppercase",
          letterSpacing: 1.5, marginBottom: 12,
        }}>
          Contenu
        </div>

        <div style={{
          background: "var(--bg-surface)",
          borderRadius: 12,
          border: "1px solid var(--border-light)",
          overflow: "hidden",
          marginBottom: 28,
        }}>
          {swipeCount > 0 && (
            <div style={{
              padding: "14px 18px",
              borderBottom: (mcqCount > 0 || tfCount > 0) ? "1px solid var(--border-light)" : "none",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>📖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Lecture découverte
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-tertiary)" }}>
                  {swipeCount} carte{swipeCount > 1 ? "s" : ""} à swiper
                </div>
              </div>
            </div>
          )}
          {mcqCount > 0 && (
            <div style={{
              padding: "14px 18px",
              borderBottom: tfCount > 0 ? "1px solid var(--border-light)" : "none",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>❓</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Quiz à choix multiple
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-tertiary)" }}>
                  {mcqCount} question{mcqCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          )}
          {tfCount > 0 && (
            <div style={{
              padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Vrai ou Faux
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-tertiary)" }}>
                  {tfCount} affirmation{tfCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: "#0b363d",
            color: "var(--text-on-dark)",
            border: "none",
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {completed ? "Recommencer" : isStarted ? "Continuer" : "Commencer"}
        </button>

        {completed && (
          <div style={{
            marginTop: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: "var(--text-tertiary)", textAlign: "center",
            fontStyle: "italic",
          }}>
            +50 XP obtenus
          </div>
        )}
      </div>
    </div>
  );
};
