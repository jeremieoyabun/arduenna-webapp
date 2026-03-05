/**
 * Lesson content, bilingual FR/EN.
 * Parcours 1 full content; Parcours 2-4 placeholders until V1.5.
 * Formats: "swipe" | "mcq" | "truefalse"
 *
 * Each lesson uses *Fr / *En suffixed fields for bilingual rendering.
 * LessonEngine picks the correct field based on user lang preference.
 */

// ── MODULE 1.1, La Forêt d'Arduenna ──────────────────────────────────────

const univers1 = [
  // Leçon 1, Swipe (4 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "La Forêt d'Arduenna",
        titleEn: "The Arduenna Forest",
        textFr: "Le nom Arduenna vient de la Silva Arduenna, l'ancienne forêt celtique des Ardennes. Un lieu de nature sauvage et préservée au cœur de la Belgique.",
        textEn: "The name Arduenna comes from Silva Arduenna, the ancient Celtic forest of the Ardennes. A place of wild, unspoiled nature at the heart of Belgium.",
        img: "/Quizz/01/Card-1.webp",
      },
      {
        titleFr: "Une distillerie artisanale belge",
        titleEn: "A Belgian artisan distillery",
        textFr: "Arduenna est une distillerie artisanale née au cœur des Ardennes belges. Fondée par une famille passionnée, elle produit un gin bio d'exception depuis ses débuts.",
        textEn: "Arduenna is an artisan distillery born in the heart of the Belgian Ardennes. Founded by a passionate family, it has crafted an exceptional organic gin since its beginnings.",
        img: "/Quizz/01/Card-3-Distillation.webp",
      },
      {
        titleFr: "Les fondateurs",
        titleEn: "The founders",
        textFr: "Deux amis partageant la même vision : créer un gin qui capture l'essence de la forêt ardennaise. Botaniques locales, processus artisanal, zéro compromis sur la qualité.",
        textEn: "Two friends sharing the same vision: to create a gin that captures the essence of the Ardennais forest. Local botanicals, artisan process, zero compromise on quality.",
        img: "/Quizz/01/Card-3-Les-fondateurs.webp",
      },
      {
        titleFr: "La philosophie",
        titleEn: "The philosophy",
        textFr: "Faire moins mais faire mieux. Trois botaniques locales récoltées à la main, une distillation lente, une eau de source des Ardennes. L'artisanat avant tout.",
        textEn: "Do less but do better. Three hand-harvested local botanicals, slow distillation, Ardennes spring water. Craftsmanship above all.",
        img: "/Quizz/01/Card-4-philosophie.webp",
      },
    ],
  },
  // Leçon 2, 5 QCM
  {
    type: "mcq",
    questionFr: "Que signifie le nom « Arduenna » ?",
    questionEn: "What does the name 'Arduenna' mean?",
    optionsFr: ["Une rivière belge", "L'ancienne forêt celtique des Ardennes", "Un village de Wallonie", "Le fondateur de la distillerie"],
    optionsEn: ["A Belgian river", "The ancient Celtic forest of the Ardennes", "A village in Wallonia", "The distillery's founder"],
    correctIndex: 1,
    explanationFr: "Arduenna vient de Silva Arduenna, le nom latin de la grande forêt celtique qui couvrait les Ardennes. Ce nom évoque la nature sauvage et préservée de la région.",
    explanationEn: "Arduenna comes from Silva Arduenna, the Latin name for the great Celtic forest that covered the Ardennes. This name evokes the wild, unspoiled nature of the region.",
  },
  {
    type: "mcq",
    questionFr: "Dans quel pays est produit le gin Arduenna ?",
    questionEn: "In which country is Arduenna gin produced?",
    optionsFr: ["France", "Luxembourg", "Belgique", "Pays-Bas"],
    optionsEn: ["France", "Luxembourg", "Belgium", "Netherlands"],
    correctIndex: 2,
    explanationFr: "Arduenna est distillé en Belgique, dans la région des Ardennes. C'est un gin 100% belge, fier de ses origines ardennaises.",
    explanationEn: "Arduenna is distilled in Belgium, in the Ardennes region. It's a 100% Belgian gin, proud of its Ardennais origins.",
  },
  {
    type: "mcq",
    questionFr: "Quel est le taux d'alcool du gin Arduenna classique ?",
    questionEn: "What is the alcohol content of classic Arduenna gin?",
    optionsFr: ["37,5%", "40%", "44%", "47%"],
    optionsEn: ["37.5%", "40%", "44%", "47%"],
    correctIndex: 2,
    explanationFr: "Le gin Arduenna titre à 44% vol. Ce taux permet une expression optimale des botaniques tout en restant équilibré en bouche.",
    explanationEn: "Arduenna gin is 44% ABV. This level allows optimal expression of the botanicals while remaining balanced on the palate.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce qui distingue Arduenna des gins industriels ?",
    questionEn: "What distinguishes Arduenna from industrial gins?",
    optionsFr: ["Son prix bas", "Ses botaniques locales, sa production artisanale et sa double certification Bio EU + B Corp", "Sa distribution mondiale", "Son conditionnement en canette"],
    optionsEn: ["Its low price", "Its local botanicals, artisan production and dual Bio EU + B Corp certification", "Its worldwide distribution", "Its canned packaging"],
    correctIndex: 1,
    explanationFr: "Arduenna se démarque par ses 3 botaniques ardennaises récoltées à la main, sa production artisanale et sa double certification Bio EU et B Corp, une combinaison unique sur le marché.",
    explanationEn: "Arduenna stands out through its 3 hand-harvested Ardennais botanicals, artisan production and dual Bio EU and B Corp certification, a unique combination in the market.",
  },
  {
    type: "mcq",
    questionFr: "Comment sont récoltées les botaniques d'Arduenna ?",
    questionEn: "How are Arduenna's botanicals harvested?",
    optionsFr: ["Par machine industrielle", "Importées de l'étranger", "À la main dans les Ardennes", "Cultivées en serre"],
    optionsEn: ["By industrial machine", "Imported from abroad", "By hand in the Ardennes", "Grown in a greenhouse"],
    correctIndex: 2,
    explanationFr: "Les 3 botaniques signatures d'Arduenna, mirabelle, bourgeons de sapin et fleurs de sureau, sont récoltées à la main dans les Ardennes belges, chacune à sa saison optimale.",
    explanationEn: "Arduenna's 3 signature botanicals, mirabelle plum, fir buds and elderflower, are hand-harvested in the Belgian Ardennes, each at its optimal season.",
  },
  // Leçon 3, 4 vrai/faux
  {
    type: "truefalse",
    statementFr: "Arduenna est certifié B Corp.",
    statementEn: "Arduenna is B Corp certified.",
    correct: true,
    explanationFr: "Vrai ! Arduenna est certifié B Corp, une certification qui évalue l'impact social et environnemental global de l'entreprise. Un engagement concret, pas seulement du marketing.",
    explanationEn: "True! Arduenna is B Corp certified, a certification that assesses the overall social and environmental impact of the company. A concrete commitment, not just marketing.",
  },
  {
    type: "truefalse",
    statementFr: "Le gin Arduenna est produit en France.",
    statementEn: "Arduenna gin is produced in France.",
    correct: false,
    explanationFr: "Faux ! Arduenna est une distillerie 100% belge, implantée dans les Ardennes belges. Belge de cœur et de terroir.",
    explanationEn: "False! Arduenna is a 100% Belgian distillery, established in the Belgian Ardennes. Belgian through and through.",
  },
  {
    type: "truefalse",
    statementFr: "Le gin Arduenna contient des arômes artificiels.",
    statementEn: "Arduenna gin contains artificial flavours.",
    correct: false,
    explanationFr: "Faux ! Arduenna n'utilise que des botaniques naturelles récoltées localement. Aucun arôme artificiel, aucun additif chimique. C'est l'essence même du gin artisanal bio.",
    explanationEn: "False! Arduenna uses only natural, locally harvested botanicals. No artificial flavours, no chemical additives. That's the very essence of organic artisan gin.",
  },
  {
    type: "truefalse",
    statementFr: "Arduenna utilise de l'eau de source des Ardennes pour la réduction.",
    statementEn: "Arduenna uses Ardennes spring water for reduction.",
    correct: true,
    explanationFr: "Vrai ! L'eau de source des Ardennes est utilisée pour réduire le gin à sa teneur finale en alcool. Chaque détail compte dans la production artisanale.",
    explanationEn: "True! Ardennes spring water is used to reduce the gin to its final alcohol content. Every detail counts in artisan production.",
  },
];

