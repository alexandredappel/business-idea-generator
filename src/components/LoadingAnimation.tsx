import React, { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  isVisible: boolean;
}

// Composant Particule pour l'arrière-plan
const Particle: React.FC<{ delay: number; size: number; color: string; top: string; left: string }> = ({ 
  delay, size, color, top, left 
}) => {
  return (
    <div 
      className="absolute rounded-full opacity-70 animate-pulse"
      style={{ 
        top, 
        left, 
        width: `${size}px`, 
        height: `${size}px`, 
        backgroundColor: color,
        animationDuration: `${3 + delay}s`,
        animationDelay: `${delay}s`
      }}
    />
  );
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const steps = [
    "Analyzing industry trends...",
    "Studying local markets...",
    "Evaluating economic viability...",
    "Finding untapped opportunities...",
    "Developing business concept...",
    "Finalizing your idea..."
  ];

  const encouragements = [
    "Your business idea is being created...",
    "We're finding the best opportunities for you...",
    "A unique concept is being prepared for you...",
    "This idea could change your professional future...",
    "Building a business starts with a great idea...",
    "Entrepreneurial inspiration coming soon...",
    "Our AI is exploring thousands of possibilities...",
    "The next big idea will be ready in a moment..."
  ];

  // Effet pour gérer l'animation d'apparition/disparition
  useEffect(() => {
    if (isVisible) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // Délai pour la transition de sortie
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    // Changement d'étape toutes les 1.8 secondes
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1800);
    
    // Changement de message d'encouragement toutes les 3.5 secondes
    const encouragementInterval = setInterval(() => {
      setEncouragementIndex(prev => {
        // Génération d'un nouvel index aléatoire différent du précédent
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * encouragements.length);
        } while (newIndex === prev && encouragements.length > 1);
        return newIndex;
      });
    }, 3500);
    
    return () => {
      clearInterval(stepInterval);
      clearInterval(encouragementInterval);
    };
  }, [isVisible, steps.length, encouragements.length]);

  if (!mounted) return null;

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Générer des particules aléatoires
  const particles = [];
  for (let i = 0; i < 12; i++) {
    const colors = ['#624CF5', '#42C9E5', '#FF7A50', '#8E74FF', '#32D4C0'];
    particles.push({
      delay: Math.random() * 2,
      size: 5 + Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    });
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay avec effet de flou */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, index) => (
          <Particle key={index} {...particle} />
        ))}
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-xl w-full mx-4 relative overflow-hidden transform transition-all duration-500 scale-100 z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light to-primary">
          <div className="h-full w-[30%] bg-white opacity-30 animate-[loading-bar_1.5s_ease-in-out_infinite]"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
          Generating business idea...
        </h2>
        
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 relative">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-l-primary border-r-transparent border-b-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
            
            {/* Orbiting elements */}
            <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ animationDuration: '8s', transformOrigin: 'center' }}>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-light rounded-full shadow-lg shadow-primary/30"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse', transformOrigin: 'center' }}>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-5 h-5 bg-secondary rounded-full shadow-lg shadow-secondary/30"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ animationDuration: '10s', transformOrigin: 'center' }}>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/30"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-2xl animate-bounce-slow">💡</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 h-14 flex items-center justify-center">
          <p className="text-center text-primary font-medium animate-pulse">
            {steps[currentStep]}
          </p>
        </div>
        
        {/* Barre de progression globale */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="space-y-4">
          {[0, 1, 2, 3, 4, 5].map(stepIndex => (
            <div key={stepIndex} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-300 
                ${stepIndex <= currentStep 
                  ? 'bg-gradient-to-r from-primary-light to-primary' 
                  : 'bg-gray-200 text-gray-500'}`}
              >
                {stepIndex + 1}
              </div>
              <div className="ml-3 flex-1">
                <div 
                  className={`h-2 rounded transition-all duration-500 ${
                    stepIndex < currentStep 
                      ? 'bg-primary w-full' 
                      : stepIndex === currentStep 
                        ? 'bg-primary-light animate-pulse w-4/5' 
                        : 'bg-gray-200 w-full'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center h-7">
          <p className="text-gray-600 text-sm transition-opacity duration-300">
            {encouragements[encouragementIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 