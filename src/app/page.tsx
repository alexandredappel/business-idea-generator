'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import LoadingAnimation from '@/components/LoadingAnimation';
import TestimonialCarousel from '@/components/TestimonialCarousel';

const industries = [
  { value: '', label: 'Select an industry' },
  { value: 'aerospace', label: 'Aerospace & Defense' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'ai_ml', label: 'AI & Machine Learning' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'childcare', label: 'Childcare & Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'consumer_goods', label: 'Consumer Goods' },
  { value: 'cosmetics', label: 'Cosmetics & Beauty' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'energy', label: 'Energy' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'fitness', label: 'Fitness & Wellness' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'gaming', label: 'Gaming & Esports' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'home_improvement', label: 'Home Improvement' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal_services', label: 'Legal Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'media_entertainment', label: 'Media & Entertainment' },
  { value: 'mental_health', label: 'Mental Health Services' },
  { value: 'mining', label: 'Mining & Metals' },
  { value: 'non_profit', label: 'Non-profit & NGO' },
  { value: 'pet_industry', label: 'Pet Industry' },
  { value: 'pharmaceutical', label: 'Pharmaceutical' },
  { value: 'public_services', label: 'Public Services' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'retail', label: 'Retail' },
  { value: 'senior_care', label: 'Senior Care' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'sports', label: 'Sports' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'technology', label: 'Technology' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'water_management', label: 'Water Management' },
];

const countries = [
  { value: '', label: 'Select a country' },
  { value: 'afghanistan', label: 'Afghanistan' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'angola', label: 'Angola' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'australia', label: 'Australia' },
  { value: 'austria', label: 'Austria' },
  { value: 'azerbaijan', label: 'Azerbaijan' },
  { value: 'bangladesh', label: 'Bangladesh' },
  { value: 'belarus', label: 'Belarus' },
  { value: 'belgium', label: 'Belgium' },
  { value: 'benin', label: 'Benin' },
  { value: 'bolivia', label: 'Bolivia' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'burkina_faso', label: 'Burkina Faso' },
  { value: 'burundi', label: 'Burundi' },
  { value: 'cambodia', label: 'Cambodia' },
  { value: 'cameroon', label: 'Cameroon' },
  { value: 'canada', label: 'Canada' },
  { value: 'chad', label: 'Chad' },
  { value: 'chile', label: 'Chile' },
  { value: 'china', label: 'China' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'cote_divoire', label: "Côte d'Ivoire" },
  { value: 'cuba', label: 'Cuba' },
  { value: 'czech_republic', label: 'Czech Republic' },
  { value: 'dominican_republic', label: 'Dominican Republic' },
  { value: 'dr_congo', label: 'DR Congo' },
  { value: 'ecuador', label: 'Ecuador' },
  { value: 'egypt', label: 'Egypt' },
  { value: 'ethiopia', label: 'Ethiopia' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'greece', label: 'Greece' },
  { value: 'guatemala', label: 'Guatemala' },
  { value: 'guinea', label: 'Guinea' },
  { value: 'haiti', label: 'Haiti' },
  { value: 'hungary', label: 'Hungary' },
  { value: 'india', label: 'India' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'iran', label: 'Iran' },
  { value: 'iraq', label: 'Iraq' },
  { value: 'israel', label: 'Israel' },
  { value: 'italy', label: 'Italy' },
  { value: 'japan', label: 'Japan' },
  { value: 'jordan', label: 'Jordan' },
  { value: 'kazakhstan', label: 'Kazakhstan' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'madagascar', label: 'Madagascar' },
  { value: 'malawi', label: 'Malawi' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'mali', label: 'Mali' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'morocco', label: 'Morocco' },
  { value: 'mozambique', label: 'Mozambique' },
  { value: 'myanmar', label: 'Myanmar' },
  { value: 'nepal', label: 'Nepal' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'niger', label: 'Niger' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'north_korea', label: 'North Korea' },
  { value: 'pakistan', label: 'Pakistan' },
  { value: 'peru', label: 'Peru' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'poland', label: 'Poland' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'romania', label: 'Romania' },
  { value: 'russia', label: 'Russia' },
  { value: 'rwanda', label: 'Rwanda' },
  { value: 'saudi_arabia', label: 'Saudi Arabia' },
  { value: 'senegal', label: 'Senegal' },
  { value: 'serbia', label: 'Serbia' },
  { value: 'somalia', label: 'Somalia' },
  { value: 'south_africa', label: 'South Africa' },
  { value: 'south_korea', label: 'South Korea' },
  { value: 'spain', label: 'Spain' },
  { value: 'sri_lanka', label: 'Sri Lanka' },
  { value: 'sudan', label: 'Sudan' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'switzerland', label: 'Switzerland' },
  { value: 'syria', label: 'Syria' },
  { value: 'tajikistan', label: 'Tajikistan' },
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'tunisia', label: 'Tunisia' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'ukraine', label: 'Ukraine' },
  { value: 'united_arab_emirates', label: 'United Arab Emirates' },
  { value: 'united_kingdom', label: 'United Kingdom' },
  { value: 'united_states', label: 'United States' },
  { value: 'uzbekistan', label: 'Uzbekistan' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'yemen', label: 'Yemen' },
  { value: 'zambia', label: 'Zambia' },
  { value: 'zimbabwe', label: 'Zimbabwe' },
];