// ── MODULE 1.2, Les 3 Botaniques ─────────────────────────────────────────

const univers2 = [
  // Leçon 1, Swipe (3 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "🍑 Mirabelle",
        titleEn: "🍑 Mirabelle Plum",
        textFr: "Petite prune dorée des Ardennes. Apporte rondeur et douceur fruitée-acidulée au gin. Récoltée à la main en fin d'été quand les fruits sont à parfaite maturité.",
        textEn: "Small golden plum from the Ardennes. Brings roundness and sweet-tart fruitiness to the gin. Hand-harvested in late summer when the fruits are at perfect ripeness.",
        img: "/Mirabelle.webp", imgContain: true,
      },
      {
        titleFr: "🌲 Sapin",
        titleEn: "🌲 Fir",
        textFr: "Bourgeons de sapin cueillis au printemps dans les forêts ardennaises. Confèrent une fraîcheur résineuse unique et des notes boisées. La signature aromatique d'Arduenna.",
        textEn: "Fir buds picked in spring from the Ardennais forests. Give a unique resinous freshness and woody notes. The aromatic signature of Arduenna.",
        img: "/Sapin.webp", imgContain: true,
      },
      {
        titleFr: "🌸 Sureau",
        titleEn: "🌸 Elderflower",
        textFr: "Fleurs de sureau récoltées en juin à leur plein épanouissement. Ajoutent élégance florale et douceur délicate. La touche de finesse qui complète le profil aromatique.",
        textEn: "Elderflowers harvested in June at full bloom. Add floral elegance and delicate sweetness. The touch of finesse that completes the aromatic profile.",
        img: "/Sureau.avif", imgContain: true,
      },
    ],
  },
  // Leçon 2, 4 QCM
  {
    type: "mcq",
    questionFr: "Quelle botanique apporte la fraîcheur résineuse au gin Arduenna ?",
    questionEn: "Which botanical brings resinous freshness to Arduenna gin?",
    optionsFr: ["La mirabelle", "Le genièvre", "Les bourgeons de sapin", "Les fleurs de sureau"],
    optionsEn: ["The mirabelle plum", "Juniper", "Fir buds", "Elderflower"],
    correctIndex: 2,
    explanationFr: "Les bourgeons de sapin, cueillis au printemps dans les forêts ardennaises, sont la signature aromatique d'Arduenna avec leurs notes résineuses et boisées distinctives.",
    explanationEn: "Fir buds, picked in spring from the Ardennais forests, are Arduenna's aromatic signature with their distinctive resinous and woody notes.",
  },
  {
    type: "mcq",
    questionFr: "Quelle botanique apporte la rondeur fruitée au gin Arduenna ?",
    questionEn: "Which botanical brings fruity roundness to Arduenna gin?",
    optionsFr: ["Le sureau", "Le sapin", "La mirabelle", "Le genièvre"],
    optionsEn: ["Elderflower", "Fir", "Mirabelle plum", "Juniper"],
    correctIndex: 2,
    explanationFr: "La mirabelle, petite prune dorée des Ardennes, apporte cette rondeur fruitée sucrée-acidulée qui équilibre les notes résineuses du sapin.",
    explanationEn: "The mirabelle plum, a small golden Ardennais plum, brings this sweet-tart fruity roundness that balances the resinous notes of the fir.",
  },
  {
    type: "mcq",
    questionFr: "Quand sont récoltées les fleurs de sureau ?",
    questionEn: "When are the elderflowers harvested?",
    optionsFr: ["En hiver", "Au printemps (mars-avril)", "En juin", "En automne"],
    optionsEn: ["In winter", "In spring (March-April)", "In June", "In autumn"],
    correctIndex: 2,
    explanationFr: "Les fleurs de sureau sont récoltées en juin, à leur plein épanouissement, quand leur parfum floral est le plus intense et délicat.",
    explanationEn: "The elderflowers are harvested in June, at full bloom, when their floral fragrance is most intense and delicate.",
  },
  {
    type: "mcq",
    questionFr: "Combien de botaniques signatures sont présentes dans le gin Arduenna ?",
    questionEn: "How many signature botanicals are in Arduenna gin?",
    optionsFr: ["2", "3", "5", "7"],
    optionsEn: ["2", "3", "5", "7"],
    correctIndex: 1,
    explanationFr: "Arduenna utilise 3 botaniques signatures ardennaises : la mirabelle, les bourgeons de sapin et les fleurs de sureau. La philosophie « moins c'est plus » pour un profil aromatique cohérent.",
    explanationEn: "Arduenna uses 3 signature Ardennais botanicals: mirabelle plum, fir buds and elderflower. The 'less is more' philosophy for a coherent aromatic profile.",
  },
  // Leçon 3, 3 vrai/faux
  {
    type: "truefalse",
    statementFr: "La mirabelle apporte des notes florales au gin Arduenna.",
    statementEn: "The mirabelle plum brings floral notes to Arduenna gin.",
    correct: false,
    explanationFr: "Faux ! La mirabelle apporte rondeur et douceur fruitée-acidulée, pas des notes florales. Les notes florales viennent du sureau.",
    explanationEn: "False! The mirabelle brings roundness and sweet-tart fruitiness, not floral notes. The floral notes come from the elderflower.",
  },
  {
    type: "truefalse",
    statementFr: "Les 3 botaniques d'Arduenna sont toutes récoltées localement dans les Ardennes.",
    statementEn: "All 3 of Arduenna's botanicals are locally harvested in the Ardennes.",
    correct: true,
    explanationFr: "Vrai ! Mirabelle, bourgeons de sapin et fleurs de sureau sont toutes récoltées à la main dans les Ardennes belges. Circuit ultra-court, zéro import.",
    explanationEn: "True! Mirabelle plum, fir buds and elderflower are all hand-harvested in the Belgian Ardennes. Ultra-short supply chain, zero imports.",
  },
  {
    type: "truefalse",
    statementFr: "Le sureau est récolté en automne.",
    statementEn: "Elderflower is harvested in autumn.",
    correct: false,
    explanationFr: "Faux ! Les fleurs de sureau sont récoltées en juin, au début de l'été. C'est à ce moment que leur fragrance florale est la plus intense.",
    explanationEn: "False! The elderflowers are harvested in June, at the start of summer. That's when their floral fragrance is most intense.",
  },
];

