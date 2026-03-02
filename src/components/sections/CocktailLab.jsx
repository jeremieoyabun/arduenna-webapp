import { seasonEmojis } from "../../data/translations";
import { IconFlask, IconHeart, IconHeartFilled, IconShare, IconDownload, IconX } from "../ui/Icons";

export const CocktailLab = ({
  t, lang, sectionRefs, productsData,
  filteredCocktails, cocktailFilter, setCocktailFilter,
  seasonFilter, setSeasonFilter,
  savedCocktails, toggleSaved, heartPulse,
  selectedCocktail, setSelectedCocktail,
  shareCocktail, downloadRecipeCard,
}) => (
  <>
    <section id="cocktails" ref={(el) => (sectionRefs.current.cocktails = el)} className="section section--wide">
      <div className="divider" />
      <div className="section-header reveal">
        <div className="section-overline">{t.cocktails.sectionLabel}</div>
        <h2 className="section-title">{t.cocktails.title}</h2>
        <p className="section-subtitle">{t.cocktails.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="filter-bar reveal">
        {["all", "gin", "noalcohol", "aperitivo"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${cocktailFilter === f ? "filter-chip--active" : ""}`}
            onClick={() => setCocktailFilter(f)}
            aria-pressed={cocktailFilter === f}
          >
            {f === "all" ? t.cocktails.all : productsData.find((p) => p.id === f)?.[lang === "fr" ? "nameFr" : "nameEn"] || f}
          </button>
        ))}
        <span className="filter-separator" aria-hidden="true" />
        {["all", "allYear", "summer", "winter", "spring", "autumn"].map((s) => (
          <button
            key={s}
            className={`filter-chip ${seasonFilter === s ? "filter-chip--active" : ""}`}
            onClick={() => setSeasonFilter(s)}
            aria-pressed={seasonFilter === s}
          >
            {s === "all" ? t.cocktails.all : t.cocktails[s]}
          </button>
        ))}
      </div>

      {/* Filter result count */}
      <div className="filter-count reveal" aria-live="polite">
        {filteredCocktails.length} {t.cocktails.results}
      </div>

      {/* Cocktail grid */}
      <div className="grid-2 reveal">
        {filteredCocktails.map((c) => (
          <div key={c.id} className="card card--interactive cocktail-card" onClick={() => setSelectedCocktail(c)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelectedCocktail(c)}>
            <div className="cocktail-card__header">
              <h4 className="cocktail-card__name">{lang === "fr" ? c.nameFr : c.nameEn}</h4>
              <button
                className={`cocktail-card__save ${savedCocktails.includes(c.id) ? "cocktail-card__save--active" : ""} ${heartPulse === c.id ? "heart-pulse" : ""}`}
                onClick={(e) => { e.stopPropagation(); toggleSaved(c.id); }}
                aria-label={savedCocktails.includes(c.id) ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={savedCocktails.includes(c.id)}
              >
                {savedCocktails.includes(c.id) ? <IconHeartFilled /> : <IconHeart />}
              </button>
            </div>
            <div className="cocktail-card__tags">
              <span className="tag">
                {productsData.find((p) => p.id === c.product)?.[lang === "fr" ? "nameFr" : "nameEn"]}
              </span>
              <span className={`tag ${c.difficulty === "easy" ? "tag--sage" : c.difficulty === "medium" ? "tag--copper" : "tag--teal"}`}>
                {t.cocktails[c.difficulty]}
              </span>
              <span className="tag">{seasonEmojis[c.season]} {t.cocktails[c.season] || t.cocktails.allYear}</span>
            </div>
            <div className="cocktail-card__accroche">{lang === "fr" ? c.accrocheFr : c.accrocheEn}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Cocktail Modal */}
    {selectedCocktail && (
      <div className="overlay" onClick={() => setSelectedCocktail(null)} role="dialog" aria-label={lang === "fr" ? selectedCocktail.nameFr : selectedCocktail.nameEn}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)" }}>
                {lang === "fr" ? selectedCocktail.nameFr : selectedCocktail.nameEn}
              </h3>
              <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <span className={`tag ${selectedCocktail.difficulty === "easy" ? "tag--sage" : selectedCocktail.difficulty === "medium" ? "tag--copper" : "tag--teal"}`}>
                  {t.cocktails[selectedCocktail.difficulty]}
                </span>
                <span className="tag">{seasonEmojis[selectedCocktail.season]} {t.cocktails[selectedCocktail.season] || t.cocktails.allYear}</span>
              </div>
            </div>
            <button className="modal__close" onClick={() => setSelectedCocktail(null)} aria-label="Close"><IconX /></button>
          </div>

          {/* Narrative hook */}
          <p className="modal__accroche">
            {lang === "fr" ? selectedCocktail.accrocheFr : selectedCocktail.accrocheEn}
          </p>

          <div className="modal__block">
            <div className="modal__block-title" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <IconFlask /> {t.cocktails.ingredients}
            </div>
            {(lang === "fr" ? selectedCocktail.ingredientsFr : selectedCocktail.ingredientsEn).map((ing, i) => (
              <div key={i} className="body-text" style={{
                fontSize: "var(--text-sm)", padding: "var(--space-1) 0",
                borderBottom: i < (lang === "fr" ? selectedCocktail.ingredientsFr : selectedCocktail.ingredientsEn).length - 1 ? "1px solid var(--border-light)" : "none",
              }}>
                {ing}
              </div>
            ))}
          </div>

          <div className="modal__block">
            <div className="modal__block-title">{t.cocktails.steps}</div>
            {(lang === "fr" ? selectedCocktail.stepsFr : selectedCocktail.stepsEn).map((step, i) => (
              <div key={i} className="body-text" style={{
                display: "flex", gap: "var(--space-3)", padding: "var(--space-1) 0", fontSize: "var(--text-sm)",
              }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 500, minWidth: 20, fontFamily: "var(--font-body)" }}>{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-4)" }} className="body-text">
            <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>{t.cocktails.garnish}:</span>
            <span style={{ fontSize: "var(--text-sm)" }}>{lang === "fr" ? selectedCocktail.garnishFr : selectedCocktail.garnishEn}</span>
          </div>

          {/* Sticky action bar */}
          <div className="action-bar">
            <button
              className={`action-bar__btn ${savedCocktails.includes(selectedCocktail.id) ? "action-bar__btn--active" : ""} ${heartPulse === selectedCocktail.id ? "heart-pulse" : ""}`}
              onClick={() => toggleSaved(selectedCocktail.id)}
              aria-label={savedCocktails.includes(selectedCocktail.id) ? "Remove from favourites" : "Add to favourites"}
            >
              {savedCocktails.includes(selectedCocktail.id) ? <IconHeartFilled /> : <IconHeart />}
              {savedCocktails.includes(selectedCocktail.id) ? t.cocktails.saved : t.cocktails.save}
            </button>
            <button
              className="action-bar__btn"
              onClick={() => shareCocktail(selectedCocktail)}
              aria-label="Share recipe"
            >
              <IconShare />
              {t.cocktails.share}
            </button>
            <button
              className="action-bar__btn"
              onClick={() => downloadRecipeCard(selectedCocktail)}
              aria-label="Download recipe card"
            >
              <IconDownload />
              {t.cocktails.download}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
