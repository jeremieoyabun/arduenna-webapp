export const Story = ({ t, sectionRefs, theme }) => {
  const isDark = theme === "dark";

  const botanicals = [
    {
      name: t.story.botanical1,
      latin: t.story.botanical1Latin,
      desc: t.story.botanical1Desc,
      img: isDark ? "/Mirabelle-dark.webp" : "/Mirabelle.webp",
    },
    {
      name: t.story.botanical2,
      latin: t.story.botanical2Latin,
      desc: t.story.botanical2Desc,
      img: isDark ? "/Sapin-dark.webp" : "/Sapin.webp",
    },
    {
      name: t.story.botanical3,
      latin: t.story.botanical3Latin,
      desc: t.story.botanical3Desc,
      img: "/Sureau.avif",
    },
  ];

  return (
    <section id="story" ref={(el) => (sectionRefs.current.story = el)} className="section">
      <div className="divider" />
      <div className="section-header reveal">
        <div className="section-overline">{t.story.sectionLabel}</div>
        <h2 className="section-title">{t.story.title}</h2>
      </div>

      <div className="body-text reveal" style={{ textAlign: "center", maxWidth: "var(--max-width-text)", margin: "0 auto var(--space-10)" }}>
        <p style={{ marginBottom: "var(--space-5)" }}>{t.story.p1}</p>
        <p style={{ marginBottom: "var(--space-5)" }}>{t.story.p2}</p>
        <p>{t.story.p3}</p>
      </div>

      <div className="grid-3">
        {botanicals.map((b, i) => (
          <div key={b.name} className={`card botanical-card reveal reveal--delay-${i + 1}`}>
            <img src={b.img} alt={b.name} className="botanical-card__img" loading="lazy" />
            <h4 className="botanical-card__name">{b.name}</h4>
            <div className="botanical-card__latin">{b.latin}</div>
            <p className="botanical-card__desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
