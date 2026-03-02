import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// ARDUENNA GIN — MVP WEBAPP
// Palette: #fef8ec (cream) · #ffffff (white) · #0b363d (teal)
// ═══════════════════════════════════════════

// ─── i18n translations ───
const translations = {
  fr: {
    nav: { story: "Histoire", products: "Produits", cocktails: "Cocktail Lab", toolbox: "Espace Pro", sustainability: "Durabilité", club: "Club" },
    hero: {
      tagline: "Original taste",
      tagline2: "of nature",
      subtitle: "Gin bio premium des Ardennes belges",
      cta: "Découvrir",
    },
    story: {
      sectionLabel: "Notre histoire",
      title: "Né de la passion de deux Ardennais",
      p1: "Arduenna est né de la volonté de Martin et François, passionnés de la nature ardennaise et épicuriens dans l'âme, de vous faire vivre des moments à la fois originaux et conviviaux.",
      p2: "Inspiré par l'élégance et la fraîcheur de l'Ardenne, Arduenna est un gin de première qualité, 100% biologique, produit en Belgique par la plus ancienne distillerie du pays.",
      p3: "Chaque arôme se révèle progressivement : la rondeur de la mirabelle, la fraîcheur vivifiante du sapin, et la douceur envoûtante de la fleur de sureau.",
      botanical1: "Mirabelle", botanical1Latin: "Myrobalanum", botanical1Desc: "Rondeur fruitée",
      botanical2: "Sapin", botanical2Latin: "Abies", botanical2Desc: "Fraîcheur vivifiante",
      botanical3: "Sureau", botanical3Latin: "Sambucus", botanical3Desc: "Douceur envoûtante",
    },
    awards: { sectionLabel: "Récompenses", title: "Reconnu internationalement" },
    products: {
      sectionLabel: "Nos produits", title: "La gamme Arduenna",
      downloadPdf: "Télécharger la fiche", profile: "Profil aromatique",
      pairings: "Accords suggérés", certifications: "Certifications",
    },
    cocktails: {
      sectionLabel: "Cocktail Lab", title: "L'art du cocktail Arduenna",
      subtitle: "Découvrez nos recettes signature et trouvez l'inspiration pour vos créations.",
      all: "Tous", difficulty: "Difficulté", easy: "Facile", medium: "Moyen", advanced: "Avancé",
      ingredients: "Ingrédients", steps: "Préparation", garnish: "Garniture",
      saved: "Sauvegardé !", save: "Sauvegarder",
      filterByProduct: "Par produit", filterBySeason: "Par saison",
      summer: "Été", winter: "Hiver", allYear: "Toute l'année", spring: "Printemps", autumn: "Automne",
    },
    toolbox: {
      sectionLabel: "Espace Pro", title: "Toolbox Partenaires",
      subtitle: "Tous les outils dont vous avez besoin pour promouvoir Arduenna dans votre établissement.",
      logos: "Logos & Branding", logosDesc: "Logos en différents formats (SVG, PNG, PDF) pour vos supports",
      photos: "Photos Produit HD", photosDesc: "Visuels haute résolution pour vos menus et réseaux sociaux",
      sheets: "Fiches Techniques", sheetsDesc: "Spécifications détaillées de chaque produit",
      salesKit: "Kit de Vente", salesKitDesc: "Argumentaire et positionnement pour vos équipes commerciales",
      download: "Télécharger", comingSoon: "Bientôt disponible",
      contact: "Besoin d'un format spécifique ? Contactez-nous",
    },
    sustainability: {
      sectionLabel: "Durabilité", title: "Une ode à la nature",
      subtitle: "Chez Arduenna, notre engagement pour la nature se reflète à chaque étape.",
      bcorp: "Certifié B Corp", bcorpDesc: "Label mondial reconnaissant les entreprises alliant performance économique, impact social et respect de l'environnement.",
      organic: "100% Biologique", organicDesc: "Tous nos ingrédients sont certifiés biologiques, pour un gin pur et authentique.",
      oldest: "Plus ancienne distillerie", oldestDesc: "Produit par la plus ancienne distillerie de Belgique, garante d'un savoir-faire ancestral.",
      bottle: "Bouteille 1L éco-conçue", bottleDesc: "Réduction de 20% du poids de verre. Bouteilles recyclées en terrazzo.",
      local: "Partenaires européens", localDesc: "Collaboration uniquement avec des partenaires partageant nos valeurs durables.",
    },
    teasers: {
      sectionLabel: "Bientôt",
      academyTitle: "Arduenna Academy", academyDesc: "Formation certifiante pour bartenders. Modules interactifs, quiz et certification officielle « Arduenna Certified Bartender ».",
      finderTitle: "Bar Finder", finderDesc: "Carte interactive géolocalisée pour trouver les bars et restaurants servant Arduenna près de chez vous.",
      cellarTitle: "Ma Cave", cellarDesc: "Gérez votre collection Arduenna, notez vos cocktails préférés et recevez des suggestions personnalisées.",
      eventsTitle: "Événements", eventsDesc: "Masterclasses, dégustations et rencontres exclusives avec les fondateurs.",
      notifyMe: "Me notifier", notified: "Notifié ✓",
    },
    footer: {
      tagline: "Original taste of nature",
      shop: "Boutique en ligne", legal: "Mentions légales", contact: "Contact",
      copyright: "© 2025 Arduenna Gin. Tous droits réservés.",
      drink: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.",
    },
    ageGate: { title: "Bienvenue", question: "Avez-vous l'âge légal pour consommer de l'alcool dans votre pays ?", yes: "Oui, j'ai l'âge légal", no: "Non", denied: "Vous devez avoir l'âge légal pour accéder à ce site." },
  },
  en: {
    nav: { story: "Story", products: "Products", cocktails: "Cocktail Lab", toolbox: "Pro Toolbox", sustainability: "Sustainability", club: "Club" },
    hero: { tagline: "Original taste", tagline2: "of nature", subtitle: "Premium organic gin from the Belgian Ardennes", cta: "Discover" },
    story: {
      sectionLabel: "Our story", title: "Born from the passion of two Ardennais",
      p1: "Arduenna was born from the desire of Martin and François, passionate about the nature of the Ardennes and epicureans at heart, to offer you original and convivial moments.",
      p2: "Inspired by the elegance and freshness of the Ardennes, Arduenna is a premium quality gin, 100% organic, produced in Belgium by the country's oldest distillery.",
      p3: "Each aroma reveals itself progressively: the roundness of mirabelle, the invigorating freshness of fir, and the enchanting sweetness of elderflower.",
      botanical1: "Mirabelle", botanical1Latin: "Myrobalanum", botanical1Desc: "Fruity roundness",
      botanical2: "Fir", botanical2Latin: "Abies", botanical2Desc: "Invigorating freshness",
      botanical3: "Elderflower", botanical3Latin: "Sambucus", botanical3Desc: "Enchanting sweetness",
    },
    awards: { sectionLabel: "Awards", title: "Internationally recognized" },
    products: { sectionLabel: "Our products", title: "The Arduenna range", downloadPdf: "Download spec sheet", profile: "Aromatic profile", pairings: "Suggested pairings", certifications: "Certifications" },
    cocktails: { sectionLabel: "Cocktail Lab", title: "The art of Arduenna cocktails", subtitle: "Discover our signature recipes and find inspiration for your creations.", all: "All", difficulty: "Difficulty", easy: "Easy", medium: "Medium", advanced: "Advanced", ingredients: "Ingredients", steps: "Method", garnish: "Garnish", saved: "Saved!", save: "Save", filterByProduct: "By product", filterBySeason: "By season", summer: "Summer", winter: "Winter", allYear: "All year", spring: "Spring", autumn: "Autumn" },
    toolbox: { sectionLabel: "Pro Toolbox", title: "Partner Toolbox", subtitle: "All the tools you need to promote Arduenna in your establishment.", logos: "Logos & Branding", logosDesc: "Logos in various formats (SVG, PNG, PDF) for your materials", photos: "HD Product Photos", photosDesc: "High-resolution visuals for your menus and social media", sheets: "Technical Sheets", sheetsDesc: "Detailed specifications for each product", salesKit: "Sales Kit", salesKitDesc: "Sales pitch and positioning for your commercial teams", download: "Download", comingSoon: "Coming soon", contact: "Need a specific format? Contact us" },
    sustainability: { sectionLabel: "Sustainability", title: "An ode to nature", subtitle: "At Arduenna, our commitment to nature is reflected at every stage.", bcorp: "B Corp Certified", bcorpDesc: "Global label recognizing companies combining economic performance, social impact and environmental respect.", organic: "100% Organic", organicDesc: "All our ingredients are certified organic, for a pure and authentic gin.", oldest: "Oldest distillery", oldestDesc: "Produced by Belgium's oldest distillery, guaranteeing ancestral know-how.", bottle: "1L eco-designed bottle", bottleDesc: "20% glass weight reduction. Bottles recycled into terrazzo.", local: "European partners", localDesc: "Collaboration only with partners sharing our sustainable values." },
    teasers: { sectionLabel: "Coming soon", academyTitle: "Arduenna Academy", academyDesc: "Certified training for bartenders. Interactive modules, quizzes and official 'Arduenna Certified Bartender' certification.", finderTitle: "Bar Finder", finderDesc: "Geolocated interactive map to find bars and restaurants serving Arduenna near you.", cellarTitle: "My Cellar", cellarDesc: "Manage your Arduenna collection, rate your favorite cocktails and receive personalized suggestions.", eventsTitle: "Events", eventsDesc: "Masterclasses, tastings and exclusive meetings with the founders.", notifyMe: "Notify me", notified: "Notified ✓" },
    footer: { tagline: "Original taste of nature", shop: "Online shop", legal: "Legal notice", contact: "Contact", copyright: "© 2025 Arduenna Gin. All rights reserved.", drink: "Please drink responsibly." },
    ageGate: { title: "Welcome", question: "Are you of legal drinking age in your country?", yes: "Yes, I am of legal age", no: "No", denied: "You must be of legal drinking age to access this site." },
  },
};

