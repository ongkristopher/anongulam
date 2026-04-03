import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anong Ulam? 🍽️",
  description:
    "Nalilito ka ba kung ano ang next na ulam o kakainin mo? Check mo na dito!",
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="fil">
      <head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Epilogue + Plus Jakarta Sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
