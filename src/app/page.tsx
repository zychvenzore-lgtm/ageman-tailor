import { getThemeConfig } from "@/lib/theme";
import { db } from "@/lib/db";
import { StorefrontClient } from "@/components/storefront/StorefrontClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const theme = await getThemeConfig();
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <StorefrontClient 
      theme={theme} 
      products={JSON.parse(JSON.stringify(products))} 
    />
  );
}
