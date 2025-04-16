/**
 * Service pour extraire les informations clés des idées générées
 * Cette fonction analyse le texte brut généré lors de la première étape
 * et en extrait les informations structurées nécessaires pour les prompts suivants
 */

/**
 * Extrait les informations clés du texte d'idée générée
 * @param businessIdeaText Le texte brut des idées générées
 * @returns Les données structurées extraites
 */
export function extractKeyInformation(businessIdeaText: string) {
  // Initialiser un objet pour stocker les données extraites
  const extractedData = {
    problem: "",
    concept: "",
    valueProposition: "",
    targetMarket: "",
    originalText: businessIdeaText,
  };

  try {
    // Patterns pour identifier les différentes sections
    const problemPatterns = [
      /Identified Problem[s]?:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Problem Statement:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Pain Point[s]?:?\s*([^#]+?)(?=#|\n\n|$)/i,
    ];

    const conceptPatterns = [
      /Concept:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Business Idea:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Solution:?\s*([^#]+?)(?=#|\n\n|$)/i,
    ];

    const valuePropositionPatterns = [
      /Value Proposition:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Unique Value:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Benefits:?\s*([^#]+?)(?=#|\n\n|$)/i,
    ];

    const targetMarketPatterns = [
      /Target Market:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Target Audience:?\s*([^#]+?)(?=#|\n\n|$)/i,
      /Customer Segment[s]?:?\s*([^#]+?)(?=#|\n\n|$)/i,
    ];

    // Fonction pour extraire le texte à partir de patterns
    const extractWithPatterns = (patterns: RegExp[], defaultValue: string) => {
      for (const pattern of patterns) {
        const match = businessIdeaText.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      return defaultValue;
    };

    // Extraire les données avec chaque ensemble de patterns
    extractedData.problem = extractWithPatterns(
      problemPatterns,
      "No specific problem identified in the text."
    );
    extractedData.concept = extractWithPatterns(
      conceptPatterns,
      "No specific concept identified in the text."
    );
    extractedData.valueProposition = extractWithPatterns(
      valuePropositionPatterns,
      "No specific value proposition identified in the text."
    );
    extractedData.targetMarket = extractWithPatterns(
      targetMarketPatterns,
      "No specific target market identified in the text."
    );

    // Si l'analyse échoue pour certaines sections, essayer de deviner à partir du texte global
    if (
      extractedData.problem === "No specific problem identified in the text." &&
      businessIdeaText.length > 100
    ) {
      // Essayer d'extraire le premier paragraphe significatif comme problème
      const firstParagraph = businessIdeaText
        .split('\n\n')
        .filter(p => p.length > 50)[0];
      if (firstParagraph) {
        extractedData.problem = firstParagraph.trim();
      }
    }

    console.log("Extracted data from business idea:", {
      problemLength: extractedData.problem.length,
      conceptLength: extractedData.concept.length,
      valuePropositionLength: extractedData.valueProposition.length,
      targetMarketLength: extractedData.targetMarket.length,
    });

    return extractedData;
  } catch (error) {
    console.error("Error extracting key information:", error);
    // En cas d'erreur, retourner le texte original comme solution de secours
    return {
      problem: "Error extracting problem.",
      concept: "Error extracting concept.",
      valueProposition: "Error extracting value proposition.",
      targetMarket: "Error extracting target market.",
      originalText: businessIdeaText,
    };
  }
} 