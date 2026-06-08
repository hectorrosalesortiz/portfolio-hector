import type { Metadata, Viewport } from "next";
import { Inter, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { LoadingScreen } from "@/components/system/loading-screen";
import { ScrollProgress } from "@/components/system/scroll-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { personJsonLd } from "@/lib/structured-data";
import { profile } from "@/lib/portfolio-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-hector.vercel.app"),
  title: {
    default: `${profile.name} | Senior AI & Full Stack Engineer`,
    template: `%s | ${profile.name}`,
  },
  description: profile.subtitle,
  applicationName: "Hector Rosales Ortiz Portfolio",
  icons: {
    icon: [
      { url: "/assets/hr-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/assets/hr-icon.svg",
    apple: "/assets/hr-icon.svg",
  },
  keywords: [
    "Senior AI Engineer",
    "Full Stack Engineer",
    "Next.js",
    "OpenAI",
    "LangChain",
    "RAG",
    "React",
    "Cloud Architecture",
    "Enterprise AI",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} | Senior AI & Full Stack Engineer`,
    description: profile.subtitle,
    url: "https://portfolio-hector.vercel.app",
    siteName: "Hector Rosales Ortiz Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | Senior AI & Full Stack Engineer`,
    description: profile.subtitle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${spaceGrotesk.variable} dark`}>
      <body>
        <AppProviders>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
          />
          <LoadingScreen />
          <ScrollProgress />
          <div className="noise-overlay" />
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
