import { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { ContainerLoader } from "@/components/common/Loader";
import { MoreHorizontal } from "lucide-react";
import { FormularioMedico } from "./FormularioMedico";

export function GestionMedicos() {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);

  const { data, isLoading } = useGetQuery(["adminMedicos"], RUTAS_API.MEDICOS);
  const medicos = data?.data?.medicos || [];

  const mutacionCrear = useMutateQuery({
    queryKeyToInvalidate: ["adminMedicos"],
    successMessage: "Médico creado con éxito.",
    onSuccess: () => setDialogoAbierto(false),
  });

  const mutacionActualizar = useMutateQuery({
    queryKeyToInvalidate: ["adminMedicos"],
    successMessage: "Médico actualizado con éxito.",
    onSuccess: () => {
      setDialogoAbierto(false);
      setMedicoSeleccionado(null);
    },
  });

  const mutacionEliminar = useMutateQuery({
    queryKeyToInvalidate: ["adminMedicos"],
    successMessage: "Médico eliminado con éxito.",
  });

  const handleGuardar = (datos) => {
    if (medicoSeleccionado) {
      mutacionActualizar.mutate({
        endpoint: `${RUTAS_API.ADMIN.MEDICOS}/${medicoSeleccionado.id}`,
        method: "PUT",
        body: datos,
      });
    } else {
      mutacionCrear.mutate({ endpoint: RUTAS_API.ADMIN.MEDICOS, body: datos });
    }
  };

  const handleEliminar = (id) => {
    mutacionEliminar.mutate({
      endpoint: `${RUTAS_API.ADMIN.MEDICOS}/${id}`,
      method: "DELETE",
    });
  };

  const abrirDialogo = (medico = null) => {
    setMedicoSeleccionado(medico);
    setDialogoAbierto(true);
  };

  if (isLoading) return <ContainerLoader />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialogo()}>Añadir Médico</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{medicoSeleccionado ? "Editar Médico" : "Añadir Nuevo Médico"}</DialogTitle>
            </DialogHeader>
            <FormularioMedico
              medico={medicoSeleccionado}
              alGuardar={handleGuardar}
              cargando={mutacionCrear.isPending || mutacionActualizar.isPending}
              esEdicion={!!medicoSeleccionado}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Colegiado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicos.length > 0 ? (
              medicos.map((medico) => (
                <TableRow key={medico.id}>
                  <TableCell>{medico.nombre_completo}</TableCell>
                  <TableCell>{medico.especialidad}</TableCell>
                  <TableCell>{medico.colegiado}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => abrirDialogo(medico)}>Editar</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Eliminar</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará al médico y su usuario asociado. No se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleEliminar(medico.id)}>Sí, eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No hay médicos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
