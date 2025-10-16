import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionMedicos } from "./componentes/GestionMedicos";
import { GestionPacientes } from "./componentes/GestionPacientes";
import { GestionConfiguracion } from "./componentes/GestionConfiguracion";
import { DashboardAdmin } from "./componentes/DashboardAdmin";
import { GestionEspecialidades } from "./componentes/GestionEspecialidades";

export function PaginaPanelAdmin() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Gestiona médicos, pacientes, citas y la configuración del sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="medicos">Médicos</TabsTrigger>
              <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
              <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <DashboardAdmin />
            </TabsContent>
            <TabsContent value="medicos" className="mt-4">
              <GestionMedicos />
            </TabsContent>
            <TabsContent value="pacientes" className="mt-4">
              <GestionPacientes />
            </TabsContent>
            <TabsContent value="especialidades" className="mt-4">
              <GestionEspecialidades />
            </TabsContent>
            <TabsContent value="configuracion" className="mt-4">
              <GestionConfiguracion />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
