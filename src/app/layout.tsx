import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://iankengott.github.io/ian-kengott-site"
  ),
  title: "Ian Kengott — Research Software & Magnetic Materials",
  description:
    "Ian Kengott — USF Physics. Dr. Arena lab support, magnonics, x-ray spectromicroscopy tooling (MANTiS), and reproducible research infrastructure.",
  keywords: [
    "Ian Kengott",
    "USF Physics",
    "magnonics",
    "magnetic materials",
    "MANTiS",
    "x-ray spectromicroscopy",
    "research software",
    "Nix",
  ],
  authors: [{ name: "Ian Kengott" }],
  icons: {
    icon: "https://github.com/iankengott.png",
  },
  openGraph: {
    title: "Ian Kengott — Research Software & Magnetic Materials",
    description:
      "Dr. Arena lab support, magnonics, x-ray spectromicroscopy tooling, and reproducible research infrastructure.",
    type: "website",
    // opengraph-image.tsx is auto-detected by Next.js and serves at /opengraph-image
  },
  twitter: {
    card: "summary_large_image",
    title: "Ian Kengott",
    description: "Research-first portfolio: magnonics, MANTiS, research infrastructure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash — read user's mode (light/dark/system). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var legacy=localStorage.getItem('theme');var isDark=m==='dark'||(m==='system'||(!m&&legacy!=='light'))&&d||(!m&&legacy==='dark')||(m===null&&legacy===null&&d);if(isDark){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-background text-foreground grain`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
