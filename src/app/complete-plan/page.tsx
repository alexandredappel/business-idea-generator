'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LoadingAnimation from '@/components/LoadingAnimation';
import { usePDF } from 'react-to-pdf';
import { marked } from 'marked';

interface DetailedPlanData {
  name: string;
  fullContent?: string;
  isExample?: boolean;
  isDemo?: boolean;
  generatedAt?: string;
}

// Style inspiré par Optiiflow pour la cohérence avec le reste de l'application
const OptiiflowStyle = {
  colors: {
    primary: '#624CF5', // Violet Optiiflow
    secondary: '#42C9E5', // Bleu clair
    accent: '#FF7A50', // Orange d'accentuation
    darkBlue: '#2E3146', // Bleu foncé pour le texte
    lightGray: '#F7F8FA', // Gris clair pour l'arrière-plan
    gray: '#E5E7EB', // Gris pour les bordures
  },
  gradients: {
    primary: 'linear-gradient(135deg, #624CF5 0%, #8E74FF 100%)',
    secondary: 'linear-gradient(135deg, #42C9E5 0%, #32D4C0 100%)',
    accent: 'linear-gradient(135deg, #FF7A50 0%, #FFA477 100%)',
  }
};

// Structure du plan d'action
const planSections = [
  {
    id: 'executive-summary',
    title: 'Résumé exécutif',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning bolt
    color: OptiiflowStyle.colors.primary
  },
  {
    id: 'market-analysis',
    title: 'Analyse de marché et positionnement',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', // Chart
    color: OptiiflowStyle.colors.secondary
  },
  {
    id: 'concept',
    title: 'Concept et proposition de valeur',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', // Light bulb
    color: OptiiflowStyle.colors.accent
  },
  {
    id: 'customer-profile',
    title: 'Profil client',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', // Users
    color: OptiiflowStyle.colors.primary
  },
  {
    id: 'business-model',
    title: 'Modèle économique',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Currency
    color: OptiiflowStyle.colors.secondary
  },
  {
    id: 'marketing',
    title: 'Stratégie marketing et acquisition',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', // Megaphone
    color: OptiiflowStyle.colors.accent
  },
  {
    id: 'roadmap',
    title: 'Feuille de route opérationnelle',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', // Document checklist
    color: OptiiflowStyle.colors.primary
  },
  {
    id: 'toolkit',
    title: 'Boîte à outils',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', // Settings icon
    color: OptiiflowStyle.colors.secondary
  }
];

