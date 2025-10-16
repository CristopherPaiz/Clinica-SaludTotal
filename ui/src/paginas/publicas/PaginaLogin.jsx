import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { esquemaLogin } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Stethoscope } from "lucide-react";

export function PaginaLogin() {
  const navegar = useNavigate();
  const { iniciarSesion, cargando } = useAuth();

  const form = useForm({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { username: "", password: "" },
  });

  const alEnviar = async (datos) => {
    try {
      await iniciarSesion(datos);
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
            <h1 className="text-3xl font-bold">Bienvenido de Nuevo</h1>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder a tu portal de paciente.</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="tu_usuario" {...field} disabled={cargando} />
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
                          <Input type="password" placeholder="••••••••" {...field} disabled={cargando} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={cargando}>
                    {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ingresar
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="underline font-semibold text-primary">
                  Regístrate aquí
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
