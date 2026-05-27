import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AtlasProviders } from "@/components/AtlasProviders";
import { AtlasShell } from "@/components/AtlasShell";

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
    "Ambient clock and focus timer. A premium digital object for stillness, deep work and time spent intentionally.",
  applicationName: "Atlas Timer",
  authors: [{ name: "Atlas" }],
  keywords: [
    "atlas",
    "atlas timer",
    "ambient clock",
    "focus timer",
    "deep work",
    "stillness",
  ],
};

export const viewport: Viewport = {
  themeColor: "#020203",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `
(function(){try{var t=localStorage.getItem('atlas-timer:theme');var m=(t==='light'||t==='dark'||t==='relax')?t:'relax';var r=document.documentElement;r.dataset.theme=m;r.classList.toggle('dark',m!=='light');r.classList.toggle('theme-relax',m==='relax');r.classList.toggle('theme-dark',m==='dark');r.classList.toggle('theme-light',m==='light');}catch(e){document.documentElement.classList.add('dark','theme-relax');document.documentElement.dataset.theme='relax';}})();
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
      <body className="h-screen overflow-hidden bg-(--color-bg) text-(--color-fg)">
        <AtlasProviders>
          <AtlasShell>{children}</AtlasShell>
        </AtlasProviders>
      </body>
    </html>
  );
}
