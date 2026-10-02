import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CapacityConnect — Professional Learning Platform",
  description:
    "A modern digital learning management system for structured capacity building, competency development, and knowledge sharing in atmospheric and earth sciences.",
  keywords: [
    "Learning Management System",
    "Capacity Building",
    "Meteorology Training",
    "Online Courses",
    "Professional Development",
    "Earth Sciences",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
