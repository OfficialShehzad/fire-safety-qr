import { DashboardNavbar } from "@/components/dashboard/navbar";
import { PersonnelList } from "@/components/dashboard/personnel-list";

export default function ListPage() {
    return (
        <main>
            <DashboardNavbar />

            <div className="max-w-6xl mx-auto space-y-8 p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Personnel List
                    </h1>
                    <p className="text-slate-500">
                        Viewing all registered staff for Aster DM Healthcare Trivandrum Private Limited.
                    </p>
                </div>

                <PersonnelList />
            </div>
        </main>
    );
}
