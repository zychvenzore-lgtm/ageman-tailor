import { getThemeConfig } from "@/lib/theme";
import { CustomizerClient } from "@/components/customizer/CustomizerClient";

export const dynamic = "force-dynamic";

export default async function CustomizePage() {
  const theme = await getThemeConfig();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
          Bespoke Customizer Studio
        </h1>
        <p className="text-sm font-light text-[#0C0A09]/60">
          Design your bespoke Ageman Javanese Batik Suit (Jas Batik). Select your cut silhouette, overlay historical embossed Javanese batik motifs, and customize premium accents.
        </p>
      </div>

      <CustomizerClient theme={JSON.parse(JSON.stringify(theme))} />
    </div>
  );
}
