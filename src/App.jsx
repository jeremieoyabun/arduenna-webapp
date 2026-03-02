import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// ARDUENNA GIN — MVP WEBAPP
// Design system tokens live in index.css
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
    certs: ["Bio EU", "B Corp", "Distillerie historique"],
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
    certs: ["Bio EU", "B Corp", "Sans alcool"],
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
    certs: ["Bio EU", "B Corp"],
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
          fill="none" stroke="var(--border-medium)" strokeWidth="0.5" />
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100)[0]} y2={getPoint(i, 100)[1]}
          stroke="var(--border-light)" strokeWidth="0.5" />
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
            fill="var(--text-secondary)" fontSize="7" fontFamily="var(--font-body)" style={{ textTransform: "capitalize" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Icons ───
const IconFlask = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6M12 3v7l-5 8.5a2 2 0 001.7 3h6.6a2 2 0 001.7-3L12 10V3"/></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const IconHeart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconHeartFilled = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconX = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconGlobe = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IconSun = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;

// Bottom nav icons (slightly larger for touch)
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const IconBottle = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2h4M12 2v4M8 6h8l1 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V10l1-4z"/></svg>;
const IconGlass = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2h8l-1 10a4 4 0 01-3 3.87V20h3v2H9v-2h3v-4.13A4 4 0 019 12L8 2z"/></svg>;
const IconLeafNav = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>;
const IconBriefcase = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;

// ─── Botanical decoration ───
const BotanicalDeco = ({ className, style }) => (
  <svg viewBox="0 0 120 200" className={className} style={{ position: "absolute", opacity: 0.05, ...style }} fill="var(--text-primary)">
    <path d="M60 200 C60 200 60 100 60 80 C60 60 30 40 20 20 C15 10 25 0 35 5 C45 10 55 30 60 50 C65 30 75 10 85 5 C95 0 105 10 100 20 C90 40 60 60 60 80Z"/>
  </svg>
);

// ─── Sustainability icons (SVG instead of emojis) ───
const SustainIcon = ({ type }) => {
  const icons = {
    bcorp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h4a2 2 0 100-4H8v8h4.5a2.5 2.5 0 100-5H8"/></svg>,
    organic: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>,
    oldest: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>,
    bottle: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 12l2 2 4-4"/></svg>,
    local: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  };
  return icons[type] || null;
};

// ═══════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════
export default function ArduennaWebapp() {
  const [lang, setLang] = useState("fr");
  const [theme, setTheme] = useState("light");
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
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang];
  const sectionRefs = useRef({});

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
  }, [ageVerified]);

  // Track active section for bottom nav
  useEffect(() => {
    if (!ageVerified) return;
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
  }, [ageVerified]);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSaved = (id) => {
    setSavedCocktails((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleTheme = () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  };

  const filteredCocktails = cocktailsData.filter((c) => {
    if (cocktailFilter !== "all" && c.product !== cocktailFilter) return false;
    if (seasonFilter !== "all" && c.season !== seasonFilter) return false;
    return true;
  });

  const navSections = ["story", "products", "cocktails", "toolbox", "sustainability"];
  const bottomNavItems = [
    { id: "hero", label: lang === "fr" ? "Accueil" : "Home", Icon: IconHome },
    { id: "products", label: t.nav.products, Icon: IconBottle },
    { id: "cocktails", label: "Cocktails", Icon: IconGlass },
    { id: "sustainability", label: lang === "fr" ? "Durable" : "Green", Icon: IconLeafNav },
    { id: "toolbox", label: "Pro", Icon: IconBriefcase },
  ];

  // ─── AGE GATE ───
  if (!ageVerified) {
    return (
      <div className="age-gate">
        <div className="age-gate__card">
          <div className="age-gate__brand">ARDUENNA</div>
          <h2 className="age-gate__title">{t.ageGate.title}</h2>
          <p className="age-gate__question">{t.ageGate.question}</p>
          {ageDenied && <p className="age-gate__denied">{t.ageGate.denied}</p>}
          <div className="age-gate__actions">
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
    <div className="app-shell">

      {/* ═══ TOP NAVIGATION ═══ */}
      <nav className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`}>
        <div className="top-nav__inner">
          <img
            src="/Arduennagin_logo_vert_.webp"
            alt="Arduenna"
            className="top-nav__logo"
            onClick={() => scrollTo("hero")}
          />

          <div className="top-nav__links">
            {navSections.map((sec) => (
              <button
                key={sec}
                className={`top-nav__link ${activeSection === sec ? "top-nav__link--active" : ""}`}
                onClick={() => scrollTo(sec)}
              >
                {t.nav[sec]}
              </button>
            ))}
          </div>

          <div className="top-nav__actions">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === "light" ? <IconMoon /> : <IconSun />}
            </button>
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="lang-toggle">
              <IconGlobe /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="menu-toggle" aria-label="Menu">
              {menuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navSections.map((sec) => (
            <button key={sec} className="mobile-menu__link" onClick={() => scrollTo(sec)}>
              {t.nav[sec]}
            </button>
          ))}
        </div>
      )}

      {/* ═══ BOTTOM NAVIGATION (mobile) ═══ */}
      <div className="bottom-nav">
        {bottomNavItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`bottom-nav__item ${activeSection === id ? "bottom-nav__item--active" : ""}`}
            onClick={() => scrollTo(id)}
          >
            <span className="bottom-nav__icon"><Icon /></span>
            {label}
          </button>
        ))}
      </div>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={(el) => (sectionRefs.current.hero = el)} className="hero">
        <BotanicalDeco style={{ top: "10%", left: "-5%", width: 200, transform: "rotate(-15deg)" }} />
        <BotanicalDeco style={{ top: "15%", right: "-3%", width: 160, transform: "rotate(20deg) scaleX(-1)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="hero__banner">
            {lang === "fr" ? "LIVRAISON GRATUITE EN BELGIQUE À PARTIR DE 50€" : "FREE DELIVERY IN BELGIUM FROM 50€"}
          </div>

          <h1 className="hero__heading">
            <span style={{ display: "block" }}>{t.hero.tagline}</span>
            <span style={{ display: "block", fontStyle: "italic" }}>
              — <em>{t.hero.tagline2}</em> —
            </span>
          </h1>

          <p className="hero__subtitle">{t.hero.subtitle}</p>

          <button className="btn-primary" onClick={() => scrollTo("products")} style={{ padding: "16px 40px" }}>
            {t.hero.cta}
          </button>

          <img
            src="/Arduenna_Bouteille_50CL-V2.avif"
            alt="Arduenna Gin"
            className="hero__bottle"
          />
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section id="story" ref={(el) => (sectionRefs.current.story = el)} className="section">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.story.sectionLabel}</div>
          <h2 className="section-title">{t.story.title}</h2>
        </div>

        <div className="body-text reveal" style={{ textAlign: "center", maxWidth: "var(--max-width-text)", margin: "0 auto var(--space-14)" }}>
          <p style={{ marginBottom: "var(--space-5)" }}>{t.story.p1}</p>
          <p style={{ marginBottom: "var(--space-5)" }}>{t.story.p2}</p>
          <p>{t.story.p3}</p>
        </div>

        <div className="grid-3">
          {[
            { name: t.story.botanical1, latin: t.story.botanical1Latin, desc: t.story.botanical1Desc, img: "/Mirabelle.svg" },
            { name: t.story.botanical2, latin: t.story.botanical2Latin, desc: t.story.botanical2Desc, img: "/Sapin.svg" },
            { name: t.story.botanical3, latin: t.story.botanical3Latin, desc: t.story.botanical3Desc, img: "/Sureau.avif" },
          ].map((b, i) => (
            <div key={b.name} className={`card botanical-card reveal reveal--delay-${i + 1}`}>
              <img src={b.img} alt={b.name} className="botanical-card__img" />
              <h4 className="botanical-card__name">{b.name}</h4>
              <div className="botanical-card__latin">{b.latin}</div>
              <p className="botanical-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ AWARDS ═══ */}
      <section className="section">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.awards.sectionLabel}</div>
          <h2 className="section-title">{t.awards.title}</h2>
        </div>

        <div className="grid-3 reveal">
          {awardsData.map((a, i) => (
            <div key={i} className="card card--flat award-card">
              <div className="award-card__year">{a.year}</div>
              <div className="award-card__title">{a.title}</div>
              <div className="award-card__detail">{a.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section id="products" ref={(el) => (sectionRefs.current.products = el)} className="section section--wide">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.products.sectionLabel}</div>
          <h2 className="section-title">{t.products.title}</h2>
        </div>

        <div className="grid-2 reveal">
          {productsData.map((p) => (
            <div key={p.id} className="card card--interactive product-card" onClick={() => setSelectedProduct(p)}>
              <img src={p.img} alt={lang === "fr" ? p.nameFr : p.nameEn} className="product-card__img" />
              <h3 className="product-card__name">{lang === "fr" ? p.nameFr : p.nameEn}</h3>
              <div className="product-card__meta">{p.volume} · {p.abv}</div>
              <div className="product-card__price">{p.price}</div>
              <div className="product-card__radar">
                <RadarChart data={p.profile} color={p.color} size={140} />
              </div>
              <p className="product-card__desc">{lang === "fr" ? p.descFr : p.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
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
              <button className="modal__close" onClick={() => setSelectedProduct(null)}><IconX /></button>
            </div>

            <p className="body-text" style={{ marginBottom: "var(--space-6)" }}>
              {lang === "fr" ? selectedProduct.descFr : selectedProduct.descEn}
            </p>

            <div className="modal__block">
              <div className="modal__block-title">{t.products.profile}</div>
              <div style={{ maxWidth: 180, margin: "0 auto" }}>
                <RadarChart data={selectedProduct.profile} color={selectedProduct.color} size={180} />
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

      {/* ═══ COCKTAIL LAB ═══ */}
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
            >
              {f === "all" ? t.cocktails.all : productsData.find((p) => p.id === f)?.[lang === "fr" ? "nameFr" : "nameEn"] || f}
            </button>
          ))}
          <span className="filter-separator" />
          {["all", "allYear", "summer", "winter", "spring", "autumn"].map((s) => (
            <button
              key={s}
              className={`filter-chip ${seasonFilter === s ? "filter-chip--active" : ""}`}
              onClick={() => setSeasonFilter(s)}
            >
              {s === "all" ? t.cocktails.all : t.cocktails[s]}
            </button>
          ))}
        </div>

        {/* Cocktail grid */}
        <div className="grid-2 reveal">
          {filteredCocktails.map((c) => (
            <div key={c.id} className="card card--interactive cocktail-card" onClick={() => setSelectedCocktail(c)}>
              <div className="cocktail-card__header">
                <h4 className="cocktail-card__name">{lang === "fr" ? c.nameFr : c.nameEn}</h4>
                <button
                  className={`cocktail-card__save ${savedCocktails.includes(c.id) ? "cocktail-card__save--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleSaved(c.id); }}
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cocktail Modal */}
      {selectedCocktail && (
        <div className="overlay" onClick={() => setSelectedCocktail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)" }}>
                {lang === "fr" ? selectedCocktail.nameFr : selectedCocktail.nameEn}
              </h3>
              <button className="modal__close" onClick={() => setSelectedCocktail(null)}><IconX /></button>
            </div>

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

            <div style={{ marginTop: "var(--space-5)" }}>
              <button onClick={() => toggleSaved(selectedCocktail.id)} className="btn-ghost btn-full" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
                {savedCocktails.includes(selectedCocktail.id) ? <IconHeartFilled /> : <IconHeart />}
                {savedCocktails.includes(selectedCocktail.id) ? t.cocktails.saved : t.cocktails.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PRO TOOLBOX ═══ */}
      <section id="toolbox" ref={(el) => (sectionRefs.current.toolbox = el)} className="section">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.toolbox.sectionLabel}</div>
          <h2 className="section-title">{t.toolbox.title}</h2>
          <p className="section-subtitle">{t.toolbox.subtitle}</p>
        </div>

        <div className="grid-4 reveal">
          {[
            { title: t.toolbox.logos, desc: t.toolbox.logosDesc, ready: true },
            { title: t.toolbox.photos, desc: t.toolbox.photosDesc, ready: true },
            { title: t.toolbox.sheets, desc: t.toolbox.sheetsDesc, ready: true },
            { title: t.toolbox.salesKit, desc: t.toolbox.salesKitDesc, ready: false },
          ].map((item, i) => (
            <div key={i} className="card toolbox-card">
              <div className="toolbox-card__icon"><IconDownload /></div>
              <h4 className="toolbox-card__title">{item.title}</h4>
              <p className="toolbox-card__desc">{item.desc}</p>
              <button className={`${item.ready ? "btn-primary" : "btn-ghost"} btn-sm btn-full`}>
                {item.ready ? t.toolbox.download : t.toolbox.comingSoon}
              </button>
            </div>
          ))}
        </div>

        <p className="caption reveal" style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
          {t.toolbox.contact}
        </p>
      </section>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section id="sustainability" ref={(el) => (sectionRefs.current.sustainability = el)} className="section">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.sustainability.sectionLabel}</div>
          <h2 className="section-title">{t.sustainability.title}</h2>
          <p className="section-subtitle">{t.sustainability.subtitle}</p>
        </div>

        <div className="grid-3 reveal">
          {[
            { icon: "bcorp", title: t.sustainability.bcorp, desc: t.sustainability.bcorpDesc },
            { icon: "organic", title: t.sustainability.organic, desc: t.sustainability.organicDesc },
            { icon: "oldest", title: t.sustainability.oldest, desc: t.sustainability.oldestDesc },
            { icon: "bottle", title: t.sustainability.bottle, desc: t.sustainability.bottleDesc },
            { icon: "local", title: t.sustainability.local, desc: t.sustainability.localDesc },
          ].map((item, i) => (
            <div key={i} className="card sustain-card">
              <div className="sustain-card__icon"><SustainIcon type={item.icon} /></div>
              <h4 className="sustain-card__title">{item.title}</h4>
              <p className="sustain-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PHASE 2 TEASERS ═══ */}
      <section className="section">
        <div className="divider" />
        <div className="section-header reveal">
          <div className="section-overline">{t.teasers.sectionLabel}</div>
        </div>

        <div className="grid-4 reveal">
          {[
            { key: "academy", title: t.teasers.academyTitle, desc: t.teasers.academyDesc },
            { key: "finder", title: t.teasers.finderTitle, desc: t.teasers.finderDesc },
            { key: "cellar", title: t.teasers.cellarTitle, desc: t.teasers.cellarDesc },
            { key: "events", title: t.teasers.eventsTitle, desc: t.teasers.eventsDesc },
          ].map((item) => (
            <div key={item.key} className="card teaser-card">
              <div className="teaser-card__lock"><IconLock /></div>
              <h4 className="teaser-card__title">{item.title}</h4>
              <p className="teaser-card__desc">{item.desc}</p>
              <button
                className={`${teaserNotifs[item.key] ? "btn-ghost" : "btn-primary"} btn-sm btn-full`}
                onClick={() => setTeaserNotifs((prev) => ({ ...prev, [item.key]: true }))}
              >
                {teaserNotifs[item.key] ? t.teasers.notified : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
                    <IconBell /> {t.teasers.notifyMe}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer__brand">
          <div className="footer__brand-name">ARDUENNA</div>
          <div className="footer__tagline">{t.footer.tagline}</div>
        </div>

        <div className="footer__links">
          <a href="https://arduenna-gin.com" target="_blank" rel="noopener noreferrer" className="footer__link">{t.footer.shop}</a>
          <span className="footer__link">{t.footer.legal}</span>
          <span className="footer__link">{t.footer.contact}</span>
        </div>

        <div className="footer__legal">
          <p className="footer__copyright">{t.footer.copyright}</p>
          <p className="footer__warning">{t.footer.drink}</p>
        </div>
      </footer>
    </div>
  );
}
