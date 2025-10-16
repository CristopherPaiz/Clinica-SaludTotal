import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API, DIAS_SEMANA } from "@/lib/dictionaries";
import { esquemaNuevaCita } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, CheckCircle, Stethoscope, CalendarDays, Award } from "lucide-react";
import { add, format, parse, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PaginaNuevaCita() {
  const navegar = useNavigate();
  const [selectedMedicoId, setSelectedMedicoId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const form = useForm({ resolver: zodResolver(esquemaNuevaCita) });

  const { data: medicosData, isLoading: cargandoMedicos } = useGetQuery(["medicos"], RUTAS_API.MEDICOS);
  const { data: configData } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const medicos = medicosData?.data?.medicos || [];
  const duracionCitaMin = configData?.data?.configuracion?.duracion_cita_min || 30;

  const { data: horariosData, isLoading: cargandoHorarios } = useGetQuery(
    ["horarios", selectedMedicoId],
    RUTAS_API.HORARIOS_MEDICO(selectedMedicoId),
    { enabled: !!selectedMedicoId }
  );
  const horarios = horariosData?.data?.horarios || [];
  const diasDeTrabajo = useMemo(() => horarios.map((h) => h.dia_semana), [horarios]);

  const fechaISO = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const { data: citasOcupadasData, isLoading: cargandoCitasOcupadas } = useGetQuery(
    ["citasOcupadas", selectedMedicoId, fechaISO],
    RUTAS_API.CITAS_OCUPADAS_MEDICO(selectedMedicoId, fechaISO),
    { enabled: !!selectedMedicoId && !!selectedDate }
  );
  const citasOcupadas = useMemo(
    () => new Set((citasOcupadasData?.data?.citas || []).map((c) => new Date(c.fecha_hora).getTime())),
    [citasOcupadasData]
  );

  const horariosDisponibles = useMemo(() => {
    if (!selectedDate || horarios.length === 0) return [];
    const diaSemana = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
    const horarioDelDia = horarios.find((h) => h.dia_semana === diaSemana + 1);
    if (!horarioDelDia) return [];

    const slots = [];
    const inicio = parse(horarioDelDia.hora_inicio, "HH:mm:ss", selectedDate);
    const fin = parse(horarioDelDia.hora_fin, "HH:mm:ss", selectedDate);
    let horaActual = inicio;

    while (horaActual < fin) {
      const esPasado = horaActual < new Date();
      const esOcupado = citasOcupadas.has(horaActual.getTime());
      slots.push({ fecha: horaActual, disponible: !esPasado && !esOcupado });
      horaActual = add(horaActual, { minutes: duracionCitaMin });
    }
    return slots;
  }, [selectedDate, horarios, citasOcupadas, duracionCitaMin]);

  const mutacionCrearCita = useMutateQuery({ successMessage: "Cita agendada exitosamente." });

  const alEnviar = async (datos) => {
    await mutacionCrearCita.mutateAsync({
      endpoint: RUTAS_API.CITAS,
      body: { medicoId: Number(datos.medicoId), fecha_hora: datos.fecha_hora.toISOString() },
    });
    navegar("/paciente/citas");
  };

  const handleSelectMedico = (medicoId) => {
    setSelectedMedicoId(medicoId);
    setSelectedDate(null);
    form.reset({ medicoId, fecha_hora: undefined });
  };

  const selectedMedico = medicos.find((m) => m.id === Number(selectedMedicoId));

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Agenda tu Próxima Cita</h1>
        <p className="text-muted-foreground">Sigue estos 3 sencillos pasos para encontrar un horario.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className={selectedMedicoId ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    1
                  </span>
                  Elige un Médico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicoId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={handleSelectMedico} defaultValue={field.value} disabled={cargandoMedicos}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un médico..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicos.map((m) => (
                            <SelectItem key={m.id} value={String(m.id)}>
                              {m.nombre_completo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedMedico ? (
                  <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${selectedMedico.nombre_completo}`} />
                      <AvatarFallback>{selectedMedico.nombre_completo.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-sm">
                      <h4 className="font-bold text-base">{selectedMedico.nombre_completo}</h4>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Stethoscope className="h-4 w-4 text-primary" /> {selectedMedico.especialidad}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" /> {diasDeTrabajo.map((d) => DIAS_SEMANA[d]).join(", ")}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4 text-primary" /> Colegiado: {selectedMedico.colegiado}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-sm text-muted-foreground h-28 rounded-lg border-2 border-dashed">
                    <p>La información del médico aparecerá aquí.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={selectedMedicoId && selectedDate ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    2
                  </span>
                  Elige una Fecha
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMedicoId ? (
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < startOfDay(new Date()) || !diasDeTrabajo.includes(date.getDay())}
                    className="rounded-md border mx-auto"
                    locale={es}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Selecciona un médico para ver las fechas disponibles.</p>
                )}
              </CardContent>
            </Card>

            <Card className={form.watch("fecha_hora") ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    3
                  </span>
                  Elige una Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <Controller
                    control={form.control}
                    name="fecha_hora"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {cargandoCitasOcupadas ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Skeleton className="h-9 w-full col-span-full" />
                            <Skeleton className="h-9 w-full col-span-full" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                            {horariosDisponibles.length > 0 ? (
                              horariosDisponibles.map((slot, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant={field.value?.getTime() === slot.fecha.getTime() ? "default" : "outline"}
                                  onClick={() => field.onChange(slot.fecha)}
                                  disabled={!slot.disponible}
                                >
                                  {format(slot.fecha, "HH:mm")}
                                </Button>
                              ))
                            ) : (
                              <p className="col-span-full text-sm text-muted-foreground text-center py-4">No hay horarios para este día.</p>
                            )}
                          </div>
                        )}
                        <FormMessage />
                      </div>
                    )}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Selecciona una fecha para ver los horarios.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <Button type="submit" size="lg" disabled={mutacionCrearCita.isPending || !form.formState.isValid}>
              {mutacionCrearCita.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              Confirmar Cita
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
