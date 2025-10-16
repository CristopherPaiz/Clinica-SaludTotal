import React, { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API, CITA_ESTADOS } from "@/lib/dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarX2, UserSearch, Calendar, Clock, User } from "lucide-react";
import { DialogoDetallesPaciente } from "./componentes/DialogoDetallesPaciente";
import { HistorialCitasTab } from "./componentes/HistorialCitasTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CitaPendienteCard({ cita, onVerDetalles }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${cita.paciente.nombre_completo}`} />
            <AvatarFallback>{cita.paciente.nombre_completo.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {cita.paciente.nombre_completo}
            </p>
            <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4 mt-1">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(cita.fecha_hora), "eeee, dd 'de' MMMM", { locale: es })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {format(new Date(cita.fecha_hora), "HH:mm 'hrs'", { locale: es })}
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={() => onVerDetalles(cita)} className="w-full sm:w-auto flex-shrink-0">
          <UserSearch className="mr-2 h-4 w-4" />
          Ver Detalles y Atender
        </Button>
      </CardContent>
    </Card>
  );
}

export function PaginaAgendaMedico() {
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetQuery(["citasMedico"], RUTAS_API.CITAS);

  const citas = data?.data?.citas?.rows || [];
  const citasPendientes = citas.filter((c) => c.estado === CITA_ESTADOS.PENDIENTE || c.estado === CITA_ESTADOS.CONFIRMADA);

  const handleVerDetalles = (cita) => {
    setCitaSeleccionada(cita);
    setDialogoAbierto(true);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="pendientes">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Mi Agenda</h1>
              <p className="text-muted-foreground">Gestiona tus citas pendientes y consulta tu historial de atenciones.</p>
            </div>
            <TabsList>
              <TabsTrigger value="pendientes">Citas Pendientes</TabsTrigger>
              <TabsTrigger value="historial">Historial de Atendidas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pendientes">
            {isLoading && <ContainerLoader />}
            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            {!isLoading &&
              !isError &&
              (citasPendientes.length > 0 ? (
                <div className="space-y-4">
                  {citasPendientes.map((cita) => (
                    <CitaPendienteCard key={cita.id} cita={cita} onVerDetalles={handleVerDetalles} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <CalendarX2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Sin citas pendientes</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Tu agenda está libre por el momento.</p>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="historial">
            <HistorialCitasTab />
          </TabsContent>
        </Tabs>
      </div>

      <DialogoDetallesPaciente cita={citaSeleccionada} open={dialogoAbierto} onOpenChange={setDialogoAbierto} onCitaAtendida={() => refetch()} />
    </>
  );
}