export default function CompletePlanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<DetailedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  
  // Configuration de PDF avec nom dynamique basé sur le plan
  const { toPDF, targetRef } = usePDF({
    filename: `${plan?.name || 'Business'} - Detailed plan.pdf`,
    page: { 
      margin: 20,
      format: 'A4',
    },
    method: 'save'
  });

  // Référence pour le scroll automatique
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // État pour détecter les problèmes de qualité
  const [hasQualityIssue, setHasQualityIssue] = useState(false);

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Observer pour détecter quelle section est visible lors du défilement
  useEffect(() => {
    if (typeof window !== 'undefined' && plan?.fullContent) {
      // Supprimer l'ancien observer si existant
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Options pour l'observer: à quel point la section doit être visible
      const options = {
        root: null, // viewport
        rootMargin: '-20% 0px -75% 0px', // Marge autour du viewport
        threshold: 0 // Le pourcentage de visibilité déclenchant le callback
      };

      // Créer un nouvel observer
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Extraire l'ID de section à partir de l'élément
            const id = entry.target.id;
            if (id && id !== activeSection) {
              setActiveSection(id);
            }
          }
        });
      }, options);

      // Observer toutes les sections
      Object.keys(sectionRefs.current).forEach(sectionId => {
        const element = sectionRefs.current[sectionId];
        if (element) {
          observerRef.current?.observe(element);
        }
      });

      // Nettoyage
      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [plan?.fullContent, activeSection]);

  useEffect(() => {
    // Récupérer les données du plan complet depuis sessionStorage
    const storedPlan = sessionStorage.getItem('completePlan');
    
    if (!storedPlan) {
      // Si aucune donnée n'est trouvée, essayer de récupérer les idées générées
      const storedIdeas = sessionStorage.getItem('generatedIdeas');
      
      if (!storedIdeas) {
        // Si aucune idée n'est trouvée, rediriger vers la page de génération
        router.push('/generate');
        return;
      }
      
      // Construire un plan basique à partir des idées générées
      setPlan({
        name: searchParams.get('idea') || 'Business Idea',
        fullContent: storedIdeas
      });
      setIsLoading(false);
    } else {
      try {
        // Parser le plan stocké
        const parsedPlan = JSON.parse(storedPlan);
        setPlan({
          name: parsedPlan.name || searchParams.get('idea') || "Business Plan",
          fullContent: parsedPlan.fullContent,
          isExample: parsedPlan.isExample,
          isDemo: parsedPlan.isDemo,
          generatedAt: parsedPlan.generatedAt
        });
        
        // Vérifier s'il s'agit d'un plan exemple ou démo
        if (parsedPlan.isExample || parsedPlan.isDemo) {
          console.log("Affichage d'un plan non-standard:", 
            parsedPlan.isExample ? "exemple" : "démo", 
            "généré le", parsedPlan.generatedAt);
        }
        
        // Définir le contenu
        if (parsedPlan.fullContent && parsedPlan.fullContent.trim().length > 0) {
          // Vérifier si le plan contient un avertissement de qualité
          const hasQualityWarning = parsedPlan.fullContent.includes('QUALITY ISSUE DETECTED');
          setHasQualityIssue(hasQualityWarning);
          
          const sections = planSections;
          const planName = parsedPlan.name;
          
          setPlan({
            name: planName || searchParams.get('idea') || "Business Plan",
            fullContent: parsedPlan.fullContent,
            isExample: parsedPlan.isExample,
            isDemo: parsedPlan.isDemo,
            generatedAt: parsedPlan.generatedAt
          });
          
          // Défaut: première section active
          if (sections.length > 0 && !activeSection) {
            setActiveSection(sections[0].id);
          }
        } else {
          console.error("Contenu vide ou invalide:", parsedPlan.fullContent);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du parsing du plan:", error);
        router.push('/generate');
      }
    }
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <LoadingAnimation isVisible={isLoading} />
    );
  }

  if (!plan) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Oups !</h2>
          <p className="mb-6">Une erreur s'est produite lors du chargement de votre plan d'action complet.</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Formatter le contenu du plan en HTML
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // Conserver une copie du contenu original
    let formattedContent = content;
    
    // Ajouter un journal pour le débogage
    console.log("Contenu original de la section:", content.substring(0, 500) + "...");
    
    // Supprimer uniquement les grands titres de sections qui sont maintenant remplacés par nos propres éléments
    formattedContent = formattedContent.replace(/^## \d+\. [^\n]+$/gm, '');
    formattedContent = formattedContent.replace(/^# [^\n]+$/gm, '');
    
    // Transformer les sous-titres en éléments HTML stylisés avec le dégradé "Get a free idea"
    // avec une hauteur de ligne réduite
    formattedContent = formattedContent.replace(/### ([^\n]+)/g, '<h3 className="text-xl font-semibold my-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-secondary leading-tight">$1</h3>');
    
    // Transformer les titres de niveau 2 (qui ne sont pas des titres de section principale)
    // avec une hauteur de ligne réduite
    formattedContent = formattedContent.replace(/## ([^\n]+)/g, '<h3 className="text-lg font-semibold my-2 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-secondary leading-tight">$1</h3>');
    
    // Détecter et formater les tableaux markdown
    formattedContent = formattedContent.replace(/\|([^\n]+)\|\n\|([:\-\s]+)\|\n((?:\|[^\n]+\|\n)+)/g, (match, headers, dividers, rows) => {
      console.log("Tableau détecté:", headers);
      
      const headerCells = headers.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
      const rowsArray = rows.trim().split('\n');
      
      let tableHtml = '<div className="overflow-x-auto my-6"><table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">';
      
      // En-têtes
      tableHtml += '<thead className="bg-gray-50"><tr>';
      headerCells.forEach((cell: string) => {
        tableHtml += `<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${cell.trim()}</th>`;
      });
      tableHtml += '</tr></thead>';
      
      // Corps
      tableHtml += '<tbody className="divide-y divide-gray-200">';
      rowsArray.forEach((row: string) => {
        const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        if (cells.length > 0) {
          tableHtml += '<tr className="hover:bg-gray-50">';
          cells.forEach((cell: string, index: number) => {
            tableHtml += `<td className="px-4 py-3 text-sm${index === 0 ? ' font-medium text-gray-900' : ' text-gray-500'}">${cell.trim()}</td>`;
          });
          tableHtml += '</tr>';
        }
      });
      
      tableHtml += '</tbody></table></div>';
      
      return tableHtml;
    });
    
    // Détecter et formater les CARTES de personas et concurrents
    const personaPattern = /\[CARTE PERSONA [^\]]+\]\s*(Nom:[^\n]+(\n|.)*?)(?=\[CARTE PERSONA|\[CARTE CONCURRENT|$)/gi;
    const competitorPattern = /\[CARTE CONCURRENT [^\]]+\]\s*(Nom:[^\n]+(\n|.)*?)(?=\[CARTE PERSONA|\[CARTE CONCURRENT|$)/gi;
    
    // Formatter les personas
    formattedContent = formattedContent.replace(personaPattern, (match, details) => {
      console.log("Persona détecté:", match.substring(0, 100) + "...");
      
      // Extraire les différentes informations du persona
      const name = details.match(/Nom:\s*([^\n]+)/)?.[1]?.trim() || "Persona";
      const age = details.match(/Âge:\s*([^\n]+)/)?.[1]?.trim() || "";
      const profession = details.match(/Profession:\s*([^\n]+)/)?.[1]?.trim() || "";
      const revenus = details.match(/Revenus:\s*([^\n]+)/)?.[1]?.trim() || "";
      const localisation = details.match(/Localisation:\s*([^\n]+)/)?.[1]?.trim() || "";
      const comportements = details.match(/Comportements en ligne:\s*([^\n]+)/)?.[1]?.trim() || "";
      const frustrations = details.match(/Frustrations principales:\s*([^\n]+)/)?.[1]?.trim() || "";
      const motivations = details.match(/Motivations d'achat:\s*([^\n]+)/)?.[1]?.trim() || "";
      const canaux = details.match(/Canaux préférés:\s*([^\n]+)/)?.[1]?.trim() || "";
      const processus = details.match(/Processus de décision:\s*([^\n]+)/)?.[1]?.trim() || "";
      const budget = details.match(/Budget:\s*([^\n]+)/)?.[1]?.trim() || "";
      
      return `
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold">${name}</h4>
              <div className="text-sm text-gray-500">${age}${profession ? ` • ${profession}` : ''}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h5 className="font-medium text-lg mb-3 text-primary">Profil</h5>
              <ul className="space-y-2">
                ${revenus ? `<li className="flex items-start">
                  <span className="font-medium mr-2">💰 Revenus:</span> ${revenus}
                </li>` : ''}
                ${localisation ? `<li className="flex items-start">
                  <span className="font-medium mr-2">📍 Localisation:</span> ${localisation}
                </li>` : ''}
                ${comportements ? `<li className="flex items-start">
                  <span className="font-medium mr-2">💻 Comportement en ligne:</span> ${comportements}
                </li>` : ''}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-lg mb-3 text-primary">Comportement d'achat</h5>
              <ul className="space-y-2">
                ${budget ? `<li className="flex items-start">
                  <span className="font-medium mr-2">💸 Budget:</span> ${budget}
                </li>` : ''}
                ${canaux ? `<li className="flex items-start">
                  <span className="font-medium mr-2">📱 Canaux préférés:</span> ${canaux}
                </li>` : ''}
                ${processus ? `<li className="flex items-start">
                  <span className="font-medium mr-2">🔄 Processus de décision:</span> ${processus}
                </li>` : ''}
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-lg mb-3 text-red-500">Frustrations</h5>
                <ul className="space-y-2">
                  ${frustrations.split(',').map((item: string) => `
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>${item.trim()}</span>
                  </li>`).join('')}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-lg mb-3 text-green-500">Motivations</h5>
                <ul className="space-y-2">
                  ${motivations.split(',').map((item: string) => `
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>${item.trim()}</span>
                  </li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    // Formatter les concurrents
    formattedContent = formattedContent.replace(competitorPattern, (match, details) => {
      console.log("Concurrent détecté:", match.substring(0, 100) + "...");
      
      // Extraire les différentes informations du concurrent
      const name = details.match(/Nom:\s*([^\n]+)/)?.[1]?.trim() || "Concurrent";
      const marketShare = details.match(/Part de marché:\s*([^\n]+)/)?.[1]?.trim() || "";
      const forces = details.match(/Forces:\s*([^\n]+)/)?.[1]?.trim() || "";
      const faiblesses = details.match(/Faiblesses:\s*([^\n]+)/)?.[1]?.trim() || "";
      const strategie = details.match(/Stratégie de prix:\s*([^\n]+)/)?.[1]?.trim() || "";
      const differentiation = details.match(/Élément différenciateur:\s*([^\n]+)/)?.[1]?.trim() || "";
      const canaux = details.match(/Canaux de distribution:\s*([^\n]+)/)?.[1]?.trim() || "";

      // Structure inspirée des cartes statiques Amazon/eBay
      return `
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col mb-6">
          ${marketShare ? `<div className="mb-1 text-sm text-gray-500">Part de marché: ${marketShare}</div>` : '<div class="mb-1 text-sm text-gray-500">Concurrent</div>'}
          <h4 className="text-3xl font-bold mb-3">${name}</h4>
          <div className="border-t border-gray-100 my-3 w-full"></div>

          <div className="space-y-4 flex-grow">
            ${strategie ? `<div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${OptiiflowStyle.colors.primary}" className="h-5 w-5">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Positionnement prix</p>
                <p className="text-sm text-gray-500">${strategie}</p>
              </div>
            </div>` : ''}

            ${differentiation ? `<div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${OptiiflowStyle.colors.primary}" className="h-5 w-5">
                   <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Proposition de valeur</p>
                <p className="text-sm text-gray-500">${differentiation}</p>
              </div>
            </div>` : ''}
          </div>

          ${(forces || faiblesses) ? '<div className="border-t border-gray-100 my-3 w-full"></div>' : ''}

          ${forces ? `<div>
            <p className="font-medium text-sm mb-2">Forces</p>
            <ul className="space-y-2">
              ${forces.split(',').map((item: string) => `
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 flex-shrink-0 mr-2">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                <span className="text-sm">${item.trim()}</span>
              </li>`).join('')}
            </ul>
          </div>` : ''}

          ${faiblesses ? `<div className="mt-3">
            <p className="font-medium text-sm mb-2">Faiblesses</p>
            <ul className="space-y-2">
              ${faiblesses.split(',').map((item: string) => `
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-500 flex-shrink-0 mr-2">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">${item.trim()}</span>
              </li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      `;
    });
    
    // Appliquer la conversion Markdown à HTML sur le contenu restant
    // Cela convertira les listes à puce, les liens, les paragraphes, etc.
    try {
      // Créer un paragraphe vide pour éviter que marked ne convertisse tout le contenu en un seul paragraphe
      formattedContent = formattedContent.replace(/\n\n/g, "\n\n<div></div>\n\n");
      
      // Préserver les tableaux déjà formatés en HTML
      const htmlTables: string[] = [];
      formattedContent = formattedContent.replace(/<div className="overflow-x-auto[\s\S]*?<\/table><\/div>/g, (match) => {
        const index = htmlTables.length;
        htmlTables.push(match);
        return `__TABLE_PLACEHOLDER_${index}__`;
      });
      
      // Préserver les cartes personas déjà formatées en HTML
      const personaCards: string[] = [];
      formattedContent = formattedContent.replace(/<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, (match) => {
        const index = personaCards.length;
        personaCards.push(match);
        return `__PERSONA_PLACEHOLDER_${index}__`;
      });
      
      // Préserver les cartes de concurrents déjà formatées en HTML
      const competitorCards: string[] = [];
      formattedContent = formattedContent.replace(/<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col mb-6">[\s\S]*?<\/div>/g, (match) => {
        const index = competitorCards.length;
        competitorCards.push(match);
        return `__COMPETITOR_PLACEHOLDER_${index}__`;
      });
      
      // Préserver les titres HTML déjà formatés
      const htmlHeadings: string[] = [];
      formattedContent = formattedContent.replace(/<h3 className="text-.*?<\/h3>/g, (match) => {
        const index = htmlHeadings.length;
        htmlHeadings.push(match);
        return `__HEADING_PLACEHOLDER_${index}__`;
      });
      
      // Convertir le Markdown en HTML (avec la bonne gestion du type)
      const htmlContent: string = marked.parse(formattedContent) as string;
      formattedContent = htmlContent;
      
      // Restaurer les éléments HTML préservés
      htmlTables.forEach((table, index) => {
        formattedContent = formattedContent.replace(`<p>__TABLE_PLACEHOLDER_${index}__</p>`, table);
      });
      
      personaCards.forEach((card, index) => {
        formattedContent = formattedContent.replace(`<p>__PERSONA_PLACEHOLDER_${index}__</p>`, card);
      });
      
      competitorCards.forEach((card, index) => {
        formattedContent = formattedContent.replace(`<p>__COMPETITOR_PLACEHOLDER_${index}__</p>`, card);
      });
      
      htmlHeadings.forEach((heading, index) => {
        formattedContent = formattedContent.replace(`<p>__HEADING_PLACEHOLDER_${index}__</p>`, heading);
      });
      
      // Ajouter des classes Tailwind aux listes
      formattedContent = formattedContent.replace(/<ul>/g, '<ul class="list-disc pl-5 my-4 space-y-2">');
      formattedContent = formattedContent.replace(/<ol>/g, '<ol class="list-decimal pl-5 my-4 space-y-2">');
      formattedContent = formattedContent.replace(/<li>/g, '<li class="ml-2">');
      
      // Ajouter des classes aux tableaux générés par marked
      formattedContent = formattedContent.replace(/<table>/g, '<table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm my-4">');
      formattedContent = formattedContent.replace(/<thead>/g, '<thead class="bg-gray-50">');
      formattedContent = formattedContent.replace(/<th>/g, '<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">');
      formattedContent = formattedContent.replace(/<tbody>/g, '<tbody class="divide-y divide-gray-200">');
      formattedContent = formattedContent.replace(/<tr>/g, '<tr class="hover:bg-gray-50">');
      formattedContent = formattedContent.replace(/<td>/g, '<td class="px-4 py-3 text-sm text-gray-500">');
      
      // Ajouter des classes aux paragraphes
      formattedContent = formattedContent.replace(/<p>/g, '<p class="my-3">');
      
      // Ajouter des classes aux séparateurs horizontaux
      formattedContent = formattedContent.replace(/<hr>/g, '<hr class="my-6 border-t border-gray-200">');
      
      console.log("Contenu formaté (premiers 500 caractères):", formattedContent.substring(0, 500) + "...");
    } catch (error) {
      console.error("Erreur lors de la conversion Markdown:", error);
    }
    
    return formattedContent;
  };

  // Extraire les sections du contenu complet
  const extractSection = (content: string, sectionId: string): string => {
    if (!content) return "Section not found.";
    
    // Logging pour le débogage
    console.log(`Extraction de la section '${sectionId}'...`);
    
    try {
      // Mapping de l'ID de section vers les titres possibles dans le contenu
      const sectionTitles: Record<string, string[]> = {
        'executive-summary': ['Résumé exécutif', 'Executive Summary', '1\\. Executive Summary', 'RÉSUMÉ EXÉCUTIF'],
        'market-analysis': ['Analyse de marché et positionnement', 'Market Analysis and Positioning', '2\\. Market Analysis', 'ANALYSE DE MARCHÉ', 'MARKET ANALYSIS'],
        'concept': ['Concept et proposition de valeur', 'Concept and Value Proposition', '3\\. Concept', 'CONCEPT ET PROPOSITION'],
        'customer-profile': ['Profil client', 'Client Profile', 'Customer Profile', '4\\. Client Profile', 'CLIENT PROFILE', 'CUSTOMER PROFILE', 'PROFIL CLIENT'],
        'business-model': ['Modèle économique', 'Business Model', 'Economic Model', '5\\. Business Model', 'MODÈLE ÉCONOMIQUE', 'BUSINESS MODEL'],
        'marketing': ['Stratégie marketing et acquisition', 'Marketing Strategy', '6\\. Marketing', 'MARKETING STRATEGY', 'STRATÉGIE MARKETING'],
        'roadmap': ['Feuille de route opérationnelle', 'Operational Roadmap', '7\\. Operational Roadmap', 'ROADMAP', 'FEUILLE DE ROUTE'],
        'toolkit': ['Boîte à outils', 'Toolkit', '8\\. Toolkit', 'RECOMMENDED TOOLS', 'BOÎTE À OUTILS']
      };

      // MÉTHODE 1: Recherche par pattern exact avec ## et vérifie jusqu'à la prochaine section
      const extractByHeading = () => {
        // Créer un pattern pour tous les headings possibles de sections
        const allSectionHeadings = Object.values(sectionTitles).flat()
          .map(title => `##\\s*${title.replace(/\\/g, '\\\\')}`)
          .join('|');
        
        // Créer le pattern regex pour la section actuelle
        const currentSectionPattern = sectionTitles[sectionId]
          .map(title => `##\\s*${title.replace(/\\/g, '\\\\')}`)
          .join('|');
        
        // Regex pour trouver la section et son contenu
        const regex = new RegExp(`(${currentSectionPattern})([\\s\\S]*?)(?=(${allSectionHeadings})|$)`, 'i');
      const match = content.match(regex);
        
        if (match && match[2] && match[2].trim().length > 50) {
          console.log(`Section '${sectionId}' extraite avec la méthode 1 (pattern exact avec ##)`);
          return match[2].trim();
        }
        return null;
      };

      // MÉTHODE 2: Recherche par indices de sections
      const extractByIndices = () => {
        // Obtenir tous les titres de section dans le contenu
        const sectionMatches: { id: string, index: number, title: string }[] = [];
        
        // Rechercher tous les titres de section
        Object.entries(sectionTitles).forEach(([id, titles]) => {
          titles.forEach(title => {
            const titlePattern = new RegExp(`##\\s*${title.replace(/\\/g, '\\\\')}`, 'i');
            const match = content.match(titlePattern);
            if (match && match.index !== undefined) {
              sectionMatches.push({ id, index: match.index, title: match[0] });
            }
          });
        });
        
        // Trier par position dans le document
        sectionMatches.sort((a, b) => a.index - b.index);
        
        // Trouver l'index de la section courante
        const currentSectionIndex = sectionMatches.findIndex(match => match.id === sectionId);
        
        if (currentSectionIndex !== -1) {
          const currentSection = sectionMatches[currentSectionIndex];
          const nextSection = sectionMatches[currentSectionIndex + 1];
          
          const startIndex = currentSection.index + currentSection.title.length;
          const endIndex = nextSection ? nextSection.index : content.length;
          
          const sectionContent = content.substring(startIndex, endIndex).trim();
          
          if (sectionContent.length > 50) {
            console.log(`Section '${sectionId}' extraite avec la méthode 2 (indices de section)`);
            return sectionContent;
          }
        }
        return null;
      };

      // MÉTHODE 3: Recherche par mots-clés spécifiques à chaque section
      const extractByKeywords = () => {
        const keywordMap: Record<string, string[]> = {
          'executive-summary': ['résumé', 'summary', 'overview', 'mission', 'vision', 'objectifs'],
          'market-analysis': ['market', 'marché', 'competitors', 'concurrents', 'analysis', 'analyse', 'industry', 'industrie'],
          'concept': ['concept', 'value proposition', 'proposition de valeur', 'solution', 'produit', 'service'],
          'customer-profile': ['customer', 'client', 'target', 'cible', 'persona', 'segment', 'demographics', 'psychographics'],
          'business-model': ['revenue', 'revenu', 'cost', 'coût', 'pricing', 'prix', 'business model', 'modèle économique', 'profit'],
          'marketing': ['marketing', 'acquisition', 'promotion', 'channels', 'canaux', 'advertising', 'publicité'],
          'roadmap': ['roadmap', 'feuille de route', 'timeline', 'chronologie', 'milestones', 'étapes', 'implementation'],
          'toolkit': ['tools', 'outils', 'software', 'logiciels', 'resources', 'ressources', 'technology', 'technologie']
        };
        
        const keywords = keywordMap[sectionId] || [];
        if (keywords.length === 0) return null;
        
        // Diviser le contenu en paragraphes
        const paragraphs = content.split('\n\n');
        
        // Trouver les paragraphes contenant au moins deux mots-clés
        const relevantParagraphs = paragraphs.filter(para => {
          const paraLower = para.toLowerCase();
          let keywordCount = 0;
          
          for (const keyword of keywords) {
            if (paraLower.includes(keyword.toLowerCase())) {
              keywordCount++;
              // Si on a déjà trouvé deux mots-clés, on arrête de chercher
              if (keywordCount >= 2) break;
            }
          }
          
          return keywordCount >= 2;
        });
        
        if (relevantParagraphs.length > 0) {
          // Vérifier si ces paragraphes sont contigus ou proches
          let result = '';
          let currentGroup = [];
          
          for (let i = 0; i < paragraphs.length; i++) {
            const para = paragraphs[i];
            
            if (relevantParagraphs.includes(para)) {
              currentGroup.push(para);
            } else if (currentGroup.length > 0) {
              // Si on a déjà commencé un groupe, compter le nombre de paragraphes non pertinents
              let nonRelevantCount = 0;
              
              // Chercher si un autre paragraphe pertinent est proche
              for (let j = i; j < Math.min(i + 5, paragraphs.length); j++) {
                if (relevantParagraphs.includes(paragraphs[j])) {
                  // On a trouvé un autre paragraphe pertinent à moins de 5 paragraphes
                  // Ajouter les paragraphes intermédiaires au groupe
                  currentGroup.push(...paragraphs.slice(i, j));
                  i = j; // Avancer l'index
                  break;
                }
                nonRelevantCount++;
              }
              
              // Si on a traversé 5 paragraphes sans en trouver de pertinents, terminer le groupe
              if (nonRelevantCount >= 5) {
                if (currentGroup.length >= 3) { // Au moins 3 paragraphes pour être significatif
                  result += currentGroup.join('\n\n') + '\n\n';
                }
                currentGroup = [];
              }
            }
          }
          
          // Ajouter le dernier groupe s'il est significatif
          if (currentGroup.length >= 3) {
            result += currentGroup.join('\n\n');
          }
          
          if (result.length > 100) {
            console.log(`Section '${sectionId}' extraite avec la méthode 3 (mots-clés)`);
            return result.trim();
          }
          
          // Si on n'a pas pu grouper correctement, prendre tous les paragraphes pertinents
          if (relevantParagraphs.join('\n\n').length > 100) {
            console.log(`Section '${sectionId}' extraite avec la méthode 3 (paragraphes non contigus)`);
            return relevantParagraphs.join('\n\n');
          }
        }
        return null;
      };

      // MÉTHODE 4: Stratégies spécifiques pour sections problématiques
      const extractBySpecialStrategy = () => {
        // Pour le profil client, rechercher entre concept et business model
        if (sectionId === 'customer-profile') {
          const conceptPattern = new RegExp(`##\\s*(${sectionTitles['concept'].join('|')})`, 'i');
          const businessModelPattern = new RegExp(`##\\s*(${sectionTitles['business-model'].join('|')})`, 'i');
          
          const conceptMatch = content.match(conceptPattern);
          const businessModelMatch = content.match(businessModelPattern);
          
          if (conceptMatch && businessModelMatch && 
              conceptMatch.index !== undefined && 
              businessModelMatch.index !== undefined && 
              conceptMatch.index < businessModelMatch.index) {
            
            // Trouver une position approximative pour le profil client
            const conceptEnd = conceptMatch.index + conceptMatch[0].length + 1000; // ~1000 caractères pour la section concept
            const businessModelStart = businessModelMatch.index;
            
            if (conceptEnd < businessModelStart) {
              const profileContent = content.substring(conceptEnd, businessModelStart);
              
              if (profileContent.length > 200) {
                console.log(`Section '${sectionId}' extraite avec la méthode 4 (position entre sections)`);
                return profileContent.trim();
              }
            }
          }
          
          // Rechercher les mots-clés spécifiques aux personas
          const personaKeywords = ['persona', 'profil', 'client', 'target', 'audience', 'customer segment', 'demography'];
          const matchingParagraphs = [];
          
          for (const keyword of personaKeywords) {
            const regex = new RegExp(`[^\\n]*${keyword}[^\\n]*`, 'gi');
            const matches = content.match(regex);
            
            if (matches) {
              matchingParagraphs.push(...matches);
            }
          }
          
          if (matchingParagraphs.length > 0) {
            // Prendre 500 caractères avant et après la première et dernière correspondance
            const startIndex = content.indexOf(matchingParagraphs[0]) - 500;
            const endIndex = content.indexOf(matchingParagraphs[matchingParagraphs.length - 1]) + 
                            matchingParagraphs[matchingParagraphs.length - 1].length + 500;
            
            const profileContent = content.substring(Math.max(0, startIndex), Math.min(content.length, endIndex));
            
            if (profileContent.length > 200) {
              console.log(`Section '${sectionId}' extraite avec la méthode 4 (mots-clés persona)`);
              return profileContent.trim();
            }
          }
        }
        
        // Pour le business model, rechercher entre profil client et marketing
        else if (sectionId === 'business-model') {
          const profilePattern = new RegExp(`##\\s*(${sectionTitles['customer-profile'].join('|')})`, 'i');
          const marketingPattern = new RegExp(`##\\s*(${sectionTitles['marketing'].join('|')})`, 'i');
          
          const profileMatch = content.match(profilePattern);
          const marketingMatch = content.match(marketingPattern);
          
          if (profileMatch && marketingMatch && 
              profileMatch.index !== undefined && 
              marketingMatch.index !== undefined && 
              profileMatch.index < marketingMatch.index) {
            
            // Trouver une position approximative pour le business model
            const profileEnd = profileMatch.index + profileMatch[0].length + 1000; // ~1000 caractères pour la section client
            const marketingStart = marketingMatch.index;
            
            if (profileEnd < marketingStart) {
              const businessModelContent = content.substring(profileEnd, marketingStart);
              
              if (businessModelContent.length > 200) {
                console.log(`Section '${sectionId}' extraite avec la méthode 4 (position entre sections)`);
                return businessModelContent.trim();
              }
            }
          }
          
          // Rechercher les mots-clés spécifiques au business model
          const businessKeywords = ['revenue', 'pricing', 'business model', 'cost', 'monetization', 'financial'];
          const matchingParagraphs = [];
          
          for (const keyword of businessKeywords) {
            const regex = new RegExp(`[^\\n]*${keyword}[^\\n]*`, 'gi');
            const matches = content.match(regex);
            
            if (matches) {
              matchingParagraphs.push(...matches);
            }
          }
          
          if (matchingParagraphs.length > 0) {
            // Prendre 500 caractères avant et après la première et dernière correspondance
            const startIndex = content.indexOf(matchingParagraphs[0]) - 500;
            const endIndex = content.indexOf(matchingParagraphs[matchingParagraphs.length - 1]) + 
                            matchingParagraphs[matchingParagraphs.length - 1].length + 500;
            
            const businessContent = content.substring(Math.max(0, startIndex), Math.min(content.length, endIndex));
            
            if (businessContent.length > 200) {
              console.log(`Section '${sectionId}' extraite avec la méthode 4 (mots-clés business)`);
              return businessContent.trim();
            }
          }
        }
        
        // Pour la boîte à outils, rechercher à la fin du document
        else if (sectionId === 'toolkit') {
          // La boîte à outils est généralement la dernière section
          const toolkitPatterns = sectionTitles['toolkit'].map(title => 
            new RegExp(`##\\s*${title.replace(/\\/g, '\\\\')}`, 'i'));
          
          for (const pattern of toolkitPatterns) {
            const match = content.match(pattern);
            
            if (match && match.index !== undefined) {
              const toolkitContent = content.substring(match.index + match[0].length);
              
              if (toolkitContent.length > 200) {
                console.log(`Section '${sectionId}' extraite avec la méthode 4 (dernière section)`);
                return toolkitContent.trim();
              }
            }
          }
          
          // Si on ne trouve pas la section, prendre les derniers 2000 caractères
          if (content.length > 2000) {
            const toolkitContent = content.substring(content.length - 2000);
            console.log(`Section '${sectionId}' extraite avec la méthode 4 (derniers caractères)`);
            return toolkitContent.trim();
          }
        }
        
        return null;
      };

      // MÉTHODE 5: Dernier recours - recherche par position relative dans le document
      const extractByPosition = () => {
        // Positions relatives approximatives des sections dans le document
        const sectionPositions: Record<string, [number, number]> = {
          'executive-summary': [0, 0.15],     // 0% à 15% du document
          'market-analysis': [0.15, 0.3],     // 15% à 30% du document
          'concept': [0.3, 0.4],              // 30% à 40% du document
          'customer-profile': [0.4, 0.5],     // 40% à 50% du document
          'business-model': [0.5, 0.6],       // 50% à 60% du document
          'marketing': [0.6, 0.7],            // 60% à 70% du document
          'roadmap': [0.7, 0.85],             // 70% à 85% du document
          'toolkit': [0.85, 1]                // 85% à 100% du document
        };
        
        const [startPercent, endPercent] = sectionPositions[sectionId] || [0, 0];
        
        if (startPercent === 0 && endPercent === 0) return null;
        
        const startIndex = Math.floor(content.length * startPercent);
        const endIndex = Math.floor(content.length * endPercent);
        
        const sectionContent = content.substring(startIndex, endIndex);
        
        if (sectionContent.length > 200) {
          console.log(`Section '${sectionId}' extraite avec la méthode 5 (position relative)`);
          return sectionContent.trim();
        }
        
        return null;
      };

      // Essayer toutes les méthodes dans l'ordre
      const methods = [
        extractByHeading,
        extractByIndices,
        extractByKeywords,
        extractBySpecialStrategy,
        extractByPosition
      ];

      for (const method of methods) {
        const result = method();
        if (result) return result;
      }

      // Si aucune méthode n'a fonctionné
      console.log(`Échec de l'extraction de la section '${sectionId}'`);
      return `Section "${sectionTitles[sectionId]?.[0] || sectionId}" not found in the generated plan. Please try regenerating the plan.`;
      
    } catch (error) {
      console.error(`Erreur lors de l'extraction de la section '${sectionId}':`, error);
      return `Error extracting section "${sectionId}". Please try regenerating the plan or contact support.`;
    }
  };

  // Télécharger le PDF
  const handleDownloadPDF = () => {
    if (targetRef.current) {
      toPDF();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-3xl font-bold text-primary text-center">
          {plan.name}
        </h1>
      </div>
      
      {/* Indicateur de mode démo ou exemple */}
      {(plan.isDemo || plan.isExample) && (
        <div className={`mb-6 p-4 rounded-lg ${plan.isDemo ? 'bg-blue-50' : 'bg-amber-50'}`}>
          <p className={`font-medium ${plan.isDemo ? 'text-blue-600' : 'text-amber-600'}`}>
            {plan.isDemo && plan.isExample && '⚠️ Plan d\'exemple généré en mode démo'}
            {plan.isDemo && !plan.isExample && '🔍 Plan généré en mode démo'}
            {!plan.isDemo && plan.isExample && '⚠️ Plan d\'exemple (l\'API n\'a pas pu générer un plan personnalisé)'}
          </p>
          {plan.generatedAt && (
            <p className="text-sm text-gray-500 mt-1">
              Généré le {new Date(plan.generatedAt).toLocaleString('fr-FR')}
            </p>
          )}
        </div>
      )}
      
      {hasQualityIssue && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Problem Detected in Generated Plan</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>We detected that the AI mistakenly focused on the wrong country in parts of this plan. We're working to fix this issue.</p>
                <p className="mt-1">You may want to try generating a new plan or edit this one to correct country-specific information.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de navigation */}
        <div className="md:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">Table des matières</h3>
            <nav className="space-y-1 mb-4">
              {planSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke={activeSection === section.id ? OptiiflowStyle.colors.primary : 'currentColor'}
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                  </svg>
                  <span className="text-sm">{section.title}</span>
                </button>
              ))}
            </nav>
            <Button onClick={handleDownloadPDF} className="w-full">
              Télécharger en PDF
            </Button>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          {/* Contenu à exporter en PDF */}
          <div ref={targetRef} className="bg-white p-8 rounded-lg shadow-md">
            <div className="pdf-content">
              {/* Header du PDF avec le logo (pour le PDF uniquement) */}
              <div className="pdf-header mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-primary">Plan d'action complet</h1>
                  <h2 className="text-xl">{plan?.name || ''}</h2>
                </div>
                <div className="text-gray-500 text-sm">
                  Généré le {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              {/* Exemple statique d'une carte de concurrent - SUPPRIMÉ */}
              {/* 
              <div className="mb-8">
                <h3 className="text-xl font-semibold my-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-secondary leading-tight">
                  Analyse des concurrents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
                   Carte Amazon... 
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col">
                     ... Contenu Amazon ... 
                  </div>
                  
                   Carte eBay... 
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col">
                     ... Contenu eBay ... 
                  </div>
                </div>
              </div>
               */}
              
              {/* Afficher toutes les sections avec des ancres */}
              {plan?.fullContent && (
                <div>
                  {planSections.map((section) => (
                    <div 
                      key={section.id}
                      className="mb-14"
                    >
                      {/* Ancre positionnée avant le titre avec ID pour l'observation */}
                      <div 
                        id={section.id} 
                        ref={(el: HTMLDivElement | null) => { sectionRefs.current[section.id] = el; }} 
                        className="relative -top-16 scroll-mt-16"
                      ></div>
                      
                      <div className="flex items-center py-2 mb-6">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8 mr-3 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke={OptiiflowStyle.colors.primary}
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                        </svg>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary-light to-primary leading-none">
                          {section.title}
                        </h2>
                      </div>
                      
                      <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                          __html: formatContent(
                            plan.fullContent ? extractSection(plan.fullContent, section.id) : ''
                          ) 
                        }} />
                      </div>
                    </div>
                  ))}
                  
                  {/* Définir les gradients pour être utilisés dans les SVG */}
                  <svg width="0" height="0" className="hidden">
                    <defs>
                      <linearGradient id="heading-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={OptiiflowStyle.colors.primary} />
                        <stop offset="100%" stopColor={OptiiflowStyle.colors.primary} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
              
              {/* Footer du PDF avec note de confidentialité et page number */}
              <div className="pdf-footer mt-12 pt-6 border-t text-center text-sm text-gray-500">
                <p>Document confidentiel - {plan?.name || ''} - {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-lg mb-4">Prêt à commencer votre aventure entrepreneuriale?</p>
        <Link href="/">
          <Button variant="secondary">
            Générer une nouvelle idée
          </Button>
        </Link>
      </div>
      
      {/* Styles spécifiques pour le PDF */}
      <style jsx global>{`
        @media print {
          .page-break-before {
            page-break-before: always;
          }
          
          .pdf-content {
            font-family: 'Plus Jakarta Sans', 'Arial', sans-serif;
          }
          
          .pdf-header, .pdf-footer {
            display: block !important;
          }
        }
        
        /* Cacher header/footer pour l'affichage écran */
        .pdf-header, .pdf-footer {
          display: none;
        }
      `}</style>
    </div>
  );
} 