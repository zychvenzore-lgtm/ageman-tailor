import { getThemeConfig } from "@/lib/theme";
import { db } from "@/lib/db";
import { AdminClient } from "@/components/admin/AdminClient";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "./login/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const theme = await getThemeConfig();
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  const bookings = await db.booking.findMany({
    orderBy: { date: "asc" },
  });
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
            Owner Dashboard
          </h1>
          <p className="text-sm font-light text-[#0C0A09]/60">
            Welcome back, <span className="font-semibold text-[#CA8A04]">{session.username}</span>. Manage the Ageman storefront, orders &amp; product catalog.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-5 bg-transparent border border-[#0C0A09]/10 hover:border-red-300 hover:text-red-600 text-[#0C0A09]/60 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            LOGOUT
          </button>
        </form>
      </div>

      <AdminClient 
        theme={JSON.parse(JSON.stringify(theme))} 
        initialProducts={JSON.parse(JSON.stringify(products))}
        initialBookings={JSON.parse(JSON.stringify(bookings))}
        initialOrders={JSON.parse(JSON.stringify(orders))}
      />
    </div>
  );
}

