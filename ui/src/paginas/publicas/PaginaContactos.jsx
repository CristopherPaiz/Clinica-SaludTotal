import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Phone, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function PaginaContactos() {
  const { data, isLoading } = useGetQuery(["medicos"], RUTAS_API.MEDICOS);
  const medicos = data?.data?.medicos || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Contacta a Nuestro Equipo</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Encuentra la información de contacto de nuestros especialistas. Estamos aquí para ayudarte.
        </p>
      </div>

      {isLoading ? (
        <ContainerLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {medicos.map((medico) => (
            <Card key={medico.id} className="text-center flex flex-col">
              <CardHeader className="flex-grow">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary/20">
                  <AvatarImage src={`https://avatar.iran.liara.run/public/boy?username=${medico.nombre_completo}`} alt={medico.nombre_completo} />
                  <AvatarFallback>{medico.nombre_completo.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{medico.nombre_completo}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 pt-1 text-primary">
                  <Stethoscope className="w-4 h-4" />
                  {medico.especialidad}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={`tel:${medico.telefono}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {medico.telefono || "No disponible"}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
