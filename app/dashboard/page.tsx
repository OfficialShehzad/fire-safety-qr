import { DashboardUserForm } from "@/components/dashboard/user-form";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />

      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Registration
            </h1>
            <p className="text-slate-500">
              Create a new personnel record for the Aster Project.
            </p>
          </div>

          <DashboardUserForm />
        </div>
      </main>
    </div>
  );
}