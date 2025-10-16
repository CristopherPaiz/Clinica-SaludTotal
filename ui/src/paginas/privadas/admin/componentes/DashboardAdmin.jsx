import { useGetQuery } from "@/hooks/useGetQuery";
import { RUTAS_API } from "@/lib/dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerLoader } from "@/components/common/Loader";
import { Users, Stethoscope, Calendar, Bell } from "lucide-react";

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function DashboardAdmin() {
  const { data, isLoading } = useGetQuery(["dashboardStats"], RUTAS_API.ADMIN.DASHBOARD_STATS);
  const stats = data?.data?.stats;

  if (isLoading) return <ContainerLoader />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total de Pacientes" value={stats?.totalPacientes ?? 0} icon={Users} />
      <StatCard title="Total de Médicos" value={stats?.totalMedicos ?? 0} icon={Stethoscope} />
      <StatCard title="Citas para Hoy" value={stats?.citasHoy ?? 0} icon={Calendar} />
      <StatCard title="Citas Pendientes" value={stats?.citasPendientes ?? 0} icon={Bell} />
    </div>
  );
}
