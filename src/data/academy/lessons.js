/**
 * Lesson content for Parcours 1 (MVP).
 * Parcours 2-4 exist in data but use placeholder until V1.5.
 * Formats for MVP: "swipe" | "mcq" | "truefalse"
 */

// ── MODULE 1.1 — La Forêt d'Arduenna ──
// Leçon 1 : swipe (4 cards) | Leçon 2 : 5 QCM | Leçon 3 : 4 vrai/faux

const univers1 = [
  // Leçon 1 — Swipe (4 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "La Forêt d'Arduenna",
        textFr: "Le nom Arduenna vient de la Silva Arduenna — l'ancienne forêt celtique des Ardennes. Un lieu de nature sauvage et préservée au cœur de la Belgique.",
      },
      {
        titleFr: "Une distillerie artisanale belge",
        textFr: "Arduenna est une distillerie artisanale née au cœur des Ardennes belges. Fondée par une famille passionnée, elle produit un gin bio d'exception depuis ses débuts.",
      },
      {
        titleFr: "Les fondateurs",
        textFr: "Deux amis partageant la même vision : créer un gin qui capture l'essence de la forêt ardennaise. Botaniques locales, processus artisanal, zéro compromis sur la qualité.",
      },
      {
        titleFr: "La philosophie",
        textFr: "Faire moins mais faire mieux. Trois botaniques locales récoltées à la main, une distillation lente, une eau de source des Ardennes. L'artisanat avant tout.",
      },
    ],
  },
  // Leçon 2 — 5 QCM
  {
    type: "mcq",
    questionFr: "Que signifie le nom « Arduenna » ?",
    optionsFr: ["Une rivière belge", "L'ancienne forêt celtique des Ardennes", "Un village de Wallonie", "Le fondateur de la distillerie"],
    correctIndex: 1,
    explanationFr: "Arduenna vient de Silva Arduenna, le nom latin de la grande forêt celtique qui couvrait les Ardennes. Ce nom évoque la nature sauvage et préservée de la région.",
  },
  {
    type: "mcq",
    questionFr: "Dans quel pays est produit le gin Arduenna ?",
    optionsFr: ["France", "Luxembourg", "Belgique", "Pays-Bas"],
    correctIndex: 2,
    explanationFr: "Arduenna est distillé en Belgique, dans la région des Ardennes. C'est un gin 100% belge, fier de ses origines ardennaises.",
  },
  {
    type: "mcq",
    questionFr: "Quel est le taux d'alcool du gin Arduenna classique ?",
    optionsFr: ["37,5%", "40%", "44%", "47%"],
    correctIndex: 2,
    explanationFr: "Le gin Arduenna titre à 44% vol. Ce taux permet une expression optimale des botaniques tout en restant équilibré en bouche.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce qui distingue Arduenna des gins industriels ?",
    optionsFr: ["Son prix bas", "Ses botaniques locales, sa production artisanale et sa double certification Bio EU + B Corp", "Sa distribution mondiale", "Son conditionnement en canette"],
    correctIndex: 1,
    explanationFr: "Arduenna se démarque par ses 3 botaniques ardennaises récoltées à la main, sa production artisanale et sa double certification Bio EU et B Corp — une combinaison unique sur le marché.",
  },
  {
    type: "mcq",
    questionFr: "Comment sont récoltées les botaniques d'Arduenna ?",
    optionsFr: ["Par machine industrielle", "Importées de l'étranger", "À la main dans les Ardennes", "Cultivées en serre"],
    correctIndex: 2,
    explanationFr: "Les 3 botaniques signatures d'Arduenna — mirabelle, bourgeons de sapin et fleurs de sureau — sont récoltées à la main dans les Ardennes belges, chacune à sa saison optimale.",
  },
  // Leçon 3 — 4 vrai/faux
  {
    type: "truefalse",
    statementFr: "Arduenna est certifié B Corp.",
    correct: true,
    explanationFr: "Vrai ! Arduenna est certifié B Corp, une certification qui évalue l'impact social et environnemental global de l'entreprise. Un engagement concret, pas seulement du marketing.",
  },
  {
    type: "truefalse",
    statementFr: "Le gin Arduenna est produit en France.",
    correct: false,
    explanationFr: "Faux ! Arduenna est une distillerie 100% belge, implantée dans les Ardennes belges. Belge de cœur et de terroir.",
  },
  {
    type: "truefalse",
    statementFr: "Le gin Arduenna contient des arômes artificiels.",
    correct: false,
    explanationFr: "Faux ! Arduenna n'utilise que des botaniques naturelles récoltées localement. Aucun arôme artificiel, aucun additif chimique. C'est l'essence même du gin artisanal bio.",
  },
  {
    type: "truefalse",
    statementFr: "Arduenna utilise de l'eau de source des Ardennes pour la réduction.",
    correct: true,
    explanationFr: "Vrai ! L'eau de source des Ardennes est utilisée pour réduire le gin à sa teneur finale en alcool. Chaque détail compte dans la production artisanale.",
  },
];

