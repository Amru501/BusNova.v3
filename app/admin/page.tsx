import Link from "next/link";
import ShinyText from "@/components/ShinyText";

const strips = [
  {
    href: "/admin/routes",
    title: "Add Route",
    desc: "Create a route and set daily/weekly prices.",
  },
  {
    href: "/admin/buses",
    title: "Add Bus",
    desc: "Register a bus on an existing route.",
  },
  {
    href: "/admin/passes",
    title: "View All Passes",
    desc: "See and approve or reject pass requests.",
  },
  {
    href: "/admin/payments",
    title: "View All Payments",
    desc: "View payment history and transaction details.",
  },
];

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

      <div className="dashboard-strips">
        {strips.map(({ href, title, desc }) => (
          <Link key={href} href={href} className="dashboard-strip">
            <div className="dashboard-strip-content">
              <h2 className="dashboard-strip-title">{title}</h2>
              <p className="dashboard-strip-desc">{desc}</p>
            </div>
            <svg
              className="dashboard-strip-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
