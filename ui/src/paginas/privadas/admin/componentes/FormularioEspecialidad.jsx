import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { FormattedInput } from "@/components/ui/FormattedInput";

const esquema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
});

export function FormularioEspecialidad({ especialidad, alGuardar, cargando }) {
  const form = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { nombre: especialidad?.nombre || "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(alGuardar)} className="space-y-4">
        <FormattedInput control={form.control} name="nombre" label="Nombre de la Especialidad" formatType="alpha" disabled={cargando} />
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
