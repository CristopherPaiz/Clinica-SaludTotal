import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { ContainerLoader } from "@/components/common/Loader";
import { Building, Target, Users } from "lucide-react";

export function PaginaNosotros() {
  const { data, isLoading } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const configuracion = data?.data?.configuracion;

  return (
    <div className="bg-white">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Sobre {configuracion?.nombre_negocio || "Nosotros"}</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Comprometidos con tu salud y bienestar a través de un servicio excepcional y un cuidado humano.
          </p>
        </div>

        {isLoading ? (
          <ContainerLoader />
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Nuestra Historia</h3>
                  <p className="text-muted-foreground">{configuracion.nosotros_texto}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Misión y Visión</h3>
                  <p className="text-muted-foreground">
                    Ser la clínica líder en atención médica, reconocida por nuestra excelencia, innovación y el trato cálido hacia nuestros pacientes,
                    mejorando la calidad de vida de nuestra comunidad.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
                alt="Doctor sonriendo"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
