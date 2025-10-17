import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContainerLoader } from "@/components/common/Loader";
import { Loader2 } from "lucide-react";
import { FormattedInput } from "@/components/ui/FormattedInput";
import { FormattedTextarea } from "@/components/ui/FormattedTextarea";

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
        <FormattedInput control={form.control} name="nombre_negocio" label="Nombre de la Clínica" disabled={mutacionActualizar.isPending} />
        <FormattedTextarea
          control={form.control}
          name="servicios"
          label="Descripción de Servicios"
          rows={3}
          disabled={mutacionActualizar.isPending}
        />
        <FormattedInput
          control={form.control}
          name="mapa_coordenadas"
          label="Coordenadas de Ubicación (lat, lon)"
          disabled={mutacionActualizar.isPending}
        />
        <FormattedTextarea
          control={form.control}
          name="nosotros_texto"
          label='Texto Página "Nosotros"'
          rows={5}
          disabled={mutacionActualizar.isPending}
        />
        <FormattedTextarea control={form.control} name="horarios" label="Horarios de Atención" rows={3} disabled={mutacionActualizar.isPending} />
        <FormattedInput control={form.control} name="ubicacion" label="Ubicación" disabled={mutacionActualizar.isPending} />
        <FormattedInput
          control={form.control}
          name="duracion_cita_min"
          label="Duración de Cita (minutos)"
          type="number"
          formatType="number"
          disabled={mutacionActualizar.isPending}
        />
        <Button type="submit" disabled={mutacionActualizar.isPending}>
          {mutacionActualizar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}
