import React, { useState } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { ContainerLoader } from "@/components/common/Loader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

export function PaginaGaleria() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { data, isLoading } = useGetQuery(["configuracion"], RUTAS_API.CONFIGURACION);
  const imagenes = data?.data?.configuracion?.galeria_imagenes || [];

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Nuestras Instalaciones</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Un vistazo a nuestros espacios modernos, cómodos y equipados con la mejor tecnología para tu cuidado.
          </p>
        </div>

        {isLoading ? (
          <ContainerLoader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imagenes.map((imagen, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="relative overflow-hidden rounded-lg group shadow-lg cursor-pointer h-72" onClick={() => setSelectedImage(imagen)}>
                    <img
                      src={imagen.url}
                      alt={imagen.descripcion}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <Eye className="h-10 w-10 text-white mb-2" />
                      <p className="text-white font-semibold">{imagen.descripcion}</p>
                    </div>
                  </div>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={handleOpenChange}>
        <DialogContent className="min-w-4xl p-2 bg-transparent border-0 shadow-none">
          {selectedImage && (
            <div className="relative">
              <img src={selectedImage.url} alt={selectedImage.descripcion} className="w-full h-auto max-h-[90vh] object-contain rounded-lg" />
              <p className="text-white text-center mt-2 bg-black/50 p-2 rounded-b-lg">{selectedImage.descripcion}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
