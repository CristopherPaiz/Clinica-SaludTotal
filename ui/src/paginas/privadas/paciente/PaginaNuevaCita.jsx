import { useForm } from "react-hook-form";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function PaginaNuevaCita() {
  const navegar = useNavigate();

  const { data: medicosData, isLoading: cargandoMedicos } = useGetQuery(["medicos"], RUTAS_API.MEDICOS);
  const medicos = medicosData?.data?.medicos || [];

  const mutacionCrearCita = useMutateQuery({
    successMessage: "Cita agendada exitosamente.",
  });

  const form = useForm({
    resolver: zodResolver(esquemaNuevaCita),
  });

  const alEnviar = async (datos) => {
    try {
      await mutacionCrearCita.mutateAsync({
        endpoint: RUTAS_API.CITAS,
        body: datos,
      });
      navegar("/paciente/citas");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Agendar Nueva Cita</CardTitle>
          <CardDescription>Selecciona un médico y una fecha para tu próxima cita.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-8">
              <FormField
                control={form.control}
                name="medicoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico</FormLabel>
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
              <FormField
                control={form.control}
                name="fecha_hora"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de la cita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutacionCrearCita.isPending}>
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
