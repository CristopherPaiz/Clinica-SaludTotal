import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as LucideIcons from "lucide-react";

export function PaginaServicios() {
  const { data, isLoading, isError, error } = useGetQuery(["servicios"], RUTAS_API.SERVICIOS);
  const servicios = data?.data?.servicios || [];

  const Icono = ({ nombre }) => {
    const IconComponent = LucideIcons[nombre] || LucideIcons.Stethoscope;
    return <IconComponent className="w-10 h-10 text-primary mx-auto mb-4" />;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Nuestros Servicios</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ofrecemos una amplia gama de especialidades médicas para cubrir todas tus necesidades de salud con la más alta calidad y profesionalismo.
        </p>
      </div>

      {isLoading && <ContainerLoader />}
      {isError && (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => (
            <Card key={servicio.id} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icono nombre={servicio.icono} />
                <CardTitle>{servicio.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{servicio.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
