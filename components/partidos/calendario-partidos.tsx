"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format";
import Link from "next/link";

interface Partido {
  id: string;
  fecha: string | null;
  cancha: string | null;
  completado: boolean;
  goles_equipo_1: number | null;
  goles_equipo_2: number | null;
  equipo_local?: { id: string; nombre: string } | null;
  equipo_visitante?: { id: string; nombre: string } | null;
}

interface CalendarioPartidosProps {
  partidos: Partido[];
  torneoId?: string;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function CalendarioPartidos({ partidos, torneoId }: CalendarioPartidosProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first and last day of current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Group partidos by date
  const partidosByDate = useMemo(() => {
    const map = new Map<string, Partido[]>();

    for (const partido of partidos) {
      if (!partido.fecha) continue;

      const date = new Date(partido.fecha);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(partido);
    }

    return map;
  }, [partidos]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getPartidosForDay = (day: number): Partido[] => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return partidosByDate.get(dateKey) || [];
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendario de Partidos</CardTitle>
            <CardDescription>
              Vista mensual de todos los partidos programados
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[200px] text-center font-semibold">
              {MONTHS[currentMonth]} {currentYear}
            </div>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="text-center font-semibold text-sm text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[120px]" />;
            }

            const partidosForDay = getPartidosForDay(day);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`
                  min-h-[120px] p-2 border rounded-lg relative
                  ${today ? "bg-primary/5 border-primary" : "bg-background"}
                  hover:bg-accent/50 transition-colors
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`
                      text-sm font-medium
                      ${today ? "text-primary font-bold" : "text-foreground"}
                    `}
                  >
                    {day}
                  </span>
                  {partidosForDay.length > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {partidosForDay.length}
                    </Badge>
                  )}
                </div>

                {/* Partidos for this day */}
                <div className="space-y-1">
                  {partidosForDay.slice(0, 2).map(partido => (
                    <Link
                      key={partido.id}
                      href={`/partidos/${partido.id}`}
                      className="block"
                    >
                      <div className="text-xs p-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors">
                        {partido.fecha && (
                          <div className="font-medium text-xs mb-0.5">
                            {formatTime(new Date(partido.fecha))}
                          </div>
                        )}
                        <div className="truncate">
                          {partido.equipo_local?.nombre || "TBD"}
                        </div>
                        <div className="truncate text-muted-foreground">
                          vs {partido.equipo_visitante?.nombre || "TBD"}
                        </div>
                        {partido.completado && (
                          <div className="font-semibold text-primary mt-0.5">
                            {partido.goles_equipo_1} - {partido.goles_equipo_2}
                          </div>
                        )}
                        {partido.cancha && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {partido.cancha}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                  {partidosForDay.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground py-1">
                      +{partidosForDay.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/10" />
            <span>Partido programado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
