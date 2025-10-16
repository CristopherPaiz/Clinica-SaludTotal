import React from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, NOMBRES_ESTADOS_CITA, CITA_ESTADOS } from "@/lib/dictionaries";
import { ContainerLoader } from "@/components/common/Loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export function GestionAgendaGlobal() {
  const { data, isLoading, refetch } = useGetQuery(["agendaGlobal"], RUTAS_API.CITAS);
  const citas = data?.data?.citas?.rows || [];

  const mutacionActualizar = useMutateQuery({
    onSuccess: () => {
      toast.success("Estado de la cita actualizado.");
      refetch();
    },
  });

  const handleUpdateStatus = (citaId, estado) => {
    mutacionActualizar.mutate({
      endpoint: `${RUTAS_API.CITAS}/${citaId}`,
      method: "PUT",
      body: { estado },
    });
  };

  if (isLoading) return <ContainerLoader />;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{format(new Date(cita.fecha_hora), "dd/MM/yy HH:mm", { locale: es })}</TableCell>
              <TableCell>{cita.paciente.nombre_completo}</TableCell>
              <TableCell>{cita.medico.nombre_completo}</TableCell>
              <TableCell>
                <Badge variant="outline">{NOMBRES_ESTADOS_CITA[cita.estado]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateStatus(cita.id, CITA_ESTADOS.CONFIRMADA)}>Confirmar Cita</DropdownMenuItem>
                    {/* La reprogramación se puede añadir aquí con un Dialogo */}
                    <DropdownMenuItem>Reprogramar (próximamente)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(cita.id, CITA_ESTADOS.CANCELADA)}>
                      Cancelar Cita
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
