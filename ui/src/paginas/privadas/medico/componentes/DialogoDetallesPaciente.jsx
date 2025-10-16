import React, { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, CITA_ESTADOS, NOMBRES_ESTADOS_CITA, COLORES_ESTADOS_CITA } from "@/lib/dictionaries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContainerLoader } from "@/components/common/Loader";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, Phone, Fingerprint, Loader2, CalendarClock } from "lucide-react";

function HistorialDeCitas({ pacienteId }) {
  const { data, isLoading } = useGetQuery(["historialCitas", pacienteId], RUTAS_API.PACIENTES.HISTORIAL_CITAS(pacienteId), { enabled: !!pacienteId });
  const historial = data?.data?.citas || [];

  if (isLoading) return <ContainerLoader />;

  return (
    <div className="mt-4 border rounded-md max-h-80 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historial.length > 0 ? (
            historial.map((cita) => (
              <TableRow key={cita.id}>
                <TableCell>{format(new Date(cita.fecha_hora), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                <TableCell>{cita.medico.nombre_completo}</TableCell>
                <TableCell>
                  <Badge variant={COLORES_ESTADOS_CITA[cita.estado]}>{NOMBRES_ESTADOS_CITA[cita.estado]}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No hay citas anteriores.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function DialogoDetallesPaciente({ cita, open, onOpenChange, onCitaAtendida }) {
  const [nota, setNota] = useState("");
  const paciente = cita?.paciente;

  const mutacionAtender = useMutateQuery({
    queryKeyToInvalidate: ["citasMedico"],
    successMessage: "Cita marcada como atendida.",
  });

  const handleAtenderCita = () => {
    mutacionAtender.mutate(
      {
        endpoint: `${RUTAS_API.CITAS}/${cita.id}`,
        method: "PUT",
        body: {
          estado: CITA_ESTADOS.ATENDIDA,
          nota: nota,
        },
      },
      {
        onSuccess: () => {
          setNota("");
          onOpenChange(false);
          onCitaAtendida?.();
        },
      }
    );
  };

  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{paciente.nombre_completo}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="informacion">
          <TabsList>
            <TabsTrigger value="informacion">Información Personal</TabsTrigger>
            <TabsTrigger value="historial">Historial de Citas</TabsTrigger>
          </TabsList>
          <TabsContent value="informacion" className="py-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-muted-foreground" /> <strong>DPI:</strong> {paciente.dpi}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" /> <strong>Email:</strong> {paciente.email}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" /> <strong>Teléfono:</strong> {paciente.telefono}
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="historial">
            <HistorialDeCitas pacienteId={paciente.id} />
          </TabsContent>
        </Tabs>
        {cita.estado !== CITA_ESTADOS.ATENDIDA && cita.estado !== CITA_ESTADOS.CANCELADA && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Atender Cita Actual</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </p>
            <Textarea placeholder="Añade una nota sobre la consulta (opcional)..." value={nota} onChange={(e) => setNota(e.target.value)} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
              <Button onClick={handleAtenderCita} disabled={mutacionAtender.isPending}>
                {mutacionAtender.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Marcar como Atendida
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
