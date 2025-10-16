import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RUTAS_API, CITA_ESTADOS, DIAS_SEMANA } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { add, format, parse, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";

const esquemaReprogramar = z.object({
  fecha_hora: z.date({ required_error: "Debe seleccionar una nueva fecha y hora." }),
});

export function DialogoReprogramarCita({ cita, onCitaReprogramada }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const medicoId = cita?.medicoId;

  const form = useForm({ resolver: zodResolver(esquemaReprogramar) });

  const { data: configData } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const duracionCitaMin = configData?.data?.configuracion?.duracion_cita_min || 30;

  const { data: horariosData } = useGetQuery(["horarios", medicoId], RUTAS_API.HORARIOS_MEDICO(medicoId), { enabled: !!medicoId && dialogoAbierto });
  const horarios = horariosData?.data?.horarios || [];
  const diasDeTrabajo = useMemo(() => horarios.map((h) => h.dia_semana), [horarios]);

  const fechaISO = fechaSeleccionada ? format(fechaSeleccionada, "yyyy-MM-dd") : null;
  const { data: citasOcupadasData, isLoading: cargandoCitasOcupadas } = useGetQuery(
    ["citasOcupadas", medicoId, fechaISO],
    RUTAS_API.CITAS_OCUPADAS_MEDICO(medicoId, fechaISO),
    { enabled: !!medicoId && !!fechaSeleccionada && dialogoAbierto }
  );
  const citasOcupadas = useMemo(
    () => new Set((citasOcupadasData?.data?.citas || []).map((c) => new Date(c.fecha_hora).getTime())),
    [citasOcupadasData]
  );

  const horariosDisponibles = useMemo(() => {
    if (!fechaSeleccionada || horarios.length === 0) return [];
    const diaSemana = fechaSeleccionada.getDay() === 0 ? 6 : fechaSeleccionada.getDay() - 1;
    const horarioDelDia = horarios.find((h) => h.dia_semana === diaSemana + 1);
    if (!horarioDelDia) return [];

    const slots = [];
    const inicio = parse(horarioDelDia.hora_inicio, "HH:mm:ss", fechaSeleccionada);
    const fin = parse(horarioDelDia.hora_fin, "HH:mm:ss", fechaSeleccionada);
    let horaActual = inicio;

    while (horaActual < fin) {
      const esPasado = horaActual < new Date();
      const esOcupado = citasOcupadas.has(horaActual.getTime());
      slots.push({ fecha: horaActual, disponible: !esPasado && !esOcupado });
      horaActual = add(horaActual, { minutes: duracionCitaMin });
    }
    return slots;
  }, [fechaSeleccionada, horarios, citasOcupadas, duracionCitaMin]);

  const mutacionReprogramar = useMutateQuery({
    queryKeyToInvalidate: ["citasPaciente", "agendaGlobal", ["historialCitasAdmin", cita?.pacienteId]],
    successMessage: "Cita reprogramada con éxito.",
  });

  const alEnviar = async (datos) => {
    await mutacionReprogramar.mutateAsync({
      endpoint: `${RUTAS_API.CITAS}/${cita.id}`,
      method: "PUT",
      body: { fecha_hora: datos.fecha_hora.toISOString(), estado: CITA_ESTADOS.PENDIENTE },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormItem>
                <FormLabel>1. Elige una nueva fecha</FormLabel>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={fechaSeleccionada}
                    onSelect={setFechaSeleccionada}
                    disabled={(date) => date < startOfDay(new Date()) || !diasDeTrabajo.includes(date.getDay())}
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
                      {cargandoCitasOcupadas ? (
                        <div className="space-y-2">
                          <Skeleton className="h-9 w-full" />
                          <Skeleton className="h-9 w-full" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                          {horariosDisponibles.map((slot, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant={field.value?.getTime() === slot.fecha.getTime() ? "default" : "outline"}
                              onClick={() => field.onChange(slot.fecha)}
                              disabled={!slot.disponible}
                            >
                              {format(slot.fecha, "HH:mm")}
                            </Button>
                          ))}
                        </div>
                      )}
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
