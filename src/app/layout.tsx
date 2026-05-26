import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Atlas Timer",
  description:
    "A premium ambient clock and timer for focus, stillness and deep work.",
  applicationName: "Atlas Timer",
  authors: [{ name: "Atlas" }],
  keywords: ["atlas", "timer", "clock", "ambient", "focus", "deep work"],
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `
(function(){try{var t=localStorage.getItem('atlas-timer:theme');var m=t||'dark';if(m==='dark'){document.documentElement.classList.add('dark');}document.documentElement.dataset.theme=m;}catch(e){document.documentElement.classList.add('dark');}})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen flex flex-col bg-(--color-bg) text-(--color-fg)">
        {children}
      </body>
    </html>
  );
}
