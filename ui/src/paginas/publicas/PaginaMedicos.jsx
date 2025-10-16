import { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, UserSearch } from "lucide-react";

function TarjetaMedico({ medico }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Stethoscope className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg">{medico.nombre_completo}</CardTitle>
          <CardDescription>{medico.especialidad}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Colegiado: {medico.colegiado}</p>
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

      <div className="mb-6 max-w-md mx-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
