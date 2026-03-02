# CLAUDE.md — Mission Arduenna Webapp

## Projet
Webapp PWA pour **Arduenna**, marque belge de gin bio premium des Ardennes.
Site e-commerce existant : https://arduenna-gin.com/

---

## 🔍 Benchmark concurrentiel — Contexte stratégique

### Positionnement unique
La webapp Arduenna occupe un **espace vide** dans le marché. Aucune marque craft/premium de taille comparable n'a de webapp dédiée. C'est un différenciateur majeur.

### Concurrents analysés et enseignements

**Hendrick's Gin** (référence storytelling digital)
- ✅ Age gate élégante pays + date de naissance
- ✅ Section cocktails filtrable par occasion, difficulté, saveur
- ✅ Univers visuel "excentrique victorien" ultra-cohérent — chaque page raconte une histoire
- ✅ Éditions limitées ("Cabinet of Curiosities") comme driver de contenu récurrent
- ❌ Site classique, pas de webapp. Pas d'outil interactif, pas de sauvegarde
- **À retenir** : cohérence narrative totale. Chaque élément respire la marque

**Seedlip** (maître du "Less is More" premium)
- ✅ Design minimaliste ultra-premium : fonds blancs, typo élégante, beaucoup d'espace
- ✅ Produits avec illustrations botaniques sur piédestal — très aspirationnel
- ✅ Recettes liées directement aux produits (quel Seedlip utiliser)
- ✅ E-books cocktails gratuits téléchargeables (capture emails)
- ✅ "Where to buy" / Store locator intégré
- ✅ Badges awards mis en avant (IWSC, Drinks International)
- ❌ Aucune fonctionnalité interactive, pas de filtres, pas d'espace pro
- **À retenir** : e-book téléchargeable, awards bien visibles, lien recette → produit

**Monkey 47** (storytelling + exclusivité)
- ✅ Storytelling fondateur raconté comme un roman d'aventure
- ✅ Distiller's Cut annuel comme événement digital récurrent
- ✅ Visites de distillerie réservables en ligne
- ✅ Merchandising intégré (Cooler en grès)
- ❌ Site vitrine statique, aucun outil bartender, pas de recettes interactives
- **À retenir** : narration "founding story" comme expérience scrollable

**Roku / Suntory** (angle saisons comme fil conducteur)
- ✅ Concept "Shun" (savourer les saisons à leur apogée) comme philosophie
- ✅ 6 botaniques = 4 saisons, structure narrative claire
- ✅ Éditions saisonnières (Sakura Bloom, Minori, Kasane) + cocktails dédiés
- ✅ Partage social des recettes intégré
- ✅ Collaborations artistiques (washi paper, compositions musicales)
- ❌ Pas de webapp, pas de filtrage cocktails
- **À retenir** : saisonnalité des cocktails (parfait pour les botaniques Ardennaises) + partage social

**Diageo Bar Academy** (plateforme B2B ultime)
- ✅ E-learning, masterclasses, certifications, quiz
- ✅ Outils calculateurs : ABV Calculator, Profitability Calculator, Stock Wastage Calculator
- ✅ Virtual Bar 3D interactif
- ✅ Contenu par niveau de carrière
- ✅ Programme World Class (compétition bartenders)
- ✅ "Retro Cocktail Match Maker" interactif
- ❌ Mastodonte multi-marques, pas reproductible à l'échelle Arduenna
- **À retenir** : les micro-outils (calculateur coût cocktail) sont faisables et ultra utiles

**Apps communautaires** (Ginventory, GINferno, Cocktail Flow, Barsys, NoFlair)
- ✅ "My Bar/Cabinet" : inventaire bouteilles → suggestions faisables
- ✅ Scan barcode pour ajouter une bouteille
- ✅ Filtres avancés : ingrédient, occasion, difficulté, saveur, saison
- ✅ AI bartender (Weber Ranch "Tex") : suggestions IA depuis photo frigo
- ✅ Community recipes : users soumettent des créations
- ✅ Tasting notes + wishlist
- ❌ Multi-marques, pas mono-marque comme Arduenna
- **À retenir** : favoris + partage essentiels, "Cocktail du mois" communautaire faisable

### Matrice de positionnement

