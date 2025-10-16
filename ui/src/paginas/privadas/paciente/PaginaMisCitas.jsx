import { Link } from "react-router-dom";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, NOMBRES_ESTADOS_CITA, COLORES_ESTADOS_CITA, CITA_ESTADOS } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PaginaMisCitas() {
  const { data, isLoading, isError, error } = useGetQuery(["citasPaciente"], RUTAS_API.CITAS);

  const mutacionCancelar = useMutateQuery({
    queryKeyToInvalidate: ["citasPaciente"],
    successMessage: "Cita cancelada correctamente.",
    errorMessage: "Error al cancelar la cita.",
  });

  const handleCancelarCita = (idCita) => {
    mutacionCancelar.mutate({
      endpoint: `${RUTAS_API.CITAS}/${idCita}`,
      method: "DELETE",
    });
  };

  const citas = data?.data?.citas?.rows || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Mis Citas</CardTitle>
            <CardDescription>Aquí puedes ver el historial de tus citas.</CardDescription>
          </div>
          <Button asChild>
            <Link to="/paciente/citas/nueva">Agendar Nueva Cita</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <ContainerLoader />}
          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !isError && citas.length === 0 && <p className="text-center text-muted-foreground">No tienes citas agendadas.</p>}
          {!isLoading && !isError && citas.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>{format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                    <TableCell>{cita.medico.nombre_completo}</TableCell>
                    <TableCell>{cita.medico.especialidad}</TableCell>
                    <TableCell>
                      <Badge variant={COLORES_ESTADOS_CITA[cita.estado]}>{NOMBRES_ESTADOS_CITA[cita.estado]}</Badge>
                    </TableCell>
                    <TableCell>
                      {cita.estado === CITA_ESTADOS.PENDIENTE && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={mutacionCancelar.isPending}>
                              Cancelar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer. Se cancelará tu cita permanentemente.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cerrar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelarCita(cita.id)}>Sí, cancelar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
