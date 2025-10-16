import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiFetch from "@/lib/api";

export const useMutateQuery = ({
  queryKeyToInvalidate,
  successMessage = "Operación realizada con éxito",
  errorMessage = "Ocurrió un error al realizar la operación",
  showSuccessToast = true,
  showErrorToast = true,
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpoint, method = "POST", body }) => {
      return apiFetch(endpoint, {
        method: method,
        body: body ? JSON.stringify(body) : null,
      });
    },
    onSuccess: () => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
      if (showSuccessToast) {
        toast.success(successMessage);
      }
    },
    onError: (error) => {
      if (showErrorToast) {
        const finalErrorMessage = error.message || errorMessage;
        toast.error(finalErrorMessage);
      }
    },
  });
};
