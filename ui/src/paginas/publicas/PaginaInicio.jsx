import { Link } from "react-router-dom";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ShieldCheck, HeartPulse, ExternalLink, Navigation } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PaginaInicio() {
  const {
    data: configData,
    isLoading: configLoading,
    isError: configIsError,
    error: configError,
  } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const { data: medicosData, isLoading: medicosLoading } = useGetQuery(["medicosPreview"], `${RUTAS_API.MEDICOS}?limit=3`);

  const configuracion = configData?.data?.configuracion;
  const medicos = medicosData?.data?.medicos || [];

  const isLoading = configLoading || medicosLoading;

  if (isLoading) return <ContainerLoader />;

  if (configIsError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{configError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const coordenadas = configuracion.mapa_coordenadas;
  const embedMapUrl = `https://maps.google.com/maps?q=${coordenadas}&hl=es&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${coordenadas}`;

  return (
    <div className="bg-background">
      <section className="relative bg-primary/5 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-800">
              Cuidamos de ti y tu familia en {configuracion.nombre_negocio}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{configuracion.servicios}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/registro">Agendar una Cita</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link to="/medicos">Conoce a nuestros médicos</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Equipo médico profesional"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="porque-elegirnos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por Qué Elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Equipo Médico Experto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profesionales altamente calificados y dedicados a tu bienestar integral.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Tecnología Avanzada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Equipos de última generación para diagnósticos precisos y tratamientos seguros.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <HeartPulse className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Atención Personalizada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nos enfocamos en un trato humano, cercano y adaptado a las necesidades de cada paciente.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="equipo-medico" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Conoce a Nuestro Equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicos.map((medico) => (
              <Card key={medico.id} className="text-center hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary/20">
                    <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${medico.nombre_completo}`} alt={medico.nombre_completo} />
                    <AvatarFallback>{medico.nombre_completo.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{medico.nombre_completo}</h3>
                  <p className="text-primary">{medico.especialidad}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/medicos">Ver Equipo Completo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="galeria" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Instalaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuracion.galeria_imagenes.map((imagen, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg group h-64 shadow-md">
                <img
                  src={imagen.url}
                  alt={imagen.descripcion}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg">{imagen.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ubicacion" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Encuéntranos Fácilmente</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-primary/10">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5">
                <img
                  src="https://alemarquitectura.com/wp-content/uploads/2024/09/recepcion-clinica-dental.jpg"
                  alt="Recepción de la clínica"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              <div className="w-full md:w-3/5 p-6 md:p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Dirección</h4>
                      <span className="text-muted-foreground">{configuracion.ubicacion}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Horarios de Atención</h4>
                      <p className="whitespace-pre-line text-muted-foreground">{configuracion.horarios}</p>
                    </div>
                  </div>
                </div>

                <div className="md:hidden mt-6">
                  <Button asChild className="w-full">
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="mr-2" size={20} />
                      Cómo llegar
                    </a>
                  </Button>
                </div>

                <div className="hidden md:block mt-6">
                  <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-primary/20 shadow-inner">
                    <iframe
                      title="Ubicación de la clínica"
                      src={embedMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 text-right">
                    <Button asChild variant="outline">
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                        Abrir en Google Maps
                        <ExternalLink className="ml-2" size={16} />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
