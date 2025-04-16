import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessIdeas } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const data = await request.json();
    const { industry, country, budget, criteria } = data;

    // Vérifier que les paramètres requis sont présents
    if (!industry || !country || !budget) {
      return NextResponse.json(
        { error: 'Les champs industry, country et budget sont requis' },
        { status: 400 }
      );
    }

    // Appeler le service Gemini pour générer les idées
    const result = await generateBusinessIdeas(industry, country, budget, criteria);

    // Retourner la réponse selon le résultat
    if (result.success) {
      return NextResponse.json({
        success: true,
        ideas: result.ideas,
        sources: result.sources || []
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Une erreur est survenue lors de la génération d\'idées' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

// Ajouter également une méthode GET pour pouvoir tester l'API facilement
export async function GET() {
  return NextResponse.json(
    { message: 'L\'API de génération d\'idées business est active. Utilisez une requête POST pour générer des idées.' }
  );
}
