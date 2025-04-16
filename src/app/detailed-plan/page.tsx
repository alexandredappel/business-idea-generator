'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface DetailedPlanData {
  name: string;
  roadmap: {
    threeMonths: string[];
    sixMonths: string[];
    twelveMonths: string[];
  };
  personas: {
    name: string;
    age: string;
    profession: string;
    painPoints: string[];
    expectations: string[];
  }[];
  marketingStrategies: string[];
  acquisitionChannels: string[];
  budget: {
    initial: number;
    monthly: number;
    breakdown: { item: string; cost: number }[];
  };
  competitors: { name: string; strengths: string[]; weaknesses: string[] }[];
  risks: { risk: string; mitigation: string }[];
}

// Exemple de plan détaillé (à remplacer par l'appel à l'API)
const mockDetailedPlan: DetailedPlanData = {
  name: "FoodLocker",
  roadmap: {
    threeMonths: [
      "Conception et prototype du casier intelligent",
      "Développement d'une application mobile MVP",
      "Partenariats avec 3-5 restaurateurs locaux",
      "Installation d'un pilote dans un immeuble de bureaux",
      "Tests utilisateurs et ajustements"
    ],
    sixMonths: [
      "Expansion à 3-5 immeubles de bureaux supplémentaires",
      "Élargissement des partenariats restaurateurs (10-15 au total)",
      "Amélioration de l'application avec système de paiement intégré",
      "Mise en place d'un programme de fidélité",
      "Recrutement d'un responsable logistique"
    ],
    twelveMonths: [
      "Présence dans 15-20 bâtiments dans la ville principale",
      "Expansion dans une deuxième ville",
      "Développement d'une offre B2B pour les entreprises",
      "Levée de fonds pour l'expansion nationale",
      "Automatisation accrue de la logistique"
    ]
  },
  personas: [
    {
      name: "Thomas",
      age: "32 ans",
      profession: "Développeur dans une startup",
      painPoints: [
        "Peu de temps pour la pause déjeuner (30 min)",
        "Options limitées à proximité de son bureau",
        "Désir de manger sain sans cuisiner"
      ],
      expectations: [
        "Gain de temps",
        "Options alimentaires variées et de qualité",
        "Processus simple et fiable"
      ]
    },
    {
      name: "Sophie",
      age: "41 ans",
      profession: "Responsable marketing en entreprise",
      painPoints: [
        "Réunions fréquentes pendant l'heure du déjeuner",
        "Fatiguée des plats préparés industriels",
        "Frustration quand les livraisons sont en retard"
      ],
      expectations: [
        "Flexibilité pour récupérer son repas quand elle veut",
        "Découverte de nouveaux restaurants",
        "Alimentation de qualité sans surcoût de livraison individuelle"
      ]
    }
  ],
  marketingStrategies: [
    "Partenariats avec les gestionnaires d'immeubles de bureaux",
    "Campagnes d'acquisition focalisées sur les immeubles équipés (flyers, événements)",
    "Programme de parrainage avec réductions sur les commandes",
    "Contenus sur les réseaux sociaux mettant en avant les restaurateurs partenaires",
    "Offres spéciales pour les premières commandes (réduction de 30%)"
  ],
  acquisitionChannels: [
    "Marketing direct dans les immeubles équipés",
    "Réseaux sociaux (Instagram, LinkedIn)",
    "Marketing d'influence avec des professionnels du quartier d'affaires",
    "Partenariats avec les services RH des entreprises locales",
    "Référencement local SEO"
  ],
  budget: {
    initial: 10000,
    monthly: 3200,
    breakdown: [
      { item: "Prototype initial des casiers (x3)", cost: 4500 },
      { item: "Développement application MVP", cost: 3500 },
      { item: "Marketing initial", cost: 1500 },
      { item: "Frais légaux et administratifs", cost: 500 },
      { item: "Location mensuelle emplacement", cost: 800 },
      { item: "Coûts logistiques mensuels", cost: 1200 },
      { item: "Marketing mensuel", cost: 600 },
      { item: "Maintenance et support", cost: 400 },
      { item: "Imprévus mensuels", cost: 200 }
    ]
  },
  competitors: [
    {
      name: "Services de livraison traditionnels (Deliveroo, Uber Eats)",
      strengths: ["Large choix de restaurants", "Notoriété", "Expérience utilisateur rodée"],
      weaknesses: ["Coûts de livraison élevés", "Délais variables", "Qualité inégale à l'arrivée"]
    },
    {
      name: "Cantines d'entreprise",
      strengths: ["Déjà en place", "Prix compétitifs", "Commodité"],
      weaknesses: ["Offre limitée", "Qualité souvent moyenne", "Horaires fixes"]
    },
    {
      name: "Frigos intelligents en entreprise",
      strengths: ["Déjà dans certains bureaux", "Accessibilité 24/7"],
      weaknesses: ["Produits préparés à l'avance", "Peu de variété", "Rarement des repas frais"]
    }
  ],
  risks: [
    {
      risk: "Difficulté à obtenir des emplacements dans les immeubles",
      mitigation: "Proposer un partage de revenus aux gestionnaires d'immeubles; démontrer la valeur ajoutée pour les locataires"
    },
    {
      risk: "Logistique complexe avec les restaurants",
      mitigation: "Développer un système de planification optimisé; concentrer les partenariats avec des restaurants fiables"
    },
    {
      risk: "Problèmes techniques avec les casiers",
      mitigation: "Tests rigoureux avant déploiement; système de support réactif; casiers de secours"
    },
    {
      risk: "Concurrence d'acteurs établis",
      mitigation: "Mettre l'accent sur la valeur unique (fraîcheur, pas de frais de livraison individuels, rapidité)"
    }
  ]
};

