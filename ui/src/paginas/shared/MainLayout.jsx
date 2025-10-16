import { Outlet, Link } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays } from "lucide-react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Separator } from "@/components/ui/separator";
import ErrorBoundary from "@/components/common/ErrorBoundary";

function EtiquetaHorarios() {
  const { data } = useGetQuery(["configuracionPublica"], RUTAS_API.CONFIGURACION);
  const horarios = data?.data?.configuracion?.horarios || "Cargando horarios...";

  const [linea1, linea2] = horarios.split("\n");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed top-1/2 right-0 -translate-y-1/2 z-30 transform translate-x-[calc(100%-40px)] hover:translate-x-0 transition-transform duration-300 rounded-r-none flex items-center gap-2 shadow-lg">
          <Clock className="h-5 w-5" />
          <span className="whitespace-nowrap">Horarios</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl">Nuestros Horarios</SheetTitle>
        </SheetHeader>
        <div className="relative h-40">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop"
            alt="Reloj en pared de clínica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="p-6 flex-grow">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lunes a Viernes</h3>
                <p className="text-muted-foreground text-base">{linea1?.split(": ")[1]}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sábados</h3>
                <p className="text-muted-foreground text-base">{linea2?.split(": ")[1]}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 mt-auto border-t">
          <SheetClose asChild>
            <Button asChild className="w-full" size="lg">
              <Link to="/registro">Agendar una Cita</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <EtiquetaHorarios />
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
