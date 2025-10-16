import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    toast.error(error.message || "Ocurrió un error al cargar los datos.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-8 text-center">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
            <p className="mb-4 text-sm">No pudimos cargar esta sección. Por favor, intenta refrescar la página.</p>
            <Button variant="destructive" onClick={() => window.location.reload()}>
              Refrescar Página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
