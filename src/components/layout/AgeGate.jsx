export const AgeGate = ({ t, ageDenied, onVerify, onDeny }) => (
  <div className="age-gate" role="dialog" aria-label="Age verification">
    <div className="age-gate__card">
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        className="age-gate__logo"
      />
      <h2 className="age-gate__title">{t.ageGate.title}</h2>
      <p className="age-gate__question">{t.ageGate.question}</p>
      {ageDenied && <p className="age-gate__denied" role="alert">{t.ageGate.denied}</p>}
      <div className="age-gate__actions">
        <button onClick={onVerify} className="btn-primary">
          {t.ageGate.yes}
        </button>
        <button onClick={onDeny} className="btn-ghost">
          {t.ageGate.no}
        </button>
      </div>
    </div>
  </div>
);
