import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/routes">
          <Card className="transition hover:border-emerald-500/50 hover:bg-zinc-800/80">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Add Route</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Create a route and set daily/weekly prices.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/buses">
          <Card className="transition hover:border-emerald-500/50 hover:bg-zinc-800/80">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Add Bus</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Register a bus on an existing route.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/passes">
          <Card className="transition hover:border-emerald-500/50 hover:bg-zinc-800/80">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">View All Passes</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                See and approve or reject pass requests.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/payments">
          <Card className="transition hover:border-emerald-500/50 hover:bg-zinc-800/80">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">View All Payments</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                View payment history and transaction details.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
