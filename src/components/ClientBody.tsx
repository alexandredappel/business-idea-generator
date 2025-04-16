"use client";

import { useEffect } from "react";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  useEffect(() => {
    // Cette partie ne s'exécute que côté client
    document.body.setAttribute('cz-shortcut-listen', 'true');
  }, []);

  return (
    <body
      className={`${plusJakartaSans.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col bg-white text-black`}
      style={{ 
        backgroundColor: '#F7F8FA', 
        color: '#000000',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {children}
    </body>
  );
} 