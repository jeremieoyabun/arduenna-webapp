import { ProgressRing } from "./ProgressRing";
import { LockOverlay } from "./LockOverlay";

export const ModuleCard = ({ module, percent = 0, locked = false, completed = false, onClick }) => (
  <div
    className="module-card"
    onClick={locked ? undefined : onClick}
    style={{ cursor: locked ? "default" : "pointer" }}
  >
    <div className="module-card__ring">
      <ProgressRing percent={completed ? 100 : percent} size={44} stroke={3} />
      {completed && (
        <div className="module-card__check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
    <div className="module-card__body">
      <div className="module-card__title">{module.titleFr}</div>
      <div className="module-card__meta">{module.lessonCount} leçons · {module.duration}</div>
    </div>
    {locked && <LockOverlay />}
  </div>
);
