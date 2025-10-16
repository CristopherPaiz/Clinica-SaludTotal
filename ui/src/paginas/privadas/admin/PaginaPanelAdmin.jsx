import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaginaPanelAdmin() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Gestiona médicos, pacientes y citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Panel de administración en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}
