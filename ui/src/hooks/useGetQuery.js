import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiFetch from "@/lib/api";

export const useGetQuery = (queryKey, endpoint, { showErrorToast = true, ...options } = {}) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => apiFetch(endpoint),
    ...options,
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