// ── MODULE 1.2 — Les 3 Botaniques ──
// Leçon 1 : swipe (3 cards) | Leçon 2 : 4 QCM | Leçon 3 : 3 vrai/faux

const univers2 = [
  // Leçon 1 — Swipe (3 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "🍑 Mirabelle",
        textFr: "Petite prune dorée des Ardennes. Apporte rondeur et douceur fruitée-acidulée au gin. Récoltée à la main en fin d'été quand les fruits sont à parfaite maturité.",
      },
      {
        titleFr: "🌲 Sapin",
        textFr: "Bourgeons de sapin cueillis au printemps dans les forêts ardennaises. Confèrent une fraîcheur résineuse unique et des notes boisées. La signature aromatique d'Arduenna.",
      },
      {
        titleFr: "🌸 Sureau",
        textFr: "Fleurs de sureau récoltées en juin à leur plein épanouissement. Ajoutent élégance florale et douceur délicate. La touche de finesse qui complète le profil aromatique.",
      },
    ],
  },
  // Leçon 2 — 4 QCM
  {
    type: "mcq",
    questionFr: "Quelle botanique apporte la fraîcheur résineuse au gin Arduenna ?",
    optionsFr: ["La mirabelle", "Le genièvre", "Les bourgeons de sapin", "Les fleurs de sureau"],
    correctIndex: 2,
    explanationFr: "Les bourgeons de sapin, cueillis au printemps dans les forêts ardennaises, sont la signature aromatique d'Arduenna avec leurs notes résineuses et boisées distinctives.",
  },
  {
    type: "mcq",
    questionFr: "Quelle botanique apporte la rondeur fruitée au gin Arduenna ?",
    optionsFr: ["Le sureau", "Le sapin", "La mirabelle", "Le genièvre"],
    correctIndex: 2,
    explanationFr: "La mirabelle, petite prune dorée des Ardennes, apporte cette rondeur fruitée sucrée-acidulée qui équilibre les notes résineuses du sapin.",
  },
  {
    type: "mcq",
    questionFr: "Quand sont récoltées les fleurs de sureau ?",
    optionsFr: ["En hiver", "Au printemps (mars-avril)", "En juin", "En automne"],
    correctIndex: 2,
    explanationFr: "Les fleurs de sureau sont récoltées en juin, à leur plein épanouissement, quand leur parfum floral est le plus intense et délicat.",
  },
  {
    type: "mcq",
    questionFr: "Combien de botaniques signatures sont présentes dans le gin Arduenna ?",
    optionsFr: ["2", "3", "5", "7"],
    correctIndex: 1,
    explanationFr: "Arduenna utilise 3 botaniques signatures ardennaises : la mirabelle, les bourgeons de sapin et les fleurs de sureau. La philosophie « moins c'est plus » pour un profil aromatique cohérent.",
  },
  // Leçon 3 — 3 vrai/faux
  {
    type: "truefalse",
    statementFr: "La mirabelle apporte des notes florales au gin Arduenna.",
    correct: false,
    explanationFr: "Faux ! La mirabelle apporte rondeur et douceur fruitée-acidulée, pas des notes florales. Les notes florales viennent du sureau.",
  },
  {
    type: "truefalse",
    statementFr: "Les 3 botaniques d'Arduenna sont toutes récoltées localement dans les Ardennes.",
    correct: true,
    explanationFr: "Vrai ! Mirabelle, bourgeons de sapin et fleurs de sureau sont toutes récoltées à la main dans les Ardennes belges. Circuit ultra-court, zéro import.",
  },
  {
    type: "truefalse",
    statementFr: "Le sureau est récolté en automne.",
    correct: false,
    explanationFr: "Faux ! Les fleurs de sureau sont récoltées en juin, au début de l'été. C'est à ce moment que leur fragrance florale est la plus intense.",
  },
];

