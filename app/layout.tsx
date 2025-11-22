import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
