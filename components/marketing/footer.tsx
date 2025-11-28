"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    Facebook,
    Instagram,
    Twitter,
    Youtube
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <img 
                src="/logooficial.png" 
                alt="GoolStar Logo" 
                className="h-16 w-auto drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              La plataforma definitiva para la gestión de torneos deportivos. 
              Donde la pasión se encuentra con la tecnología.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
              <SocialLink href="#" icon={<Youtube className="h-5 w-5" />} label="Youtube" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-display font-bold text-white uppercase tracking-widest mb-6">
              Torneo
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/" label="Inicio" />
              <FooterLink href="#premios" label="Premios" />
              <FooterLink href="#reglas" label="Reglas" />
              <FooterLink href="#equipos" label="Equipos" />
              <FooterLink href="#resultados" label="Resultados" />
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-display font-bold text-white uppercase tracking-widest mb-6">
              Soporte
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/faq" label="Preguntas Frecuentes" />
              <FooterLink href="/contacto" label="Contacto" />
              <FooterLink href="/terminos" label="Términos y Condiciones" />
              <FooterLink href="/privacidad" label="Política de Privacidad" />
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-display font-bold text-white uppercase tracking-widest mb-6">
              Mantente Informado
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Suscríbete para recibir noticias sobre nuevos torneos y eventos.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <Button className="w-full font-display uppercase tracking-wider font-bold">
                Suscribirse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} GoolStar. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>en Ecuador</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href}
      aria-label={label}
      className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
      >
        <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
        {label}
      </Link>
    </li>
  );
}