// ── MODULE 1.3 — Le Processus ──
// Leçon 1 : swipe (5 cards) | Leçon 2 : 4 QCM

const univers3 = [
  // Leçon 1 — Swipe (5 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "1. Cueillette",
        textFr: "Les botaniques sont cueillies à la main dans les Ardennes, chacune à sa saison optimale. Mirabelle en fin d'été, sapin au printemps, sureau en juin.",
      },
      {
        titleFr: "2. Macération",
        textFr: "Les botaniques macèrent dans un alcool de grain bio pour en extraire tous les arômes. Cette étape détermine la profondeur et la complexité du gin.",
      },
      {
        titleFr: "3. Distillation",
        textFr: "Distillation lente en alambic cuivre traditionnel. Le maître distillateur sélectionne avec précision le « cœur de chauffe » — la partie la plus pure et aromatique.",
      },
      {
        titleFr: "4. Assemblage",
        textFr: "Les différents distillats sont assemblés puis réduits à l'eau de source des Ardennes jusqu'à atteindre la teneur en alcool finale de 44%.",
      },
      {
        titleFr: "5. Mise en bouteille",
        textFr: "Chaque bouteille est remplie, capsulée et contrôlée à la main. La bouteille éco-conçue (100% verre recyclable) est étiquetée avec soin avant expédition.",
      },
    ],
  },
  // Leçon 2 — 4 QCM
  {
    type: "mcq",
    questionFr: "Quel type d'alambic est utilisé pour distiller Arduenna ?",
    optionsFr: ["Alambic en acier inoxydable", "Alambic à colonne continu", "Alambic en cuivre traditionnel", "Alambic sous vide"],
    correctIndex: 2,
    explanationFr: "Arduenna est distillé dans un alambic en cuivre traditionnel (pot still). Le cuivre interagit avec l'alcool pour éliminer les impuretés et enrichir le profil aromatique.",
  },
  {
    type: "mcq",
    questionFr: "Quelle est la première étape de la production du gin Arduenna ?",
    optionsFr: ["La distillation", "La macération", "La cueillette des botaniques", "La mise en bouteille"],
    correctIndex: 2,
    explanationFr: "La cueillette est la première étape — et la plus importante. Botaniques de qualité = gin de qualité. Tout commence dans les forêts ardennaises.",
  },
  {
    type: "mcq",
    questionFr: "Avec quelle eau est réduit le gin Arduenna ?",
    optionsFr: ["Eau du robinet traitée", "Eau distillée", "Eau de source des Ardennes", "Eau de mer dessalinisée"],
    correctIndex: 2,
    explanationFr: "L'eau de source des Ardennes est utilisée pour réduire le distillat à 44%. Une eau pure et minérale qui contribue au terroir unique d'Arduenna.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce que le « cœur de chauffe » dans la distillation ?",
    optionsFr: ["La partie la plus alcoolisée", "La partie la plus pure et aromatique sélectionnée par le distillateur", "Le premier liquide à sortir de l'alambic", "La température maximale de distillation"],
    correctIndex: 1,
    explanationFr: "Le cœur de chauffe est la partie centrale de la distillation, sélectionnée avec précision. C'est la fraction la plus pure et la plus aromatique — celle qui donnera le gin final.",
  },
];

// ── MODULE 1.4 — B Corp & Bio ──
// Leçon 1 : swipe (3 cards) | Leçon 2 : 4 QCM | Leçon 3 : 3 vrai/faux

