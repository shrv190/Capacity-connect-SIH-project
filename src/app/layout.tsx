import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CAPACITY CONNECT | Ministry of Earth Sciences & India Meteorological Department",
  description:
    "Official Digital Capacity Building and Learning Management Portal (LMS) for organizational training, competency development, and knowledge sharing across India's atmospheric and earth sciences workforce.",
  keywords: [
    "MoES",
    "IMD",
    "Capacity Building",
    "Learning Management Portal",
    "Meteorology",
    "Doppler Weather Radar",
    "NWP",
    "Cyclone Warning",
    "Earth Sciences",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