// ─── Product Data ───
const productsData = [
  {
    id: "gin", nameFr: "Arduenna Gin", nameEn: "Arduenna Gin",
    volume: "50cl", abv: "44%", price: "40.95 €",
    descFr: "Un gin de première qualité, 100% bio, qui capture l'essence des forêts ardennaises. Notes de sapin, mirabelle et fleur de sureau pour une expérience gustative unique.",
    descEn: "A premium gin, 100% organic, capturing the essence of the Ardennes forests. Notes of fir, mirabelle plum and elderflower for a unique taste experience.",
    color: "#0b363d",
    profile: { juniper: 85, citrus: 40, floral: 70, herbal: 60, spice: 30, fruit: 75 },
    pairingsFr: ["Tonic premium", "Agrumes frais", "Fruits de mer", "Fromages affinés"],
    pairingsEn: ["Premium tonic", "Fresh citrus", "Seafood", "Aged cheeses"],
    certs: ["Bio EU", "B Corp", "Distillerie historique"], emoji: "🌲",
    img: "/Thumbnail-Arduenna-gin-aspect-ratio-1072-1372.avif",
  },
  {
    id: "noalcohol", nameFr: "Arduenna No Alcohol", nameEn: "Arduenna No Alcohol",
    volume: "50cl", abv: "0%", price: "30.95 €",
    descFr: "Toute la complexité aromatique d'Arduenna, sans alcool. Parfait pour des moments de convivialité accessibles à tous.",
    descEn: "All the aromatic complexity of Arduenna, without alcohol. Perfect for convivial moments accessible to everyone.",
    color: "#3a7a6b",
    profile: { juniper: 70, citrus: 50, floral: 75, herbal: 55, spice: 25, fruit: 80 },
    pairingsFr: ["Tonic léger", "Herbes fraîches", "Desserts fruités", "Apéritif"],
    pairingsEn: ["Light tonic", "Fresh herbs", "Fruity desserts", "Aperitif"],
    certs: ["Bio EU", "B Corp", "Sans alcool"], emoji: "🌿",
    img: "/arduenna_no_alcohol_site-aspect-ratio-1072-1372.webp",
  },
  {
    id: "aperitivo", nameFr: "694 Aperitivo", nameEn: "694 Aperitivo",
    volume: "50cl", abv: "15%", price: "29.95 €",
    descFr: "Un voyage gustatif alliant l'authenticité belge et la chaleur méditerranéenne. Bitter biologique qui évoque le soleil et la convivialité.",
    descEn: "A taste journey combining Belgian authenticity and Mediterranean warmth. Organic bitter evoking sunshine and conviviality.",
    color: "#c2744a",
    profile: { juniper: 30, citrus: 80, floral: 45, herbal: 70, spice: 55, fruit: 60 },
    pairingsFr: ["Prosecco", "Soda", "Olives & charcuterie", "Cuisine italienne"],
    pairingsEn: ["Prosecco", "Soda", "Olives & charcuterie", "Italian cuisine"],
    certs: ["Bio EU", "B Corp"], emoji: "🍊",
    img: "/Thumbnail-Arduenna-694-aspect-ratio-1072-1372-1.avif",
  },
];

