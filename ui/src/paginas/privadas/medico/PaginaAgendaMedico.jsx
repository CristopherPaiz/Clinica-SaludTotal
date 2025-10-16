import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, NOMBRES_ESTADOS_CITA, CITA_ESTADOS } from "@/lib/dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { CalendarX2 } from "lucide-react";

export function PaginaAgendaMedico() {
  const [nota, setNota] = useState("");
  const { data, isLoading, isError, error } = useGetQuery(["citasMedico"], RUTAS_API.CITAS);

  const mutacionAtender = useMutateQuery({
    queryKeyToInvalidate: ["citasMedico"],
    successMessage: "Cita marcada como atendida.",
  });

  const citas = data?.data?.citas?.rows || [];
  const citasPendientes = citas.filter((c) => c.estado === CITA_ESTADOS.PENDIENTE || c.estado === CITA_ESTADOS.CONFIRMADA);

  const handleAtenderCita = (idCita) => {
    mutacionAtender.mutate({
      endpoint: `${RUTAS_API.CITAS}/${idCita}`,
      method: "PUT",
      body: {
        estado: CITA_ESTADOS.ATENDIDA,
        nota: nota,
      },
    });
    setNota("");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Mi Agenda</CardTitle>
          <CardDescription>Visualiza y gestiona tus citas pendientes.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <ContainerLoader />}
          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !isError && citasPendientes.length === 0 && (
            <div className="text-center py-12">
              <CalendarX2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Sin citas pendientes</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tu agenda está libre por el momento.</p>
            </div>
          )}
          {!isLoading && !isError && citasPendientes.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citasPendientes.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                      <TableCell>{cita.paciente.nombre_completo}</TableCell>
                      <TableCell>{NOMBRES_ESTADOS_CITA[cita.estado]}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Atender</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Atender Cita</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Textarea
                                placeholder="Añade una nota breve sobre la consulta (opcional)..."
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={() => handleAtenderCita(cita.id)} disabled={mutacionAtender.isPending}>
                                  Marcar como Atendida
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
