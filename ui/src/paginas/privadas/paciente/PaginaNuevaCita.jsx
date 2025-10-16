import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { esquemaNuevaCita } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function PaginaNuevaCita() {
  const navegar = useNavigate();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const { data: medicosData, isLoading: cargandoMedicos } = useGetQuery(["medicos"], RUTAS_API.MEDICOS);
  const medicos = medicosData?.data?.medicos || [];

  const mutacionCrearCita = useMutateQuery({
    successMessage: "Cita agendada exitosamente.",
  });

  const form = useForm({
    resolver: zodResolver(esquemaNuevaCita),
  });

  const medicoIdSeleccionado = form.watch("medicoId");
  const horariosDisponibles = generarHorarios(fechaSeleccionada);

  const alEnviar = async (datos) => {
    try {
      await mutacionCrearCita.mutateAsync({
        endpoint: RUTAS_API.CITAS,
        body: {
          medicoId: Number(datos.medicoId),
          fecha_hora: datos.fecha_hora.toISOString(),
        },
      });
      navegar("/paciente/citas");
    } catch (error) {
      console.error("Error al crear la cita:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Agendar Nueva Cita</CardTitle>
          <CardDescription>Completa los 3 pasos para agendar tu cita.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paso 1: Elige un médico</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={cargandoMedicos}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un médico..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medicos.map((medico) => (
                              <SelectItem key={medico.id} value={String(medico.id)}>
                                {medico.nombre_completo} ({medico.especialidad})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {medicoIdSeleccionado && (
                    <FormItem>
                      <FormLabel>Paso 2: Elige una fecha</FormLabel>
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
                  )}
                </div>

                {fechaSeleccionada && (
                  <Controller
                    control={form.control}
                    name="fecha_hora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paso 3: Elige una hora</FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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

              <Button type="submit" disabled={mutacionCrearCita.isPending || !form.formState.isValid}>
                {mutacionCrearCita.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Agendar Cita
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