// ─── Cocktail Data ───
const cocktailsData = [
  { id: 1, nameFr: "Arduenna G&T Signature", nameEn: "Arduenna Signature G&T", product: "gin", difficulty: "easy", season: "allYear",
    ingredientsFr: ["5 cl Arduenna Gin", "15 cl tonic premium", "1 brin de romarin", "1 tranche de pamplemousse rose", "Glaçons"],
    ingredientsEn: ["5 cl Arduenna Gin", "15 cl premium tonic", "1 sprig of rosemary", "1 slice pink grapefruit", "Ice cubes"],
    stepsFr: ["Remplir un verre ballon de glaçons", "Verser l'Arduenna Gin", "Ajouter le tonic délicatement le long du verre", "Remuer doucement une fois", "Garnir de romarin et pamplemousse"],
    stepsEn: ["Fill a balloon glass with ice", "Pour Arduenna Gin", "Gently add tonic along the glass", "Stir gently once", "Garnish with rosemary and grapefruit"],
    garnishFr: "Romarin & pamplemousse rose", garnishEn: "Rosemary & pink grapefruit",
  },
  { id: 2, nameFr: "Forest Negroni", nameEn: "Forest Negroni", product: "gin", difficulty: "medium", season: "allYear",
    ingredientsFr: ["3 cl Arduenna Gin", "3 cl Vermouth rouge", "3 cl Campari", "Zeste d'orange", "Glaçons"],
    ingredientsEn: ["3 cl Arduenna Gin", "3 cl Red Vermouth", "3 cl Campari", "Orange zest", "Ice cubes"],
    stepsFr: ["Remplir un verre old-fashioned de glaçons", "Verser tous les ingrédients", "Remuer pendant 20 secondes", "Exprimer le zeste d'orange au-dessus du verre"],
    stepsEn: ["Fill an old-fashioned glass with ice", "Pour all ingredients", "Stir for 20 seconds", "Express orange zest over the glass"],
    garnishFr: "Zeste d'orange", garnishEn: "Orange zest",
  },
  { id: 3, nameFr: "Ardenne Sour", nameEn: "Ardenne Sour", product: "gin", difficulty: "medium", season: "allYear",
    ingredientsFr: ["5 cl Arduenna Gin", "3 cl jus de citron frais", "2 cl sirop de sureau", "1 blanc d'œuf", "2 dashes Angostura bitters"],
    ingredientsEn: ["5 cl Arduenna Gin", "3 cl fresh lemon juice", "2 cl elderflower syrup", "1 egg white", "2 dashes Angostura bitters"],
    stepsFr: ["Dry shake (sans glace) tous les ingrédients 15 sec", "Ajouter les glaçons et shaker à nouveau", "Filtrer dans un verre coupé", "Décorer de bitters sur la mousse"],
    stepsEn: ["Dry shake (no ice) all ingredients 15 sec", "Add ice and shake again", "Strain into a coupe glass", "Decorate bitters on the foam"],
    garnishFr: "Angostura bitters sur mousse", garnishEn: "Angostura bitters on foam",
  },
  { id: 4, nameFr: "Mirabelle Fizz", nameEn: "Mirabelle Fizz", product: "gin", difficulty: "easy", season: "summer",
    ingredientsFr: ["4 cl Arduenna Gin", "2 cl liqueur de mirabelle", "2 cl jus de citron", "Eau pétillante", "Feuilles de menthe"],
    ingredientsEn: ["4 cl Arduenna Gin", "2 cl mirabelle liqueur", "2 cl lemon juice", "Sparkling water", "Mint leaves"],
    stepsFr: ["Shaker le gin, la liqueur et le citron avec des glaçons", "Filtrer dans un verre highball rempli de glace", "Compléter avec l'eau pétillante", "Garnir de menthe"],
    stepsEn: ["Shake gin, liqueur and lemon with ice", "Strain into a highball filled with ice", "Top with sparkling water", "Garnish with mint"],
    garnishFr: "Menthe fraîche", garnishEn: "Fresh mint",
  },
  { id: 5, nameFr: "694 Spritz", nameEn: "694 Spritz", product: "aperitivo", difficulty: "easy", season: "summer",
    ingredientsFr: ["6 cl 694 Aperitivo", "9 cl Prosecco", "3 cl eau pétillante", "1 tranche d'orange", "Olive verte"],
    ingredientsEn: ["6 cl 694 Aperitivo", "9 cl Prosecco", "3 cl sparkling water", "1 orange slice", "Green olive"],
    stepsFr: ["Remplir un verre à vin de glaçons", "Verser le 694 Aperitivo", "Ajouter le Prosecco", "Compléter avec l'eau pétillante", "Garnir avec l'orange et l'olive"],
    stepsEn: ["Fill a wine glass with ice", "Pour 694 Aperitivo", "Add Prosecco", "Top with sparkling water", "Garnish with orange and olive"],
    garnishFr: "Orange & olive verte", garnishEn: "Orange & green olive",
  },
  { id: 6, nameFr: "Winter Warmer", nameEn: "Winter Warmer", product: "gin", difficulty: "medium", season: "winter",
    ingredientsFr: ["5 cl Arduenna Gin", "2 cl miel de fleurs", "3 cl jus de pomme chaud", "1 bâton de cannelle", "2 clous de girofle", "1 tranche de pomme"],
    ingredientsEn: ["5 cl Arduenna Gin", "2 cl flower honey", "3 cl hot apple juice", "1 cinnamon stick", "2 cloves", "1 apple slice"],
    stepsFr: ["Chauffer le jus de pomme avec la cannelle et les clous de girofle", "Ajouter le miel et mélanger", "Verser dans un verre résistant à la chaleur", "Ajouter l'Arduenna Gin", "Garnir avec la tranche de pomme"],
    stepsEn: ["Heat apple juice with cinnamon and cloves", "Add honey and mix", "Pour into a heat-resistant glass", "Add Arduenna Gin", "Garnish with apple slice"],
    garnishFr: "Pomme & cannelle", garnishEn: "Apple & cinnamon",
  },
  { id: 7, nameFr: "Elderflower Collins", nameEn: "Elderflower Collins", product: "gin", difficulty: "easy", season: "spring",
    ingredientsFr: ["5 cl Arduenna Gin", "3 cl jus de citron", "2 cl sirop de sureau", "Eau pétillante", "Fleur de sureau (si disponible)"],
    ingredientsEn: ["5 cl Arduenna Gin", "3 cl lemon juice", "2 cl elderflower syrup", "Sparkling water", "Elderflower (if available)"],
    stepsFr: ["Shaker le gin, citron et sirop avec des glaçons", "Filtrer dans un verre collins rempli de glace", "Compléter avec l'eau pétillante", "Garnir de fleur de sureau"],
    stepsEn: ["Shake gin, lemon and syrup with ice", "Strain into a collins glass filled with ice", "Top with sparkling water", "Garnish with elderflower"],
    garnishFr: "Fleur de sureau", garnishEn: "Elderflower",
  },
  { id: 8, nameFr: "Ardenne Mule", nameEn: "Ardenne Mule", product: "gin", difficulty: "easy", season: "allYear",
    ingredientsFr: ["5 cl Arduenna Gin", "2 cl jus de citron vert", "12 cl ginger beer", "Feuilles de menthe", "Tranche de citron vert"],
    ingredientsEn: ["5 cl Arduenna Gin", "2 cl lime juice", "12 cl ginger beer", "Mint leaves", "Lime slice"],
    stepsFr: ["Presser le citron vert dans un mug en cuivre", "Ajouter les glaçons", "Verser l'Arduenna Gin", "Compléter avec le ginger beer", "Garnir de menthe et citron vert"],
    stepsEn: ["Squeeze lime into a copper mug", "Add ice", "Pour Arduenna Gin", "Top with ginger beer", "Garnish with mint and lime"],
    garnishFr: "Menthe & citron vert", garnishEn: "Mint & lime",
  },
  { id: 9, nameFr: "694 Negroni Twist", nameEn: "694 Negroni Twist", product: "aperitivo", difficulty: "medium", season: "autumn",
    ingredientsFr: ["3 cl 694 Aperitivo", "3 cl Arduenna Gin", "3 cl Vermouth rouge", "Zeste d'orange"],
    ingredientsEn: ["3 cl 694 Aperitivo", "3 cl Arduenna Gin", "3 cl Red Vermouth", "Orange zest"],
    stepsFr: ["Remplir un verre old-fashioned de glaçons", "Verser tous les ingrédients", "Remuer 30 secondes", "Exprimer et déposer le zeste d'orange"],
    stepsEn: ["Fill an old-fashioned glass with ice", "Pour all ingredients", "Stir for 30 seconds", "Express and place orange zest"],
    garnishFr: "Zeste d'orange", garnishEn: "Orange zest",
  },
  { id: 10, nameFr: "No Alcohol Tonic", nameEn: "No Alcohol Tonic", product: "noalcohol", difficulty: "easy", season: "allYear",
    ingredientsFr: ["5 cl Arduenna No Alcohol", "15 cl tonic premium", "Rondelles de concombre", "Poivre rose"],
    ingredientsEn: ["5 cl Arduenna No Alcohol", "15 cl premium tonic", "Cucumber slices", "Pink pepper"],
    stepsFr: ["Remplir un verre ballon de glaçons", "Verser l'Arduenna No Alcohol", "Ajouter le tonic délicatement", "Garnir de concombre et poivre rose"],
    stepsEn: ["Fill a balloon glass with ice", "Pour Arduenna No Alcohol", "Gently add tonic", "Garnish with cucumber and pink pepper"],
    garnishFr: "Concombre & poivre rose", garnishEn: "Cucumber & pink pepper",
  },
];

