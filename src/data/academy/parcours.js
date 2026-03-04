/**
 * 4 parcours de formation Arduenna Academy.
 * targetRoles: array de rôles qui voient ce parcours. "all" = visible par tous.
 */
export const parcoursData = [
  {
    id: "univers",
    titleFr: "L'Univers Arduenna",
    titleEn: "The Arduenna Universe",
    descFr: "Histoire, terroir, botaniques et engagement durable",
    descEn: "History, terroir, botanicals and sustainable commitment",
    targetRoles: "all",
    modules: ["univers-1", "univers-2", "univers-3", "univers-4"],
    certificateFr: "Ambassadeur Arduenna",
    certificateEn: "Arduenna Ambassador",
    color: "#3a7a6b",
  },
  {
    id: "gamme",
    titleFr: "La Gamme",
    titleEn: "The Range",
    descFr: "Gin, No Alcohol, 694 Aperitivo : profils et positionnement",
    descEn: "Gin, No Alcohol, 694 Aperitivo: profiles and positioning",
    targetRoles: ["commercial", "caviste"],
    modules: ["gamme-1", "gamme-2", "gamme-3", "gamme-4"],
    certificateFr: "Expert Gamme Arduenna",
    certificateEn: "Arduenna Range Expert",
    color: "#c2744a",
  },
  {
    id: "cocktail",
    titleFr: "Le Cocktail Lab",
    titleEn: "The Cocktail Lab",
    descFr: "Recettes signatures, techniques et accords saisonniers",
    descEn: "Signature recipes, techniques and seasonal pairings",
    targetRoles: ["bartender"],
    modules: ["cocktail-1", "cocktail-2", "cocktail-3", "cocktail-4"],
    certificateFr: "Mixologue Arduenna",
    certificateEn: "Arduenna Mixologist",
    color: "#0b363d",
  },
  {
    id: "vente",
    titleFr: "Vendre Arduenna",
    titleEn: "Selling Arduenna",
    descFr: "Argumentaire, objections, concurrence et réglementation",
    descEn: "Sales pitch, objections, competition and regulations",
    targetRoles: ["commercial"],
    modules: ["vente-1", "vente-2", "vente-3", "vente-4"],
    certificateFr: "Commercial Certifié Arduenna",
    certificateEn: "Arduenna Certified Sales",
    color: "#8B6914",
  },
];
