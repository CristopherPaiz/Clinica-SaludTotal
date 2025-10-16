import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { esquemaRegistro } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Stethoscope } from "lucide-react";

export function PaginaRegistro() {
  const navegar = useNavigate();
  const { registrar, cargando } = useAuth();

  const form = useForm({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: {
      username: "",
      password: "",
      nombre_completo: "",
      dpi: "",
      email: "",
      telefono: "",
    },
  });

  const alEnviar = async (datos) => {
    try {
      await registrar(datos);
      navegar("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Crea tu Cuenta</h1>
            <p className="text-muted-foreground">Regístrate para agendar y gestionar tus citas médicas.</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre_completo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={cargando} />
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
                            <Input {...field} disabled={cargando} maxLength={13} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={cargando} />
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
                          <Input {...field} disabled={cargando} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de usuario</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={cargando} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} disabled={cargando} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={cargando}>
                    {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear cuenta
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="underline font-semibold text-primary">
                  Inicia sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-primary/5 lg:flex items-center justify-center p-8">
        <div className="text-center">
          <Stethoscope className="mx-auto h-24 w-24 text-primary mb-6" />
          <h2 className="text-4xl font-bold text-gray-800">Clínica SaludTotal</h2>
          <p className="text-xl text-muted-foreground mt-2">Tu salud, nuestra prioridad.</p>
        </div>
      </div>
    </div>
  );
}
