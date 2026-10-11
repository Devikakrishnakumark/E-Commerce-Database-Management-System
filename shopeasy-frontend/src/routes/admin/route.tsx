import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardProvider } from '@/components/dashboard/store';
import { DashboardShell } from '@/components/dashboard/shell';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardProvider>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </DashboardProvider>
  );
}
