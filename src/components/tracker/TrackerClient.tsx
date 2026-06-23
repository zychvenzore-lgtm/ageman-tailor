"use client";

import React, { useState } from "react";
import { getOrderTrackerAction } from "@/app/tracker/actions";
import { Search, Sparkles, CheckCircle, Clock, AlertCircle, Scissors, Paintbrush, Flame, Shirt } from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  clientName: string;
  email: string;
  garmentType: string;
  motif: string;
  accents: string;
  collar: string;
  status: string;
  statusStep: number;
  measurements?: string | null;
  clothType?: string | null;
  liningColor?: string | null;
  tailorNotes?: string | null;
}

export const TrackerClient: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    const result = await getOrderTrackerAction(orderId);

    setLoading(false);
    if (result.success && result.order) {
      setOrder(result.order as any);
    } else {
      setError(result.error || "Failed to search order.");
    }
  };

  const steps = [
    {
      step: 1,
      title: "Nyanting (Waxing)",
      icon: Flame,
      description: "Artisans write hot wax (malam) outlines onto silk fabric using copper canting pens to resist dyes.",
    },
    {
      step: 2,
      title: "Nyolet (Hand-dyeing)",
      icon: Paintbrush,
      description: "Organic dyes are painted by hand inside the wax enclosures to color the pattern details.",
    },
    {
      step: 3,
      title: "Melorod (Boiling)",
      icon: Flame,
      description: "The fabric is boiled in hot water to melt and strip away the wax outlines, revealing the light batik contours.",
    },
    {
      step: 4,
      title: "Polan (Cutting)",
      icon: Scissors,
      description: "Master cutter matches the batik patterns seamlessly across seam lines and cuts the bespoke shapes.",
    },
    {
      step: 5,
      title: "Jahit (Tailoring)",
      icon: Shirt,
      description: "Senior tailors assemble, stitch, line with premium silk linings, and complete hand-finished detailing.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0C0A09]/40" size={16} />
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ENTER ORDER ID (e.g. AGM-770)"
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] tracking-wider font-semibold uppercase"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 bg-[#1C1917] hover:bg-[#CA8A04] disabled:bg-[#1C1917]/50 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm"
        >
          {loading ? "SEARCHING..." : "TRACK"}
        </button>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Tracker Visual Result */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 animate-fade-in"
        >
          {/* Metadata Frame */}
          <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">CLIENT</span>
              <p className="text-sm font-semibold mt-0.5 truncate">{order.clientName}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">GARMENT</span>
              <p className="text-sm font-semibold mt-0.5">{order.garmentType}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">MOTIF</span>
              <p className="text-sm font-semibold mt-0.5">{order.motif}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">ACCENTS</span>
              <p className="text-sm font-semibold mt-0.5">{order.accents} + {order.collar}</p>
            </div>
          </div>

          {/* Pre-production Pending Approval Notice */}
          {order.statusStep === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center animate-fade-in">
              <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0">
                <Clock size={20} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#CA8A04] tracking-widest uppercase">WAITING FOR FITTING & APPROVAL</span>
                <h4 className="text-sm font-bold text-stone-800">Order Pending Tailor Measurements</h4>
                <p className="text-xs font-light text-stone-600 leading-relaxed max-w-xl">
                  This custom Javanese Batik Suit is currently waiting for your physical fitting session. Once the master tailor meets you to take exact measurements and approves the order, active production will begin.
                </p>
              </div>
            </div>
          )}

          {/* Tailoring specifications Display */}
          {order.statusStep >= 1 && order.measurements && (
            <div className="bg-stone-50 border border-stone-100 rounded-3xl p-6 space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold tracking-widest text-[#0C0A09]/60 uppercase flex items-center gap-1.5">
                <Scissors size={12} className="text-[#CA8A04]" /> TAILORED MEASUREMENTS & SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-100">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">MEASUREMENTS</span>
                  <p className="font-semibold text-stone-800 mt-1">{order.measurements}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-100">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">FABRIC SELECTION</span>
                  <p className="font-semibold text-stone-800 mt-1">{order.clothType || "Bespoke Selection"}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-100">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">ACCENT LINING</span>
                  <p className="font-semibold text-stone-800 mt-1">{order.liningColor || "Bespoke Color"}</p>
                </div>
                {order.tailorNotes && (
                  <div className="md:col-span-3 p-3 bg-white rounded-xl border border-stone-100 italic text-stone-600">
                    " {order.tailorNotes} "
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Steps */}
          <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 relative">
            <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase flex items-center gap-1">
              <Sparkles size={12} className="text-[#CA8A04]" /> ARTISAN LIFECYCLE TIMELINE
            </h3>

            <div className="relative pl-6 md:pl-8 space-y-8 border-l border-[#0C0A09]/10">
              {steps.map((st) => {
                const StepIcon = st.icon;
                const isCompleted = order.statusStep > st.step;
                const isCurrent = order.statusStep === st.step;
                const isPending = order.statusStep < st.step;

                return (
                  <div key={st.step} className="relative">
                    {/* Circle Indicator on the timeline line */}
                    <div className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 bg-white ${
                      isCompleted
                        ? "border-green-600 text-green-600"
                        : isCurrent
                        ? "border-[#CA8A04] text-[#CA8A04] ring-4 ring-[#CA8A04]/10"
                        : "border-[#0C0A09]/10 text-[#0C0A09]/30"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={14} className="fill-green-50" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{st.step}</span>
                      )}
                    </div>

                    {/* Step details content */}
                    <div className={`space-y-1 transition-all duration-500 ${isPending ? "opacity-40" : "opacity-100"}`}>
                      <div className="flex items-center gap-2">
                        <h4 className="font-cormorant text-xl font-bold text-[#0C0A09]">
                          {st.title}
                        </h4>
                        
                        {/* Badges */}
                        {isCompleted && (
                          <span className="py-0.5 px-2 bg-green-50 text-green-700 border border-green-200 text-[8px] font-bold rounded-full tracking-wider">
                            COMPLETED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="py-0.5 px-2 bg-[#CA8A04]/10 text-[#CA8A04] border border-[#CA8A04]/20 text-[8px] font-bold rounded-full tracking-wider animate-pulse flex items-center gap-0.5">
                            <Clock size={8} /> ARTISAN ACTIVE
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs font-light text-[#0C0A09]/70 leading-relaxed max-w-lg">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
