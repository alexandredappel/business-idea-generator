'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LoadingAnimation from '@/components/LoadingAnimation';

interface IdeaData {
  name: string;
  concept: string;
  targetMarket: string;
  uniqueValue: string;
  revenueModel: string;
  initialInvestment: string;
  challenges: string;
  growthStrategy: string;
  fullContent?: string; // To store the full content of a specific idea
  painPoint: string; // Field for the pain point (problem to solve)
  shortSummary?: string; // Short summary of the idea in 12 words maximum
}

// Global style inspired by Optiiflow
const OptiiflowStyle = {
  colors: {
    primary: '#624CF5', // Main Optiiflow purple
    secondary: '#42C9E5', // Light blue
    accent: '#FF7A50', // Accent orange
    darkBlue: '#2E3146', // Dark blue for text
    lightGray: '#F7F8FA', // Light gray for background
    gray: '#E5E7EB', // Gray for borders
  },
  gradients: {
    primary: 'linear-gradient(135deg, #624CF5 0%, #8E74FF 100%)',
    secondary: 'linear-gradient(135deg, #42C9E5 0%, #32D4C0 100%)',
    accent: 'linear-gradient(135deg, #FF7A50 0%, #FFA477 100%)',
  }
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [parsedIdea, setParsedIdea] = useState<IdeaData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  // Récupérer les paramètres de l'URL
  const industry = searchParams.get('industry');
  const country = searchParams.get('country');
  const budget = searchParams.get('budget');

  useEffect(() => {
    // Vérifier que nous avons les paramètres requis
    if (!industry || !country || !budget) {
      router.push('/generate');
      return;
    }

    // Récupérer les idées générées depuis sessionStorage
    const storedIdeas = sessionStorage.getItem('generatedIdeas');
    
    if (!storedIdeas) {
      // Si aucune idée n'est trouvée, rediriger vers la page de génération
      setIsLoading(false);
      setParseError("Aucune idée générée. Veuillez réessayer.");
      return;
    }

    try {
      // Définir le contenu brut
      setGeneratedContent(storedIdeas);
      
      // Essayer de parser une idée depuis le texte généré
      const extractedIdea = extractBusinessIdea(storedIdeas);
      setParsedIdea(extractedIdea);
      
      // Vérifier si l'utilisateur a déjà payé pour le plan complet
      const storedPlan = sessionStorage.getItem('completePlan');
      if (storedPlan) {
        setHasPaid(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du parsing des idées:", error);
      setParseError("Erreur lors de l'analyse des idées générées. Veuillez réessayer.");
      setIsLoading(false);
    }
  }, [industry, country, budget, router]);

  // Function to extract the first business idea from the generated text
  const extractBusinessIdea = (text: string): IdeaData => {
    // Clean the text to remove escape characters and format line breaks
    const cleanText = text.replace(/\\n/g, '\n').replace(/\*\*/g, '');
    
    // Check if we're dealing with the new format (single idea with pain point)
    const hasPainPointSection = cleanText.includes("Pain Point Identified") || 
                               cleanText.includes("## Pain Point");
    const hasTargetAudienceSection = cleanText.includes("Target Audience") || 
                                    cleanText.includes("## Target Audience");
    const hasConceptSummarySection = cleanText.includes("Concept Summary") || 
                                    cleanText.includes("## Concept Summary");
    
    // If we detect the new format
    if (hasPainPointSection && hasTargetAudienceSection && hasConceptSummarySection) {
      console.log("Détection du nouveau format de prompt");
      
      // Initialize variables
      let name = "";
      let concept = "";
      
      // Extract company name from the title
      const titleMatch = cleanText.match(/# .* Opportunity: ([^-\n]+)(?:\s*-\s*(.+))?/);
      if (titleMatch) {
        name = titleMatch[1].trim().replace(/\[|\]/g, '');
        
        // If name appears to be a placeholder, we'll extract it from the text later
        if (name.includes("COMPANY NAME") || name.length < 3) {
          name = "";
        }
        
        if (titleMatch[2]) {
          concept = titleMatch[2].trim().replace(/\[|\]/g, '');
        }
      }
      
      console.log("Nom extrait du titre:", name);
      
      // Extract all sections without truncating
      const extractedSections = {
        painPoint: extractFullSectionContent(cleanText, "Pain Point Identified", "Target Audience") ||
                  extractFullSectionContent(cleanText, "## Pain Point", "## Target"),
        
        targetMarket: extractFullSectionContent(cleanText, "Target Audience", "Concept Summary") ||
                     extractFullSectionContent(cleanText, "## Target Audience", "## Concept"),
        
        conceptSummary: extractFullSectionContent(cleanText, "Concept Summary", "Unique Value Proposition") ||
                       extractFullSectionContent(cleanText, "## Concept Summary", "## Unique Value"),
        
        uniqueValue: extractFullSectionContent(cleanText, "Unique Value Proposition", "Revenue Model") ||
                    extractFullSectionContent(cleanText, "## Unique Value", "## Revenue"),
        
        revenueModel: extractFullSectionContent(cleanText, "Revenue Model & Distribution", "") ||
                     extractFullSectionContent(cleanText, "## Revenue Model", "")
      };
      
      // Clean sections to remove markdown and placeholders
      const cleanedSections = {
        painPoint: cleanMarkdownAndPlaceholders(extractedSections.painPoint),
        targetMarket: cleanMarkdownAndPlaceholders(extractedSections.targetMarket),
        conceptSummary: cleanMarkdownAndPlaceholders(extractedSections.conceptSummary),
        uniqueValue: cleanMarkdownAndPlaceholders(extractedSections.uniqueValue),
        revenueModel: cleanMarkdownAndPlaceholders(extractedSections.revenueModel)
      };
      
      // If name is still empty, try to extract it from the concept summary
      if (!name && extractedSections.conceptSummary) {
        // Look for capitalized words that might be business names
        const potentialNames = extractedSections.conceptSummary.match(/\b([A-Z][a-zA-Z]+(?:Hub|Tech|App|Connect|Go|Now|Wise|Box|Flex|Plus|Pro|Smart|Link|Care|Mind|Eco|Pay|Health|Learn|Work|Life|Shop|Track|View|Fit|Solutions?|Technologies?|Systems?|Network|Group|Labs?))\b/g);
        
        if (potentialNames && potentialNames.length > 0) {
          // Filter out common words that might be capitalized but aren't business names
          const filteredNames = potentialNames.filter(word => 
            !['The', 'This', 'Our', 'These', 'Those', 'It', 'Its', 'Their', 'They', 
              'We', 'Target', 'Audience', 'Pain', 'Point', 'Concept', 'Summary', 
              'Value', 'Proposition', 'Revenue', 'Model', 'Identified', 'Unique'].includes(word)
          );
          
          if (filteredNames.length > 0) {
            name = filteredNames[0];
            console.log("Nom extrait du contenu:", name);
          }
        }
      }
      
      // If still no name, create one based on the industry or key concepts
      if (!name) {
        // Extract possible keywords from the industry or concept
        const keywords = (cleanText.match(/\b(Tech|App|Digital|Online|Mobile|Smart|Eco|Health|Green|Learning|Virtual|Cloud|IoT|AI|Analytics|Platform|Market|Shop|Connect)\b/g) || []);
        
        // Create a name from keywords or default to a generic name
        if (keywords.length >= 2) {
          name = keywords[0] + keywords[1];
          console.log("Nom créé à partir de mots-clés:", name);
        } else if (keywords.length === 1) {
          name = keywords[0] + "Hub";
          console.log("Nom créé à partir d'un mot-clé:", name);
        } else {
          name = "InnovaConnect";
          console.log("Utilisation du nom par défaut");
        }
      }
      
      // Create summary from the concept (non-truncated)
      const shortSummary = extractedSections.conceptSummary 
        ? cleanedSections.conceptSummary.split('.')[0] + '.'
        : "An innovative solution to a concrete problem.";
      
      return {
        name: name,
        concept: cleanedSections.conceptSummary || "See full details below.",
        targetMarket: cleanedSections.targetMarket || "See full details below.",
        uniqueValue: cleanedSections.uniqueValue || "See full details below.",
        revenueModel: cleanedSections.revenueModel || "See full details below.",
        initialInvestment: "See full details below.", // Not present in new format
        challenges: "See full details below.", // Not present in new format
        growthStrategy: "See full details below.", // Not present in new format
        fullContent: cleanText,
        painPoint: cleanedSections.painPoint || "Users face a specific problem that this solution efficiently solves.",
        shortSummary: shortSummary
      };
    }
    
    // Original format processing (for backward compatibility)
    // Split the text into sections to identify ideas
    const sections = cleanText.split(/Idea \d+:|Idea \d+\s*:/).filter(Boolean);
    
    // If there are no identifiable sections, return a generic object
    if (sections.length <= 1) {
      return {
        name: "InnovaSolution",
        concept: cleanText.substring(0, 300) + "...",
        targetMarket: "See full details below.",
        uniqueValue: "See full details below.",
        revenueModel: "See full details below.",
        initialInvestment: "See full details below.",
        challenges: "See full details below.",
        growthStrategy: "See full details below.",
        fullContent: cleanText,
        painPoint: "Users face a specific problem that this solution efficiently solves.",
        shortSummary: "An innovative solution to a concrete problem."
      };
    }
    
    // Take the first idea (after the general introduction)
    const ideaContent = sections[1]; // The first section is usually the intro
    
    // Extract specific information from this idea
    const lines = ideaContent.split('\n');
    let name = "";
    let concept = "";
    let targetMarket = "";
    let uniqueValue = "";
    let revenueModel = "";
    let initialInvestment = "";
    let challenges = "";
    let growthStrategy = "";
    let painPoint = "";
    let shortSummary = "";
    
    // Look for the company name
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Find name and concept of the company
      if (line.includes("Company name") || line.includes("main concept")) {
        const matchResult = line.match(/.*?:\s*(.*?)(?:\s*-\s*|\s*:\s*)(.*)/);
        if (matchResult && matchResult.length >= 3) {
          name = matchResult[1].trim();
          concept = matchResult[2].trim();
        } else if (line.includes(":")) {
          const parts = line.split(":");
          name = parts[1].trim().split("-")[0].trim();
          concept = parts.length > 1 ? parts.slice(1).join(":").split("-").slice(1).join("-").trim() : "";
        }
        
        // If we've only found the name, look for the concept in the next line
        if (name && !concept && i + 1 < lines.length) {
          concept = lines[i + 1].trim();
        }
      }
      
      // Look for other information
      if (line.toLowerCase().includes("target audience") || line.toLowerCase().includes("market size")) {
        targetMarket = extractInfoAfterLine(lines, i);
      }
      else if (line.toLowerCase().includes("unique value") || line.toLowerCase().includes("proposition")) {
        uniqueValue = extractInfoAfterLine(lines, i);
      }
      else if (line.toLowerCase().includes("revenue model") || line.toLowerCase().includes("distribution channels")) {
        revenueModel = extractInfoAfterLine(lines, i);
      }
      else if (line.toLowerCase().includes("initial investment")) {
        initialInvestment = extractInfoAfterLine(lines, i);
        
        // Try to capture points with an asterisk or totals
        let investmentDetails = "";
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].trim().includes("Total:") || lines[j].includes("$")) {
            investmentDetails += lines[j].trim() + "\n";
          }
          if (lines[j].trim().startsWith("*") || lines[j].trim().includes("Total")) {
            investmentDetails += lines[j].trim() + "\n";
          }
        }
        if (investmentDetails) {
          initialInvestment += "\n" + investmentDetails;
        }
      }
      else if (line.toLowerCase().includes("challenges") || line.toLowerCase().includes("potential challenges") || line.toLowerCase().includes("solutions")) {
        challenges = extractInfoAfterLine(lines, i);
        
        // Try to capture listed points
        let challengeDetails = "";
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].trim().startsWith("*") || lines[j].trim().includes(":")) {
            challengeDetails += "• " + lines[j].trim().replace(/^\*/, '').trim() + "\n";
          }
        }
        if (challengeDetails) {
          challenges += "\n" + challengeDetails;
        }
      }
      else if (line.toLowerCase().includes("growth strategy") || line.toLowerCase().includes("over 3")) {
        growthStrategy = extractInfoAfterLine(lines, i);
        
        // Capture points by year
        let growthDetails = "";
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].trim().startsWith("*") || lines[j].trim().includes("Year")) {
            growthDetails += "• " + lines[j].trim().replace(/^\*/, '').trim() + "\n";
          }
        }
        if (growthDetails) {
          growthStrategy += "\n" + growthDetails;
        }
      }
      
      // Enhanced extraction of pain point
      if (
        line.toLowerCase().includes("pain point") || 
        line.toLowerCase().includes("problem") || 
        line.toLowerCase().includes("issue") || 
        line.toLowerCase().includes("main challenge") ||
        line.toLowerCase().includes("unmet need") ||
        line.toLowerCase().includes("frustration") ||
        line.toLowerCase().includes("difficulty") ||
        line.toLowerCase().includes("market gap") ||
        line.toLowerCase().includes("current challenge") ||
        line.toLowerCase().includes("major obstacle") ||
        line.toLowerCase().includes("sector issue")
      ) {
        painPoint = extractInfoAfterLine(lines, i);
        
        // If the line itself contains the pain point, capture it
        if (line.includes(":")) {
          const parts = line.split(":");
          if (parts.length > 1 && parts[1].trim().length > 10) {
            painPoint = parts[1].trim();
          }
        }
        
        // Capture more details across multiple lines
        if (painPoint) {
          let moreDetails = "";
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const nextLine = lines[j].trim();
            // Stop if we detect the beginning of a new section
            if (nextLine.includes(":") && (
                nextLine.toLowerCase().includes("solution") ||
                nextLine.toLowerCase().includes("proposition") ||
                nextLine.toLowerCase().includes("market") ||
                nextLine.toLowerCase().includes("revenue")
            )) {
              break;
            }
            if (!nextLine.includes(":") && nextLine.length > 5) {
              moreDetails += nextLine + " ";
            }
          }
          if (moreDetails) {
            painPoint += " " + moreDetails.trim();
          }
        }
      }
    }
    
    // If no pain point was found directly, extract it from other sections with simpler analysis
    if (!painPoint || painPoint.length < 20) {
      // Simplified approach to extract the pain point
      
      // 1. Look in the concept
      if (concept && concept.length > 20) {
        // Find a sentence that mentions a problem or need
        const problemSentence = concept.match(/[^.!?]*(?:problem|need|difficulty|challenge|frustration)[^.!?]*[.!?]/i);
        if (problemSentence) {
          painPoint = problemSentence[0].trim();
        }
      }
      
      // 2. If nothing in the concept, look in the value proposition
      if ((!painPoint || painPoint.length < 20) && uniqueValue && uniqueValue.length > 20) {
        const problemSentence = uniqueValue.match(/[^.!?]*(?:problem|need|difficulty|challenge|frustration)[^.!?]*[.!?]/i);
        if (problemSentence) {
          painPoint = problemSentence[0].trim();
        }
      }
      
      // 3. Last option: create a simple pain point based on the target market
      if (!painPoint || painPoint.length < 20) {
        const market = targetMarket || "this sector";
        const solution = name || "This solution";
        
        painPoint = `Users in ${market} need a better solution. ${solution} addresses this need.`;
      }
    }
    
    // Ensure pain point is clear and concise
    if (painPoint.length > 200) {
      const sentences = painPoint.split(/[.!?]+/).filter(s => s.trim().length > 0);
      painPoint = sentences.slice(0, 2).join('. ') + '.';
    }
    
    // Create a short summary based on the concept, limited to exactly 12 words maximum
    if (concept) {
      // Clean the concept of excessive punctuation
      const cleanConcept = concept.replace(/[.,;:!?]+/g, '.').replace(/\.\s*\./g, '.').trim();
      
      // Extract a meaningful sentence
      const sentences = cleanConcept.split('.');
      
      // Find the most relevant sentence (containing keywords)
      const keywordPattern = /innov|solut|plate|app|service|technolog|tool|system|concept/i;
      let bestSentence = sentences[0]; // By default, take the first sentence
      
      for (const sentence of sentences) {
        if (sentence.trim().length > 10 && keywordPattern.test(sentence)) {
          bestSentence = sentence;
          break;
        }
      }
      
      // Limit to 12 words exactly
      const words = bestSentence.trim().split(/\s+/);
      
      // Take the first 12 words (or fewer if the sentence is shorter)
      shortSummary = words.slice(0, Math.min(12, words.length)).join(' ');
      
      // Ensure the sentence ends properly
      if (!shortSummary.endsWith('.') && !shortSummary.endsWith('!') && !shortSummary.endsWith('?')) {
        shortSummary += '.';
      }
    } else {
      // Generic summary but limited to 12 words exactly
      shortSummary = `Innovative solution for the ${targetMarket ? targetMarket.split(' ').slice(0, 5).join(' ') : "target"} market.`;
      
      // Check if summary exceeds 12 words
      const words = shortSummary.split(/\s+/);
      if (words.length > 12) {
        shortSummary = words.slice(0, 12).join(' ') + '.';
      }
    }
    
    // If we couldn't extract a name, use a default name
    if (!name) {
      // Try to find a name in quotes
      const nameMatch = ideaContent.match(/"([^"]+)"/);
      if (nameMatch) {
        name = nameMatch[1];
      } else {
        // Try to extract a name with a common business suffix
        const businessNameRegex = /([A-Z][a-zA-Z]+(?:Hub|Tech|App|Connect|Go|Now|Wise|Box|Flex|Plus|Pro|Smart|Link|Care|Mind|Eco|Pay|Health|Learn|Work|Life|Shop|Track|View|Fit))/g;
        const businessNames = ideaContent.match(businessNameRegex);
        
        if (businessNames && businessNames.length > 0) {
          name = businessNames[0];
        } else {
          name = "InnovaSolution";
        }
      }
    }
    
    // Ensure name is properly formatted
    if (name) {
      // Remove square brackets if present
      name = name.replace(/\[|\]/g, '');
      
      // Capitalize only the first letter of each word
      name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
        
      // Remove "company name" if it's still there
      name = name.replace(/company name/i, '').trim();
    }
    
    // If no concept, take the first words of the text
    if (!concept) {
      concept = ideaContent.substring(0, 200) + "...";
    }
    
    return {
      name,
      concept,
      targetMarket: targetMarket || "Target audience to be defined",
      uniqueValue: uniqueValue || "Unique value proposition to be defined",
      revenueModel: revenueModel || "Revenue model to be defined",
      initialInvestment: initialInvestment || "Initial investment to be defined",
      challenges: challenges || "Challenges to be identified",
      growthStrategy: growthStrategy || "Growth strategy to be developed",
      fullContent: ideaContent, // Keep the full content of this idea
      painPoint: painPoint || "Problem to solve identified by our AI",
      shortSummary: shortSummary
    };
  };
  
  // Helper function to extract information after a header line
  const extractInfoAfterLine = (lines: string[], index: number): string => {
    let result = "";
    for (let j = index + 1; j < Math.min(index + 5, lines.length); j++) {
      if (lines[j].trim() === "" || lines[j].includes(":") || (lines[j].match(/^\d+\./) && j > index + 1)) {
        break;
      }
      result += (result ? " " : "") + lines[j].trim();
    }
    return result || lines[index].split(":").slice(1).join(":").trim();
  };

  // Function to clean and format text: remove markdown artifacts, limit length, and format bullets
  const cleanAndFormatText = (text: string, maxLength: number = 0, formatBullets: boolean = false, ensureFullSentence: boolean = false): string => {
    if (!text) return "";
    
    // Remove markdown artifacts
    let cleanText = text
      .replace(/##/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[|\]/g, '')
      .trim();
    
    // Format bullets if requested
    if (formatBullets && cleanText.includes('*')) {
      return cleanText
        .split('\n')
        .map(line => line.trim())
        .map(line => line.startsWith('*') ? '• ' + line.substring(1).trim() : line)
        .join('\n');
    }
    
    // If no length limit, just return the cleaned text
    if (maxLength <= 0) return cleanText;
    
    // Apply length limit while ensuring we don't cut in the middle of a sentence
    if (cleanText.length <= maxLength) return cleanText;
    
    if (ensureFullSentence) {
      // Find the last sentence boundary before maxLength
      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [];
      let result = '';
      let currentLength = 0;
      
      for (const sentence of sentences) {
        if (currentLength + sentence.length <= maxLength) {
          result += sentence;
          currentLength += sentence.length;
        } else {
          break;
        }
      }
      
      // If we couldn't get a full sentence, take the substring and add ellipsis
      return result || cleanText.substring(0, maxLength - 3) + '...';
    } else {
      // Just cut at maxLength and add ellipsis
      return cleanText.substring(0, maxLength - 3) + '...';
    }
  };
  
  // Helper function to extract full section content without truncating
  const extractFullSectionContent = (text: string, startSection: string, endSection: string): string => {
    let startIndex = text.indexOf(startSection);
    if (startIndex === -1) return "";
    
    startIndex = startIndex + startSection.length;
    
    let endIndex = endSection ? text.indexOf(endSection, startIndex) : text.length;
    if (endIndex === -1) endIndex = text.length;
    
    return text.substring(startIndex, endIndex).trim();
  };
  
  // Helper function to clean markdown and placeholder text
  const cleanMarkdownAndPlaceholders = (text: string): string => {
    if (!text) return "";
    
    // Remove markdown headers and placeholders
    let cleanedText = text
      .replace(/##/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[.*?\]/g, '') // Remove placeholder text in brackets
      .trim();
      
    // Convert asterisks to bullet points while preserving line breaks
    if (cleanedText.includes('*')) {
      cleanedText = cleanedText
        .split('\n')
        .map(line => line.trim())
        .map(line => {
          if (line.startsWith('*')) {
            return '• ' + line.substring(1).trim();
          }
          return line;
        })
        .join('\n');
    }
    
    // Normalize line breaks
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
    
    return cleanedText;
  };

  const handleBuyDetailedPlan = () => {
    // Récupérer les paramètres d'URL si disponibles
    const industry = searchParams.get('industry') || '';
    const country = searchParams.get('country') || '';
    const budget = searchParams.get('budget') || '';
    
    // Stocker toutes les informations nécessaires dans sessionStorage
    // pour garantir qu'elles sont disponibles pour la génération du plan détaillé
    sessionStorage.setItem('currentIdeaInfo', JSON.stringify({
      industry,
      country,
      budget,
      name: parsedIdea?.name || 'Business Idea',
      idea: parsedIdea || null
    }));
    
    // Construire une URL avec tous les paramètres nécessaires
    const url = `/payment?idea=${encodeURIComponent(parsedIdea?.name || 'Business Idea')}&industry=${encodeURIComponent(industry)}&country=${encodeURIComponent(country)}&budget=${encodeURIComponent(budget)}`;
    
    // Rediriger vers la page de paiement
    window.location.href = url;
  };

  if (isLoading) {
    return (
      <LoadingAnimation isVisible={isLoading} />
    );
  }

  if (parseError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#FF7A50]">Oops!</h2>
          <p className="mb-6 text-[#2E3146]">{parseError}</p>
          <Link href="/">
            <button className="px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#624CF5] to-[#8E74FF] hover:opacity-90 transition-all">
              Try again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!parsedIdea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#FF7A50]">Oops!</h2>
          <p className="mb-6 text-[#2E3146]">An error occurred while generating your idea.</p>
          <Link href="/">
            <button className="px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#624CF5] to-[#8E74FF] hover:opacity-90 transition-all">
              Try again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-black bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page header styled like Optiiflow */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#2E3146] leading-tight">
            <span className="bg-gradient-to-r from-[#624CF5] to-[#8E74FF] bg-clip-text text-transparent">
              {parsedIdea.name}
            </span>
          </h1>
          <p className="text-xl text-[#2E3146]/70 max-w-3xl mx-auto">
            {parsedIdea.shortSummary ? parsedIdea.shortSummary.replace(/##/g, '').trim() : "Innovative solution for a specific market"}
          </p>
        </div>

        {/* Problem to solve section - Enhanced pain point highlighting */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-gray-200 w-16"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E3146] px-4 text-center">The problem to solve</h2>
            <div className="h-[1px] bg-gray-200 w-16"></div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF7A50] to-[#FFA477] rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-[#2E3146]">Identified Problem</h3>
                    <span className="px-3 py-1 bg-[#FF7A50]/10 text-[#FF7A50] text-xs font-medium rounded-full">
                      Market Opportunity
                    </span>
                  </div>
                  <div className="bg-[#FFF8F6] border-l-4 border-[#FF7A50] p-5 rounded-r-lg mb-6">
                    <p className="text-[#2E3146] text-lg font-medium whitespace-pre-line">
                      {parsedIdea.painPoint}
                    </p>
                  </div>
                  <div className="bg-[#F7F8FA] p-4 rounded-lg border border-gray-100">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-[#2E3146]/80">
                        <strong>Why it matters:</strong> Solving a concrete problem is the key to success. The best companies address real needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main features section - Optiiflow style */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-gray-200 w-16"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E3146] px-4 text-center">Key Features</h2>
            <div className="h-[1px] bg-gray-200 w-16"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Concept Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 mb-6 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2E3146]">Concept</h3>
              <p className="text-[#2E3146]/80 whitespace-pre-line">
                {parsedIdea.concept}
              </p>
            </div>

            {/* Value Proposition Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 mb-6 bg-gradient-to-r from-[#42C9E5] to-[#32D4C0] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2E3146]">Value Proposition</h3>
              <p className="text-[#2E3146]/80 whitespace-pre-line">
                {parsedIdea.uniqueValue}
              </p>
            </div>

            {/* Target Market Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 mb-6 bg-gradient-to-r from-[#FF7A50] to-[#FFA477] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2E3146]">Target Market</h3>
              <p className="text-[#2E3146]/80 whitespace-pre-line">
                {parsedIdea.targetMarket}
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap Section - Optiiflow Style */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-gray-200 w-16"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E3146] px-4 text-center">Roadmap for the first 3 months</h2>
            <div className="h-[1px] bg-gray-200 w-16"></div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10 relative">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] rounded-xl flex items-center justify-center shadow-sm mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2E3146]">Strategic roadmap</h3>
            </div>
            
            {/* Blurred Timeline - Optiiflow Style */}
            <div className="relative">
              <div className="blur-sm opacity-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Month 1 */}
                  <div className="bg-[#F7F8FA] p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#624CF5] text-white flex items-center justify-center mr-3 shadow-sm">
                        <span className="font-bold">1</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#2E3146]">Month 1: Foundations</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          In-depth market research
                        </p>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          Brand identity creation
                        </p>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Month 2 */}
                  <div className="bg-[#F7F8FA] p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#42C9E5] text-white flex items-center justify-center mr-3 shadow-sm">
                        <span className="font-bold">2</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#2E3146]">Month 2: Development</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#42C9E5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          Prototyping and testing
                        </p>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#42C9E5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          Initial partnerships
                        </p>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Month 3 */}
                  <div className="bg-[#F7F8FA] p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#FF7A50] text-white flex items-center justify-center mr-3 shadow-sm">
                        <span className="font-bold">3</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#2E3146]">Month 3: Launch</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF7A50] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          MVP launch
                        </p>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF7A50] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#2E3146]/80">
                          Initial marketing strategy
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Premium overlay - Optiiflow Style */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/50 flex flex-col justify-center items-center p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] rounded-full flex items-center justify-center shadow-lg mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#2E3146] mb-3">Get the detailed roadmap</h3>
                <p className="text-[#2E3146]/80 mb-6 max-w-md">
                  Access the complete 12-month plan with detailed steps for each phase of your business development.
                </p>
                <button 
                  onClick={handleBuyDetailedPlan} 
                  className="px-8 py-3 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 hover:opacity-95"
                >
                  Unlock the full version
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Optiiflow Style */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-8 p-8 md:p-10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] rounded-xl flex items-center justify-center shadow-sm mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2E3146]">
                    Complete action plan for success
                  </h3>
                </div>
                <p className="text-[#2E3146]/80 mb-8">
                  Get a detailed and actionable plan to successfully launch your business. It includes all the key elements needed to transform this idea into a profitable company.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#2E3146]">Challenge analysis</p>
                      <p className="text-sm text-[#2E3146]/70">Solutions to overcome obstacles</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#2E3146]">Growth strategy</p>
                      <p className="text-sm text-[#2E3146]/70">3-year vision with key milestones</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#2E3146]">Initial investment</p>
                      <p className="text-sm text-[#2E3146]/70">Detailed and quantified budget</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#624CF5] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#2E3146]">Marketing plan</p>
                      <p className="text-sm text-[#2E3146]/70">Customer acquisition strategies</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 bg-[#F7F8FA] p-8 md:p-10 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#2E3146]/70 uppercase tracking-wider font-medium mb-2">Complete action plan</p>
                  <div className="text-5xl font-bold text-[#624CF5] mb-1">€19</div>
                  <p className="text-sm text-[#2E3146]/70">One-time payment</p>
                </div>
                <button 
                  onClick={handleBuyDetailedPlan} 
                  className="w-full py-3 bg-gradient-to-r from-[#624CF5] to-[#8E74FF] text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 hover:opacity-95"
                >
                  Get the detailed plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section CTA pour acheter le plan détaillé */}
        <div className="mt-16 mb-12 bg-gray-50 rounded-xl p-8 border border-gray-100">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Vous souhaitez transformer cette idée en business concret ?
            </h3>
            
            <p className="text-lg mb-8">
              Obtenez un plan d'action détaillé pour concrétiser "{parsedIdea?.name}" 
              avec une roadmap à 3, 6 et 12 mois, les personas clients cibles, 
              stratégies marketing, budget prévisionnel, et plus.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {hasPaid ? (
                <Link href={`/complete-plan?idea=${encodeURIComponent(parsedIdea?.name || 'InnovaConnect')}`}>
                  <Button size="lg">
                    Accéder à mon plan d'action complet
                  </Button>
                </Link>
              ) : (
                <Link href={`/payment?idea=${encodeURIComponent(parsedIdea?.name || 'InnovaConnect')}`}>
                  <Button size="lg">
                    Obtenir mon plan d'action détaillé pour 19€
                  </Button>
                </Link>
              )}
              
              <Link href="/">
                <Button variant="secondary" size="lg">
                  Générer une autre idée
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 