import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaginaMiPerfil() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
          <CardDescription>Aquí puedes ver y editar tus datos personales.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidad de edición de perfil en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}
