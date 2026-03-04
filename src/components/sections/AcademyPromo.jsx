import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const IconBook = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <path d="M8 7h8M8 11h6" />
  </svg>
);

const IconTrophy = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 1012 0V2z" />
  </svg>
);

const IconCert = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M7 12h10M7 8h10M7 16h6" />
    <circle cx="18" cy="18" r="3" />
    <path d="M18 21v-1.5" />
  </svg>
);

export const AcademyPromo = ({ t }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { icon: <IconBook />, title: t.academyPromo.feat1, desc: t.academyPromo.feat1Desc },
    { icon: <IconTrophy />, title: t.academyPromo.feat2, desc: t.academyPromo.feat2Desc },
    { icon: <IconCert />, title: t.academyPromo.feat3, desc: t.academyPromo.feat3Desc },
  ];

  return (
    <section className="section">
      <div className="divider" />
      <div className="section-header reveal">
        <div className="section-overline">{t.academyPromo.sectionLabel}</div>
        <h2 className="section-title">{t.academyPromo.title}</h2>
        <p className="section-subtitle">{t.academyPromo.subtitle}</p>
      </div>

      <div className="grid-3 reveal">
        {features.map((f, i) => (
          <div
            key={i}
            className={`card reveal reveal--delay-${i + 1}`}
            style={{ textAlign: "center", padding: "var(--space-8) var(--space-6)" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: 16,
              background: "rgba(194,116,74,0.10)",
              color: "var(--accent-secondary)",
              marginBottom: "var(--space-4)",
            }}>
              {f.icon}
            </div>
            <h4 style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 500, fontStyle: "italic",
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}>
              {f.title}
            </h4>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              lineHeight: "var(--leading-normal)",
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
        <button
          className="btn-primary"
          onClick={() => navigate(user ? "/academy" : "/login")}
          style={{ padding: "14px 36px" }}
        >
          {t.academyPromo.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, verticalAlign: "middle" }}>
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
};
