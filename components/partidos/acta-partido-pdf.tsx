"use client";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  matchInfo: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: "30%",
  },
  value: {
    width: "70%",
  },
  scoreBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    border: 1,
    borderColor: "#000",
  },
  teamName: {
    fontSize: 14,
    fontWeight: "bold",
    width: "40%",
    textAlign: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    width: "20%",
    textAlign: "center",
  },
  separator: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  table: {
    width: "100%",
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 5,
    fontWeight: "bold",
    borderBottom: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottom: 0.5,
    borderBottomColor: "#ccc",
  },
  tableCol1: {
    width: "10%",
  },
  tableCol2: {
    width: "50%",
  },
  tableCol3: {
    width: "20%",
  },
  tableCol4: {
    width: "20%",
  },
  yellowCard: {
    color: "#FDB813",
  },
  redCard: {
    color: "#DC2626",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: "#000",
    paddingTop: 10,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  signatureBox: {
    width: "30%",
    borderTop: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 9,
  },
});

interface ActaPartidoPDFProps {
  data: {
    partido: {
      id: string;
      fecha: string | null;
      cancha: string | null;
      goles_equipo_1: number | null;
      goles_equipo_2: number | null;
      equipo_local?: { id: string; nombre: string } | null;
      equipo_visitante?: { id: string; nombre: string } | null;
      arbitros?: { id: string; nombre: string; apellido: string } | null;
      torneos?: { id: string; nombre: string } | null;
    };
    goles: Array<{
      id: string;
      minuto: number;
      equipo_id: string;
      jugadores?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
    tarjetas: Array<{
      id: string;
      minuto: number;
      tipo: string;
      equipo_id: string;
      jugadores?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
    cambios: Array<{
      id: string;
      minuto: number;
      equipo_id: string;
      jugador_sale?: { primer_nombre: string; primer_apellido: string } | null;
      jugador_entra?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
  };
}

export function ActaPartidoPDF({ data }: ActaPartidoPDFProps) {
  const { partido, goles, tarjetas, cambios } = data;

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "No especificada";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ACTA OFICIAL DE PARTIDO</Text>
          <Text style={styles.subtitle}>
            {partido.torneos?.nombre || "GoolStar Tournament"}
          </Text>
        </View>

        {/* Match Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL PARTIDO</Text>
          <View style={styles.matchInfo}>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha y Hora:</Text>
              <Text style={styles.value}>{formatFecha(partido.fecha)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cancha:</Text>
              <Text style={styles.value}>
                {partido.cancha || "No especificada"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Árbitro:</Text>
              <Text style={styles.value}>
                {partido.arbitros
                  ? `${partido.arbitros.nombre} ${partido.arbitros.apellido}`
                  : "No especificado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Score Box */}
        <View style={styles.scoreBox}>
          <Text style={styles.teamName}>
            {partido.equipo_local?.nombre || "Equipo 1"}
          </Text>
          <Text style={styles.score}>{partido.goles_equipo_1 ?? 0}</Text>
          <Text style={styles.separator}>-</Text>
          <Text style={styles.score}>{partido.goles_equipo_2 ?? 0}</Text>
          <Text style={styles.teamName}>
            {partido.equipo_visitante?.nombre || "Equipo 2"}
          </Text>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GOLES</Text>
          {goles.length === 0 ? (
            <Text style={{ fontStyle: "italic", color: "#666", marginTop: 5 }}>
              No se registraron goles en este partido
            </Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol1}>MIN</Text>
                <Text style={styles.tableCol2}>JUGADOR</Text>
                <Text style={styles.tableCol3}>EQUIPO</Text>
              </View>
              {goles.map((gol) => {
                const equipoNombre =
                  gol.equipo_id === partido.equipo_local?.id
                    ? partido.equipo_local?.nombre
                    : partido.equipo_visitante?.nombre;
                return (
                  <View key={gol.id} style={styles.tableRow}>
                    <Text style={styles.tableCol1}>{gol.minuto}'</Text>
                    <Text style={styles.tableCol2}>
                      {gol.jugadores
                        ? `${gol.jugadores.primer_nombre} ${gol.jugadores.primer_apellido}`
                        : "Desconocido"}
                    </Text>
                    <Text style={styles.tableCol3}>{equipoNombre}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TARJETAS</Text>
          {tarjetas.length === 0 ? (
            <Text style={{ fontStyle: "italic", color: "#666", marginTop: 5 }}>
              No se registraron tarjetas en este partido
            </Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol1}>MIN</Text>
                <Text style={styles.tableCol2}>JUGADOR</Text>
                <Text style={styles.tableCol3}>TIPO</Text>
                <Text style={styles.tableCol4}>EQUIPO</Text>
              </View>
              {tarjetas.map((tarjeta) => {
                const equipoNombre =
                  tarjeta.equipo_id === partido.equipo_local?.id
                    ? partido.equipo_local?.nombre
                    : partido.equipo_visitante?.nombre;
                return (
                  <View key={tarjeta.id} style={styles.tableRow}>
                    <Text style={styles.tableCol1}>{tarjeta.minuto}'</Text>
                    <Text style={styles.tableCol2}>
                      {tarjeta.jugadores
                        ? `${tarjeta.jugadores.primer_nombre} ${tarjeta.jugadores.primer_apellido}`
                        : "Desconocido"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCol3,
                        tarjeta.tipo === "AMARILLA"
                          ? styles.yellowCard
                          : styles.redCard,
                      ]}
                    >
                      {tarjeta.tipo}
                    </Text>
                    <Text style={styles.tableCol4}>{equipoNombre}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Substitutions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAMBIOS</Text>
          {cambios.length === 0 ? (
            <Text style={{ fontStyle: "italic", color: "#666", marginTop: 5 }}>
              No se registraron cambios en este partido
            </Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol1}>MIN</Text>
                <Text style={styles.tableCol2}>SALE → ENTRA</Text>
                <Text style={styles.tableCol3}>EQUIPO</Text>
              </View>
              {cambios.map((cambio) => {
                const equipoNombre =
                  cambio.equipo_id === partido.equipo_local?.id
                    ? partido.equipo_local?.nombre
                    : partido.equipo_visitante?.nombre;
                return (
                  <View key={cambio.id} style={styles.tableRow}>
                    <Text style={styles.tableCol1}>{cambio.minuto}'</Text>
                    <Text style={styles.tableCol2}>
                      {cambio.jugador_sale
                        ? `${cambio.jugador_sale.primer_nombre} ${cambio.jugador_sale.primer_apellido}`
                        : "?"}{" "}
                      →{" "}
                      {cambio.jugador_entra
                        ? `${cambio.jugador_entra.primer_nombre} ${cambio.jugador_entra.primer_apellido}`
                        : "?"}
                    </Text>
                    <Text style={styles.tableCol3}>{equipoNombre}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text>Árbitro</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Capitán Equipo Local</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Capitán Equipo Visitante</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado el{" "}
            {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            - GoolStar Tournament Management System
          </Text>
        </View>
      </Page>
    </Document>
  );
}
