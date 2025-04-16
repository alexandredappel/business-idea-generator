import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientBody from "@/components/ClientBody";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BusinessIdeaGen - Générateur d'Idées Business",
  description: "Générez des idées de business viables adaptées à vos critères en quelques clics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <ClientBody>
        <Header />
        <main className="flex-grow bg-[#F7F8FA] text-black">
          {children}
        </main>
        <Footer />
      </ClientBody>
    </html>
  );
}
