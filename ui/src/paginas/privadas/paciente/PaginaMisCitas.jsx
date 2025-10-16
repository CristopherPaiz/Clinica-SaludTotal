import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, NOMBRES_ESTADOS_CITA, COLORES_ESTADOS_CITA, CITA_ESTADOS } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { DialogoReprogramarCita } from "./DialogoReprogramarCita";
import { CalendarPlus, Calendar, Clock, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const CITAS_POR_PAGINA = 5;

function CitaCard({ cita, onCancelar }) {
  const esCitaFutura = cita.estado === CITA_ESTADOS.PENDIENTE || cita.estado === CITA_ESTADOS.CONFIRMADA;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${cita.medico.nombre_completo}`} />
            <AvatarFallback>{cita.medico.nombre_completo.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{cita.medico.nombre_completo}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Stethoscope className="h-4 w-4" /> {cita.medico.especialidad}
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-foreground">{format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium text-foreground">{format(new Date(cita.fecha_hora), "HH:mm 'hrs'", { locale: es })}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
          <Badge variant={COLORES_ESTADOS_CITA[cita.estado]} className="mb-2 sm:mb-0">
            {NOMBRES_ESTADOS_CITA[cita.estado]}
          </Badge>
          {esCitaFutura && (
            <div className="flex gap-2">
              <DialogoReprogramarCita cita={cita} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
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
                    <AlertDialogAction onClick={() => onCancelar(cita.id)}>Sí, cancelar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PaginaMisCitas() {
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = `${RUTAS_API.CITAS}?page=${currentPage}&size=${CITAS_POR_PAGINA}`;
  const { data, isLoading, isError, error } = useGetQuery(["citasPaciente", currentPage], endpoint);

  const mutacionCancelar = useMutateQuery({
    queryKeyToInvalidate: ["citasPaciente", currentPage],
    successMessage: "Cita cancelada correctamente.",
  });

  const citas = data?.data?.citas?.rows || [];
  const totalCitas = data?.data?.citas?.count || 0;
  const totalPages = Math.ceil(totalCitas / CITAS_POR_PAGINA);

  const handleCancelarCita = (idCita) => {
    mutacionCancelar.mutate({
      endpoint: `${RUTAS_API.CITAS}/${idCita}`,
      method: "DELETE",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Citas</h1>
          <p className="text-muted-foreground">Aquí puedes ver tu historial y gestionar tus próximas citas.</p>
        </div>
        <Button asChild>
          <Link to="/paciente/citas/nueva">Agendar Nueva Cita</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && <ContainerLoader />}
        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && citas.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tienes citas agendadas</h3>
            <p className="mt-1 text-sm text-muted-foreground">¡Agenda tu primera cita para comenzar!</p>
          </div>
        )}
        {!isLoading && !isError && citas.length > 0 && (
          <>
            <div className="space-y-4">
              {citas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} onCancelar={handleCancelarCita} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm font-medium">
                      Página {currentPage} de {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
