import { useState, useEffect, useRef, useCallback } from "react";
import { productsData } from "../data/products";
import { cocktailsData } from "../data/cocktails";
import { Navbar, BottomNav } from "../components/layout/Navbar";
import { MobileMenu } from "../components/layout/MobileMenu";
import { Hero } from "../components/sections/Hero";
import { Story } from "../components/sections/Story";
import { Awards } from "../components/sections/Awards";
import { Products } from "../components/sections/Products";
import { CocktailLab } from "../components/sections/CocktailLab";
import { Toolbox } from "../components/sections/Toolbox";
import { Sustainability } from "../components/sections/Sustainability";
import { Teasers } from "../components/sections/Teasers";
import { Footer } from "../components/layout/Footer";
import { IconHome, IconGlass, IconLeafNav, IconBriefcase } from "../components/ui/Icons";

export const HomePage = ({ lang, setLang, theme, toggleTheme, t }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [cocktailFilter, setCocktailFilter] = useState("all");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [savedCocktails, setSavedCocktails] = useState([]);
  const [teaserNotifs, setTeaserNotifs] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState(null);
  const [heartPulse, setHeartPulse] = useState(null);

  const sectionRefs = useRef({});

  // Scroll detection for nav glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Track active section for bottom nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id || "hero");
          }
        });
      },
      { threshold: 0.3 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSaved = (id) => {
    const wasSaved = savedCocktails.includes(id);
    setSavedCocktails((prev) => wasSaved ? prev.filter((x) => x !== id) : [...prev, id]);
    if (!wasSaved) {
      setHeartPulse(id);
      setTimeout(() => setHeartPulse(null), 400);
    }
  };

  // Web Share API
  const shareCocktail = async (cocktail) => {
    const name = lang === "fr" ? cocktail.nameFr : cocktail.nameEn;
    const shareData = {
      title: `${name} — Arduenna`,
      text: lang === "fr"
        ? `Découvrez la recette ${name} avec Arduenna 🍸`
        : `Discover the ${name} recipe with Arduenna 🍸`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setToast(t.cocktails.shareCopied);
      }
    } catch (e) {
      // User cancelled share dialog — ignore
    }
  };

  // Download recipe card as PNG
  const downloadRecipeCard = (cocktail) => {
    const name = lang === "fr" ? cocktail.nameFr : cocktail.nameEn;
    const ingredients = lang === "fr" ? cocktail.ingredientsFr : cocktail.ingredientsEn;
    const steps = lang === "fr" ? cocktail.stepsFr : cocktail.stepsEn;
    const garnish = lang === "fr" ? cocktail.garnishFr : cocktail.garnishEn;
    const accroche = lang === "fr" ? cocktail.accrocheFr : cocktail.accrocheEn;

    const canvas = document.createElement("canvas");
    const dpr = 2;
    canvas.width = 700 * dpr;
    canvas.height = 950 * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#fef8ec";
    ctx.fillRect(0, 0, 700, 950);

    ctx.fillStyle = "#0b363d";
    ctx.fillRect(0, 0, 700, 120);
    ctx.fillStyle = "#fef8ec";
    ctx.font = "600 11px 'DM Sans', sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("ARDUENNA", 40, 50);
    ctx.font = "italic 28px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(name, 40, 90);

    ctx.fillStyle = "rgba(11,54,61,0.5)";
    ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(accroche, 40, 160);

    ctx.strokeStyle = "rgba(11,54,61,0.12)";
    ctx.beginPath();
    ctx.moveTo(40, 185);
    ctx.lineTo(660, 185);
    ctx.stroke();

    ctx.fillStyle = "#0b363d";
    ctx.font = "500 13px 'DM Sans', sans-serif";
    ctx.fillText((lang === "fr" ? "INGRÉDIENTS" : "INGREDIENTS"), 40, 215);
    ctx.font = "400 14px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(11,54,61,0.7)";
    ingredients.forEach((ing, i) => {
      ctx.fillText(`• ${ing}`, 40, 245 + i * 26);
    });

    const stepsY = 260 + ingredients.length * 26;

    ctx.fillStyle = "#0b363d";
    ctx.font = "500 13px 'DM Sans', sans-serif";
    ctx.fillText((lang === "fr" ? "PRÉPARATION" : "METHOD"), 40, stepsY);
    ctx.font = "400 14px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(11,54,61,0.7)";
    steps.forEach((step, i) => {
      ctx.fillText(`${i + 1}. ${step}`, 40, stepsY + 30 + i * 26);
    });

    const garnishY = stepsY + 45 + steps.length * 26;

    ctx.fillStyle = "#0b363d";
    ctx.font = "500 13px 'DM Sans', sans-serif";
    ctx.fillText((lang === "fr" ? "GARNITURE" : "GARNISH"), 40, garnishY);
    ctx.font = "400 14px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(11,54,61,0.7)";
    ctx.fillText(garnish, 40, garnishY + 24);

    ctx.fillStyle = "rgba(11,54,61,0.25)";
    ctx.font = "400 11px 'DM Sans', sans-serif";
    ctx.fillText("arduenna-gin.com", 40, 920);
    ctx.fillStyle = "#c2744a";
    ctx.fillText("BIO EU · B CORP", 560, 920);

    const link = document.createElement("a");
    link.download = `${name.toLowerCase().replace(/\s+/g, "-")}-arduenna.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const filteredCocktails = cocktailsData.filter((c) => {
    if (cocktailFilter !== "all" && c.product !== cocktailFilter) return false;
    if (seasonFilter !== "all" && c.season !== seasonFilter) return false;
    return true;
  });

  const navSections = ["story", "products", "cocktails", "toolbox", "sustainability"];

  const bottomNavItems = [
    { id: "hero", label: lang === "fr" ? "Accueil" : "Home", Icon: IconHome },
    { id: "cocktails", label: "Cocktails", Icon: IconGlass },
    { id: "sustainability", label: lang === "fr" ? "Durable" : "Green", Icon: IconLeafNav },
    { id: "toolbox", label: "Pro", Icon: IconBriefcase },
  ];

  return (
    <div className="app-shell">
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      <Navbar
        t={t} lang={lang} theme={theme} scrolled={scrolled} menuOpen={menuOpen}
        activeSection={activeSection} navSections={navSections} scrollTo={scrollTo}
        toggleTheme={toggleTheme} setLang={setLang} setMenuOpen={setMenuOpen}
      />

      <MobileMenu t={t} menuOpen={menuOpen} navSections={navSections} scrollTo={scrollTo} />

      <BottomNav activeSection={activeSection} bottomNavItems={bottomNavItems} scrollTo={scrollTo} />

      <Hero t={t} sectionRefs={sectionRefs} scrollTo={scrollTo} />
      <Story t={t} sectionRefs={sectionRefs} />
      <Awards t={t} />
      <Products
        t={t} lang={lang} sectionRefs={sectionRefs}
        productsData={productsData}
        selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}
      />
      <CocktailLab
        t={t} lang={lang} sectionRefs={sectionRefs}
        productsData={productsData}
        filteredCocktails={filteredCocktails}
        cocktailFilter={cocktailFilter} setCocktailFilter={setCocktailFilter}
        seasonFilter={seasonFilter} setSeasonFilter={setSeasonFilter}
        savedCocktails={savedCocktails} toggleSaved={toggleSaved} heartPulse={heartPulse}
        selectedCocktail={selectedCocktail} setSelectedCocktail={setSelectedCocktail}
        shareCocktail={shareCocktail} downloadRecipeCard={downloadRecipeCard}
      />
      <Toolbox t={t} sectionRefs={sectionRefs} />
      <Sustainability t={t} sectionRefs={sectionRefs} />
      <Teasers t={t} teaserNotifs={teaserNotifs} setTeaserNotifs={setTeaserNotifs} />
      <Footer t={t} />
    </div>
  );
};