export default function DetailedPlanPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<DetailedPlanData | null>(null);
  
  useEffect(() => {
    // Simuler un chargement d'API
    const timer = setTimeout(() => {
      setPlan(mockDetailedPlan);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Chargement de votre plan détaillé...</p>
        </div>
      </div>
    );
  }
  
  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Oups !</h2>
          <p className="mb-6">Une erreur s'est produite lors du chargement de votre plan détaillé.</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline inline-flex items-center">
          ← Retour à l'accueil
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{plan.name}</h1>
        <Button>
          Télécharger en PDF
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Roadmap pour le lancement et développement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary">0 - 3 mois</h3>
              <ul className="list-disc pl-5 space-y-2 text-text-light">
                {plan.roadmap.threeMonths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">3 - 6 mois</h3>
              <ul className="list-disc pl-5 space-y-2 text-text-light">
                {plan.roadmap.sixMonths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">6 - 12 mois</h3>
              <ul className="list-disc pl-5 space-y-2 text-text-light">
                {plan.roadmap.twelveMonths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Personas clients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.personas.map((persona, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                    {persona.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{persona.name}, {persona.age}</h3>
                    <p className="text-sm text-text-light">{persona.profession}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Points de friction :</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-text-light mb-3">
                    {persona.painPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                  <h4 className="font-medium mb-2">Attentes :</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
                    {persona.expectations.map((expectation, i) => (
                      <li key={i}>{expectation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Marketing et acquisition</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Stratégies marketing recommandées :</h3>
            <ul className="list-disc pl-5 space-y-2 text-text-light">
              {plan.marketingStrategies.map((strategy, index) => (
                <li key={index}>{strategy}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Canaux d'acquisition clients :</h3>
            <ul className="list-disc pl-5 space-y-2 text-text-light">
              {plan.acquisitionChannels.map((channel, index) => (
                <li key={index}>{channel}</li>
              ))}
            </ul>
          </div>
        </Card>
        
        <Card className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Budget prévisionnel</h2>
          
          <div className="mb-4">
            <p className="font-semibold">Budget initial requis :</p>
            <p className="text-2xl font-bold text-primary">{plan.budget.initial.toLocaleString()}€</p>
          </div>
          
          <div className="mb-6">
            <p className="font-semibold">Coûts mensuels estimés :</p>
            <p className="text-xl font-bold text-primary">{plan.budget.monthly.toLocaleString()}€/mois</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Ventilation des coûts :</h3>
            <div className="space-y-2">
              {plan.budget.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-text-light">{item.item}</span>
                  <span className="font-medium">{item.cost.toLocaleString()}€</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Analyse concurrentielle</h2>
          
          <div className="space-y-6">
            {plan.competitors.map((competitor, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold mb-3">{competitor.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-primary font-medium mb-2">Points forts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-text-light">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-500 font-medium mb-2">Points faibles</h4>
                    <ul className="list-disc pl-5 space-y-1 text-text-light">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Risques potentiels et solutions</h2>
          
          <div className="space-y-4">
            {plan.risks.map((risk, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-red-500">Risque :</h3>
                  <p className="text-text-light">{risk.risk}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-green-600">Mitigation :</h3>
                  <p className="text-text-light">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="text-center">
        <p className="text-lg text-text-light mb-6">
          Besoin d'aide pour mettre en œuvre ce plan ? 
          Envie de discuter davantage de cette idée business ?
        </p>
        <Button variant="secondary">
          Contactez notre équipe
        </Button>
      </div>
    </div>
  );
} 