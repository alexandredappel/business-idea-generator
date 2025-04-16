'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import LoadingAnimation from '@/components/LoadingAnimation';
import { generateDetailedPlan } from '@/services/generateDetailedPlan';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ideaName = searchParams.get('idea') || 'Business Idea';
  
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    fullName: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    fullName: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false); // Mode de débogage
  
  // Exemple de plan complet pour le mode débogage
  const examplePlan = `# COMPREHENSIVE ACTION PLAN FOR BUSINESS IDEA

## 1. Executive Summary
Cette idée de business répond à un besoin croissant sur le marché avec une approche innovante. Nous proposons une solution qui combine technologie et service personnalisé pour résoudre un problème important pour notre cible. Avec un investissement initial modéré, nous prévoyons d'atteindre la rentabilité dans les 12-18 mois grâce à un modèle économique solide et une stratégie d'acquisition clients bien définie.

## 2. Market Analysis and Positioning
### Pain Point and Problem Solved
Les clients actuels font face à de nombreuses difficultés avec les solutions existantes. Notre produit résout ces problèmes en offrant une alternative plus performante et intuitive.

### Simplified Market Study
Le marché représente plus de 500 millions d'euros en France, avec une croissance annuelle de 15%. Plus de 60% des utilisateurs potentiels se déclarent insatisfaits des solutions actuelles.

### Competitive Analysis
* Concurrent A: Force dans le réseau de distribution, mais technologie obsolète
* Concurrent B: Bonne technologie mais prix trop élevé
* Concurrent C: Approche similaire mais expérience client médiocre

## 3. Concept and Value Proposition
### Detailed Concept Description
Notre solution combine une plateforme numérique avec un service sur mesure. Les utilisateurs peuvent facilement configurer leurs préférences et obtenir un résultat optimal en moins de temps que les alternatives existantes.

### Unique Value Proposition (UVP)
"La seule solution qui combine simplicité d'utilisation, personnalisation avancée et tarification accessible pour répondre à ce besoin spécifique."

### Competitive Differentiation
Notre avantage concurrentiel repose sur trois piliers: technologie propriétaire, expérience utilisateur exceptionnelle, et structure de coûts optimisée permettant des prix compétitifs.

## 4. Customer Profile
### Primary Persona
* Nom: Thomas, 35 ans
* Profession: Cadre en entreprise
* Besoins spécifiques: Gain de temps, simplicité, résultats fiables
* Comportement d'achat: Recherche en ligne, essai avant achat
* Facteurs de décision: Prix, réputation, facilité d'utilisation

### Secondary Persona
* Nom: Sophie, 42 ans
* Profession: Entrepreneur
* Besoins spécifiques: Flexibilité, support client réactif, solution évolutive
* Comportement d'achat: Recommandations et avis en ligne
* Facteurs de décision: Fiabilité, fonctionnalités, évolutivité

## 5. Business Model
### Revenue Model
Modèle d'abonnement mensuel avec trois niveaux de service:
* Basique: 29€/mois pour les fonctionnalités essentielles
* Pro: 49€/mois incluant des fonctionnalités avancées
* Entreprise: 99€+/mois pour solutions personnalisées

### Cost Structure
* Coûts fixes: Développement technologique, salaires équipe de base, marketing
* Coûts variables: Service client, infrastructure cloud, commissions partenaires

### Simplified Budget Forecast
* Investissement initial: 75,000€ (développement, marketing, opérations)
* Coûts mensuels: 12,000€ (équipe, infrastructure, marketing)
* Projection de revenus à 12 mois: 25,000€/mois
* Point d'équilibre: Mois 10 avec 300 utilisateurs payants

## 6. Marketing and Acquisition Strategy
### Recommended Marketing Strategies
* Positionnement: Solution premium mais accessible, accent sur simplicité et efficacité
* Contenu: Blog démontrant expertise, études de cas, guides pratiques
* Publicité: Campagnes Google Ads ciblées, LinkedIn pour B2B
* Relations publiques: Partenariats avec influenceurs du secteur

### Customer Acquisition Channels
* Marketing de contenu (SEO): 30% des acquisitions prévues
* Publicité en ligne: 25% des acquisitions
* Partenariats: 20% des acquisitions
* Recommandations: 15% des acquisitions
* Vente directe: 10% des acquisitions

## 7. Operational Roadmap
### 3-Month Milestones
* Finalisation du MVP et tests utilisateurs
* Constitution de l'équipe fondatrice
* Lancement de la version beta avec 50 utilisateurs pilotes

### 6-Month Milestones
* Lancement officiel du produit
* Atteindre 100 utilisateurs payants
* Implémentation des premiers retours utilisateurs

### 12-Month Milestones
* Expansion de l'offre avec nouvelles fonctionnalités
* Atteindre 300+ utilisateurs payants
* Préparation pour levée de fonds ou autofinancement

### Key Performance Indicators
* Taux de conversion visiteurs/utilisateurs
* Churn rate mensuel (objectif <5%)
* Coût d'acquisition client (CAC)
* Valeur vie client (LTV)
* Net Promoter Score (NPS)

## 8. Toolkit
### Launch Checklist
* Plateforme technique opérationnelle
* Processus de support client en place
* Stratégie de contenu pour 3 mois
* Identité visuelle et site web
* Outils d'analyse et de suivi

### Recommended Tools and Technologies
* CRM: HubSpot ou Pipedrive
* Marketing: SEMrush, Mailchimp
* Développement: GitHub, AWS/GCP
* Support: Intercom ou Zendesk
* Analytique: Google Analytics, Hotjar`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is filled
    if (value) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = () => {
    // En mode débogage, pas besoin de validation
    if (debugMode) return true;

    // Validation normale
    const newErrors = {
      email: formData.email ? '' : 'Veuillez saisir votre email',
      cardNumber: formData.cardNumber ? '' : 'Veuillez saisir votre numéro de carte',
      expiryDate: formData.expiryDate ? '' : 'Veuillez saisir la date d\'expiration',
      cvc: formData.cvc ? '' : 'Veuillez saisir le code CVC',
      fullName: formData.fullName ? '' : 'Veuillez saisir votre nom complet',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };
  
  // Fonction pour passer directement à la page du plan complet avec une vraie génération
  const handleDebugAccess = async () => {
    setIsProcessing(true);
    setProcessingStep('Generating action plan in demo mode...');
    
    try {
      // Récupérer les idées générées depuis sessionStorage ou utiliser une idée factice
      const storedIdeas = sessionStorage.getItem('generatedIdeas') || 
        `Idée de business: ${ideaName} - Une solution innovante dans le secteur ${searchParams.get('industry') || 'technologique'} qui résout [problème fictif] pour [clients cibles].`;
      
      console.log("Idées utilisées pour le mode démo:", storedIdeas);
      
      // Paramètres pour la génération
      const industry = searchParams.get('industry') || 'technologie';
      const country = searchParams.get('country') || 'France';
      const budget = searchParams.get('budget') || 'medium';
      
      // Forcer une variante unique en ajoutant un timestamp
      const uniqueIdea = `${storedIdeas}\n\nGénération unique: ${Date.now()}`;
      
      try {
        // Utiliser notre service qui appelle la route API côté serveur
        const detailedPlan = await generateDetailedPlan(uniqueIdea, industry, country, budget);
        
        if (detailedPlan && detailedPlan !== "Une erreur est survenue lors de la génération du plan détaillé. Veuillez réessayer.") {
          // Ajouter un marqueur de mode démo
          const demoContent = `# PLAN GÉNÉRÉ EN MODE DÉMO LE ${new Date().toLocaleString('fr-FR')}\n\n${detailedPlan}`;
          
          // Stocker le plan dans sessionStorage
          sessionStorage.setItem('completePlan', JSON.stringify({
            name: ideaName,
            fullContent: demoContent,
            generatedAt: new Date().toISOString(),
            isDemo: true
          }));
          
          // Rediriger vers la page du plan complet
          router.push(`/complete-plan?idea=${encodeURIComponent(ideaName)}&demo=true&t=${Date.now()}`);
        } else {
          throw new Error("Échec de génération");
        }
      } catch (error) {
        console.error("Erreur lors de la génération en mode démo:", error);
        
        // En cas d'échec, utiliser le plan d'exemple mais avec des modifications pour le rendre unique
        const now = new Date().toLocaleString('fr-FR');
        const modifiedExample = examplePlan
          .replace("BUSINESS IDEA", ideaName)
          .replace("Executive Summary", `Executive Summary (Démo générée le ${now})`);
        
        sessionStorage.setItem('completePlan', JSON.stringify({
          name: ideaName,
          fullContent: modifiedExample,
          generatedAt: new Date().toISOString(),
          isDemo: true,
          isExample: true
        }));
        
        // Rediriger vers la page du plan complet
        router.push(`/complete-plan?idea=${encodeURIComponent(ideaName)}&demo=true&fallback=true&t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Erreur dans le mode démo:", error);
      setIsProcessing(false);
      setProcessingError("Erreur lors de l'accès au mode démo");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mode débogage direct
    if (debugMode) {
      handleDebugAccess();
      return;
    }
    
    if (validateForm()) {
      setIsProcessing(true);
      setProcessingError(null);
      setProcessingStep('Processing payment...');
      
      try {
        // Simuler un délai de traitement du paiement
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Récupérer les idées générées depuis sessionStorage
        const storedIdeas = sessionStorage.getItem('generatedIdeas');
        if (!storedIdeas) {
          throw new Error("No ideas found in session");
        }
        
        // Récupérer les informations complètes de l'idée depuis sessionStorage (priorité la plus élevée)
        let industry = '';
        let country = '';
        let budget = '';
        
        try {
          // Essayer d'abord de récupérer les informations complètes (méthode la plus fiable)
          const currentIdeaInfo = sessionStorage.getItem('currentIdeaInfo');
          if (currentIdeaInfo) {
            const ideaInfo = JSON.parse(currentIdeaInfo);
            industry = ideaInfo.industry;
            country = ideaInfo.country;
            budget = ideaInfo.budget;
            console.log("Paramètres récupérés depuis currentIdeaInfo:", { industry, country, budget });
          }
        } catch (e) {
          console.error("Erreur lors de la récupération des informations de l'idée:", e);
        }
        
        // Si les informations ne sont pas disponibles, essayer de les récupérer à partir d'autres sources
        if (!industry || !country || !budget) {
          // Essayer d'abord les paramètres de l'URL
          industry = industry || searchParams.get('industry') || '';
          country = country || searchParams.get('country') || '';
          budget = budget || searchParams.get('budget') || '';
          
          console.log("Paramètres récupérés depuis URL:", { industry, country, budget });
          
          // Récupérer les paramètres depuis generationParams si disponibles et si toujours manquants
          try {
            const originalParams = sessionStorage.getItem('generationParams');
            if (originalParams) {
              const params = JSON.parse(originalParams);
              // N'utiliser les paramètres stockés que si ceux déjà récupérés sont manquants
              industry = industry || params.industry;
              country = country || params.country;
              budget = budget || params.budget;
              console.log("Paramètres complétés depuis generationParams:", { industry, country, budget });
            }
          } catch (e) {
            console.error("Erreur lors de la récupération des paramètres originaux:", e);
          }
        }
        
        // Utiliser des valeurs par défaut si toujours manquantes (dernier recours)
        industry = industry || 'technology';
        country = country || 'United States';
        budget = budget || 'medium';
        
        // Log détaillé des paramètres finaux
        console.log("Paramètres finaux pour la génération du plan:", { 
          industry, 
          country, 
          budget, 
          ideaName,
          ideaContentLength: storedIdeas.length 
        });
        
        setProcessingStep('Generating your detailed action plan...');
        
        try {
          // Utiliser notre service qui appelle l'API serveur
          const detailedPlan = await generateDetailedPlan(storedIdeas, industry, country, budget);
          
          // Log pour déboguer - Vérifier la réponse
          console.log("API response:", detailedPlan ? "Success" : "Failure");
          
          if (detailedPlan && detailedPlan !== "An error occurred while generating the detailed plan. Please try again.") {
            // Ajouter un timestamp pour garantir l'unicité
            const planWithTimestamp = `# Plan generated on ${new Date().toLocaleString('en-US')}\n\n${detailedPlan}`;
            
            // Stocker le plan complet dans sessionStorage
            sessionStorage.setItem('completePlan', JSON.stringify({
              name: ideaName,
              fullContent: planWithTimestamp,
              generatedAt: new Date().toISOString(), // Ajouter un timestamp
              industry: industry,
              country: country,
              budget: budget
            }));
            
            setProcessingStep('Finalizing...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Rediriger vers la page du plan complet
            router.push(`/complete-plan?idea=${encodeURIComponent(ideaName)}&industry=${encodeURIComponent(industry)}&country=${encodeURIComponent(country)}&budget=${encodeURIComponent(budget)}&t=${Date.now()}`);
          } else {
            // En cas d'erreur avec l'API, utiliser le plan d'exemple
            console.warn("Error with API, using example plan");
            
            // Ajouter un timestamp pour garantir l'unicité
            const examplePlanWithTimestamp = `# Example plan generated on ${new Date().toLocaleString('en-US')}\n\n${examplePlan}`;
            
            sessionStorage.setItem('completePlan', JSON.stringify({
              name: ideaName,
              fullContent: examplePlanWithTimestamp,
              generatedAt: new Date().toISOString(),
              isExample: true,
              industry: industry,
              country: country,
              budget: budget
            }));
            
            setProcessingStep('Finalizing (fallback mode)...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Rediriger vers la page du plan complet avec les paramètres
            router.push(`/complete-plan?idea=${encodeURIComponent(ideaName)}&industry=${encodeURIComponent(industry)}&country=${encodeURIComponent(country)}&budget=${encodeURIComponent(budget)}&t=${Date.now()}`);
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          // Fallback sur le plan d'exemple en cas d'erreur
          const examplePlanWithTimestamp = `# Example plan (after error) generated on ${new Date().toLocaleString('en-US')}\n\n${examplePlan}`;
          
          sessionStorage.setItem('completePlan', JSON.stringify({
            name: ideaName,
            fullContent: examplePlanWithTimestamp,
            generatedAt: new Date().toISOString(),
            isExample: true,
            error: String(apiError),
            industry: industry,
            country: country,
            budget: budget
          }));
          
          setProcessingStep('Finalizing (fallback mode)...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Rediriger vers la page du plan complet avec les paramètres
          router.push(`/complete-plan?idea=${encodeURIComponent(ideaName)}&industry=${encodeURIComponent(industry)}&country=${encodeURIComponent(country)}&budget=${encodeURIComponent(budget)}&t=${Date.now()}`);
        }
      } catch (error: any) {
        console.error("Error:", error);
        setProcessingError(error.message || "An error occurred during processing");
        setIsProcessing(false);
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {isProcessing && (
        <LoadingAnimation isVisible={isProcessing} />
      )}
      
      <div className="mb-8">
        <Link href="/result" className="text-primary hover:underline inline-flex items-center">
          ← Back to result
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Card className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Plan d'action détaillé</h1>
            <p className="text-text-light mb-6">
              Vous êtes sur le point d'acheter le plan d'action détaillé pour lancer
              votre idée business : <span className="font-semibold">{ideaName}</span>
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Plan détaillé</span>
                <span>19.00€</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>19.00€</span>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Ce que vous obtiendrez :</h3>
              <ul className="list-disc pl-5 space-y-1 text-text-light">
                <li>Executive summary du projet</li>
                <li>Analyse du marché et positionnement</li>
                <li>Concept et proposition de valeur</li>
                <li>Profil client détaillé (personas)</li>
                <li>Modèle économique complet</li>
                <li>Stratégie marketing et acquisition</li>
                <li>Roadmap opérationnelle à 3, 6 et 12 mois</li>
                <li>Boîte à outils et checklist de lancement</li>
              </ul>
            </div>
            
            {/* Bouton d'accès direct pour déboguer */}
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs text-gray-400 hover:text-primary"
              >
                {debugMode ? '✓ Mode démo activé' : 'Activer le mode démo'}
              </button>
            </div>
          </Card>
        </div>
        
        <div className="lg:w-1/2">
          {isProcessing ? null : (
            <Card>
              <h2 className="text-xl font-bold mb-6">Informations de paiement</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!debugMode ? (
                    <>
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />
                      
                      <Input
                        label="Nom complet"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        required
                      />
                      
                      <Input
                        label="Numéro de carte"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        error={errors.cardNumber}
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Date d'expiration"
                          name="expiryDate"
                          placeholder="MM/AA"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          error={errors.expiryDate}
                          required
                        />
                        
                        <Input
                          label="CVC"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleChange}
                          error={errors.cvc}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
                      <p className="text-green-700">Mode démo activé</p>
                      <p className="text-sm text-green-600">Cliquez sur le bouton ci-dessous pour accéder directement au plan d'action complet.</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                    >
                      {debugMode ? 'Accéder au plan d\'action' : 'Payer 19.00€'}
                    </Button>
                  </div>
                  
                  <p className="text-center text-sm text-text-light mt-4">
                    Paiement sécurisé. Nous ne stockons pas vos informations de carte bancaire.
                  </p>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 