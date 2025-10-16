import { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, UserSearch, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function TarjetaMedico({ medico }) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-primary/10">
          <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${medico.nombre_completo}`} alt={medico.nombre_completo} />
          <AvatarFallback>{medico.nombre_completo.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{medico.nombre_completo}</CardTitle>
        <CardDescription className="text-primary font-medium flex items-center justify-center gap-2 pt-1">
          <Stethoscope className="w-4 h-4" />
          {medico.especialidad}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <Award className="w-3 h-3" />
          Colegiado: {medico.colegiado}
        </p>
      </CardContent>
    </Card>
  );
}

export function PaginaMedicos() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const terminoDebounce = useDebounce(terminoBusqueda, 300);

  const urlMedicos = `${RUTAS_API.MEDICOS}?q=${terminoDebounce}`;
  const { data, isLoading, isError, error } = useGetQuery(["medicos", terminoDebounce], urlMedicos);

  const medicos = data?.data?.medicos || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Nuestro Equipo Médico</h1>
        <p className="text-muted-foreground mt-2">Conoce a los profesionales dedicados a tu salud.</p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <UserSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o especialidad..."
            className="pl-10"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <ContainerLoader />}
      {isError && (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {medicos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {medicos.map((medico) => (
                <TarjetaMedico key={medico.id} medico={medico} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-10">No se encontraron médicos con ese criterio.</p>
          )}
        </>
      )}
    </div>
  );
}