// ── MODULE 1.3, Le Processus ──────────────────────────────────────────────

const univers3 = [
  // Leçon 1, Swipe (5 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "1. Cueillette",
        titleEn: "1. Harvesting",
        textFr: "Les botaniques sont cueillies à la main dans les Ardennes, chacune à sa saison optimale. Mirabelle en fin d'été, sapin au printemps, sureau en juin.",
        textEn: "The botanicals are hand-picked in the Ardennes, each at its optimal season. Mirabelle in late summer, fir in spring, elderflower in June.",
        img: "/Quizz/01/Card-cueillette.webp",
      },
      {
        titleFr: "2. Macération",
        titleEn: "2. Maceration",
        textFr: "Les botaniques macèrent dans un alcool de grain bio pour en extraire tous les arômes. Cette étape détermine la profondeur et la complexité du gin.",
        textEn: "The botanicals macerate in organic grain spirit to extract all the aromas. This step determines the depth and complexity of the gin.",
        img: "/Quizz/01/Card-Macération.webp",
      },
      {
        titleFr: "3. Distillation",
        titleEn: "3. Distillation",
        textFr: "Distillation lente en alambic cuivre traditionnel. Le maître distillateur sélectionne avec précision le « cœur de chauffe », la partie la plus pure et aromatique.",
        textEn: "Slow distillation in a traditional copper pot still. The master distiller precisely selects the 'heart of the run', the purest and most aromatic part.",
        img: "/Quizz/01/Card-3-Distillation.webp",
      },
      {
        titleFr: "4. Assemblage",
        titleEn: "4. Blending",
        textFr: "Les différents distillats sont assemblés puis réduits à l'eau de source des Ardennes jusqu'à atteindre la teneur en alcool finale de 44%.",
        textEn: "The various distillates are blended then reduced with Ardennes spring water to reach the final alcohol content of 44%.",
        img: "/Quizz/01/Card-3-Assemblage.webp",
      },
      {
        titleFr: "5. Mise en bouteille",
        titleEn: "5. Bottling",
        textFr: "Chaque bouteille est remplie, capsulée et contrôlée à la main. La bouteille éco-conçue (100% verre recyclable) est étiquetée avec soin avant expédition.",
        textEn: "Each bottle is filled, sealed and checked by hand. The eco-designed bottle (100% recyclable glass) is carefully labelled before dispatch.",
        img: "/Quizz/01/Card-mise-bouteille.webp",
      },
    ],
  },
  // Leçon 2, 4 QCM
  {
    type: "mcq",
    questionFr: "Quel type d'alambic est utilisé pour distiller Arduenna ?",
    questionEn: "What type of still is used to distil Arduenna?",
    optionsFr: ["Alambic en acier inoxydable", "Alambic à colonne continu", "Alambic en cuivre traditionnel", "Alambic sous vide"],
    optionsEn: ["Stainless steel pot still", "Continuous column still", "Traditional copper pot still", "Vacuum still"],
    correctIndex: 2,
    explanationFr: "Arduenna est distillé dans un alambic en cuivre traditionnel (pot still). Le cuivre interagit avec l'alcool pour éliminer les impuretés et enrichir le profil aromatique.",
    explanationEn: "Arduenna is distilled in a traditional copper pot still. The copper interacts with the spirit to eliminate impurities and enrich the aromatic profile.",
  },
  {
    type: "mcq",
    questionFr: "Quelle est la première étape de la production du gin Arduenna ?",
    questionEn: "What is the first step in producing Arduenna gin?",
    optionsFr: ["La distillation", "La macération", "La cueillette des botaniques", "La mise en bouteille"],
    optionsEn: ["Distillation", "Maceration", "Harvesting the botanicals", "Bottling"],
    correctIndex: 2,
    explanationFr: "La cueillette est la première étape, et la plus importante. Botaniques de qualité = gin de qualité. Tout commence dans les forêts ardennaises.",
    explanationEn: "Harvesting is the first step, and the most important. Quality botanicals = quality gin. Everything begins in the Ardennais forests.",
  },
  {
    type: "mcq",
    questionFr: "Avec quelle eau est réduit le gin Arduenna ?",
    questionEn: "With which water is Arduenna gin reduced?",
    optionsFr: ["Eau du robinet traitée", "Eau distillée", "Eau de source des Ardennes", "Eau de mer dessalinisée"],
    optionsEn: ["Treated tap water", "Distilled water", "Ardennes spring water", "Desalinated sea water"],
    correctIndex: 2,
    explanationFr: "L'eau de source des Ardennes est utilisée pour réduire le distillat à 44%. Une eau pure et minérale qui contribue au terroir unique d'Arduenna.",
    explanationEn: "Ardennes spring water is used to reduce the distillate to 44%. A pure, mineral water that contributes to Arduenna's unique terroir.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce que le « cœur de chauffe » dans la distillation ?",
    questionEn: "What is the 'heart of the run' in distillation?",
    optionsFr: ["La partie la plus alcoolisée", "La partie la plus pure et aromatique sélectionnée par le distillateur", "Le premier liquide à sortir de l'alambic", "La température maximale de distillation"],
    optionsEn: ["The most alcoholic part", "The purest and most aromatic part selected by the distiller", "The first liquid to come out of the still", "The maximum distillation temperature"],
    correctIndex: 1,
    explanationFr: "Le cœur de chauffe est la partie centrale de la distillation, sélectionnée avec précision. C'est la fraction la plus pure et la plus aromatique, celle qui donnera le gin final.",
    explanationEn: "The heart of the run is the central part of the distillation, precisely selected. It's the purest and most aromatic fraction, the one that will give the final gin.",
  },
];