const awardsData = [
  { year: "2025", title: "World Gin Awards", detail: "Silver" },
  { year: "2023", title: "London Awards", detail: "Gin of the Year" },
  { year: "2022", title: "Europe Wine & Spirits", detail: "Double Gold" },
  { year: "2022", title: "Women's Int'l Trophy", detail: "Winner" },
  { year: "2022", title: "Yellow Line Design", detail: "Gold" },
  { year: "2021", title: "IWSC Gin & Tonic", detail: "Bronze" },
];

// ─── Radar Chart (brand-themed) ───
const RadarChart = ({ data, color, size = 160 }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angleStep = (Math.PI * 2) / labels.length;
  const getPoint = (i, val) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      {[25, 50, 75, 100].map((level) => (
        <polygon key={level} points={labels.map((_, i) => getPoint(i, level).join(",")).join(" ")}
          fill="none" stroke="rgba(11,54,61,0.12)" strokeWidth="0.5" />
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100)[0]} y2={getPoint(i, 100)[1]}
          stroke="rgba(11,54,61,0.08)" strokeWidth="0.5" />
      ))}
      <polygon points={values.map((v, i) => getPoint(i, v).join(",")).join(" ")}
        fill={color + "22"} stroke={color} strokeWidth="1.5" />
      {values.map((v, i) => {
        const [px, py] = getPoint(i, v);
        return <circle key={i} cx={px} cy={py} r="2.5" fill={color} />;
      })}
      {labels.map((label, i) => {
        const [px, py] = getPoint(i, 115);
        return (
          <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle"
            fill="#0b363d" fontSize="7" fontFamily="inherit" style={{ textTransform: "capitalize" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Icons ───
const IconLeaf = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>;
const IconFlask = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6M12 3v7l-5 8.5a2 2 0 001.7 3h6.6a2 2 0 001.7-3L12 10V3"/></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const IconHeart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconHeartFilled = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconChevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IconX = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconGlobe = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;

// ─── Botanical decoration ───
const BotanicalDeco = ({ style }) => (
  <svg viewBox="0 0 120 200" style={{ position: "absolute", opacity: 0.06, ...style }} fill="#0b363d">
    <path d="M60 200 C60 200 60 100 60 80 C60 60 30 40 20 20 C15 10 25 0 35 5 C45 10 55 30 60 50 C65 30 75 10 85 5 C95 0 105 10 100 20 C90 40 60 60 60 80Z"/>
  </svg>
);

// ═══════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════
export default function ArduennaWebapp() {
  const [lang, setLang] = useState("fr");
  const [ageVerified, setAgeVerified] = useState(false);
  const [ageDenied, setAgeDenied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [cocktailFilter, setCocktailFilter] = useState("all");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [savedCocktails, setSavedCocktails] = useState([]);
  const [teaserNotifs, setTeaserNotifs] = useState({});
  const [scrollY, setScrollY] = useState(0);

  const t = translations[lang];
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0);
    const container = document.querySelector("[data-app-scroll]");
    if (container) container.addEventListener("scroll", handleScroll);
    else window.addEventListener("scroll", handleScroll);
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      else window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSaved = (id) => {
    setSavedCocktails((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const filteredCocktails = cocktailsData.filter((c) => {
    if (cocktailFilter !== "all" && c.product !== cocktailFilter) return false;
    if (seasonFilter !== "all" && c.season !== seasonFilter) return false;
    return true;
  });

  // ─── AGE GATE ───
  if (!ageVerified) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fef8ec", fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        color: "#0b363d", padding: 24,
      }}>
        <div style={{
          background: "#ffffff", borderRadius: 16, padding: "56px 40px", maxWidth: 440,
          width: "100%", textAlign: "center", border: "1px solid rgba(11,54,61,0.08)",
          boxShadow: "0 8px 40px rgba(11,54,61,0.06)",
        }}>
          <div style={{ fontSize: 14, letterSpacing: 4, marginBottom: 24, color: "#0b363d", opacity: 0.5, textTransform: "uppercase" }}>
            ARDUENNA
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8, fontStyle: "italic" }}>{t.ageGate.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 32, color: "rgba(11,54,61,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            {t.ageGate.question}
          </p>
          {ageDenied && <p style={{ color: "#c2744a", fontSize: 14, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{t.ageGate.denied}</p>}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setAgeVerified(true)} className="btn-primary">
              {t.ageGate.yes}
            </button>
            <button onClick={() => setAgeDenied(true)} className="btn-ghost">
              {t.ageGate.no}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN APP ───
  return (
    <div style={{ background: "#fef8ec", color: "#0b363d", fontFamily: "'Cormorant Garamond', 'Georgia', serif", minHeight: "100vh" }}>
      <style>{`
        /* fonts loaded in index.css */
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #fef8ec; }
        ::-webkit-scrollbar-thumb { background: #0b363d; border-radius: 4px; opacity: 0.3; }
        
        .section-label {
          font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(11,54,61,0.4); margin-bottom: 12px;
        }
        .section-title {
          font-size: 36px; font-weight: 400; font-style: italic; margin-bottom: 16px;
          line-height: 1.2; color: #0b363d;
        }
        
        .btn-primary {
          padding: 14px 32px; background: #0b363d; border: none;
          color: #fef8ec; border-radius: 6px; font-size: 13px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 1px; text-transform: uppercase;
          transition: all 0.3s;
        }
        .btn-primary:hover { background: #0a2e34; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(11,54,61,0.2); }
        
        .btn-ghost {
          padding: 14px 24px; background: transparent;
          border: 1px solid rgba(11,54,61,0.2); color: #0b363d;
          border-radius: 6px; font-size: 13px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 1px; text-transform: uppercase;
          transition: all 0.3s;
        }
        .btn-ghost:hover { border-color: #0b363d; background: rgba(11,54,61,0.03); }
        
        .card {
          background: #ffffff; border: 1px solid rgba(11,54,61,0.06);
          border-radius: 12px; padding: 28px; transition: all 0.3s;
          box-shadow: 0 2px 12px rgba(11,54,61,0.03);
        }
        .card:hover { border-color: rgba(11,54,61,0.12); box-shadow: 0 6px 24px rgba(11,54,61,0.06); transform: translateY(-2px); }
        
        .nav-link {
          color: rgba(11,54,61,0.6); text-decoration: none; font-size: 11px;
          letter-spacing: 2px; cursor: pointer; transition: color 0.3s;
          padding: 8px 0; text-transform: uppercase; font-family: 'DM Sans', sans-serif;
        }
        .nav-link:hover { color: #0b363d; }
        
        .filter-btn {
          padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(11,54,61,0.12);
          background: transparent; color: rgba(11,54,61,0.5); font-size: 12px;
          cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif;
        }
        .filter-btn:hover { border-color: #0b363d; color: #0b363d; }
        .filter-btn.active { background: #0b363d; border-color: #0b363d; color: #fef8ec; }
        
        .overlay {
          position: fixed; inset: 0; background: rgba(11,54,61,0.3);
          backdrop-filter: blur(12px); z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal {
          background: #ffffff; border: 1px solid rgba(11,54,61,0.08);
          border-radius: 16px; max-width: 520px; width: 100%; max-height: 85vh;
          overflow-y: auto; padding: 36px; box-shadow: 0 20px 60px rgba(11,54,61,0.15);
        }
        .modal-label {
          background: rgba(11,54,61,0.05); border: 1px solid rgba(11,54,61,0.08);
          border-radius: 8px; padding: 16px; margin-bottom: 12px;
        }
        .divider {
          height: 1px; margin: 32px 0;
          background: linear-gradient(90deg, transparent, rgba(11,54,61,0.12), transparent);
        }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease both; }
        
        @media (max-width: 768px) {
          .section-title { font-size: 28px; }
          .modal { padding: 24px; margin: 12px; }
        }
      `}</style>

      {/* ═══ NAVIGATION ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrollY > 50 ? "rgba(254,248,236,0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(11,54,61,0.06)" : "none",
        transition: "all 0.4s ease", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src="/Arduennagin_logo_vert_.webp"
              alt="Arduenna"
              style={{ height: 20, cursor: "pointer" }}
              onClick={() => scrollTo("hero")}
            />
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
            {["story", "products", "cocktails", "toolbox", "sustainability"].map((sec) => (
              <span key={sec} className="nav-link" onClick={() => scrollTo(sec)}>
                {t.nav[sec]}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} style={{
              display: "flex", alignItems: "center", gap: 4, background: "rgba(11,54,61,0.04)",
              border: "1px solid rgba(11,54,61,0.1)", borderRadius: 6, padding: "5px 12px",
              color: "#0b363d", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 1,
            }}>
              <IconGlobe /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "none", border: "none", color: "#0b363d", cursor: "pointer", display: "flex",
            }}>
              {menuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 45, background: "rgba(254,248,236,0.98)",
          backdropFilter: "blur(30px)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 28,
        }}>
          {["story", "products", "cocktails", "toolbox", "sustainability"].map((sec) => (
            <span key={sec} onClick={() => scrollTo(sec)} style={{
              fontSize: 24, fontStyle: "italic", color: "#0b363d", cursor: "pointer",
              letterSpacing: 2,
            }}>
              {t.nav[sec]}
            </span>
          ))}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section ref={(el) => (sectionRefs.current.hero = el)} style={{
        minHeight: "85vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <BotanicalDeco style={{ top: "10%", left: "-5%", width: 200, transform: "rotate(-15deg)" }} />
        <BotanicalDeco style={{ top: "15%", right: "-3%", width: 160, transform: "rotate(20deg) scaleX(-1)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label" style={{ marginBottom: 32, letterSpacing: 5 }}>
            LIVRAISON GRATUITE EN BELGIQUE À PARTIR DE 50€
          </div>

          <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 24 }}>
            <span style={{ display: "block" }}>{t.hero.tagline}</span>
            <span style={{ display: "block", fontStyle: "italic", color: "#0b363d" }}>
              — <em>{t.hero.tagline2}</em> —
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(11,54,61,0.55)",
            maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.7, letterSpacing: 0.5,
          }}>
            {t.hero.subtitle}
          </p>

          <button className="btn-primary" onClick={() => scrollTo("products")} style={{ fontSize: 13, padding: "16px 40px" }}>
            {t.hero.cta}
          </button>

          <img
            src="/Arduenna_Bouteille_50CL-V2.avif"
            alt="Arduenna Gin"
            style={{ marginTop: 48, width: 180, height: "auto", filter: "drop-shadow(0 20px 40px rgba(11,54,61,0.12))" }}
          />
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section ref={(el) => (sectionRefs.current.story = el)} style={{
        padding: "80px 24px", maxWidth: 900, margin: "0 auto", position: "relative",
      }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">{t.story.sectionLabel}</div>
          <h2 className="section-title">{t.story.title}</h2>
        </div>

        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.85, color: "rgba(11,54,61,0.7)", textAlign: "center", maxWidth: 680, margin: "0 auto 56px" }}>
          <p style={{ marginBottom: 20 }}>{t.story.p1}</p>
          <p style={{ marginBottom: 20 }}>{t.story.p2}</p>
          <p>{t.story.p3}</p>
        </div>

        {/* Botanicals */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[
            { name: t.story.botanical1, latin: t.story.botanical1Latin, desc: t.story.botanical1Desc, img: "/Mirabelle.svg" },
            { name: t.story.botanical2, latin: t.story.botanical2Latin, desc: t.story.botanical2Desc, img: "/Sapin.svg" },
            { name: t.story.botanical3, latin: t.story.botanical3Latin, desc: t.story.botanical3Desc, img: "/Sureau.png" },
          ].map((b) => (
            <div key={b.name} className="card" style={{ textAlign: "center", padding: 32 }}>
              <img src={b.img} alt={b.name} style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 12 }} />
              <h4 style={{ fontSize: 20, fontWeight: 400, fontStyle: "italic", marginBottom: 4 }}>{b.name}</h4>
              <div style={{ fontSize: 12, fontStyle: "italic", color: "rgba(11,54,61,0.35)", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                {b.latin}
              </div>
              <p style={{ fontSize: 13, color: "rgba(11,54,61,0.6)", fontFamily: "'DM Sans', sans-serif" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ AWARDS ═══ */}
      <section style={{ padding: "60px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">{t.awards.sectionLabel}</div>
          <h2 className="section-title">{t.awards.title}</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {awardsData.map((a, i) => (
            <div key={i} className="card" style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 12, color: "rgba(11,54,61,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>{a.year}</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontStyle: "italic", marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "#c2744a", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: 1 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section ref={(el) => (sectionRefs.current.products = el)} style={{
        padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto",
      }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">{t.products.sectionLabel}</div>
          <h2 className="section-title">{t.products.title}</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {productsData.map((p) => (
            <div key={p.id} className="card" style={{ cursor: "pointer", padding: 32, textAlign: "center" }}
              onClick={() => setSelectedProduct(p)}>
              <img src={p.img} alt={lang === "fr" ? p.nameFr : p.nameEn} style={{ width: 120, height: 160, objectFit: "contain", marginBottom: 16 }} />
              <h3 style={{ fontSize: 22, fontWeight: 400, fontStyle: "italic", marginBottom: 8 }}>
                {lang === "fr" ? p.nameFr : p.nameEn}
              </h3>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.5)", marginBottom: 16 }}>
                {p.volume} · {p.abv}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 500, color: "#0b363d",
                marginBottom: 16,
              }}>
                {p.price}
              </div>
              <div style={{ maxWidth: 140, margin: "0 auto" }}>
                <RadarChart data={p.profile} color={p.color} size={140} />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.5)", marginTop: 16, lineHeight: 1.6 }}>
                {lang === "fr" ? p.descFr : p.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <img src={selectedProduct.img} alt={lang === "fr" ? selectedProduct.nameFr : selectedProduct.nameEn} style={{ width: 80, height: 110, objectFit: "contain", marginBottom: 8 }} />
                <h3 style={{ fontSize: 26, fontWeight: 400, fontStyle: "italic" }}>
                  {lang === "fr" ? selectedProduct.nameFr : selectedProduct.nameEn}
                </h3>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.5)", marginTop: 4 }}>
                  {selectedProduct.volume} · {selectedProduct.abv} · {selectedProduct.price}
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0b363d" }}><IconX /></button>
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(11,54,61,0.7)", marginBottom: 24 }}>
              {lang === "fr" ? selectedProduct.descFr : selectedProduct.descEn}
            </p>

            <div className="modal-label">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>{t.products.profile}</div>
              <div style={{ maxWidth: 180, margin: "0 auto" }}>
                <RadarChart data={selectedProduct.profile} color={selectedProduct.color} size={180} />
              </div>
            </div>

            <div className="modal-label">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{t.products.pairings}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.6)", lineHeight: 1.8 }}>
                {(lang === "fr" ? selectedProduct.pairingsFr : selectedProduct.pairingsEn).join(" · ")}
              </div>
            </div>

            <div className="modal-label">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{t.products.certifications}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedProduct.certs.map((c) => (
                  <span key={c} style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 20,
                    background: "rgba(11,54,61,0.05)", border: "1px solid rgba(11,54,61,0.08)",
                    fontFamily: "'DM Sans', sans-serif", color: "rgba(11,54,61,0.6)",
                  }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ COCKTAIL LAB ═══ */}
      <section ref={(el) => (sectionRefs.current.cocktails = el)} style={{
        padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto",
      }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="section-label">{t.cocktails.sectionLabel}</div>
          <h2 className="section-title">{t.cocktails.title}</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(11,54,61,0.5)", maxWidth: 480, margin: "0 auto" }}>
            {t.cocktails.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {["all", "gin", "noalcohol", "aperitivo"].map((f) => (
            <button key={f} className={`filter-btn ${cocktailFilter === f ? "active" : ""}`}
              onClick={() => setCocktailFilter(f)}>
              {f === "all" ? t.cocktails.all : productsData.find((p) => p.id === f)?.[lang === "fr" ? "nameFr" : "nameEn"] || f}
            </button>
          ))}
          <span style={{ width: 1, height: 24, background: "rgba(11,54,61,0.1)", margin: "0 4px" }} />
          {["all", "allYear", "summer", "winter", "spring", "autumn"].map((s) => (
            <button key={s} className={`filter-btn ${seasonFilter === s ? "active" : ""}`}
              onClick={() => setSeasonFilter(s)}>
              {s === "all" ? t.cocktails.all : t.cocktails[s]}
            </button>
          ))}
        </div>

        {/* Cocktail grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filteredCocktails.map((c) => (
            <div key={c.id} className="card" style={{ cursor: "pointer", padding: 24 }}
              onClick={() => setSelectedCocktail(c)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h4 style={{ fontSize: 18, fontWeight: 400, fontStyle: "italic", flex: 1 }}>
                  {lang === "fr" ? c.nameFr : c.nameEn}
                </h4>
                <button onClick={(e) => { e.stopPropagation(); toggleSaved(c.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: savedCocktails.includes(c.id) ? "#c2744a" : "rgba(11,54,61,0.25)", transition: "color 0.3s" }}>
                  {savedCocktails.includes(c.id) ? <IconHeartFilled /> : <IconHeart />}
                </button>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 12,
                  background: "rgba(11,54,61,0.04)", color: "rgba(11,54,61,0.5)",
                }}>
                  {productsData.find((p) => p.id === c.product)?.[lang === "fr" ? "nameFr" : "nameEn"]}
                </span>
                <span style={{
                  padding: "3px 10px", borderRadius: 12,
                  background: c.difficulty === "easy" ? "rgba(58,122,107,0.08)" : c.difficulty === "medium" ? "rgba(194,116,74,0.08)" : "rgba(11,54,61,0.08)",
                  color: c.difficulty === "easy" ? "#3a7a6b" : c.difficulty === "medium" ? "#c2744a" : "#0b363d",
                }}>
                  {t.cocktails[c.difficulty]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cocktail Modal */}
      {selectedCocktail && (
        <div className="overlay" onClick={() => setSelectedCocktail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 400, fontStyle: "italic" }}>
                {lang === "fr" ? selectedCocktail.nameFr : selectedCocktail.nameEn}
              </h3>
              <button onClick={() => setSelectedCocktail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0b363d" }}><IconX /></button>
            </div>

            <div className="modal-label">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                <IconFlask /> {t.cocktails.ingredients}
              </div>
              {(lang === "fr" ? selectedCocktail.ingredientsFr : selectedCocktail.ingredientsEn).map((ing, i) => (
                <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.7)", padding: "4px 0", borderBottom: i < (lang === "fr" ? selectedCocktail.ingredientsFr : selectedCocktail.ingredientsEn).length - 1 ? "1px solid rgba(11,54,61,0.04)" : "none" }}>
                  {ing}
                </div>
              ))}
            </div>

            <div className="modal-label">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                {t.cocktails.steps}
              </div>
              {(lang === "fr" ? selectedCocktail.stepsFr : selectedCocktail.stepsEn).map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "6px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.7)" }}>
                  <span style={{ color: "#0b363d", fontWeight: 500, minWidth: 20 }}>{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.5)" }}>
              <span style={{ fontWeight: 500, color: "#0b363d" }}>{t.cocktails.garnish}:</span>
              {lang === "fr" ? selectedCocktail.garnishFr : selectedCocktail.garnishEn}
            </div>

            <div style={{ marginTop: 20 }}>
              <button onClick={() => toggleSaved(selectedCocktail.id)} className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {savedCocktails.includes(selectedCocktail.id) ? <IconHeartFilled /> : <IconHeart />}
                {savedCocktails.includes(selectedCocktail.id) ? t.cocktails.saved : t.cocktails.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PRO TOOLBOX ═══ */}
      <section ref={(el) => (sectionRefs.current.toolbox = el)} style={{
        padding: "60px 24px 80px", maxWidth: 900, margin: "0 auto",
      }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">{t.toolbox.sectionLabel}</div>
          <h2 className="section-title">{t.toolbox.title}</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(11,54,61,0.5)", maxWidth: 480, margin: "0 auto" }}>
            {t.toolbox.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { title: t.toolbox.logos, desc: t.toolbox.logosDesc, ready: true },
            { title: t.toolbox.photos, desc: t.toolbox.photosDesc, ready: true },
            { title: t.toolbox.sheets, desc: t.toolbox.sheetsDesc, ready: true },
            { title: t.toolbox.salesKit, desc: t.toolbox.salesKitDesc, ready: false },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(11,54,61,0.04)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#0b363d" }}>
                <IconDownload />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 400, fontStyle: "italic", marginBottom: 8 }}>{item.title}</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(11,54,61,0.5)", lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
              <button className={item.ready ? "btn-primary" : "btn-ghost"} style={{ fontSize: 11, padding: "8px 20px", width: "100%" }}>
                {item.ready ? t.toolbox.download : t.toolbox.comingSoon}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.4)", marginTop: 24 }}>
          {t.toolbox.contact}
        </p>
      </section>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section ref={(el) => (sectionRefs.current.sustainability = el)} style={{
        padding: "60px 24px 80px", maxWidth: 900, margin: "0 auto",
      }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">{t.sustainability.sectionLabel}</div>
          <h2 className="section-title">{t.sustainability.title}</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(11,54,61,0.5)", maxWidth: 480, margin: "0 auto" }}>
            {t.sustainability.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: "🅱️", title: t.sustainability.bcorp, desc: t.sustainability.bcorpDesc },
            { icon: "🌱", title: t.sustainability.organic, desc: t.sustainability.organicDesc },
            { icon: "🏛️", title: t.sustainability.oldest, desc: t.sustainability.oldestDesc },
            { icon: "♻️", title: t.sustainability.bottle, desc: t.sustainability.bottleDesc },
            { icon: "🤝", title: t.sustainability.local, desc: t.sustainability.localDesc },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h4 style={{ fontSize: 17, fontWeight: 400, fontStyle: "italic", marginBottom: 8 }}>{item.title}</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.6)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PHASE 2 TEASERS ═══ */}
      <section style={{ padding: "60px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">{t.teasers.sectionLabel}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { key: "academy", title: t.teasers.academyTitle, desc: t.teasers.academyDesc },
            { key: "finder", title: t.teasers.finderTitle, desc: t.teasers.finderDesc },
            { key: "cellar", title: t.teasers.cellarTitle, desc: t.teasers.cellarDesc },
            { key: "events", title: t.teasers.eventsTitle, desc: t.teasers.eventsDesc },
          ].map((item) => (
            <div key={item.key} className="card" style={{ padding: 24, opacity: 0.7, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "rgba(11,54,61,0.35)" }}>
                <IconLock />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 400, fontStyle: "italic", marginBottom: 8 }}>{item.title}</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(11,54,61,0.5)", lineHeight: 1.6, marginBottom: 16 }}>
                {item.desc}
              </p>
              <button
                className={teaserNotifs[item.key] ? "btn-ghost" : "btn-primary"}
                style={{ fontSize: 11, padding: "8px 20px", width: "100%" }}
                onClick={() => setTeaserNotifs((prev) => ({ ...prev, [item.key]: true }))}
              >
                {teaserNotifs[item.key] ? t.teasers.notified : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <IconBell /> {t.teasers.notifyMe}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "48px 24px 32px", maxWidth: 900, margin: "0 auto",
        borderTop: "1px solid rgba(11,54,61,0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 20, letterSpacing: 5, fontWeight: 500, marginBottom: 8 }}>ARDUENNA</div>
          <div style={{ fontStyle: "italic", fontSize: 16, color: "rgba(11,54,61,0.5)" }}>{t.footer.tagline}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <a href="https://arduenna-gin.com" target="_blank" rel="noopener noreferrer" className="nav-link">{t.footer.shop}</a>
          <span className="nav-link">{t.footer.legal}</span>
          <span className="nav-link">{t.footer.contact}</span>
        </div>

        <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
          <p style={{ fontSize: 11, color: "rgba(11,54,61,0.35)", marginBottom: 8 }}>{t.footer.copyright}</p>
          <p style={{ fontSize: 11, color: "rgba(11,54,61,0.3)", fontStyle: "italic" }}>{t.footer.drink}</p>
        </div>
      </footer>
    </div>
  );
}
