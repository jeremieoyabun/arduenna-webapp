import { RadarChart } from "../ui/RadarChart";
import { IconX } from "../ui/Icons";

export const Products = ({ t, lang, sectionRefs, productsData, selectedProduct, setSelectedProduct }) => (
  <>
    <section id="products" ref={(el) => (sectionRefs.current.products = el)} className="section section--wide">
      <div className="divider" />
      <div className="section-header reveal">
        <div className="section-overline">{t.products.sectionLabel}</div>
        <h2 className="section-title">{t.products.title}</h2>
      </div>

      <div className="grid-2 reveal">
        {productsData.map((p) => (
          <div key={p.id} className="card card--interactive product-card" onClick={() => setSelectedProduct(p)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelectedProduct(p)}>
            <img src={p.img} alt={lang === "fr" ? p.nameFr : p.nameEn} className="product-card__img" />
            <h3 className="product-card__name">{lang === "fr" ? p.nameFr : p.nameEn}</h3>
            <div className="product-card__meta">{p.volume} · {p.abv}</div>
            <div className="product-card__price">{p.price}</div>
            <div className="product-card__radar">
              <RadarChart data={p.profile} color={p.color} size={440} />
            </div>
            <div className="product-card__serve">
              <strong>{t.products.perfectServe}</strong> · {lang === "fr" ? p.perfectServeFr : p.perfectServeEn}
            </div>
            <p className="product-card__desc">{lang === "fr" ? p.descFr : p.descEn}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Product Modal */}
    {selectedProduct && (
      <div className="overlay" onClick={() => setSelectedProduct(null)} role="dialog" aria-label={lang === "fr" ? selectedProduct.nameFr : selectedProduct.nameEn}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <div>
              <img
                src={selectedProduct.img}
                alt={lang === "fr" ? selectedProduct.nameFr : selectedProduct.nameEn}
                style={{ width: 80, height: 110, objectFit: "contain", marginBottom: "var(--space-2)" }}
              />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)" }}>
                {lang === "fr" ? selectedProduct.nameFr : selectedProduct.nameEn}
              </h3>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-tertiary)", marginTop: "var(--space-1)" }}>
                {selectedProduct.volume} · {selectedProduct.abv} · {selectedProduct.price}
              </div>
            </div>
            <button className="modal__close" onClick={() => setSelectedProduct(null)} aria-label="Close"><IconX /></button>
          </div>

          <p className="body-text" style={{ marginBottom: "var(--space-6)" }}>
            {lang === "fr" ? selectedProduct.descFr : selectedProduct.descEn}
          </p>

          <div className="modal__block">
            <div className="modal__block-title">{t.products.perfectServe}</div>
            <div className="body-text" style={{ fontSize: "var(--text-sm)", color: "var(--accent-secondary)" }}>
              {lang === "fr" ? selectedProduct.perfectServeFr : selectedProduct.perfectServeEn}
            </div>
          </div>

          <div className="modal__block">
            <div className="modal__block-title">{t.products.profile}</div>
            <div style={{ maxWidth: 320, margin: "0 auto" }}>
              <RadarChart data={selectedProduct.profile} color={selectedProduct.color} size={320} />
            </div>
          </div>

          <div className="modal__block">
            <div className="modal__block-title">{t.products.pairings}</div>
            <div className="body-text" style={{ fontSize: "var(--text-sm)" }}>
              {(lang === "fr" ? selectedProduct.pairingsFr : selectedProduct.pairingsEn).join(" · ")}
            </div>
          </div>

          <div className="modal__block">
            <div className="modal__block-title">{t.products.certifications}</div>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {selectedProduct.certs.map((c) => (
                <span key={c} className="cert-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
