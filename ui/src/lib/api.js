const apiFetch = async (endpoint, options = {}) => {
  if (!import.meta.env.VITE_API_URL) {
    console.error("La variable de entorno VITE_API_URL no está definida.");
    throw new Error("La variable de entorno VITE_API_URL no está definida.");
  }

  if (!endpoint.startsWith("/")) {
    endpoint = `/${endpoint}`;
  }

  const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Error ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || "Ocurrió un error inesperado.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default apiFetch;
