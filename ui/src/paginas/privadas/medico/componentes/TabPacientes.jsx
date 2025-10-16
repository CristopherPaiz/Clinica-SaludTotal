import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TabPacientes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pacientes</CardTitle>
        <CardDescription>Busca, edita o elimina pacientes del sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Tabla de gestión de pacientes en construcción.</p>
        <p>Aquí irá el `ComponenteTablaDatos` con la lógica para CRUD de pacientes.</p>
      </CardContent>
    </Card>
  );
}
