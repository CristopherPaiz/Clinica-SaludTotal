import { Outlet } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";

function EtiquetaHorarios() {
  const { data } = useGetQuery(["configuracionPublica"], RUTAS_API.CONFIGURACION);
  const horarios = data?.data?.configuracion?.horarios || "Cargando horarios...";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed top-1/2 right-0 -translate-y-1/2 z-30 transform translate-x-[calc(100%-40px)] hover:translate-x-0 transition-transform duration-300 rounded-r-none flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="-rotate-90 whitespace-nowrap">Horarios</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuestros Horarios de Atención</SheetTitle>
        </SheetHeader>
        <div className="py-4 whitespace-pre-line text-muted-foreground">{horarios.replace(". ", ".\n")}</div>
      </SheetContent>
    </Sheet>
  );
}

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <EtiquetaHorarios />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
