import { useState } from "react";
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
import { FormularioEspecialidad } from "./FormularioEspecialidad";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";

export function GestionEspecialidades() {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const { data, isLoading } = useGetQuery(["especialidades"], RUTAS_API.ESPECIALIDADES);
  const especialidades = data?.data?.especialidades || [];

  const mutacionCrear = useMutateQuery({
    queryKeyToInvalidate: ["especialidades"],
    successMessage: "Especialidad creada.",
    onSuccess: () => setDialogoAbierto(false),
  });
  const mutacionActualizar = useMutateQuery({
    queryKeyToInvalidate: ["especialidades"],
    successMessage: "Especialidad actualizada.",
    onSuccess: () => {
      setDialogoAbierto(false);
      setItemSeleccionado(null);
    },
  });
  const mutacionEliminar = useMutateQuery({ queryKeyToInvalidate: ["especialidades"], successMessage: "Especialidad eliminada." });

  const handleGuardar = (datos) => {
    if (itemSeleccionado) {
      mutacionActualizar.mutate({ endpoint: `${RUTAS_API.ESPECIALIDADES}/${itemSeleccionado.id}`, method: "PUT", body: datos });
    } else {
      mutacionCrear.mutate({ endpoint: RUTAS_API.ESPECIALIDADES, body: datos });
    }
  };

  const handleEliminar = (id) => {
    mutacionEliminar.mutate({ endpoint: `${RUTAS_API.ESPECIALIDADES}/${id}`, method: "DELETE" });
  };

  const abrirDialogo = (item = null) => {
    setItemSeleccionado(item);
    setDialogoAbierto(true);
  };

  if (isLoading) return <ContainerLoader />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialogo()}>Añadir Especialidad</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{itemSeleccionado ? "Editar" : "Añadir"} Especialidad</DialogTitle>
            </DialogHeader>
            <FormularioEspecialidad
              especialidad={itemSeleccionado}
              alGuardar={handleGuardar}
              cargando={mutacionCrear.isPending || mutacionActualizar.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {especialidades.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => abrirDialogo(item)}>Editar</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEliminar(item.id)}>Sí, eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