// Options de budget définies
const budgetOptions = [
  { value: 0, label: '0$' },
  { value: 100, label: '100$' },
  { value: 500, label: '500$' },
  { value: 1000, label: '1000$' },
  { value: 5000, label: '5000$' },
  { value: 10000, label: '10000$+' },
];

// Fonction pour obtenir la valeur du budget en fonction de la position du curseur
const getValueFromPosition = (position: number): number => {
  // position est entre 0 et 5 (inclus)
  const index = Math.round(position);
  return budgetOptions[index].value;
};

// Fonction pour obtenir la position du curseur en fonction de la valeur
const getPositionFromValue = (value: number): number => {
  for (let i = 0; i < budgetOptions.length; i++) {
    if (value <= budgetOptions[i].value) {
      return i;
    }
  }
  return budgetOptions.length - 1; // Si la valeur est supérieure au maximum, retourner la dernière position
};

// Example business ideas for the carousel
const exampleIdeas = [
  {
    name: "EcoDelivery",
    description: "Zero-emission food delivery service using electric bikes and eco-friendly packaging.",
    industry: "Food & Sustainability",
    icon: "🚲",
    color: "from-green-400 to-teal-500",
    highlight: "Eco-friendly"
  },
  {
    name: "MindfulSpace",
    description: "Subscription-based meditation pods in corporate environments and shopping centers.",
    industry: "Health & Wellness",
    icon: "🧘",
    color: "from-purple-400 to-indigo-500",
    highlight: "Mental Health"
  },
  {
    name: "SkillSwap",
    description: "Peer-to-peer platform connecting professionals for skill exchange and mentorship.",
    industry: "Education & Technology",
    icon: "🔄",
    color: "from-blue-400 to-indigo-600",
    highlight: "Peer Learning"
  },
  {
    name: "LocalCraft",
    description: "Marketplace connecting local artisans with consumers seeking handmade, sustainable products.",
    industry: "E-commerce & Sustainability",
    icon: "🛍️",
    color: "from-amber-400 to-orange-500",
    highlight: "Artisanal"
  },
  {
    name: "SeniorTech",
    description: "Tech support and digital literacy service specifically designed for seniors.",
    industry: "Technology & Health",
    icon: "👵",
    color: "from-red-400 to-pink-500",
    highlight: "Accessibility"
  }
];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    industry: '',
    country: '',
    budget: '1000',
    criteria: '',
  });
  const [errors, setErrors] = useState({
    industry: '',
    country: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(3); // Position par défaut (index de 1000$)
  
  // États pour les dropdowns personnalisés
  const [industrySearch, setIndustrySearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  
  // Refs pour gérer le clic en dehors des dropdowns
  const industryDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les industries et pays basés sur la recherche
  const filteredIndustries = useMemo(() => {
    if (!industrySearch) return industries;
    return industries.filter(industry => 
      industry.label.toLowerCase().includes(industrySearch.toLowerCase()) ||
      industry.value === '' // Toujours inclure l'option "Select an industry"
    );
  }, [industrySearch]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(country => 
      country.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.value === '' // Toujours inclure l'option "Select a country"
    );
  }, [countrySearch]);

  // Gestionnaire pour détecter les clics en dehors des dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setIsIndustryOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-rotate through example ideas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdeaIndex((prevIndex) => (prevIndex + 1) % exampleIdeas.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is filled
    if (value && name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Reset API error if user modifies something
    if (apiError) {
      setApiError('');
    }
  };

  // Gestionnaire pour la sélection d'une industrie
  const handleIndustrySelect = (value: string, label: string) => {
    setFormData(prev => ({
      ...prev,
      industry: value
    }));
    setIsIndustryOpen(false);
    setIndustrySearch('');
    
    // Clear error
    if (value && errors.industry) {
      setErrors(prev => ({
        ...prev,
        industry: ''
      }));
    }
    
    // Reset API error
    if (apiError) {
      setApiError('');
    }
  };

  // Gestionnaire pour la sélection d'un pays
  const handleCountrySelect = (value: string, label: string) => {
    setFormData(prev => ({
      ...prev,
      country: value
    }));
    setIsCountryOpen(false);
    setCountrySearch('');
    
    // Clear error
    if (value && errors.country) {
      setErrors(prev => ({
        ...prev,
        country: ''
      }));
    }
    
    // Reset API error
    if (apiError) {
      setApiError('');
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseInt(e.target.value);
    setSliderPosition(position);
    const budgetValue = getValueFromPosition(position);
    setFormData((prev) => ({
      ...prev,
      budget: budgetValue.toString(),
    }));
    
    // Clear budget error if any
    if (errors.budget) {
      setErrors((prev) => ({
        ...prev,
        budget: '',
      }));
    }
    
    // Reset API error if user modifies something
    if (apiError) {
      setApiError('');
    }
  };

  // Gestionnaires pour la recherche
  const handleIndustrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndustrySearch(e.target.value);
  };

  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearch(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {
      industry: formData.industry ? '' : 'Please select an industry',
      country: formData.country ? '' : 'Please select a country',
      budget: formData.budget ? '' : 'Please provide a budget',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Défiler vers le haut de la page pour montrer l'animation de chargement
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Petit délai pour permettre le défilement avant d'afficher l'animation
      setTimeout(() => {
        setIsLoading(true);
        setApiError('');
        
        // Encapsuler l'appel API dans un setTimeout pour permettre à l'animation de s'afficher
        setTimeout(async () => {
          try {
            // Stocker les paramètres originaux dans sessionStorage
            sessionStorage.setItem('generationParams', JSON.stringify({
              industry: formData.industry,
              country: formData.country,
              budget: formData.budget
            }));
            
            // API call to generate the idea
            const response = await fetch('/api/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || 'An error occurred while generating the idea');
            }
            
            // Store ideas in sessionStorage to retrieve them on the results page
            sessionStorage.setItem('generatedIdeas', JSON.stringify(data.ideas));
            
            // Redirect to the results page with parameters
            router.push(`/result?industry=${formData.industry}&country=${formData.country}&budget=${formData.budget}`);
          } catch (error) {
            console.error('Error during generation:', error);
            setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
            setIsLoading(false);
          }
        }, 500); // Délai avant de démarrer la requête API
      }, 200); // Délai pour le défilement
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-black bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Loading Animation */}
      <LoadingAnimation isVisible={isLoading} />
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center md:justify-between mb-20">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="mb-6">
            <span className="bg-primary/20 text-primary-light px-4 py-1 rounded-full text-sm font-medium">
              AI-Powered
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black">
            Discover your next <span className="heading-gradient">business idea</span> in a few clicks
          </h1>
          <p className="text-lg text-black mb-8 max-w-lg">
            Generate innovative business ideas tailored to your criteria using artificial intelligence and get
            a detailed action plan to start quickly.
          </p>
        </div>
        <div className="md:w-1/2 w-full flex justify-center">
          <Card className="w-full shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Dropdown personnalisé pour l'industrie */}
                <div ref={industryDropdownRef}>
                  <label htmlFor="industry" className="block text-sm font-medium mb-1">
                    Industry
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                      className={`input-field w-full text-left flex items-center justify-between ${errors.industry ? 'border-red-500' : ''}`}
                      aria-haspopup="listbox"
                      aria-expanded={isIndustryOpen}
                    >
                      <span>
                        {formData.industry 
                          ? industries.find(i => i.value === formData.industry)?.label 
                          : 'Select an industry'}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${isIndustryOpen ? 'transform rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {isIndustryOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <input
                            type="text"
                            placeholder="Search industries..."
                            value={industrySearch}
                            onChange={handleIndustrySearch}
                            className="input-field w-full pl-8"
                            onClick={e => e.stopPropagation()}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <ul className="py-1" role="listbox">
                          {filteredIndustries.map((option) => (
                            <li
                              key={option.value}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.industry === option.value ? 'bg-primary/10 text-primary' : ''}`}
                              onClick={() => handleIndustrySelect(option.value, option.label)}
                              role="option"
                              aria-selected={formData.industry === option.value}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry}</p>}
                </div>
                
                {/* Dropdown personnalisé pour le pays */}
                <div ref={countryDropdownRef}>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className={`input-field w-full text-left flex items-center justify-between ${errors.country ? 'border-red-500' : ''}`}
                      aria-haspopup="listbox"
                      aria-expanded={isCountryOpen}
                    >
                      <span>
                        {formData.country 
                          ? countries.find(c => c.value === formData.country)?.label 
                          : 'Select a country'}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${isCountryOpen ? 'transform rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {isCountryOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={handleCountrySearch}
                            className="input-field w-full pl-8"
                            onClick={e => e.stopPropagation()}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <ul className="py-1" role="listbox">
                          {filteredCountries.map((option) => (
                            <li
                              key={option.value}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.country === option.value ? 'bg-primary/10 text-primary' : ''}`}
                              onClick={() => handleCountrySelect(option.value, option.label)}
                              role="option"
                              aria-selected={formData.country === option.value}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                </div>
                
                {/* Curseur de budget amélioré et corrigé */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-3">
                    Budget
                  </label>
                  <div className="mt-6 mb-12 relative">
                    {/* Curseur principal */}
                    <input
                      type="range"
                      id="budget-slider"
                      min="0"
                      max="5"
                      step="1"
                      value={sliderPosition}
                      onChange={handleSliderChange}
                      className="w-full h-2 appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #6366f1, #a855f7)',
                        height: '6px',
                        borderRadius: '8px',
                        outline: 'none',
                        WebkitAppearance: 'none',
                        marginTop: '10px',
                      }}
                    />
                    
                    {/* Styles personnalisés pour le curseur */}
                    <style jsx>{`
                      #budget-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: white;
                        border: 3px solid #6366f1;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                        margin-top: -12px;
                        position: relative;
                        z-index: 10;
                      }
                      
                      #budget-slider::-moz-range-thumb {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: white;
                        border: 3px solid #6366f1;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                        position: relative;
                        z-index: 10;
                      }
                    `}</style>
                    
                    {/* Indicateurs de position */}
                    <div className="grid grid-cols-6 w-full px-0 mt-8 -mb-2">
                      {budgetOptions.map((option, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className={`w-1 h-5 transform ${sliderPosition === index ? 'bg-primary scale-125' : 'bg-gray-300'}`}
                            style={{ 
                              marginLeft: index === 0 ? '0' : 
                                         index === budgetOptions.length - 1 ? '-2px' : '-1px'
                            }}
                          ></div>
                          <span 
                            className={`text-sm mt-2 ${sliderPosition === index ? 'text-primary font-medium' : ''}`}
                            style={{ 
                              marginLeft: index === 0 ? '0' : 
                                         index === budgetOptions.length - 1 ? '-2px' : '-1px'
                            }}
                          >
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                </div>
                
                {apiError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
                    {apiError}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={isLoading}
                    className={isLoading ? 'opacity-70 cursor-not-allowed' : 'glow'}
                  >
                    {isLoading ? 'Generating...' : 'Generate an idea'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="mb-20 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block heading-gradient">
            How it works
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            A simple three-step process to get your next business idea
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-gradient p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-6 glow">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">Define your criteria</h3>
            <p className="text-text-light">
              Select the industry, country, and your budget to
              precisely target the type of idea you're looking for.
            </p>
          </div>
          
          <div className="card-gradient p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center mb-6 glow-green">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-secondary">Get a free idea</h3>
            <p className="text-text-light">
              Our AI instantly generates a viable business concept with
              a description, the targeted pain point, and initial steps.
            </p>
          </div>
          
          <div className="card-gradient p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mb-6 glow-amber">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-light to-accent">Detailed action plan</h3>
            <p className="text-text-light">
              For €19, get a comprehensive plan with roadmap, marketing
              strategies, competitive analysis, and budget forecasts.
            </p>
          </div>
        </div>
      </section>

      {/* Example Ideas Carousel Section */}
      <section className="py-24 relative overflow-hidden mb-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block heading-gradient">
            Inspiring Business Ideas
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Discover the kind of innovative concepts our AI can generate for you
          </p>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full filter blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full filter blur-[80px] opacity-70"></div>
          <div className="absolute top-[40%] right-[20%] w-[20rem] h-[20rem] bg-accent/5 rounded-full filter blur-[60px] opacity-60"></div>
        </div>
        
        {/* Carousel */}
        <div className="max-w-5xl mx-auto px-4 relative">
          {/* Previous/Next idea controls */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 hidden md:block">
            <button 
              onClick={() => setCurrentIdeaIndex((prevIndex) => prevIndex === 0 ? exampleIdeas.length - 1 : prevIndex - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-gray-50 transition-all"
              aria-label="Previous idea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 hidden md:block">
            <button 
              onClick={() => setCurrentIdeaIndex((prevIndex) => (prevIndex + 1) % exampleIdeas.length)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-gray-50 transition-all"
              aria-label="Next idea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Sliding carousel */}
          <div className="carousel overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentIdeaIndex * 100}%)` }}
            >
              {exampleIdeas.map((idea, index) => (
                <div key={index} className="w-full flex-shrink-0 p-4">
                  <div className="glass bg-white/70 backdrop-blur-lg rounded-xl shadow-xl p-8 md:p-10 relative overflow-hidden transform transition-all hover:scale-[1.01]">
                    {/* Badge */}
                    <div className="absolute top-0 right-0">
                      <div className={`bg-gradient-to-r ${idea.color} text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
                        {idea.highlight}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Icon */}
                      <div className="mb-4 md:mb-0 bg-gradient-to-br from-white to-gray-100 rounded-full p-4 shadow-inner">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${idea.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-3xl">{idea.icon}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${idea.color}`}>
                          {idea.name}
                        </h3>
                        
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {idea.industry}
                          </span>
                        </div>
                        
                        <p className="text-text-light text-lg mb-6">
                          {idea.description}
                        </p>
                        
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                          <div className="text-sm text-text-muted flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Generated in less than 30 seconds
                          </div>
                          
                          <Button 
                            size="sm" 
                            className={`bg-gradient-to-r ${idea.color} text-white border-none hover:opacity-90`}
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Try it now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {exampleIdeas.map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
                  index === currentIdeaIndex 
                    ? 'bg-primary scale-125 shadow-md'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIdeaIndex(index)}
                aria-label={`View idea ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-gradient p-12 text-center my-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 heading-gradient">
            Ready to discover your next business idea?
          </h2>
          <p className="text-lg text-text-light mb-8 max-w-2xl mx-auto">
            Generate a free idea tailored to your criteria in less than 30 seconds.
            No signup required.
          </p>
          <a href="#top">
            <Button className="btn-primary glow text-lg py-4 px-8">
              Generate an idea now
            </Button>
          </a>
        </div>
      </section>
      
      {/* Testimonials/Stats Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 heading-gradient">
            Ideas that inspire
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Join entrepreneurs who have discovered their next opportunity with us
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-light">96%</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Satisfaction</h3>
                <p className="text-text-muted text-sm">of users</p>
              </div>
            </div>
            <p className="text-text-light">
              Our users are satisfied with the generated ideas and find them relevant to their criteria.
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-secondary-light">5K+</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Ideas</h3>
                <p className="text-text-muted text-sm">generated this month</p>
              </div>
            </div>
            <p className="text-text-light">
              Thousands of entrepreneurs trust our platform to find their next venture.
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-lg font-bold text-accent-light">42%</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Implementation</h3>
                <p className="text-text-muted text-sm">of purchased ideas</p>
              </div>
            </div>
            <p className="text-text-light">
              Nearly half of the purchased action plans are implemented by their owners.
            </p>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 heading-gradient">
            Témoignages clients
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs pensent de notre générateur d'idées d'entreprise
          </p>
        </div>

        <TestimonialCarousel 
          testimonials={[
            {
              initials: "LM",
              name: "Laurent Martin",
              rating: 5,
              text: "L'outil a généré une idée que je n'aurais jamais envisagée par moi-même. J'ai pu lancer mon entreprise de livraison écologique en moins de 2 mois grâce au plan d'action détaillé.",
              bgGradient: "from-primary to-primary-light"
            },
            {
              initials: "SC",
              name: "Sophie Clement",
              rating: 4,
              text: "Très impressionnée par la qualité des idées proposées. Le plan d'action vaut vraiment son prix, il m'a fait gagner énormément de temps dans mes recherches.",
              bgGradient: "from-secondary to-secondary-light"
            },
            {
              initials: "TD",
              name: "Thomas Dubois",
              rating: 5,
              text: "J'hésitais entre plusieurs secteurs et cet outil m'a aidé à voir les possibilités dans chacun d'eux. J'ai finalement trouvé une idée parfaitement adaptée à mon budget limité.",
              bgGradient: "from-accent to-accent-light"
            },
            {
              initials: "CM",
              name: "Cécile Moreau",
              rating: 4,
              text: "Génial pour trouver l'inspiration quand on est bloqué. Les idées sont adaptées aux tendances locales et tiennent compte des spécificités du marché français.",
              bgGradient: "from-primary-light to-secondary"
            },
            {
              initials: "PL",
              name: "Philippe Legrand",
              rating: 5,
              text: "J'ai acheté plusieurs plans d'action pour différentes idées avant de me décider. La profondeur d'analyse et les détails financiers sont impressionnants.",
              bgGradient: "from-secondary to-accent"
            },
            {
              initials: "EG",
              name: "Émilie Girard",
              rating: 4,
              text: "Parfait pour les entrepreneurs débutants. L'outil m'a guidé dans un secteur que je connaissais peu et m'a donné confiance pour me lancer.",
              bgGradient: "from-accent to-primary"
            },
            {
              initials: "AB",
              name: "Alexandre Blanc",
              rating: 5,
              text: "La qualité des idées proposées est exceptionnelle. J'ai pu présenter le plan d'action à ma banque pour obtenir un financement sans difficulté.",
              bgGradient: "from-primary to-accent"
            },
            {
              initials: "JR",
              name: "Juliette Rousseau",
              rating: 4,
              text: "Un outil incroyablement utile pour explorer différentes options d'entreprise. Les analyses de tendances et de marché sont particulièrement pertinentes.",
              bgGradient: "from-secondary-light to-primary-light"
            },
            {
              initials: "NP",
              name: "Nicolas Petit",
              rating: 5,
              text: "J'utilise ce service régulièrement pour tester de nouvelles idées d'entreprise. Le rapport qualité-prix est imbattable comparé à une étude de marché traditionnelle.",
              bgGradient: "from-accent-light to-secondary"
            },
            {
              initials: "ML",
              name: "Marie Lambert",
              rating: 4,
              text: "Cet outil m'a fait gagner un temps précieux dans ma recherche d'idée d'entreprise. Les conseils pour le financement et le lancement ont été particulièrement utiles.",
              bgGradient: "from-primary to-secondary"
            }
          ]}
        />
      </section>
    </div>
  );
}
