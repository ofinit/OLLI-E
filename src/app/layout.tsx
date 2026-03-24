import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLLI-E AI - The Only AI You'll Ever Need",
  description: "Experience superhuman intelligence without the complexity. OLLI-E abstracts the world's best models into specialized, layman-friendly niche tools.",
  openGraph: {
    title: "OLLI-E AI",
    description: "The premium AI aggregator for layman users.",
    images: ["/og-image.png"], // Placeholder path
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
