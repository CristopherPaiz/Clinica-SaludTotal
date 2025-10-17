import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { FormattedInput } from "@/components/ui/FormattedInput";

const esquemaPaciente = z.object({
  nombre_completo: z.string().min(3, "El nombre es obligatorio."),
  dpi: z.string().length(13, "El DPI debe tener 13 dígitos."),
  email: z.string().email("Email inválido."),
  telefono: z.string().min(8, "El teléfono es obligatorio."),
  username: z.string().min(3, "El usuario es obligatorio.").optional(),
});

export function FormularioPaciente({ paciente, alGuardar, cargando, esEdicion = false }) {
  const form = useForm({
    resolver: zodResolver(
      esquemaPaciente.refine((data) => esEdicion || data.username, {
        message: "El nombre de usuario es obligatorio para nuevos pacientes.",
        path: ["username"],
      })
    ),
    defaultValues: {
      nombre_completo: paciente?.nombre_completo || "",
      dpi: paciente?.dpi || "",
      email: paciente?.email || "",
      telefono: paciente?.telefono || "",
      username: paciente?.usuario?.username || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(alGuardar)} className="space-y-4">
        <FormattedInput control={form.control} name="nombre_completo" label="Nombre Completo" formatType="alpha" disabled={cargando} />
        <div className="grid grid-cols-2 gap-4">
          <FormattedInput control={form.control} name="dpi" label="DPI" formatType="number" maxLength={13} disabled={cargando} />
          <FormattedInput control={form.control} name="telefono" label="Teléfono" formatType="number" maxLength={8} disabled={cargando} />
        </div>
        <FormattedInput control={form.control} name="email" label="Email" type="email" disabled={cargando || esEdicion} />
        <FormattedInput control={form.control} name="username" label="Nombre de Usuario" formatType="alphanumeric" disabled={cargando || esEdicion} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={cargando}>
            {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
