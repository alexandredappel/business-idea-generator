import React, { useState, useEffect } from 'react';

// Interface pour les données de témoignage
interface Testimonial {
  initials: string;
  name: string;
  rating: number;
  text: string;
  bgGradient: string;
}

// Interface pour les props du composant
interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Nombre de slides (affichage de 2 témoignages par slide)
  const totalSlides = Math.ceil(testimonials.length / 2);
  
  // Auto-rotation du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);
  
  // Navigation précédent
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };
  
  // Navigation suivant
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 relative">
      {/* Boutons de navigation */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 hidden md:block">
        <button 
          onClick={handlePrevious}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-gray-50 transition-all"
          aria-label="Témoignage précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 hidden md:block">
        <button 
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-gray-50 transition-all"
          aria-label="Témoignage suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Carrousel */}
      <div className="carousel overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Grouper les témoignages par 2 */}
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Premier témoignage du slide */}
                {testimonials[slideIndex * 2] && (
                  <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonials[slideIndex * 2].bgGradient} flex items-center justify-center text-white font-bold`}>
                        {testimonials[slideIndex * 2].initials}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg">{testimonials[slideIndex * 2].name}</h3>
                        <div className="flex text-amber-400 mt-1">
                          {'★'.repeat(testimonials[slideIndex * 2].rating)}
                          {'☆'.repeat(5 - testimonials[slideIndex * 2].rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-light">
                      "{testimonials[slideIndex * 2].text}"
                    </p>
                  </div>
                )}
                
                {/* Deuxième témoignage du slide */}
                {testimonials[slideIndex * 2 + 1] && (
                  <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonials[slideIndex * 2 + 1].bgGradient} flex items-center justify-center text-white font-bold`}>
                        {testimonials[slideIndex * 2 + 1].initials}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg">{testimonials[slideIndex * 2 + 1].name}</h3>
                        <div className="flex text-amber-400 mt-1">
                          {'★'.repeat(testimonials[slideIndex * 2 + 1].rating)}
                          {'☆'.repeat(5 - testimonials[slideIndex * 2 + 1].rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-light">
                      "{testimonials[slideIndex * 2 + 1].text}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicateurs de position */}
      <div className="flex justify-center mt-8 space-x-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
              index === currentIndex 
                ? 'bg-primary scale-125 shadow-md'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Voir témoignages ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel; 