import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { AuthProvider, HandwritingProvider } from "@/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LetterBuddy - Transform Your Handwriting with AI",
  description: "Master beautiful, legible handwriting with AI-powered photo analysis. Perfect for iPad, Apple Pencil, and drawing tablets.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <HandwritingProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </HandwritingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
