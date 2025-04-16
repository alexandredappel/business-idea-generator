import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

/**
 * API handler for generating individual sections of the detailed plan
 */
export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const body = await request.json();
    const { sectionId, prompt } = body;
    
    // Validate required parameters
    if (!sectionId || !prompt) {
      console.error("Missing parameters:", { sectionId: !!sectionId, promptProvided: !!prompt });
      return NextResponse.json({ 
        success: false, 
        error: "Missing parameters. Please provide sectionId and prompt." 
      }, { status: 400 });
    }
    
    // Log detailed server-side information (not visible in browser)
    console.log(`Generating section '${sectionId}'...`);
    console.log(`Prompt length: ${prompt.length} characters`);
    
    // Configure Gemini API
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not defined!");
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration incomplete. Missing API key." 
      }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        maxOutputTokens: 4096,  // Assurer suffisamment de tokens pour générer une section complète
        temperature: 0.7,       // Un peu de créativité mais pas trop aléatoire
        topP: 0.95,             // Haute qualité de texte
        topK: 40                // Diversité raisonnable
      }
    });
    
    // Generate content for this section
    try {
      console.log(`Starting generation for section '${sectionId}'...`);
      
      // Essayer de générer le contenu avec un timeout
      const generateWithTimeout = async () => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Generation timeout")), 90000); // 90 secondes
        });
        
        const generationPromise = model.generateContent(prompt);
        
        return Promise.race([generationPromise, timeoutPromise]);
      };
      
      const result = await generateWithTimeout() as any;
      
      if (!result || !result.response) {
        throw new Error("Invalid response from Gemini API");
      }
      
      const response = await result.response;
      const text = response.text();
      
      // Validation du contenu généré
      if (!text || text.length < 200) {
        console.error(`Section '${sectionId}' content too short (${text?.length || 0} characters)`);
        return NextResponse.json({
          success: false,
          error: `Generated content for section '${sectionId}' is too short or empty.`
        }, { status: 500 });
      }
      
      // Vérifier que le contenu est pertinent pour la section
      const relevancyCheck = checkContentRelevancy(sectionId, text);
      if (!relevancyCheck.isRelevant) {
        console.warn(`Section '${sectionId}' might be irrelevant: ${relevancyCheck.reason}`);
        // On continue quand même mais on logue l'avertissement
      }
      
      console.log(`Section '${sectionId}' generated successfully (${text.length} characters)`);
      
      return NextResponse.json({
        success: true,
        sectionContent: text
      });
    } catch (generationError: any) {
      console.error(`Error generating section '${sectionId}':`, generationError);
      
      // Si l'erreur est liée à l'API Gemini, essayer de récupérer plus d'informations
      let errorDetails = generationError.message || `Error generating section '${sectionId}'`;
      
      if (generationError.response && generationError.response.status) {
        errorDetails += ` (HTTP ${generationError.response.status})`;
      }
      
      if (generationError.response && generationError.response.data) {
        errorDetails += `: ${JSON.stringify(generationError.response.data)}`;
      }
      
      return NextResponse.json({
        success: false,
        error: errorDetails
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message || "An unknown error occurred"
    }, { status: 500 });
  }
}

/**
 * Vérifie que le contenu généré est pertinent pour la section
 */
function checkContentRelevancy(sectionId: string, content: string): { isRelevant: boolean; reason?: string } {
  if (!content) return { isRelevant: false, reason: "Empty content" };
  
  const contentLower = content.toLowerCase();
  
  // Vérification basique de pertinence par section
  const keywordsMap: Record<string, string[]> = {
    'executive-summary': ['summary', 'overview', 'business', 'objectives', 'market'],
    'market-analysis': ['market', 'analysis', 'competitor', 'industry', 'positioning'],
    'concept': ['concept', 'value', 'proposition', 'product', 'service'],
    'customer-profile': ['customer', 'client', 'persona', 'target', 'demographic'],
    'business-model': ['revenue', 'cost', 'pricing', 'model', 'financial'],
    'marketing': ['marketing', 'strategy', 'promotion', 'channels', 'acquisition'],
    'roadmap': ['roadmap', 'timeline', 'milestone', 'implementation', 'launch'],
    'toolkit': ['tools', 'resources', 'software', 'equipment', 'technology']
  };
  
  // Vérifier les mots-clés attendus
  const expectedKeywords = keywordsMap[sectionId] || [];
  const matchingKeywords = expectedKeywords.filter(keyword => contentLower.includes(keyword));
  
  if (matchingKeywords.length < 2) {
    return { 
      isRelevant: false, 
      reason: `Content matches only ${matchingKeywords.length} of ${expectedKeywords.length} expected keywords` 
    };
  }
  
  return { isRelevant: true };
} 