import { createContext, useState, useEffect, useMemo } from "react";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutateQuery } from "@/hooks/useMutateQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { FullScreenLoader } from "@/components/common/Loader";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  const { data, isSuccess, isError } = useGetQuery(["usuarioActual"], RUTAS_API.AUTH.PERFIL, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !estaAutenticado,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.usuario) {
      setUsuario(data.data.usuario);
      setEstaAutenticado(true);
    }
    if (isSuccess || isError) {
      setCargandoInicial(false);
    }
  }, [isSuccess, isError, data]);

  const mutacionLogin = useMutateQuery({
    successMessage: "Inicio de sesión exitoso.",
  });

  const mutacionRegistro = useMutateQuery({
    successMessage: "Registro completado con éxito.",
  });

  const mutacionLogout = useMutateQuery({
    showSuccessToast: false,
  });

  const iniciarSesion = async (credenciales) => {
    const resultado = await mutacionLogin.mutateAsync({
      endpoint: RUTAS_API.AUTH.LOGIN,
      body: credenciales,
    });
    if (resultado?.data?.usuario) {
      setUsuario(resultado.data.usuario);
      setEstaAutenticado(true);
    }
    return resultado;
  };

  const registrar = async (datos) => {
    const resultado = await mutacionRegistro.mutateAsync({
      endpoint: RUTAS_API.AUTH.REGISTRO,
      body: datos,
    });
    if (resultado?.data?.usuario) {
      setUsuario(resultado.data.usuario);
      setEstaAutenticado(true);
    }
    return resultado;
  };

  const cerrarSesion = async () => {
    await mutacionLogout.mutateAsync({
      endpoint: RUTAS_API.AUTH.LOGOUT,
      method: "GET",
    });
    setUsuario(null);
    setEstaAutenticado(false);
  };

  const valor = useMemo(
    () => ({
      usuario,
      estaAutenticado,
      iniciarSesion,
      registrar,
      cerrarSesion,
      cargando: mutacionLogin.isPending || mutacionRegistro.isPending,
    }),
    [usuario, estaAutenticado, mutacionLogin.isPending, mutacionRegistro.isPending]
  );

  if (cargandoInicial) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
