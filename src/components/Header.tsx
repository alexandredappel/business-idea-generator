import Link from 'next/link';
import Button from './Button';

export default function Header() {
  return (
    <header className="w-full py-4 px-4 md:px-8 z-50 backdrop-blur-lg bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold relative group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#624CF5] via-[#42C9E5] to-[#FF7A50] bg-300% animate-gradient-x">
            BusinessIdeaGen
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#624CF5] to-[#42C9E5] group-hover:w-full transition-all duration-300"></span>
        </Link>
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link href="/">
                <Button
                  size="md"
                  className="glow"
                >
                  Generate
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 