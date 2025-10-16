import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TabMedicos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Médicos</CardTitle>
        <CardDescription>Añade, edita o elimina médicos del sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Tabla de gestión de médicos en construcción.</p>
        <p>Aquí irá el `ComponenteTablaDatos` con la lógica para CRUD de médicos.</p>
      </CardContent>
    </Card>
  );
}
