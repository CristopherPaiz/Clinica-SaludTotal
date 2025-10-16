import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useGetQuery } from "@/hooks/useGetQuery";

const esquemaMedico = z.object({
  nombre_completo: z.string().min(3, "El nombre es obligatorio."),
  especialidad: z.string({ required_error: "Debe seleccionar una especialidad." }),
  colegiado: z.string().min(1, "El número de colegiado es obligatorio."),
  username: z.string().min(3, "El usuario es obligatorio.").optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional(),
});

export function FormularioMedico({ medico, alGuardar, cargando, esEdicion = false }) {
  const { data: especialidadesData, isLoading: cargandoEspecialidades } = useGetQuery(["especialidades"], RUTAS_API.ESPECIALIDADES);
  const especialidades = especialidadesData?.data?.especialidades || [];

  const form = useForm({
    resolver: zodResolver(
      esEdicion
        ? esquemaMedico.omit({ username: true, password: true })
        : esquemaMedico.refine((data) => esEdicion || data.password, {
            message: "La contraseña es obligatoria para nuevos médicos.",
            path: ["password"],
          })
    ),
    defaultValues: {
      nombre_completo: medico?.nombre_completo || "",
      especialidad: medico?.especialidad || "",
      colegiado: medico?.colegiado || "",
      username: "",
      password: "",
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

        <FormField
          control={form.control}
          name="especialidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={cargando || cargandoEspecialidades}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={cargandoEspecialidades ? "Cargando..." : "Seleccione una especialidad..."} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.nombre}>
                      {esp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colegiado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Colegiado</FormLabel>
              <FormControl>
                <Input {...field} disabled={cargando} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!esEdicion && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={cargando} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={cargando} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
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