| Feature | Hendrick's | Seedlip | Monkey 47 | Roku | Diageo BA | **Arduenna** |
|---|---|---|---|---|---|---|
| Age gate élégante | ✅ | ✅ | ✅ | ✅ | ✅ | **✅** |
| Cocktails filtrables | ✅ basique | ❌ | ❌ | ❌ | ✅ | **✅✅** |
| Profil aromatique visuel | ❌ | ❌ | ❌ | texte | ❌ | **✅ radar** |
| Sauvegarde favoris | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| Partage social recettes | ❌ | ❌ | ❌ | ✅ | ❌ | **✅** |
| Cocktails saisonniers | ❌ | ❌ | ❌ | ✅✅ | ❌ | **✅** |
| PDF recette téléchargeable | ❌ | ebook | ❌ | ❌ | ✅ | **✅** |
| Awards bien visibles | ❌ | ✅ | ❌ | ❌ | ❌ | **✅** |
| Espace pro/toolbox | ❌ | ❌ | ❌ | ❌ | ✅✅ | **✅** |
| Multilingue | par pays | ✅ | ✅ | ✅ | ✅ | **✅ FR/EN** |
| Durabilité/B Corp | ❌ | ❌ | ❌ | ❌ | ❌ | **✅✅ unique** |
| Webapp dédiée | ❌ | ❌ | ❌ | ❌ | ✅ | **✅ unique craft** |

### Avantages concurrentiels Arduenna
1. **Seule marque craft premium avec une webapp dédiée** — différenciateur immédiat
2. **B Corp + Bio** — aucun concurrent ne met en avant la durabilité à ce niveau
3. **Cocktails interactifs avec filtres + favoris + partage** — au-delà de tout concurrent mono-marque
4. **Espace pro intégré** — seul Diageo (multi-marques) offre ça, Arduenna le fait en mono-marque
5. **Radar charts aromatiques** — visualisation unique absente chez tous les concurrents

---

## Stack
- **React 18** + **Vite 6** (pas de Next.js, pas de TypeScript pour le MVP)
- Single-page app déployée sur **Vercel** via GitHub
- PWA avec manifest.json
- Pas de backend — tout est statique/client-side

## Palette de couleurs — STRICTE
| Token       | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| `cream`     | `#fef8ec` | Fond principal                 |
| `white`     | `#ffffff` | Cartes, modales                |
| `teal`      | `#0b363d` | Texte, boutons, accents        |
| `copper`    | `#c2744a` | Accent secondaire (awards, CTA)|

**INTERDIT** : vert forêt, violet, bleu vif, gris foncé, fonds noirs/sombres.
L'esthétique est lumineuse, élégante, premium — comme le site arduenna-gin.com.

## Typographie
- **Titres** : Cormorant Garamond (serif, italique pour les h2/h3)
- **Corps** : DM Sans (sans-serif, 13-15px)
- **Navigation** : DM Sans, uppercase, letterspacing 2-3px, 11px

## Assets dans /public
- `logo.webp` — Logo Arduenna (vertical)
- `mirabelle.svg` — Illustration botanique mirabelle
- `sapin.svg` — Illustration botanique sapin
- `sureau.png` — Illustration botanique sureau (fleur)
- `logo-192.png` / `logo-512.png` — Icônes PWA (à créer à partir du logo)

## Architecture de l'app
Un seul composant principal `src/App.jsx` avec ces sections :

1. **Age Gate** — Vérification âge légal (obligatoire légalement)
2. **Navigation** — Fixe, teal sur crème, toggle langue FR/EN
3. **Hero** — "Original taste / — *of nature* —" style site officiel
4. **Histoire** — Texte + 3 cartes botaniques (Mirabelle, Sapin, Sureau)
5. **Récompenses** — Grille d'awards internationaux, style badges/médailles premium (inspiré Seedlip). Visuellement impactant avec nom de compétition, année, médaille.
6. **Produits** — 3 cartes (Gin 44%, No Alcohol 0%, 694 Aperitivo 15%) + modales détail avec radar charts
7. **Cocktail Lab** — 10 recettes, filtres par produit/saison/difficulté, favoris, partage, PDF, modales
8. **Espace Pro** — 4 catégories de téléchargements pour partenaires B2B
9. **Durabilité** — 5 engagements (B Corp, Bio, etc.) — **différenciateur unique vs concurrence**
10. **Phase 2 Teasers** — 4 features verrouillées (Academy, Bar Finder, Ma Cave, Events) avec "Me notifier"
11. **Footer** — Liens, mentions légales, avertissement alcool

## Données produits
- **Arduenna Gin** : 50cl, 44%, 40.95€, Bio EU + B Corp
- **Arduenna No Alcohol** : 50cl, 0%, 30.95€, Bio EU + B Corp
- **694 Aperitivo** : 50cl, 15%, 29.95€, Bio EU + B Corp

## Fonctionnalités clés

