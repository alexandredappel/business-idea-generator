This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Amélioration du plan détaillé

### Nouvelle architecture de génération du plan détaillé

Le plan détaillé a été amélioré pour générer des contenus de meilleure qualité et plus complets grâce à une nouvelle architecture:

1. **Extraction des informations clés:** Le système extrait maintenant les éléments importants de la première génération d'idée (problème identifié, concept, proposition de valeur, marché cible).

2. **Génération par section:** Au lieu d'un prompt unique pour tout le plan, chaque section est générée individuellement:
   - Résumé exécutif
   - Analyse de marché et positionnement
   - Concept et proposition de valeur
   - Profil client
   - Modèle économique
   - Stratégie marketing et acquisition
   - Feuille de route opérationnelle
   - Boîte à outils

3. **Prompts spécialisés:** Chaque section utilise un prompt adapté qui spécifie exactement ce qui doit être inclus, avec des instructions détaillées.

4. **Génération parallèle:** Les sections sont générées en parallèle pour optimiser les performances.

### Amélioration de l'extraction des sections

L'algorithme d'extraction des sections du plan a été amélioré pour mieux identifier chaque partie, en particulier les sections qui posaient problème (Profil client, Modèle économique, Boîte à outils).

### Avantages

- Plans plus complets et détaillés
- Meilleure structure de chaque section
- Réutilisation des données de la première génération d'idée
- Résolution du problème des sections manquantes
