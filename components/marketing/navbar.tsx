import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/">GoolStar</Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Registrarse</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
