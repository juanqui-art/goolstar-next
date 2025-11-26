import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  DollarSign,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Gestiona tus torneos como un profesional
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                La plataforma todo en uno para organizar torneos de fútbol.
                Estadísticas automáticas, gestión financiera y control total de
                tus competiciones.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8">
                  Empieza Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Características Principales
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Todo lo que necesitas para tu torneo
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Olvídate de las hojas de cálculo y los papeles. GoolStar
                centraliza toda la gestión de tu torneo en un solo lugar.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Trophy className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Gestión de Torneos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crea y administra múltiples torneos, categorías y fases.
                  Configura reglas y formatos de competición fácilmente.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Estadísticas Automáticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tablas de posiciones, goleadores y estadísticas de equipo se
                  actualizan automáticamente al finalizar cada partido.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Control Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lleva el control de inscripciones, pagos, multas y deudas de
                  cada equipo. Genera reportes financieros claros.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Equipos y Jugadores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestiona la información de equipos y jugadores, incluyendo
                  documentación y fotos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Calendario y Fixture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Organiza el calendario de partidos, asigna canchas y horarios.
                  Visualiza el fixture completo.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Actas Digitales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Registra goles, tarjetas y cambios en tiempo real. Genera
                  actas de partido digitales y listas para imprimir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                ¿Listo para profesionalizar tu torneo?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Únete a los organizadores que ya están usando GoolStar para
                llevar sus torneos al siguiente nivel.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8">
                  Crear Cuenta Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
