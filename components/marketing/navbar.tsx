"use client";

import { PolygonButton } from "@/components/ui/polygon-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-white/10 py-2"
          : "bg-transparent py-4 bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="container mx-auto grid grid-cols-3 items-center gap-4">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center group justify-start">
          <img 
            src="/logooficial.png" 
            alt="GoolStar Logo" 
            className="h-14 w-auto transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
          />
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-display font-bold uppercase tracking-widest text-white/80 hover:text-primary transition-colors relative group"
          >
            Inicio
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-display font-bold uppercase tracking-widest text-white/80 hover:text-primary transition-colors relative group"
          >
            Premios
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-display font-bold uppercase tracking-widest text-white/80 hover:text-primary transition-colors relative group"
          >
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </button>
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/login" className="hidden sm:block">
            <span className="text-sm font-display font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">
              Soy Capitán
            </span>
          </Link>
          <PolygonButton
            variant="fill"
            size="sm"
            onClick={() => scrollToSection("registration-form")}
            className="hidden sm:flex"
          >
            Inscribirse
          </PolygonButton>
        </div>
      </div>
    </header>
  );
}