const univers4 = [
  // Leçon 1 — Swipe (3 cards)
  {
    type: "swipe",
    cards: [
      {
        titleFr: "Certifié B Corp",
        textFr: "La certification B Corp évalue l'impact global d'une entreprise sur 5 piliers : Gouvernance, Employés, Communauté, Environnement et Clients. Arduenna fait partie des entreprises les plus responsables.",
      },
      {
        titleFr: "Label Bio EU",
        textFr: "Tous les ingrédients d'Arduenna sont issus de l'agriculture biologique (certifié Bio EU). Zéro pesticide, zéro additif chimique. La nature respectée à chaque étape.",
      },
      {
        titleFr: "Bouteille éco-conçue",
        textFr: "La bouteille Arduenna est fabriquée en verre 100% recyclable. Chaque détail de l'emballage est pensé pour réduire l'impact environnemental sans compromis sur le premium.",
      },
    ],
  },
  // Leçon 2 — 4 QCM
  {
    type: "mcq",
    questionFr: "Combien de piliers la certification B Corp évalue-t-elle ?",
    optionsFr: ["3", "4", "5", "7"],
    correctIndex: 2,
    explanationFr: "B Corp évalue 5 piliers : Gouvernance, Employés, Communauté, Environnement et Clients. C'est une évaluation globale de l'impact d'une entreprise, bien au-delà des seules pratiques environnementales.",
  },
  {
    type: "mcq",
    questionFr: "Les ingrédients d'Arduenna sont...",
    optionsFr: ["Issus de l'agriculture conventionnelle", "Certifiés Bio EU", "Partiellement biologiques", "Importés d'Asie"],
    correctIndex: 1,
    explanationFr: "Tous les ingrédients d'Arduenna sont certifiés Bio EU. Pas de demi-mesure : 100% bio de la matière première à la mise en bouteille.",
  },
  {
    type: "mcq",
    questionFr: "Que signifie B Corp en pratique pour Arduenna ?",
    optionsFr: [
      "C'est un label marketing sans contrainte",
      "C'est une certification indépendante qui évalue l'impact social et environnemental global de l'entreprise",
      "C'est uniquement un label bio pour les spiritueux",
      "C'est une norme de qualité gustative",
    ],
    correctIndex: 1,
    explanationFr: "B Corp est une certification indépendante et rigoureuse — pas du marketing. Elle évalue l'entreprise dans sa globalité et exige une performance élevée sur 5 dimensions.",
  },
  {
    type: "mcq",
    questionFr: "Qu'est-ce qui rend la bouteille Arduenna éco-responsable ?",
    optionsFr: ["Elle est en plastique recyclé", "Elle est en verre 100% recyclable", "Elle est biodégradable", "Elle n'a pas d'emballage"],
    correctIndex: 1,
    explanationFr: "La bouteille Arduenna est en verre 100% recyclable. Un choix de matériau premium qui est aussi un choix responsable — le verre est recyclable à l'infini sans perte de qualité.",
  },
  // Leçon 3 — 3 vrai/faux
  {
    type: "truefalse",
    statementFr: "La certification B Corp est attribuée à vie, sans réévaluation.",
    correct: false,
    explanationFr: "Faux ! La certification B Corp doit être renouvelée tous les 3 ans. L'entreprise doit maintenir et améliorer ses pratiques pour conserver la certification.",
  },
  {
    type: "truefalse",
    statementFr: "Arduenna est à la fois certifié Bio EU et B Corp.",
    correct: true,
    explanationFr: "Vrai ! Arduenna cumule la certification Bio EU (ingrédients biologiques) et la certification B Corp (impact global de l'entreprise). Une double distinction rare dans le monde des spiritueux.",
  },
  {
    type: "truefalse",
    statementFr: "B Corp et Bio EU sont la même certification.",
    correct: false,
    explanationFr: "Faux ! Ce sont deux certifications distinctes. Bio EU garantit que les ingrédients sont biologiques. B Corp évalue l'impact global de l'entreprise (social, environnemental, gouvernance). Arduenna détient les deux.",
  },
];

// ── Parcours 2-4 placeholder (V1.5) ──
const placeholder = [
  {
    type: "swipe",
    cards: [
      { titleFr: "Contenu bientôt disponible", textFr: "Ce parcours sera disponible dans la prochaine version d'Arduenna Academy. Restez connecté !" },
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
