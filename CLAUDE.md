# CLAUDE.md — Arduenna Webapp

## Projet
Webapp PWA pour **Arduenna**, marque belge de gin bio premium des Ardennes.
Site existant : https://arduenna-gin.com/

## Stack
React 18 + Vite 6 (pas Next.js, pas TypeScript) → Vercel via GitHub. PWA, pas de backend.

## Palette — STRICTE
| Token | Hex | Usage |
|-------|-----|-------|
| cream | #fef8ec | Fond principal |
| white | #ffffff | Cartes, modales |
| teal | #0b363d | Texte, boutons, accents |
| copper | #c2744a | Accent secondaire |

**INTERDIT** : vert forêt, violet, bleu vif, gris foncé, fonds noirs.

## Typo
- Titres : Cormorant Garamond (serif)
- Corps : DM Sans (13-15px)
- Nav : DM Sans uppercase, letterspacing 2-3px, 11px

## Sections de l'app (App.jsx)
1. Age Gate → 2. Nav → 3. Hero → 4. Histoire + botaniques → 5. Awards → 6. Produits (3) + modales radar → 7. Cocktail Lab (10 recettes, filtres, favoris, partage, PDF) → 8. Espace Pro → 9. Durabilité → 10. Phase 2 teasers → 11. Footer

## Produits
- Arduenna Gin : 50cl, 44%, 40.95€
- Arduenna No Alcohol : 50cl, 0%, 30.95€
- 694 Aperitivo : 50cl, 15%, 29.95€

## Features MVP
- Bilingue FR/EN (toggle nav)
- Filtres cocktails : produit + saison + difficulté
- Favoris cocktails (state)
- Partage recettes (Web Share API)
- PDF recette téléchargeable (canvas → PNG)
- Awards visuels style médailles
- Radar charts aromatiques sur produits
- Responsive mobile-first

## Design
- Cartes blanches, border 1px rgba(11,54,61,0.06), shadow 0 2px 12px rgba(11,54,61,0.03)
- Boutons primaires : fond teal, texte crème
- Beaucoup d'espace blanc, animations subtiles
- Pas de bordures épaisses ni ombres lourdes

## Commandes
```bash
npm install      # Dépendances
npm run dev      # Dev localhost:3000
npm run build    # Build /dist
npm run preview  # Preview build
```

## Docs stratégiques
Voir `docs/BENCHMARK.md` pour l'analyse concurrentielle complète et les guidelines UX/UI.
