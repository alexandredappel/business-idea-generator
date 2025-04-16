import { extractKeyInformation } from './extractKeyInformation';
import {
  getExecutiveSummaryPrompt,
  getMarketAnalysisPrompt,
  getConceptValuePrompt,
  getClientProfilePrompt,
  getBusinessModelPrompt,
  getMarketingStrategyPrompt,
  getOperationalRoadmapPrompt,
  getToolkitPrompt
} from './sectionPrompts';

export async function generateDetailedPlan(
  businessIdea: string,
  industry: string,
  country: string,
  budget: string
): Promise<string> {
  try {
    console.log("Génération du plan détaillé avec l'API serveur...");
    console.log("Paramètres:", { industry, country, budget });

    // Transformer les valeurs pour s'assurer qu'elles sont bien formatées
    const formattedCountry = country.trim() ? country.charAt(0).toUpperCase() + country.slice(1).toLowerCase() : "Unknown Country";
    const formattedIndustry = industry.trim() ? industry.toLowerCase().replace(/_/g, ' ') : "Unknown Industry";
    
    // Extraire les informations clés du businessIdea
    const extractedData = extractKeyInformation(businessIdea);
    console.log("Données extraites:", {
      problemLength: extractedData.problem.length,
      conceptLength: extractedData.concept.length,
      valuePropositionLength: extractedData.valueProposition.length,
      targetMarketLength: extractedData.targetMarket.length
    });
    
    // Informer l'utilisateur que la génération est en cours
    console.log("Génération du plan détaillé section par section...");
    
    // Génération séquentielle des sections (au lieu de parallèle) pour éviter les problèmes d'API
    const sections: Record<string, string> = {
      'executive-summary': '',
      'market-analysis': '',
      'concept': '',
      'customer-profile': '',
      'business-model': '',
      'marketing': '',
      'roadmap': '',
      'toolkit': ''
    };
    
    const sectionsOrder = [
      { id: 'executive-summary', title: 'Executive Summary', 
        prompt: getExecutiveSummaryPrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'market-analysis', title: 'Market Analysis and Positioning', 
        prompt: getMarketAnalysisPrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'concept', title: 'Concept and Value Proposition', 
        prompt: getConceptValuePrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'customer-profile', title: 'Client Profile', 
        prompt: getClientProfilePrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'business-model', title: 'Business Model', 
        prompt: getBusinessModelPrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'marketing', title: 'Marketing Strategy', 
        prompt: getMarketingStrategyPrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'roadmap', title: 'Operational Roadmap', 
        prompt: getOperationalRoadmapPrompt(extractedData, formattedIndustry, formattedCountry, budget) },
      { id: 'toolkit', title: 'Toolkit', 
        prompt: getToolkitPrompt(extractedData, formattedIndustry, formattedCountry, budget) }
    ];
    
    // Générer chaque section de manière séquentielle avec des retries en cas d'échec
    let hasErrors = false;
    
    for (const section of sectionsOrder) {
      console.log(`Génération de la section '${section.id}' (${section.title})...`);
      
      try {
        // Essayer de générer la section avec jusqu'à 2 retries
        let attempts = 0;
        let success = false;
        let content = '';
        
        while (attempts < 3 && !success) {
          try {
            attempts++;
            content = await generateSectionContent(section.id, section.prompt);
            success = true;
            console.log(`Section '${section.id}' générée avec succès (${content.length} caractères) à la tentative ${attempts}`);
          } catch (error) {
            console.error(`Tentative ${attempts} échouée pour la section '${section.id}':`, error);
            if (attempts >= 3) {
              throw error; // Relancer l'erreur après 3 tentatives
            }
            // Attendre un peu avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // Vérifier que la section a bien été générée
        if (content && content.length > 100) {
          sections[section.id] = content;
        } else {
          throw new Error(`Contenu généré trop court pour '${section.id}': ${content.length} caractères`);
        }
      } catch (error) {
        console.error(`Erreur finale lors de la génération de la section '${section.id}':`, error);
        hasErrors = true;
        
        // Utiliser le contenu extrait du businessIdea comme fallback
        let fallbackContent = '';
        
        if (section.id === 'executive-summary') {
          fallbackContent = `# Executive Summary\n\n${extractedData.problem}\n\n${extractedData.concept}`;
        } else if (section.id === 'concept') {
          fallbackContent = `# Concept and Value Proposition\n\n${extractedData.concept}\n\n${extractedData.valueProposition}`;
        } else if (section.id === 'customer-profile') {
          fallbackContent = `# Client Profile\n\n${extractedData.targetMarket}`;
        } else {
          fallbackContent = `# ${section.title}\n\nThis section could not be generated. Please try regenerating the plan or edit this section manually.`;
        }
        
        sections[section.id] = fallbackContent;
      }
    }
    
    // Vérifier que toutes les sections ont un contenu suffisant
    const sectionsWithIssues: string[] = [];
    Object.entries(sections).forEach(([sectionId, content]) => {
      if (!content || content.length < 200) {
        sectionsWithIssues.push(sectionId);
        hasErrors = true;
      }
    });
    
    if (sectionsWithIssues.length > 0) {
      console.warn(`ATTENTION: Les sections suivantes sont manquantes ou trop courtes: ${sectionsWithIssues.join(', ')}`);
    }
    
    // Assembler le plan détaillé complet
    let detailedPlan = `# COMPREHENSIVE BUSINESS PLAN FOR ${formattedCountry.toUpperCase()}\n\n`;
    
    if (hasErrors) {
      detailedPlan += `QUALITY ISSUE DETECTED: Some sections of this plan may be incomplete due to generation errors. You may want to regenerate the plan.\n\n`;
    }
    
    // Ajouter chaque section au plan
    detailedPlan += `## Résumé exécutif\n${sections['executive-summary']}\n\n`;
    detailedPlan += `## Analyse de marché et positionnement\n${sections['market-analysis']}\n\n`;
    detailedPlan += `## Concept et proposition de valeur\n${sections['concept']}\n\n`;
    detailedPlan += `## Profil client\n${sections['customer-profile']}\n\n`;
    detailedPlan += `## Modèle économique\n${sections['business-model']}\n\n`;
    detailedPlan += `## Stratégie marketing et acquisition\n${sections['marketing']}\n\n`;
    detailedPlan += `## Feuille de route opérationnelle\n${sections['roadmap']}\n\n`;
    detailedPlan += `## Boîte à outils\n${sections['toolkit']}\n\n`;
    
    // Vérifier si le plan mentionne bien le pays demandé
    const countryMentioned = detailedPlan.toLowerCase().includes(formattedCountry.toLowerCase());
    
    if (!countryMentioned) {
      console.warn(`ATTENTION: Le pays ${formattedCountry} n'est pas explicitement mentionné dans le plan généré!`);
    } else {
      console.log(`Validation: Le pays ${formattedCountry} est bien mentionné dans le plan généré.`);
    }

    return detailedPlan;
  } catch (error) {
    console.error("Erreur lors de la génération du plan détaillé:", error);
    return "An error occurred while generating the detailed plan. Please try again.";
  }
}

/**
 * Génère le contenu d'une section spécifique du plan
 * @param sectionId Identifiant de la section
 * @param prompt Prompt à utiliser pour générer le contenu
 * @returns Le contenu généré pour la section
 */
async function generateSectionContent(sectionId: string, prompt: string): Promise<string> {
  try {
    console.log(`Génération de la section '${sectionId}' avec un prompt de ${prompt.length} caractères...`);
    
    // Vérifier que le prompt est valide
    if (!prompt || prompt.length < 50) {
      throw new Error("Prompt invalide ou trop court");
    }
    
    // Appeler l'API pour générer le contenu de cette section
    const response = await fetch('/api/generate-section', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sectionId,
        prompt
      }),
    });
    
    // Gérer les erreurs HTTP
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `Status code: ${response.status}` };
      }
      console.error(`Erreur API pour la section '${sectionId}':`, errorData);
      throw new Error(`Erreur serveur: ${errorData.error || response.statusText}`);
    }
    
    // Traiter la réponse
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || `Erreur inconnue lors de la génération de la section '${sectionId}'`);
    }
    
    const content = data.sectionContent;
    
    // Vérifier que le contenu est valide
    if (!content || content.length < 50) {
      throw new Error(`Contenu généré invalide ou trop court pour la section '${sectionId}'`);
    }
    
    return content;
  } catch (error) {
    console.error(`Erreur lors de la génération de la section '${sectionId}':`, error);
    throw error;
  }
} 