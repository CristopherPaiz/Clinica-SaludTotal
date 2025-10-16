import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Clock, Stethoscope } from "lucide-react";

export function PaginaInicio() {
  const { data, isLoading, isError, error } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);

  const configuracion = data?.data?.configuracion;

  if (isLoading) return <ContainerLoader />;
  if (isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <section className="text-center my-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{configuracion.nombre_negocio}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{configuracion.servicios}</p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 my-12">
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <Stethoscope className="w-8 h-8 text-primary" />
            <CardTitle>Nuestros Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ofrecemos especialidades como Cardiología, Pediatría y Dermatología con profesionales de primer nivel.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <Clock className="w-8 h-8 text-primary" />
            <CardTitle>Horarios de Atención</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{configuracion.horarios}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <MapPin className="w-8 h-8 text-primary" />
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{configuracion.ubicacion}</p>
          </CardContent>
        </Card>
      </section>

      <section className="my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestras Instalaciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {configuracion.galeria_imagenes.map((imagen, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg group">
              <img
                src={imagen.url}
                alt={imagen.descripcion}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white">{imagen.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
