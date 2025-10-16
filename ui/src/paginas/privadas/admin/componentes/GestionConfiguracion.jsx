import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContainerLoader } from "@/components/common/Loader";
import { Loader2 } from "lucide-react";

const esquemaConfiguracion = z.object({
  nombre_negocio: z.string().min(1, "El nombre es obligatorio."),
  servicios: z.string().min(1, "La descripción de servicios es obligatoria."),
  horarios: z.string().min(1, "El horario es obligatorio."),
  ubicacion: z.string().min(1, "La ubicación es obligatoria."),
  duracion_cita_min: z.coerce.number().int().positive("Debe ser un número positivo."),
  nosotros_texto: z.string().min(1, "El texto de 'Nosotros' es obligatorio."),
  mapa_coordenadas: z.string().min(1, "Las coordenadas del mapa son obligatorias."),
});

export function GestionConfiguracion() {
  const { data, isLoading } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const configuracion = data?.data?.configuracion;

  const mutacionActualizar = useMutateQuery({
    queryKeyToInvalidate: ["configuracion"],
    successMessage: "Configuración actualizada correctamente.",
  });

  const form = useForm({
    resolver: zodResolver(esquemaConfiguracion),
    defaultValues: {
      nombre_negocio: "",
      servicios: "",
      horarios: "",
      ubicacion: "",
      duracion_cita_min: 30,
      nosotros_texto: "",
      mapa_coordenadas: "",
    },
  });

  useEffect(() => {
    if (configuracion) {
      form.reset(configuracion);
    }
  }, [configuracion, form]);

  const alEnviar = (datos) => {
    mutacionActualizar.mutate({ endpoint: RUTAS_API.CONFIGURACION, method: "PUT", body: datos });
  };

  if (isLoading) return <ContainerLoader />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="nombre_negocio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Clínica</FormLabel>
              <FormControl>
                <Input {...field} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="servicios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción de Servicios</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mapa_coordenadas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenadas de Ubicación</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nosotros_texto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto Página "Nosotros"</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="horarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horarios de Atención</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input {...field} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duracion_cita_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración de Cita (minutos)</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={mutacionActualizar.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutacionActualizar.isPending}>
          {mutacionActualizar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
