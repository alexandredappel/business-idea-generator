import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function generateBusinessIdeas(industry: string, country: string, budget: string, criteria?: string) {
  try {
    // Configuring the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // using the latest version 2.0
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Translate budget to text value
    let budgetText = "";
    switch(budget) {
      case "low":
        budgetText = "less than $10,000";
        break;
      case "medium":
        budgetText = "between $10,000 and $50,000";
        break;
      case "high":
        budgetText = "between $50,000 and $200,000";
        break;
      case "very_high":
        budgetText = "more than $200,000";
        break;
      default:
        budgetText = budget;
    }

    // Building the prompt
    const criteriaText = criteria ? `and meeting the following criteria: ${criteria}` : "";
    const prompt = `
      Perform an in-depth analysis of the ${industry} sector in ${country} to identify a specific and underserved pain point with an initial budget of ${budgetText} ${criteriaText}.

      STEP 1: Conduct thorough research of pain points by simulating an analysis of:
      - Relevant Reddit forums in the sector
      - Specialized Facebook groups
      - Industry-specific blogs
      - Customer reviews of existing products/services
      - Comments on marketplaces

      STEP 2: Identify the most promising and underexploited pain point, specifying:
      - Precise description of the problem
      - Why current solutions are inadequate
      - Who suffers most from this problem (detailed target profile)

      STEP 3: Generate ONE SINGLE niche business idea that directly addresses this pain point with this structure:

      # ${industry} Opportunity: [COMPANY NAME - SIMPLE CONCEPT]

      ## Pain Point Identified
      [Write a detailed 4-5 sentence paragraph that clearly explains the problem, why it's important, and who it affects. Be specific and include concrete examples of how this pain point manifests in daily life or business operations.]

      ## Target Audience
      [Write a detailed 4-5 sentence paragraph describing the target audience demographics, behaviors, frustrations, and needs. Include age ranges, occupations, income levels, and specific characteristics that make them particularly affected by this pain point.]

      ## Concept Summary
      [Write a detailed 4-5 sentence paragraph explaining the proposed solution in concrete terms. Describe how it works, what it offers, and how it specifically addresses the pain point identified above.]

      ## Unique Value Proposition
      * [Key value point 1 with brief explanation]
      * [Key value point 2 with brief explanation]
      * [Key value point 3 with brief explanation]
      * [Key value point 4 with brief explanation]

      ## Revenue Model & Distribution
      * [Revenue stream 1 with pricing details]
      * [Revenue stream 2 with pricing details if applicable]
      * [Main distribution channels with explanation]
      * [Customer acquisition strategy overview]

      Use data and observations specific to ${country} and ${industry}. Be precise, creative, and solution-oriented. Ensure all content is specific to the market conditions in ${country}.
      
      Make sure all sections are fully detailed with complete information, not just placeholders or brief mentions.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // For now, we don't have sources because we're not using the search tool
    // (it had type issues in the API)
    const sources: string[] = [];

    return {
      success: true,
      ideas: text,
      sources: sources
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

export async function generateDetailedPlan(businessIdea: string, industry: string, country: string, budget: string) {
  try {
    // PROBLÈME POTENTIEL: Cette fonction est peut-être appelée côté client,
    // où les clés API ne devraient pas être utilisées (risque de sécurité).
    // Dans une application de production, cette logique devrait être dans une route API
    // côté serveur, pas dans un service appelé directement depuis le navigateur.
    
    // Vérifier si nous sommes côté client
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      console.warn("Attention: Tentative d'appel à l'API Gemini côté client - cela devrait être fait côté serveur!");
    }
    
    // Configuring the Gemini API
    const apiKey = process.env.GOOGLE_API_KEY || "";
    console.log("API Key disponible:", apiKey ? "Oui (longueur: " + apiKey.length + ")" : "Non");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // using the latest version 2.0
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Translate budget to text value
    let budgetText = "";
    switch(budget) {
      case "low":
        budgetText = "moins de 10 000€";
        break;
      case "medium":
        budgetText = "entre 10 000€ et 50 000€";
        break;
      case "high":
        budgetText = "entre 50 000€ et 200 000€";
        break;
      case "very_high":
        budgetText = "plus de 200 000€";
        break;
      default:
        budgetText = budget;
    }

    // Building the detailed prompt with specific questions for each section
    const prompt = `
      En tant que consultant en stratégie d'entreprise de premier plan, créez un plan d'action complet et détaillé en français pour l'idée de business suivante:
      
      "${businessIdea}"
      
      Cette entreprise opérera dans le secteur ${industry} en ${country} avec un budget initial de ${budgetText}.
      
      FORMAT GÉNÉRAL:
      - Utilisez une structure claire avec des titres, sous-titres et séparateurs visuels
      - Incluez des éléments visuels formatés (tableaux, cartes pour les concurrents et personas)
      - Assurez-vous que chaque section est détaillée (minimum 400-500 mots)
      - Organisez le contenu en paragraphes clairs, points clés et sous-sections
      - Utilisez un langage professionnel mais accessible
      - Fournissez des informations concrètes et exploitables
      
      # PLAN D'ACTION COMPLET POUR [NOM DE L'ENTREPRISE]
      
      ## 1. RÉSUMÉ EXÉCUTIF
      - Présentation claire du problème ciblé avec statistiques spécifiques à ${country}
      - Solution en une phrase percutante
      - Description précise des clients cibles (segments démographiques/psychographiques)
      - Modèle de revenus détaillé avec projections chiffrées
      - Objectifs à court terme (3 mois), moyen terme (1 an) et long terme (3 ans)
      - Avantage concurrentiel unique avec preuves de concept
      - Potentiel de croissance avec 3-5 statistiques/chiffres clés du marché en ${country}
      
      ## 2. ANALYSE DE MARCHÉ ET POSITIONNEMENT
      - Analyse détaillée du problème (point de douleur) avec données quantitatives
      - 5 tendances majeures influençant ce marché avec statistiques récentes
      - Présentation des 3 concurrents principaux sous forme de CARTES:
      
      [CARTE CONCURRENT 1]
      Nom: [Nom précis]
      Part de marché: [%]
      Forces: [Liste de 3-5 forces]
      Faiblesses: [Liste de 3-5 faiblesses]
      Stratégie de prix: [Détails]
      Canaux de distribution: [Liste]
      Élément différenciateur: [Description]
      
      [CARTE CONCURRENT 2]
      [Même structure]
      
      [CARTE CONCURRENT 3]
      [Même structure]
      
      - Matrice de positionnement concurrentiel (format tableau)
      - Analyse des barrières à l'entrée avec stratégies de contournement
      - Estimation de la taille du marché adressable avec calculs détaillés
      
      ## 3. CONCEPT ET PROPOSITION DE VALEUR
      - Explication détaillée du fonctionnement pratique avec étapes claires
      - Liste exhaustive des bénéfices utilisateurs (primaires et secondaires)
      - Proposition de valeur unique en une phrase impactante
      - Analyse comparative avec les solutions actuelles (tableau comparatif)
      - Description des problèmes secondaires résolus avec leur impact
      - Exemples concrets d'utilisation par des clients types
      
      ## 4. PROFIL CLIENT
      - 3 personas détaillés présentés sous forme de CARTES:
      
      [CARTE PERSONA 1]
      Nom: [Nom fictif]
      Âge: [Tranche d'âge]
      Profession: [Métier]
      Revenus: [Niveau]
      Localisation: [Type de région en ${country}]
      Comportements en ligne: [Habitudes]
      Frustrations principales: [Liste de 3-5]
      Motivations d'achat: [Liste de 3-5]
      Canaux préférés: [Liste]
      Processus de décision: [Étapes]
      Budget: [Fourchette]
      
      [CARTE PERSONA 2]
      [Même structure]
      
      [CARTE PERSONA 3]
      [Même structure]
      
      - Analyse des comportements d'achat avec données spécifiques à ${country}
      - Cartographie du parcours client (de la prise de conscience à l'achat)
      - Critères de sélection priorisés avec pondération
      - Analyse des canaux d'information et d'achat avec données d'utilisation
      
      ## 5. MODÈLE ÉCONOMIQUE
      - Sources de revenus primaires et secondaires avec projections sur 3 ans
      - Structure de prix détaillée (abonnement, freemium, etc.) avec justifications
      - Tableau complet des coûts fixes et variables:
        - Coûts de démarrage (détaillés)
        - Coûts mensuels d'exploitation (détaillés)
        - Coûts d'acquisition client estimés
        - Coûts de rétention
      - Analyse du point mort avec calculs précis
      - Projections financières sur 3 ans (revenus, coûts, marges)
      - Stratégies d'optimisation des coûts et d'augmentation des revenus
      
      ## 6. STRATÉGIE MARKETING ET ACQUISITION
      - Stratégie de communication globale adaptée au marché de ${country}
      - 3 canaux marketing prioritaires avec:
        - Justification détaillée pour chaque canal
        - Tactiques spécifiques par canal
        - Budget requis et ROI attendu
        - Métriques de mesure d'efficacité
      - Plan de contenu détaillé (types, fréquence, canaux)
      - Stratégie de génération de leads qualifiés avec processus
      - Plan de fidélisation client
      - Partenariats stratégiques potentiels
      - Calendrier éditorial pour les 3 premiers mois
      
      ## 7. FEUILLE DE ROUTE OPÉRATIONNELLE
      - Plan d'action détaillé pour les 3 premiers mois (semaine par semaine)
      - Jalons critiques à 6 mois avec conditions de réussite
      - Objectifs précis à 12 mois avec métriques associées
      - KPIs spécifiques pour chaque période avec valeurs cibles
      - Plan de recrutement/sous-traitance
      - Stratégie d'évolution du produit/service
      - Plan de gestion des risques avec solutions de mitigation
      
      ## 8. BOÎTE À OUTILS
      - Outils technologiques essentiels par fonction (tableau détaillé):
      
      | Fonction | Outil recommandé | Coût | Fonctionnalités clés | Alternative budget |
      |----------|------------------|------|---------------------|---------------------|
      | [Fonction 1] | [Outil] | [Prix] | [Liste] | [Alternative] |
      
      - Plateformes SaaS recommandées avec comparaison
      - Ressources humaines nécessaires (équipe interne vs externe)
      - Check-list pré-lancement exhaustive
      - Calendrier de mise en œuvre des outils
      - Ressources d'apprentissage par domaine
      - Liste de fournisseurs potentiels en ${country}
      
      ---
      
      CONSIGNES DE RÉDACTION IMPORTANTES:
      1. Toutes les informations doivent être spécifiques à ${country} (pas de références à la France sauf si ${country} est la France)
      2. Les recommandations doivent être adaptées au budget indiqué de ${budgetText}
      3. Chaque élément doit être actionnable et réaliste
      4. Les données doivent être présentées de façon visuelle quand c'est pertinent
      5. Le rapport doit établir un équilibre entre exhaustivité et clarté
      6. Chaque section principale doit faire minimum 400-500 mots
      7. Pour les sections qui demandent des "CARTES", créez des encadrés visuels distincts pour chaque élément
      8. Utilisez des tableaux et des listes structurées pour présenter les informations complexes
      9. Assurez-vous que toutes les 8 sections sont complètes et détaillées
      10. Incluez des données chiffrées spécifiques et réalistes pour le secteur
      
      Ce document doit être d'une qualité exceptionnelle, comparable à ce que produirait un cabinet de conseil stratégique de premier plan facturant plusieurs milliers d'euros pour une telle prestation.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      detailedPlan: text
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
