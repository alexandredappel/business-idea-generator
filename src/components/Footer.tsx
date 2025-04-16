export default function Footer() {
  return (
    <footer className="footer w-full py-8 bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#624CF5] to-[#42C9E5] font-semibold mb-2">
              BusinessIdeaGen
            </div>
            <p className="text-black text-sm">
              © {new Date().getFullYear()} BusinessIdeaGen. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="footer-link text-black hover:text-[#624CF5] transition-all duration-300 text-sm relative group">
              Mentions légales
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#624CF5]/50 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="footer-link text-black hover:text-[#624CF5] transition-all duration-300 text-sm relative group">
              Confidentialité
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#42C9E5]/50 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="footer-link text-black hover:text-[#624CF5] transition-all duration-300 text-sm relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF7A50]/50 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 