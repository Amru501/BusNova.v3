"use client";

import Link from "next/link";
import ShinyText from "@/components/ShinyText";

const strips = [
  {
    href: "/student/my-pass",
    title: "View My Pass",
    desc: "See your pass status, type and route.",
  },
  {
    href: "/student/request",
    title: "Request for Pass",
    desc: "Choose a route and pass type. Price is set per route by admin.",
  },
  {
    href: "/student/buses",
    title: "View All Buses",
    desc: "See all available buses and their routes.",
  },
  {
    href: "/student/drivers",
    title: "View Drivers",
    desc: "See driver names and contact numbers.",
  },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="My Dashboard"
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
