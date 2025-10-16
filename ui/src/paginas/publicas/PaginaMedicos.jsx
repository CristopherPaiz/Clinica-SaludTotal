import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaginaMedicos() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Nuestro Equipo Médico</CardTitle>
          <CardDescription>Conoce a nuestros especialistas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Catálogo de médicos en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}
