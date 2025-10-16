import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiFetch from "@/lib/api";

export const useGetQuery = (queryKey, endpoint, options = {}) => {
  const { showErrorToast = true, ...restOfOptions } = options;

  return useQuery(queryKey, () => apiFetch(endpoint), {
    retryOnWindowFocus: false,
    ...restOfOptions,
    onError: (error) => {
      if (showErrorToast) {
        toast.error(error.message || "Error al cargar los datos.");
      }
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};