// ── MODULE 1.4, B Corp & Bio ──────────────────────────────────────────────

const univers4 = [
  // Leçon 1, Swipe (3 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "Certifié B Corp",
        titleEn: "B Corp Certified",
        textFr: "Arduenna rejoint la communauté B Corp : un label mondial vérifié par B Lab, reconnaissant les entreprises alliant performance économique, impact social et respect de l'environnement. Évaluation sur 5 piliers : Gouvernance, Employés, Communauté, Environnement et Clients.",
        textEn: "Arduenna joins the B Corp community: a global label verified by B Lab, recognising companies that combine economic performance, social impact and environmental respect. Assessment across 5 pillars: Governance, Employees, Community, Environment and Customers.",
        img: "/Quizz/01/Card-1.webp",
      },
      {
        titleFr: "Label Bio EU",
        titleEn: "EU Organic Label",
        textFr: "Dès le début de l'aventure, Arduenna a obtenu la certification biologique : ingrédients exempts de produits chimiques de synthèse et d'OGM, protection de l'environnement, préservation de la biodiversité. Un étiquetage 100% transparent.",
        textEn: "From the very start, Arduenna obtained organic certification: ingredients free from synthetic chemicals and GMOs, environmental protection, biodiversity preservation. 100% transparent labelling.",
        img: "/Quizz/01/Card-2.webp",
      },
      {
        titleFr: "Bouteille éco-conçue",
        titleEn: "Eco-designed bottle",
        textFr: "Bouteille 1L développée en 2023 : 20% de verre en moins pour une même quantité. Les bouteilles usagées sont recyclées en sous-verres terrazzo. Cartons certifiés FSC, emballages en amidon végétal dégradables au contact de l'eau.",
        textEn: "1L bottle developed in 2023: 20% less glass for the same volume. Used bottles are recycled into terrazzo coasters. FSC certified cardboard, plant starch packaging degradable on contact with water.",
        img: "/Quizz/01/Card-3-Bouteille-éco.webp", imgContain: true,
      },
      {
        titleFr: "Initiatives durables",
        titleEn: "Sustainability initiatives",
        textFr: "Depuis 2022, Arduenna propose une solution de remplissage en magasins partenaires : moins de gaspillage de verre et un tarif réduit. Collaboration uniquement avec des partenaires européens partageant les mêmes valeurs responsables.",
        textEn: "Since 2022, Arduenna offers a bottle refilling solution in partner stores: less glass waste and a reduced price. Collaboration only with European partners sharing the same responsible values.",
      },
    ],
  },
  // Leçon 2, 4 QCM
  {
    type: "mcq",
    questionFr: "Combien de piliers la certification B Corp évalue-t-elle ?",
    questionEn: "How many pillars does B Corp certification assess?",
    optionsFr: ["3", "4", "5", "7"],
    optionsEn: ["3", "4", "5", "7"],
    correctIndex: 2,
    explanationFr: "B Corp évalue 5 piliers : Gouvernance, Employés, Communauté, Environnement et Clients. C'est une évaluation globale de l'impact d'une entreprise, bien au-delà des seules pratiques environnementales.",
    explanationEn: "B Corp assesses 5 pillars: Governance, Employees, Community, Environment and Customers. It's a global assessment of a company's impact, well beyond environmental practices alone.",
  },
  {
    type: "mcq",
    questionFr: "Les ingrédients d'Arduenna sont...",
    questionEn: "Arduenna's ingredients are...",
    optionsFr: ["Issus de l'agriculture conventionnelle", "Certifiés Bio EU", "Partiellement biologiques", "Importés d'Asie"],
    optionsEn: ["From conventional farming", "EU Organic certified", "Partially organic", "Imported from Asia"],
    correctIndex: 1,
    explanationFr: "Tous les ingrédients d'Arduenna sont certifiés Bio EU. Pas de demi-mesure : 100% bio de la matière première à la mise en bouteille.",
    explanationEn: "All Arduenna's ingredients are EU Organic certified. No half-measures: 100% organic from raw material to bottling.",
  },
  {
    type: "mcq",
    questionFr: "Que signifie B Corp en pratique pour Arduenna ?",
    questionEn: "What does B Corp mean in practice for Arduenna?",
    optionsFr: [
      "C'est un label marketing sans contrainte",
      "C'est une certification indépendante qui évalue l'impact social et environnemental global de l'entreprise",
      "C'est uniquement un label bio pour les spiritueux",
      "C'est une norme de qualité gustative",
    ],
    optionsEn: [
      "It's a marketing label with no constraints",
      "It's an independent certification assessing the company's overall social and environmental impact",
      "It's only an organic label for spirits",
      "It's a taste quality standard",
    ],
    correctIndex: 1,
    explanationFr: "B Corp est une certification indépendante et rigoureuse, pas du marketing. Elle évalue l'entreprise dans sa globalité et exige une performance élevée sur 5 dimensions.",
    explanationEn: "B Corp is an independent, rigorous certification, not marketing. It assesses the company as a whole and requires high performance across 5 dimensions.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce qui rend la bouteille 1L d'Arduenna plus durable ?",
    questionEn: "What makes the Arduenna 1L bottle more sustainable?",
    optionsFr: ["Elle est en plastique recyclé", "Elle réduit le poids de verre de 20% et les bouteilles usagées sont recyclées en terrazzo", "Elle est biodégradable", "Elle n'a pas d'emballage"],
    optionsEn: ["It's made from recycled plastic", "It reduces glass weight by 20% and used bottles are recycled into terrazzo", "It's biodegradable", "It has no packaging"],
    correctIndex: 1,
    explanationFr: "La bouteille 1L, développée en 2023, réduit le poids de verre de 20%. Les bouteilles usagées sont transformées en élégants sous-verres en terrazzo, leur donnant une seconde vie.",
    explanationEn: "The 1L bottle, developed in 2023, reduces glass weight by 20%. Used bottles are transformed into elegant terrazzo coasters, giving them a second life.",
  },
  // Leçon 3, 3 vrai/faux
  {
    type: "truefalse",
    statementFr: "La certification B Corp est attribuée à vie, sans réévaluation.",
    statementEn: "B Corp certification is awarded for life, without reassessment.",
    correct: false,
    explanationFr: "Faux ! La certification B Corp doit être renouvelée tous les 3 ans. L'entreprise doit maintenir et améliorer ses pratiques pour conserver la certification.",
    explanationEn: "False! B Corp certification must be renewed every 3 years. The company must maintain and improve its practices to keep the certification.",
  },
  {
    type: "truefalse",
    statementFr: "Arduenna est à la fois certifié Bio EU et B Corp.",
    statementEn: "Arduenna is both EU Organic certified and B Corp certified.",
    correct: true,
    explanationFr: "Vrai ! Arduenna cumule la certification Bio EU (ingrédients biologiques) et la certification B Corp (impact global de l'entreprise). Une double distinction rare dans le monde des spiritueux.",
    explanationEn: "True! Arduenna combines the EU Organic certification (organic ingredients) and B Corp certification (overall company impact). A rare double distinction in the spirits world.",
  },
  {
    type: "truefalse",
    statementFr: "B Corp et Bio EU sont la même certification.",
    statementEn: "B Corp and EU Organic are the same certification.",
    correct: false,
    explanationFr: "Faux ! Ce sont deux certifications distinctes. Bio EU garantit que les ingrédients sont biologiques. B Corp évalue l'impact global de l'entreprise (social, environnemental, gouvernance). Arduenna détient les deux.",
    explanationEn: "False! They are two distinct certifications. EU Organic guarantees that the ingredients are organic. B Corp assesses the company's overall impact (social, environmental, governance). Arduenna holds both.",
  },
];

// ── Parcours 2-4 placeholder (V1.5) ───────────────────────────────────────

const placeholder = [
  {
    type: "swipe",
    cards: [
      {
        titleFr: "Contenu bientôt disponible",
        titleEn: "Content coming soon",
        textFr: "Ce parcours sera disponible dans la prochaine version d'Arduenna Academy. Restez connecté !",
        textEn: "This course will be available in the next version of Arduenna Academy. Stay connected!",
      },
    ],
  },
];

export const lessonsData = {
  "univers-1": univers1,
  "univers-2": univers2,
  "univers-3": univers3,
  "univers-4": univers4,
  // Parcours 2 placeholders
  "gamme-1": placeholder, "gamme-2": placeholder, "gamme-3": placeholder, "gamme-4": placeholder,
  // Parcours 3 placeholders
  "cocktail-1": placeholder, "cocktail-2": placeholder, "cocktail-3": placeholder, "cocktail-4": placeholder,
  // Parcours 4 placeholders
  "vente-1": placeholder, "vente-2": placeholder, "vente-3": placeholder, "vente-4": placeholder,
};
