import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

// Fonction pour traduire le budget en texte descriptif
function translateBudget(budget: string): string {
  switch(budget) {
    case "low":
      return "less than $10,000";
    case "medium":
      return "between $10,000 and $50,000";
    case "high":
      return "between $50,000 and $200,000";
    case "very_high":
      return "more than $200,000";
    default:
      return budget;
  }
}

// Gestionnaire de la route POST /api/generate-complete-plan
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
    console.log("Génération de plan complet avec les paramètres:", {
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
      generationConfig: {
        maxOutputTokens: 32768,  // Augmentation significative par rapport à 8192
        temperature: 0.7,       // Un peu de créativité mais pas trop aléatoire
        topP: 0.95,             // Haute qualité de texte
        topK: 40                // Diversité raisonnable
      }
    });
    
    // Vérifier si le pays est mentionné explicitement dans l'idée
    const ideaIncludesCountry = businessIdea.toLowerCase().includes(country.toLowerCase());
    if (!ideaIncludesCountry) {
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
      2. EACH MAIN SECTION MUST BE AT LEAST 1000 WORDS LONG
      3. ALL data and statistics must be relevant to ${country.toUpperCase()} - each section must mention ${country.toUpperCase()} explicitly
      4. ONLY cite competitors relevant to the ${country.toUpperCase()} market
      5. ONLY mention regulations and laws applicable in ${country.toUpperCase()}
      6. ONLY use the local currency of ${country.toUpperCase()}
      7. ALL prices and costs must reflect the economy of ${country.toUpperCase()}
      8. INCLUDE cultural specificities of ${country.toUpperCase()}
      9. CITE success examples from ${country.toUpperCase()}
      10. ADAPT marketing strategies to ${country.toUpperCase()}'s consumer habits
      
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
      
      Create an exceptionally detailed and structured action plan following the format below. Each main section must contain at least 1000 words, be perfectly organized with paragraphs, bullet points, visual "cards", and clear subsections:
      
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
      
      ---
      #### COMPETITOR 1: [NAME]
      **Description:** [Brief description]
      **Market Share:** [Percentage if available]
      **Strengths:**
      - [Strength 1]
      - [Strength 2]
      - [Strength 3]
      **Weaknesses:**
      - [Weakness 1]
      - [Weakness 2]
      - [Weakness 3]
      **Pricing Strategy:** [Details]
      **Value Proposition:** [Core value offered]
      ---
      
      - Repeat this card format for at least 3-5 competitors in ${country.toUpperCase()}
      - Create a positioning matrix showing where the offer compares to the competition in ${country.toUpperCase()} using a table format:
      
      | Competitor | Price | Quality | Features | Market Focus |
      |------------|-------|---------|----------|--------------|
      | Your Business | Medium | High | Complete | Rural Areas |
      | Competitor 1 | High | Medium | Basic | Urban Centers |
      | Competitor 2 | Low | Low | Limited | Nationwide |
      
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
      
      ---
      ### PERSONA 1: [NAME] in ${country.toUpperCase()}
      
      **Demographic Information:**
      - **Age:** [Age range]
      - **Gender:** [Gender]
      - **Location:** [Specific regions in ${country.toUpperCase()}]
      - **Profession:** [Job title/sector]
      - **Income Level:** [Income in local currency]
      - **Family Situation:** [Marital status, children]
      - **Education:** [Education level]
      
      **Behavior and Psychographics:**
      - **Needs:** [List specific needs]
      - **Desires:** [List specific desires]
      - **Frustrations:** [List specific frustrations]
      - **Consumption Habits:** [Relevant consumption patterns]
      - **Values:** [Personal and professional values]
      
      **Purchase Journey:**
      - **Awareness Stage:** [How they become aware of solutions]
      - **Consideration Stage:** [How they evaluate options]
      - **Decision Stage:** [What convinces them to purchase]
      - **Preferred Channels:** [Where they seek information and purchase]
      
      **Contact Points:**
      - **Effective Channels:** [Best ways to reach them]
      - **Resonant Messages:** [Messages that appeal to them]
      - **Objections:** [Common objections and responses]
      ---
      
      Repeat this detailed card structure for each persona.
      
      ## 5. Economic Model
      ### Revenue Model
      - Detail the main and secondary revenue sources adapted to ${country.toUpperCase()}
      - Explain the pricing structure (subscription, freemium, etc.) in the context of ${country.toUpperCase()}
      - Present a detailed pricing strategy with justifications based on ${country.toUpperCase()}'s market
      - Create a pricing table showing different options/tiers:
      
      | Plan/Tier | Price (Local Currency) | Features | Target Segment |
      |-----------|------------------------|----------|----------------|
      | Basic | [Price] | [Feature list] | [Target segment] |
      | Standard | [Price] | [Feature list] | [Target segment] |
      | Premium | [Price] | [Feature list] | [Target segment] |
      
      ### Cost Structure
      - Deeply analyze the main cost categories (fixed and variable) in ${country.toUpperCase()}
      - Identify cost optimization levers specific to ${country.toUpperCase()}
      - Present cost breakdowns in table format:
      
      | Cost Category | Monthly Amount (Local Currency) | Details |
      |---------------|--------------------------------|---------|
      | [Category 1] | [Amount] | [Description] |
      | [Category 2] | [Amount] | [Description] |
      
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
      
      ---
      #### CHANNEL 1: [CHANNEL NAME] in ${country.toUpperCase()}
      **Strategic Justification:** [Why this channel works in this market]
      **Specific Tactics:**
      - [Tactic 1]
      - [Tactic 2]
      - [Tactic 3]
      **Recommended Budget:** [Amount in local currency]
      **Key Performance Indicators:**
      - [KPI 1]
      - [KPI 2]
      **Implementation Timeline:**
      - Month 1: [Activities]
      - Month 2: [Activities]
      - Month 3: [Activities]
      ---
      
      Repeat this card format for each priority channel.
      
      ### Content Strategy
      - Detailed editorial plan adapted to ${country.toUpperCase()}'s audience
      - Recommended content types that resonate with ${country.toUpperCase()}'s market
      - Publication calendar in table format:
      
      | Content Type | Frequency | Channel | Purpose | Target Audience |
      |--------------|-----------|---------|---------|----------------|
      | [Type 1] | [Frequency] | [Channel] | [Purpose] | [Audience] |
      | [Type 2] | [Frequency] | [Channel] | [Purpose] | [Audience] |
      
      ### Conversion and Loyalty Strategy
      - Techniques for generating qualified leads in ${country.toUpperCase()}
      - Detailed conversion process adapted to consumers in ${country.toUpperCase()}
      - Loyalty program designed for ${country.toUpperCase()}
      - Partnership and co-marketing strategies with ${country.toUpperCase()} companies
      
      ## 7. Operational Roadmap
      ### 0-3 months: Foundations in ${country.toUpperCase()}
      - Detailed prioritized actions in ${country.toUpperCase()}
      - Critical milestones to achieve
      - Required resources in ${country.toUpperCase()}
      - Specific KPIs to follow
      - Expected deliverables
      
      Present this information in a timeline format:
      
      | Week | Key Activities | Milestones | Resources Needed |
      |------|---------------|------------|------------------|
      | 1-2 | [Activities] | [Milestone] | [Resources] |
      | 3-4 | [Activities] | [Milestone] | [Resources] |
      | 5-8 | [Activities] | [Milestone] | [Resources] |
      | 9-12 | [Activities] | [Milestone] | [Resources] |
      
      ### 4-6 months: Initial Validation and Growth in ${country.toUpperCase()}
      - Detailed key steps
      - Additional resources required in ${country.toUpperCase()}
      - KPIs evolution
      - Potential strategic adjustments based on ${country.toUpperCase()}'s market feedback
      - Dependencies between different actions
      
      Use a similar timeline format as above.
      
      ### 7-12 months: Optimization and Expansion in ${country.toUpperCase()}
      - Detailed objectives
      - Scaling plan after validation in ${country.toUpperCase()}
      - Team and resource evolution
      - Advanced KPIs
      - Expansion strategies within ${country.toUpperCase()}
      
      Use a similar timeline format as above.
      
      ### Key Performance Indicators
      - Business critical KPIs in the context of ${country.toUpperCase()}
      - Marketing and sales KPIs relevant to ${country.toUpperCase()}
      - Product/service KPIs
      - Recommended measurement methods and tools available in ${country.toUpperCase()}
      
      Present this information in a structured table:
      
      | KPI Category | Specific KPI | Target | Measurement Method | Frequency |
      |--------------|--------------|--------|-------------------|-----------|
      | [Category] | [KPI] | [Target] | [Method] | [Frequency] |
      
      ## 8. Toolbox
      ### Launch Checklist
      - Complete and detailed list of pre-launch tasks in ${country.toUpperCase()}
      - Critical validation points
      - Recommended timeline adapted to ${country.toUpperCase()}'s business environment
      
      Present this as a checklist with clear sections:
      
      #### Legal and Administrative
      - [ ] [Task 1]
      - [ ] [Task 2]
      
      #### Marketing and Sales
      - [ ] [Task 1]
      - [ ] [Task 2]
      
      #### Operations
      - [ ] [Task 1]
      - [ ] [Task 2]
      
      ### Recommended Tools and Technologies
      By functional category, recommend specific tools available in ${country.toUpperCase()}:
      
      ---
      #### CATEGORY: Marketing and Communications
      
      | Tool Name | Price (Local Currency) | Key Features | Benefits for This Business | Alternatives |
      |-----------|------------------------|--------------|----------------------------|--------------|
      | [Tool 1] | [Price] | [Features] | [Benefits] | [Alternatives] |
      | [Tool 2] | [Price] | [Features] | [Benefits] | [Alternatives] |
      
      #### CATEGORY: Sales and CRM
      
      | Tool Name | Price (Local Currency) | Key Features | Benefits for This Business | Alternatives |
      |-----------|------------------------|--------------|----------------------------|--------------|
      | [Tool 1] | [Price] | [Features] | [Benefits] | [Alternatives] |
      | [Tool 2] | [Price] | [Features] | [Benefits] | [Alternatives] |
      ---
      
      Repeat this format for each tool category.
      
      ---
      
      IMPORTANT WRITING GUIDELINES:
      1. Produce a PREMIUM document that fully justifies its $20 value
      2. Use a professional but accessible tone
      3. Include specific and realistic numerical data for the sector in ${country.toUpperCase()}
      4. EXTENSIVELY structure the content with:
         - Hierarchical titles and subtitles (using #, ##, ###)
         - Well-defined paragraphs with clear topic sentences
         - Bullet points AND numbered lists for key points
         - Visual "cards" for personas, competitors, and marketing channels using this format:
           
           ---
           ## [TITLE OF CARD]
           **Key Feature 1:** Detailed description
           **Key Feature 2:** Detailed description
           ...
           ---
         
         - TABLES for comparative data using proper markdown formatting:
           
           | Header 1 | Header 2 | Header 3 |
           |----------|----------|----------|
           | Data 1   | Data 2   | Data 3   |
           
      5. EACH MAIN SECTION MUST BE AT LEAST 1000 WORDS
      6. Use horizontal rules (---) to clearly separate sections
      7. Create VISUAL HIERARCHY with varying heading levels
      8. The document must be immediately actionable by an entrepreneur in ${country.toUpperCase()}
      9. Include concrete and specific recommendations for the ${country.toUpperCase()} market
      10. Suggest relevant external resources specific to ${country.toUpperCase()}
      11. Ensure the content is perfectly adapted to the idea, sector, and specifically to ${country.toUpperCase()}
      12. Use numerous subtitles for easy reading
      13. For sections requiring "cards", create distinct visual frames for each element
      14. Feel free to use descriptive visual elements such as tables, lists, and separator lines
      
      This document must be of exceptional quality, comparable to what a leading strategic consulting firm would produce charging several thousand dollars for such a service.
    `;
    
    // Générer le contenu
    console.log("Démarrage de la génération du plan complet...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Vérifier que le contenu généré est valide
    if (!text || text.length < 2000) {
      console.error(`Contenu généré trop court (${text?.length || 0} caractères)`);
      return NextResponse.json({
        success: false,
        error: "Le contenu généré est trop court ou vide."
      }, { status: 500 });
    }
    
    // Vérifier que le plan mentionne bien le pays
    const planIncludesCountry = text.toLowerCase().includes(country.toLowerCase());
    if (!planIncludesCountry) {
      console.warn(`ATTENTION: Le pays ${country} n'est pas explicitement mentionné dans le plan généré!`);
    }
    
    console.log(`Plan complet généré avec succès (${text.length} caractères)`);
    
    // Retourner le plan complet
    return NextResponse.json({
      success: true,
      plan: text
    });
    
  } catch (error: any) {
    console.error("Erreur lors de la génération du plan complet:", error);
    
    // Préparer un message d'erreur détaillé
    let errorMessage = "Une erreur s'est produite lors de la génération du plan complet.";
    
    if (error.message) {
      errorMessage += ` Détails: ${error.message}`;
    }
    
    if (error.response) {
      errorMessage += ` (HTTP ${error.response.status})`;
      
      if (error.response.data) {
        errorMessage += `: ${JSON.stringify(error.response.data)}`;
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
} 