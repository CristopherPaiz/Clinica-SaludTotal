import React from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API, CITA_ESTADOS } from "@/lib/dictionaries";
import { ContainerLoader } from "@/components/common/Loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Archive } from "lucide-react";

export function HistorialCitasTab() {
  const { data, isLoading } = useGetQuery(["citasAtendidasMedico"], `${RUTAS_API.CITAS}?estado=${CITA_ESTADOS.ATENDIDA}`);
  const historial = data?.data?.citas?.rows || [];

  if (isLoading) return <ContainerLoader />;

  if (historial.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Archive className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Sin historial</h3>
        <p className="mt-1 text-sm">Aún no has marcado ninguna cita como atendida.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Fecha de Atención</TableHead>
            <TableHead className="text-center">Notas de Consulta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historial.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.paciente.nombre_completo}</TableCell>
              <TableCell>{format(new Date(cita.fecha_hora), "dd 'de' MMMM, yyyy", { locale: es })}</TableCell>
              <TableCell className="text-center">
                {cita.nota ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Ver Notas</AccordionTrigger>
                      <AccordionContent className="text-left whitespace-pre-wrap">{cita.nota}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <span className="text-xs text-muted-foreground">Sin notas</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
