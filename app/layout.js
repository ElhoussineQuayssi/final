import { Cormorant_Garamond, Roboto } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper.jsx";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "Fondation Assalam - Ensemble pour un avenir meilleur",
  description: "Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${cormorantGaramond.variable} ${roboto.variable} antialiased`}
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
