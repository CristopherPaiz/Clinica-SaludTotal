import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RUTAS_API, CITA_ESTADOS, NOMBRES_ESTADOS_CITA } from "@/lib/dictionaries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ContainerLoader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { DialogoReprogramarCita } from "@/paginas/privadas/paciente/DialogoReprogramarCita";
import { Loader2 } from "lucide-react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";

export function DialogoVerCitasPaciente({ paciente, open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetQuery(["historialCitasAdmin", paciente?.id], RUTAS_API.PACIENTES.HISTORIAL_CITAS(paciente?.id), {
    enabled: !!paciente && open,
  });
  const citas = data?.data?.citas || [];

  const mutacionActualizar = useMutateQuery({
    onSuccess: () => {
      toast.success("La cita ha sido actualizada.");
      queryClient.invalidateQueries(["historialCitasAdmin", paciente?.id]);
      queryClient.invalidateQueries(["agendaGlobal"]);
    },
  });

  const handleConfirmar = (citaId) => {
    mutacionActualizar.mutate({
      endpoint: `${RUTAS_API.CITAS}/${citaId}`,
      method: "PUT",
      body: { estado: CITA_ESTADOS.CONFIRMADA },
    });
    onOpenChange(false);
  };

  const handleCancelar = (citaId) => {
    mutacionActualizar.mutate({
      endpoint: `${RUTAS_API.CITAS}/${citaId}`,
      method: "DELETE",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Historial de Citas de {paciente?.nombre_completo}</DialogTitle>
          <DialogDescription>Visualiza y gestiona las citas del paciente.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <ContainerLoader />
          ) : (
            <div className="space-y-4">
              {citas.length > 0 ? (
                citas.map((cita) => {
                  const esCitaGestionable = cita.estado === CITA_ESTADOS.PENDIENTE || cita.estado === CITA_ESTADOS.CONFIRMADA;
                  return (
                    <div key={cita.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-4">
                      <div>
                        <p className="font-semibold">{format(new Date(cita.fecha_hora), "eeee, dd MMMM yyyy - HH:mm 'hrs'", { locale: es })}</p>
                        <p className="text-sm text-muted-foreground">Dr. {cita.medico.nombre_completo}</p>
                        <Badge variant="outline" className="mt-1">
                          {NOMBRES_ESTADOS_CITA[cita.estado]}
                        </Badge>
                      </div>

                      {esCitaGestionable && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <DialogoReprogramarCita
                            cita={cita}
                            onCitaReprogramada={() => queryClient.invalidateQueries(["historialCitasAdmin", paciente?.id])}
                          />

                          {cita.estado === CITA_ESTADOS.PENDIENTE && (
                            <Button variant="outline" size="sm" onClick={() => handleConfirmar(cita.id)} disabled={mutacionActualizar.isLoading}>
                              {mutacionActualizar.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Confirmar
                            </Button>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={mutacionActualizar.isLoading}>
                                {mutacionActualizar.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Cancelar cita
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Seguro que deseas cancelar esta cita?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCancelar(cita.id)}>Sí, cancelar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">Este paciente no tiene citas registradas.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