### Core features
- **Bilingue FR/EN** — Toggle dans la nav, toutes les strings traduites
- **Filtres cocktails** — Par produit (Gin/No Alcohol/Aperitivo) + par saison + par difficulté
- **Favoris cocktails** — Sauvegarde en state (pas de localStorage dans artifact, ok en prod)
- **Modales produits** — Radar chart profil aromatique + accords + certifications
- **Modales cocktails** — Ingrédients + étapes + garniture
- **Responsive** — Mobile-first, grilles adaptatives
- **Smooth scroll** — Navigation fluide entre sections

### Features MVP issues du benchmark

**1. Partage social recettes (Web Share API)** — inspiré Roku/Suntory
Sur chaque cocktail, un bouton "Partager" qui utilise le Web Share API natif (mobile) ou copie le lien (desktop). Format : nom du cocktail + ingrédients clés + lien vers la webapp.
```javascript
const shareRecipe = async (cocktail) => {
  const shareData = {
    title: `${cocktail.name} — Arduenna`,
    text: `Découvrez la recette ${cocktail.name} avec ${cocktail.product} 🍸`,
    url: window.location.href
  };
  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    // Afficher toast "Lien copié !"
  }
};
```

**2. Tags saisons + filtre cocktails saisonniers** — inspiré Roku "Shun"
Chaque recette cocktail reçoit un tag saison (Printemps 🌸, Été ☀️, Automne 🍂, Hiver ❄️, Toutes saisons). Le filtre cocktails inclut un sélecteur de saison. S'aligne avec l'ADN "botaniques des Ardennes" et le cycle naturel de la forêt.

**3. PDF recette téléchargeable par cocktail** — inspiré Diageo BA + Seedlip
Sur chaque modale cocktail, bouton "Télécharger la fiche". Génère un PDF/image propre avec : nom, ingrédients + dosages, étapes, produit Arduenna utilisé, logo. Utilisable par les bartenders pour affichage en cuisine. Approche simple : canvas → image PNG téléchargeable (pas besoin de lib externe lourde).

**4. Section Awards plus visible** — inspiré Seedlip
Section Récompenses refondée pour être visuellement impactante. Badges/médailles premium avec : nom de la compétition, année, type (Or/Argent/Bronze). Style inspiré de Seedlip qui aligne ses awards comme des trophées. Les awards sont un argument de vente critique dans le premium.

## Principes de design
- Pas de bordures épaisses, pas d'ombres lourdes
- Cartes blanches avec `border: 1px solid rgba(11,54,61,0.06)` et `box-shadow: 0 2px 12px rgba(11,54,61,0.03)`
- Boutons primaires : fond teal `#0b363d`, texte crème
- Boutons secondaires : transparent avec bordure teal fine
- Séparateurs : `linear-gradient(90deg, transparent, rgba(11,54,61,0.12), transparent)`
- Beaucoup d'espace blanc (padding généreux)
- Animations subtiles (fadeIn, hover translateY -2px)
- **Cohérence narrative** : chaque section doit "respirer" la marque (leçon Hendrick's)
- **Less is more** : préférer la respiration au remplissage (leçon Seedlip)

## Storytelling & contenu — Leçons du benchmark
- **Hendrick's** : chaque page raconte une histoire, pas juste une fiche technique
- **Monkey 47** : la "founding story" est une aventure captivante, pas un texte corporate
- **Roku** : les botaniques sont les personnages principaux, liées aux saisons
- **Seedlip** : l'absence de quelque chose (alcool) est présentée comme une force, pas un manque
- **Pour Arduenna** : la forêt des Ardennes, la plus ancienne distillerie de Belgique, les 3 botaniques emblématiques (mirabelle, sapin, sureau) sont le fil narratif. Chaque section doit évoquer cette connection terre-produit.

## Phase 2 (pas encore — juste des teasers)
- **Arduenna Academy** (formation bartenders) — inspiré Diageo BA en version micro
- **Bar Finder** (carte interactive) — inspiré Seedlip "Where to buy"
- **Ma Cave** (collection personnelle) — inspiré Ginventory/NoFlair "My Cabinet"
- **Événements** (masterclasses) — inspiré Hendrick's "Expedition Cocktail"

## Commandes
```bash
npm install      # Installer les dépendances
npm run dev      # Serveur de dev sur localhost:3000
npm run build    # Build production dans /dist
npm run preview  # Preview du build
```

## Déploiement
Push sur GitHub → Vercel auto-deploy depuis la branche `main`.
Framework preset : Vite. Aucune config spéciale nécessaire.
