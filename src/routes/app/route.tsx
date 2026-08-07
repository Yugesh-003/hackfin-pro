import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/app/ProtectedRoute";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppNav } from "@/components/app/AppNav";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile/tablet top bar */}
          <AppNav />

          {/* Page content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
