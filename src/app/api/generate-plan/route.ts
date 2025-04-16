import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

// Fonction utilitaire pour traduire le budget
function translateBudget(budget: string): string {
  switch(budget) {
    case "low":
      return "less than 10,000";
    case "medium":
      return "between 10,000 and 50,000";
    case "high":
      return "between 50,000 and 200,000";
    case "very_high":
      return "more than 200,000";
    default:
      return budget;
  }
}

// Gestionnaire de la route POST /api/generate-plan
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const body = await request.json();
    const { businessIdea, industry, country, budget } = body;
    
    // Vérifier que tous les paramètres nécessaires sont présents
    if (!businessIdea || !industry || !country || !budget) {
      return NextResponse.json({ 
        success: false, 
        error: "Paramètres manquants. Veuillez fournir businessIdea, industry, country et budget." 
      }, { status: 400 });
    }
    
    // Convertir le budget en texte
    const budgetText = translateBudget(budget);
    
    // Log côté serveur détaillé (n'apparaît pas dans le navigateur)
    console.log("Génération de plan avec les paramètres:", {
      industry,
      country,
      budget: budgetText,
      ideaLength: businessIdea.length
    });
    
    // Configurer l'API Gemini
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("Clé API Gemini non définie!");
      return NextResponse.json({ 
        success: false, 
        error: "Configuration du serveur incomplète. Clé API manquante." 
      }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Obtenir le modèle Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    // Vérifier si le pays est mentionné explicitement dans l'idée
    const countryMentioned = businessIdea.toLowerCase().includes(country.toLowerCase());
    if (!countryMentioned) {
      console.warn(`ATTENTION: Le pays ${country} n'est pas explicitement mentionné dans l'idée! Nous le renforcerons dans le prompt.`);
    }
    
    // Construire le prompt détaillé avec un accent TRÈS fort sur le pays et l'industrie
    const prompt = `
      As a top-tier business strategy consultant, create a comprehensive and detailed action plan IN ENGLISH for the following business idea:
      
      "${businessIdea}"
      
      ⚠️⚠️⚠️ MANDATORY CONTEXT - ABSOLUTELY CRITICAL - MUST BE RESPECTED: ⚠️⚠️⚠️
      1. Country: ${country.toUpperCase()} - ALL CONTENT MUST BE 100% SPECIFIC TO ${country.toUpperCase()}
      2. Industry: ${industry.toUpperCase()}
      3. Initial budget: ${budgetText}
      
      ⚠️ CRITICAL INSTRUCTIONS - BUSINESS PLAN SPECIFICITY:
      1. THIS PLAN MUST BE WRITTEN ENTIRELY IN ENGLISH, regardless of the country chosen
      2. This plan must be 100% focused on ${country.toUpperCase()} ONLY
      3. ALL references to markets, competitors, regulations, trends, data MUST be specific to ${country.toUpperCase()}
      4. ALL examples must come from ${country.toUpperCase()}
      5. ALL currencies must be the local currency of ${country.toUpperCase()}
      
      ❌ ABSOLUTE PROHIBITIONS:
      - NEVER mention France unless ${country.toUpperCase()} is France
      - NEVER use French market data
      - NEVER cite French competitors
      - NEVER use euros unless it's the local currency in ${country.toUpperCase()}
      - NEVER mention French regulations
      
      ✅ ABSOLUTE REQUIREMENTS FOR EVERY SECTION:
      1. ALL content must be IN ENGLISH
      2. ALL data and statistics must be relevant to ${country.toUpperCase()} - each section must mention ${country.toUpperCase()} explicitly
      3. ONLY cite competitors relevant to the ${country.toUpperCase()} market
      4. ONLY mention regulations and laws applicable in ${country.toUpperCase()}
      5. ONLY use the local currency of ${country.toUpperCase()}
      6. ALL prices and costs must reflect the economy of ${country.toUpperCase()}
      7. INCLUDE cultural specificities of ${country.toUpperCase()}
      8. CITE success examples from ${country.toUpperCase()}
      9. ADAPT marketing strategies to ${country.toUpperCase()}'s consumer habits
      
      👉 IMPORTANT VERIFICATION:
      At the beginning of EACH main section, remind yourself that this plan is for ${country.toUpperCase()} by beginning the section with a brief ${country.toUpperCase()}-specific introduction.
      
      Ensure that the entire document integrates the following ${country.toUpperCase()}-specific elements:
      - Markets and trends specific to ${country.toUpperCase()}
      - Local consumer habits in ${country.toUpperCase()}
      - Regulations and legal framework applicable in ${country.toUpperCase()}
      - Competitors present in ${country.toUpperCase()}'s market
      - Necessary adaptations of the concept to ${country.toUpperCase()}'s local context
      - Marketing strategies appropriate for ${country.toUpperCase()}
      - Business ecosystem and potential partners in ${country.toUpperCase()}
      - Cost structure and prices adapted to ${country.toUpperCase()}'s local economy
      - Cultural considerations in ${country.toUpperCase()} that could affect the business
      
      Create an exceptionally detailed and structured action plan following the format below. Each main section must contain at least 400 words, be perfectly organized with paragraphs, bullet points, visual "cards", and clear subsections:
      
      # COMPREHENSIVE ACTION PLAN FOR [COMPANY NAME] IN ${country.toUpperCase()}
      
      ## 1. Executive Summary
      Provide a complete and engaging summary that clearly answers these questions:
      - What specific problem does this business idea solve in ${country.toUpperCase()}? (pain point)
      - What is the solution in one sentence?
      - Who are the main target customers in ${country.toUpperCase()}?
      - What is the main revenue model?
      - What are the short and medium-term objectives?
      - What are the 2-3 key competitive advantages of this business in ${country.toUpperCase()}?
      
      ## 2. Market Analysis and Positioning for ${country.toUpperCase()}
      ### Problem and Solution
      - Deeply analyze the concrete problem (pain point) that the business solves in ${country.toUpperCase()}
      - Explain how the solution perfectly addresses this problem for ${country.toUpperCase()} consumers
      
      ### Simplified Market Study
      - What is the size of the addressable market in ${country.toUpperCase()} (in local currency) and its growth rate?
      - Present the main trends that influence this market in ${country.toUpperCase()}
      - Provide relevant numerical data for this specific business in ${country.toUpperCase()}
      
      ### Competitive Analysis
      Create a detailed analysis for each competitor in the form of cards (one per competitor):
      - Identify 3-5 main competitors in ${country.toUpperCase()} and their market share
      - For each competitor, analyze:
        * Name and description
        * Main strengths (min. 3)
        * Main weaknesses (min. 3)
        * Pricing position
        * Value proposition
      - Create a positioning matrix showing where the offer compares to the competition in ${country.toUpperCase()}
      
      ## 3. Concept and Value Proposition
      ### Detailed Concept Description
      - Explain concretely how the product/service works in the context of ${country.toUpperCase()}
      - Detail the typical user journey for customers in ${country.toUpperCase()}
      - Present the essential technical/functional specifications adapted to ${country.toUpperCase()}
      
      ### Unique Value Proposition (UVP)
      - Formulate a unique value proposition in one sentence for the ${country.toUpperCase()} market
      - Explain why this proposition is relevant to the target market in ${country.toUpperCase()}
      
      ### Competitive Differentiation
      - Identify at least 5 specific competitive differentiation factors in the ${country.toUpperCase()} market
      - Explain how each factor creates a competitive advantage in ${country.toUpperCase()}
      - Present the key features/characteristics that distinguish this business in ${country.toUpperCase()}
      
      ## 4. Client Profile
      For each of the 2-3 target personas in ${country.toUpperCase()}, create a detailed card including:
      
      ### [Persona 1 Name] in ${country.toUpperCase()}
      - Demographic Information:
        * Age, sex, location in ${country.toUpperCase()}
        * Profession and income level in ${country.toUpperCase()}
        * Family situation
        * Education level
      - Behavior and psychographics:
        * Main needs, desires, and frustrations specific to ${country.toUpperCase()}
        * Consumption habits in ${country.toUpperCase()}
        * Personal and professional values in the context of ${country.toUpperCase()}
      - Purchase Journey:
        * Typical purchase behaviors in ${country.toUpperCase()}
        * Decision-making process
        * Main decision criteria
        * Preferred information and purchase channels in ${country.toUpperCase()}
      - Contact Points:
        * How to reach them effectively in ${country.toUpperCase()}
        * Messages resonating with them in the context of ${country.toUpperCase()}
        * Potential objections and how to respond
      
      ### [Persona 2 Name] in ${country.toUpperCase()}
      [Repeat the same detailed structure]
      
      ### [Persona 3 - if relevant] in ${country.toUpperCase()}
      [Repeat the same detailed structure]
      
      ## 5. Economic Model
      ### Revenue Model
      - Detail the main and secondary revenue sources adapted to ${country.toUpperCase()}
      - Explain the pricing structure (subscription, freemium, etc.) in the context of ${country.toUpperCase()}
      - Present a detailed pricing strategy with justifications based on ${country.toUpperCase()}'s market
      
      ### Cost Structure
      - Deeply analyze the main cost categories (fixed and variable) in ${country.toUpperCase()}
      - Identify cost optimization levers specific to ${country.toUpperCase()}
      
      ### Simplified Budget Projections
      - Detailed startup costs (itemized) in ${country.toUpperCase()}
      - Monthly operational costs in ${country.toUpperCase()}
      - 12-month revenue projections (baseline/medium/optimistic scenarios) in ${country.toUpperCase()}
      - Break-even analysis adapted to ${country.toUpperCase()}'s economy
      - Key financial indicators to monitor
      
      ## 6. Marketing Strategy and Acquisition
      ### Global Strategy
      - Define the global marketing positioning for ${country.toUpperCase()}
      - Present the marketing communication and branding strategy adapted to ${country.toUpperCase()}
      - Explain the general approach to acquisition, conversion, and loyalty in ${country.toUpperCase()}
      
      ### Priority Acquisition Channels
      For each of the 3-5 priority marketing channels in ${country.toUpperCase()}, create a detailed card:
      
      #### [Channel 1] in ${country.toUpperCase()}
      - Strategic justification for this channel in ${country.toUpperCase()}
      - Specific tactics to deploy in ${country.toUpperCase()}
      - Recommended budget in ${country.toUpperCase()}'s local currency
      - KPIs to measure effectiveness
      - Implementation calendar
      
      #### [Channel 2] in ${country.toUpperCase()}
      [Repeat the same detailed structure]
      
      #### [Channel 3] in ${country.toUpperCase()}
      [Repeat the same detailed structure]
      
      ### Content Strategy
      - Detailed editorial plan adapted to ${country.toUpperCase()}'s audience
      - Recommended content types that resonate with ${country.toUpperCase()}'s market
      - Publication calendar
      
      ### Conversion and Loyalty Strategy
      - Techniques for generating qualified leads in ${country.toUpperCase()}
      - Detailed conversion process adapted to consumers in ${country.toUpperCase()}
      - Loyalty program designed for ${country.toUpperCase()}
      - Partnership and co-marketing strategies with ${country.toUpperCase()} businesses
      
      ## 7. Operational Roadmap
      ### 0-3 months: Foundations in ${country.toUpperCase()}
      - Detailed prioritized actions in ${country.toUpperCase()}
      - Critical milestones to achieve
      - Required resources in ${country.toUpperCase()}
      - Specific KPIs to follow
      - Expected deliverables
      
      ### 4-6 months: Initial Validation and Growth in ${country.toUpperCase()}
      - Detailed key steps
      - Additional resources required in ${country.toUpperCase()}
      - KPIs evolution
      - Potential strategic adjustments based on ${country.toUpperCase()}'s market feedback
      - Dependencies between different actions
      
      ### 7-12 months: Optimization and Expansion in ${country.toUpperCase()}
      - Detailed objectives
      - Scaling plan after validation in ${country.toUpperCase()}
      - Team and resource evolution
      - Advanced KPIs
      - Expansion strategies within ${country.toUpperCase()}
      
      ### Key Performance Indicators
      - Business critical KPIs in the context of ${country.toUpperCase()}
      - Marketing and sales KPIs relevant to ${country.toUpperCase()}
      - Product/service KPIs
      - Recommended measurement methods and tools available in ${country.toUpperCase()}
      
      ## 8. Toolbox
      ### Launch Checklist
      - Complete and detailed list of pre-launch tasks in ${country.toUpperCase()}
      - Critical validation points
      - Recommended timeline adapted to ${country.toUpperCase()}'s business environment
      
      ### Recommended Tools and Technologies
      By functional category, recommend specific tools available in ${country.toUpperCase()}:
      - Marketing and communication tools accessible in ${country.toUpperCase()}
      - Sales and CRM systems used in ${country.toUpperCase()}
      - Project management tools
      - Product development resources
      - Customer service solutions available in ${country.toUpperCase()}
      - Finance and accounting tools compliant with ${country.toUpperCase()}'s regulations
      - Technical infrastructure options in ${country.toUpperCase()}
      - Analysis and reporting tools
      
      For each tool, specify:
      - Main name and features
      - Estimated pricing in ${country.toUpperCase()}'s local currency
      - Specific advantages for this business in ${country.toUpperCase()}
      - Potential alternatives available in ${country.toUpperCase()}
      
      ---
      
      IMPORTANT WRITING GUIDELINES:
      1. Produce a premium document that fully justifies its price of $19
      2. Use a professional but accessible tone
      3. Include specific and realistic numerical data for the sector in ${country.toUpperCase()}
      4. Visually structure the content with:
         - Hierarchical titles and subtitles
         - Well-defined paragraphs
         - Bullet points for key points
         - Visual "cards" for personas, competitors, and marketing channels (use Markdown elements to simulate cards)
      5. Each main section must be at least 400 words
      6. The document must be immediately actionable by an entrepreneur in ${country.toUpperCase()}
      7. Include concrete and specific recommendations for the ${country.toUpperCase()} market
      8. Suggest relevant external resources specific to ${country.toUpperCase()}
      9. Ensure the content is perfectly adapted to the idea, sector, and specifically to ${country.toUpperCase()}
      10. Use numerous subtitles for easy reading
      11. For sections requiring "cards", create distinct visual frames for each element
      12. Feel free to use descriptive visual elements such as tables or structured lists
      
      This document must be of exceptional quality, comparable to what a leading strategic consulting firm would produce charging several thousand dollars for such a service.
    `;
    
    // Générer le contenu
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Vérification de qualité pour les pays autres que la France
    if (country.toLowerCase() !== 'france') {
      // Vérifier si le texte contient des références non voulues à la France
      const frenchReferences = [
        "France", "French", "Paris", "Lyon", "Marseille", "Bordeaux", 
        "Toulouse", "Nantes", "Strasbourg", "Nice", "Montpellier",
        "euros", "€", "EUR"
      ];
      
      // Vérifier la présence du pays demandé
      const countryMentionCount = (text.match(new RegExp(country, 'gi')) || []).length;
      console.log(`Le pays ${country} est mentionné ${countryMentionCount} fois dans le plan généré.`);
      
      if (countryMentionCount < 10) {
        console.warn(`ALERTE: Le pays ${country} n'est mentionné que ${countryMentionCount} fois, ce qui est insuffisant!`);
      }
      
      // Calculer un score de mauvaise qualité
      let badQualityScore = 0;
      let matchedReferences: string[] = [];
      
      frenchReferences.forEach(ref => {
        // Recherche avec une regex qui respecte les limites de mots
        const regex = new RegExp(`\\b${ref}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
          badQualityScore += matches.length;
          matchedReferences.push(`${ref} (${matches.length})`);
        }
      });
      
      console.log(`Score de références françaises: ${badQualityScore}, Références trouvées: ${matchedReferences.join(', ')}`);
      
      // Si le score est trop élevé, générer un autre plan
      if (badQualityScore > 3) {
        console.log("Trop de références à la France détectées alors que le pays sélectionné est:", country);
        
        // Ajouter un message d'erreur au début du plan
        const errorMessage = `
# QUALITY ISSUE DETECTED

The AI generated a business plan that incorrectly focuses on France instead of ${country}.

**Detected French references:** ${matchedReferences.join(', ')}

This is a known issue that we're working to fix. Please try generating a new plan or contact support.

---

`;
        
        return NextResponse.json({
          success: true,
          detailedPlan: errorMessage + text
        });
      }
    }
    
    // Retourner le résultat
    return NextResponse.json({
      success: true,
      detailedPlan: text
    });
    
  } catch (error: any) {
    console.error("Erreur API Gemini:", error);
    
    // Retourner une réponse d'erreur
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Une erreur inconnue s'est produite"
    }, { status: 500 });
  }
} 