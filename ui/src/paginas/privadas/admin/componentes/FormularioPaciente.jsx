import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

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
        <FormField
          control={form.control}
          name="nombre_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input {...field} disabled={cargando} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dpi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DPI</FormLabel>
                <FormControl>
                  <Input {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={cargando || esEdicion} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input {...field} disabled={cargando || esEdicion} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
