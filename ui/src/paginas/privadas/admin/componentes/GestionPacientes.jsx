import { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
import { FormularioPaciente } from "./FormularioPaciente";
import { DialogoVerCitasPaciente } from "./DialogoVerCitasPaciente";

export function GestionPacientes() {
  const [dialogoFormularioAbierto, setDialogoFormularioAbierto] = useState(false);
  const [dialogoCitasAbierto, setDialogoCitasAbierto] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const { data, isLoading } = useGetQuery(["adminPacientes"], RUTAS_API.PACIENTES.BASE);
  const pacientes = data?.data?.pacientes?.rows || [];

  const mutacionCrear = useMutateQuery({
    queryKeyToInvalidate: ["adminPacientes"],
    successMessage: "Paciente creado.",
    onSuccess: () => setDialogoFormularioAbierto(false),
  });
  const mutacionActualizar = useMutateQuery({
    queryKeyToInvalidate: ["adminPacientes"],
    successMessage: "Paciente actualizado.",
    onSuccess: () => {
      setDialogoFormularioAbierto(false);
      setPacienteSeleccionado(null);
    },
  });
  const mutacionEliminar = useMutateQuery({ queryKeyToInvalidate: ["adminPacientes"], successMessage: "Paciente eliminado." });

  const handleGuardar = (datos) => {
    if (pacienteSeleccionado && pacienteSeleccionado.id) {
      mutacionActualizar.mutate({ endpoint: `${RUTAS_API.ADMIN.PACIENTES}/${pacienteSeleccionado.id}`, method: "PUT", body: datos });
    } else {
      mutacionCrear.mutate({ endpoint: RUTAS_API.ADMIN.PACIENTES, body: datos });
    }
  };

  const handleEliminar = (id) => {
    mutacionEliminar.mutate({ endpoint: `${RUTAS_API.ADMIN.PACIENTES}/${id}`, method: "DELETE" });
  };

  const abrirDialogoFormulario = (paciente = null) => {
    setPacienteSeleccionado(paciente);
    setDialogoFormularioAbierto(true);
  };

  const abrirDialogoCitas = (paciente) => {
    setPacienteSeleccionado(paciente);
    setDialogoCitasAbierto(true);
  };

  if (isLoading) return <ContainerLoader />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogoFormularioAbierto} onOpenChange={setDialogoFormularioAbierto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialogoFormulario()}>Añadir Paciente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{pacienteSeleccionado?.id ? "Editar Paciente" : "Añadir Nuevo Paciente"}</DialogTitle>
            </DialogHeader>
            <FormularioPaciente
              paciente={pacienteSeleccionado}
              alGuardar={handleGuardar}
              cargando={mutacionCrear.isPending || mutacionActualizar.isPending}
              esEdicion={!!pacienteSeleccionado?.id}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>DPI</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pacientes.map((paciente) => (
              <TableRow key={paciente.id}>
                <TableCell>{paciente.nombre_completo}</TableCell>
                <TableCell>{paciente.email}</TableCell>
                <TableCell>{paciente.telefono}</TableCell>
                <TableCell>{paciente.dpi}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => abrirDialogoCitas(paciente)}>Ver Citas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => abrirDialogoFormulario(paciente)}>Editar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción eliminará al paciente y su usuario. No se puede deshacer.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEliminar(paciente.id)}>Sí, eliminar</AlertDialogAction>
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

      <DialogoVerCitasPaciente paciente={pacienteSeleccionado} open={dialogoCitasAbierto} onOpenChange={setDialogoCitasAbierto} />
    </>
  );
}
