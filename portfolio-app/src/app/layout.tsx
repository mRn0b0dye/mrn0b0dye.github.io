import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/siteConfig";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">{children}</main>
        <div className="max-w-4xl mx-auto px-6 w-full">
          <Footer />
        </div>
      </body>
    </html>
  );
}
