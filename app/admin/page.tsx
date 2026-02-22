import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ShinyText from "@/components/ShinyText";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="Admin Dashboard"
          color="#b5b5b5"
          shineColor="#ffffff"
          speed={2.5}
          spread={120}
          yoyo
          pauseOnHover
          className="text-2xl font-bold"
        />
      </h1>

      <div className="dashboard-blocks">
        <div className="dashboard-twine" aria-hidden />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          <Link href="/admin/routes">
            <Card className="dashboard-card transition hover:border-emerald-500/40">
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
            <Card className="dashboard-card transition hover:border-emerald-500/40">
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
            <Card className="dashboard-card transition hover:border-emerald-500/40">
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
            <Card className="dashboard-card transition hover:border-emerald-500/40">
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
    </div>
  );
}
