import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, CITA_ESTADOS } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { add, format, setHours, setMinutes, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const DURACION_CITA_MIN = 30;

function generarHorarios(fechaSeleccionada) {
  if (!fechaSeleccionada) return [];
  const horarios = [];
  let horaActual = setMinutes(setHours(startOfDay(fechaSeleccionada), 8), 0);
  const finJornada = setMinutes(setHours(startOfDay(fechaSeleccionada), 17), 0);

  while (horaActual < finJornada) {
    horarios.push(horaActual);
    horaActual = add(horaActual, { minutes: DURACION_CITA_MIN });
  }
  return horarios;
}

const esquemaReprogramar = z.object({
  fecha_hora: z.date({ required_error: "Debe seleccionar una nueva fecha y hora." }),
});

export function DialogoReprogramarCita({ cita, onCitaReprogramada }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  const mutacionReprogramar = useMutateQuery({
    queryKeyToInvalidate: ["citasPaciente"],
    successMessage: "Cita reprogramada con éxito.",
  });

  const form = useForm({
    resolver: zodResolver(esquemaReprogramar),
  });

  const horariosDisponibles = generarHorarios(fechaSeleccionada);

  const alEnviar = async (datos) => {
    await mutacionReprogramar.mutateAsync({
      endpoint: `${RUTAS_API.CITAS}/${cita.id}`,
      method: "PUT",
      body: {
        fecha_hora: datos.fecha_hora.toISOString(),
        estado: CITA_ESTADOS.PENDIENTE,
      },
    });
    setDialogoAbierto(false);
    onCitaReprogramada?.();
  };

  return (
    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Reprogramar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Reprogramar Cita</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Cita actual: {format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>1. Elige una nueva fecha</FormLabel>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={fechaSeleccionada}
                    onSelect={setFechaSeleccionada}
                    disabled={(date) => date < startOfDay(new Date()) || date.getDay() === 0}
                    className="rounded-md border"
                    locale={es}
                  />
                </div>
              </FormItem>
              {fechaSeleccionada && (
                <Controller
                  control={form.control}
                  name="fecha_hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Elige una nueva hora</FormLabel>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                        {horariosDisponibles.map((hora, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant={field.value?.getTime() === hora.getTime() ? "default" : "outline"}
                            onClick={() => field.onChange(hora)}
                          >
                            {format(hora, "HH:mm")}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutacionReprogramar.isPending || !form.formState.isValid}>
                {mutacionReprogramar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Reprogramación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
