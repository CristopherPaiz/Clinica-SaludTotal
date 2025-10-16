import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaginaAgendaMedico() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Mi Agenda</CardTitle>
          <CardDescription>Visualiza y gestiona tus citas del día.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Agenda del médico en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}
