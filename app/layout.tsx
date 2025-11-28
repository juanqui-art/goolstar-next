import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Montserrat, Rajdhani } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoolStar - Tournament Management",
  description: "Indoor soccer tournament management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${rajdhani.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
