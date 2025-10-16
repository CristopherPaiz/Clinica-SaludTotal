import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const esquemaPerfil = z.object({
  nombre_completo: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  dpi: z.string().length(13, "El DPI debe tener 13 dígitos.").regex(/^\d+$/, "El DPI solo debe contener números."),
  email: z.string().email("Email inválido."),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos."),
  direccion: z.string().optional(),
});

function PerfilSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  );
}

export function PaginaMiPerfil() {
  const { data, isLoading } = useGetQuery(["perfilPaciente"], RUTAS_API.PACIENTES.PERFIL);
  const paciente = data?.data?.paciente;

  const mutacionActualizar = useMutateQuery({
    queryKeyToInvalidate: ["perfilPaciente"],
    successMessage: "Perfil actualizado correctamente.",
  });

  const form = useForm({
    resolver: zodResolver(esquemaPerfil),
    defaultValues: { nombre_completo: "", dpi: "", email: "", telefono: "", direccion: "" },
  });

  useEffect(() => {
    if (paciente) {
      form.reset({
        nombre_completo: paciente.nombre_completo || "",
        dpi: paciente.dpi || "",
        email: paciente.email || "",
        telefono: paciente.telefono || "",
        direccion: paciente.direccion || "",
      });
    }
  }, [paciente, form]);

  const alEnviar = (datos) => {
    mutacionActualizar.mutate({ endpoint: RUTAS_API.PACIENTES.PERFIL, method: "PUT", body: datos });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
          <CardDescription>Aquí puedes ver y editar tus datos personales.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PerfilSkeleton />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nombre_completo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mutacionActualizar.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dpi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DPI</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mutacionActualizar.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mutacionActualizar.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tu dirección (opcional)" disabled={mutacionActualizar.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={mutacionActualizar.isPending}>
                  {mutacionActualizar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
