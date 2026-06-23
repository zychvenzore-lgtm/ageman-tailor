import { TrackerClient } from "@/components/tracker/TrackerClient";

export default function TrackerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
          Artisan Transparency Tracker
        </h1>
        <p className="text-sm font-light text-[#0C0A09]/60 max-w-lg mx-auto">
          Trace the slow, Javanese hand-craftsmanship steps of your garment. Enter your Order ID (try: <span className="font-mono font-semibold text-[#CA8A04]">AGM-770</span> or <span className="font-mono font-semibold text-[#CA8A04]">AGM-101</span>) to view its progress in our studios.
        </p>
      </div>

      <TrackerClient />
    </div>
  );
}
