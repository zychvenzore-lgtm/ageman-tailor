"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Send, X, Calendar, Clock, MapPin, Phone, Mail, User, AlertCircle } from "lucide-react";
import { ThemeConfig } from "@/lib/schema";
import { createBespokeOrderAction } from "@/app/customize/actions";

interface CustomizerClientProps {
  theme: ThemeConfig;
}

export const CustomizerClient: React.FC<CustomizerClientProps> = ({ theme }) => {
  // Load dynamic motifs
  const defaultMotifs = [
    {
      id: "PARANG",
      title: "Parang",
      meaning: "Resilience, continuous growth, and leadership",
      description: "Originating from the royal courts of Mataram, the diagonal S-curves represent ocean waves crashing against rocks. It symbolizes leadership and moral resilience.",
      image: ""
    },
    {
      id: "KAWUNG",
      title: "Kawung",
      meaning: "Cosmic balance, self-control, and purity of heart",
      description: "A geometric motif representing four palm fruit lobes. It stands for purity of mind, justice, and self-control.",
      image: ""
    },
    {
      id: "MEGAMENDUNG",
      title: "Megamendung",
      meaning: "Patience, cool-mindedness, and emotional stability",
      description: "Represented by layered, dynamic cloud contours. It symbolises the necessity of maintaining patience and keeping a cool mind.",
      image: ""
    }
  ];

  const getMotifsList = () => {
    let result = defaultMotifs;
    try {
      if (theme.customStylesJson) {
        const parsed = JSON.parse(theme.customStylesJson);
        if (parsed.motifs && Array.isArray(parsed.motifs) && parsed.motifs.length > 0) {
          result = parsed.motifs;
        }
      }
    } catch (e) {
      console.error("Failed to parse custom motifs in customizer:", e);
    }
    return result;
  };

  const dynamicMotifs = getMotifsList();

  // Customizer Specifications State
  const [garmentType, setGarmentType] = useState<"SINGLE_BREASTED" | "DOUBLE_BREASTED" | "BESKAP_HERITAGE">("SINGLE_BREASTED");
  const [batikMotif, setBatikMotif] = useState<string>(dynamicMotifs[0]?.id || "PARANG");
  const [buttonAccent, setButtonAccent] = useState<"GOLD" | "SILVER" | "BRONZE">("GOLD");
  const [collarStyle, setCollarStyle] = useState<"MANDARIN" | "CLASSIC" | "PEAK" | "NONE">("CLASSIC");

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:30 - 12:00");
  const [location, setLocation] = useState("YOGYAKARTA");
  const [notes, setNotes] = useState("");

  // Loading and Success/Error States
  const [modalLoading, setModalLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [customOrderId, setCustomOrderId] = useState("");

  // Pricing Model
  const prices = {
    SINGLE_BREASTED: 1850000,
    DOUBLE_BREASTED: 2150000,
    BESKAP_HERITAGE: 1950000,
  };

  const accentSurcharges = {
    GOLD: 100000,
    SILVER: 70000,
    BRONZE: 50000,
  };

  const getMotifSurcharge = (motifId: string) => {
    if (motifId === "NONE") return 0;
    if (motifId === "MEGAMENDUNG") return 200000;
    return 150000; // Default custom motif surcharge
  };

  const currentPrice = prices[garmentType] + getMotifSurcharge(batikMotif) + accentSurcharges[buttonAccent];

  const getMotifPhilosophy = (motifId: string) => {
    if (motifId === "NONE") return "Minimalist solid fabric without batik print.";
    const found = dynamicMotifs.find(m => m.id === motifId);
    if (found) {
      return `"${found.meaning || ""}" — ${found.description || ""}`;
    }
    return "Bespoke Javanese motif pattern.";
  };

  const getMotifTitle = (motifId: string) => {
    if (motifId === "NONE") return "None (Solid)";
    const found = dynamicMotifs.find(m => m.id === motifId);
    return found ? found.title : motifId;
  };

  const hasPattern = (motifId: string) => {
    const idLower = motifId.toLowerCase();
    return ["parang", "kawung", "megamendung"].includes(idLower) || dynamicMotifs.some(m => m.id === motifId && m.image);
  };

  const buttonColors = {
    GOLD: "#CA8A04",
    SILVER: "#94A3B8",
    BRONZE: "#B45309",
  };

  // Open booking modal
  const handleOpenBookingModal = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  // Submit actual order and booking
  const handleConfirmOrderAndBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setSubmitError(null);

    const result = await createBespokeOrderAction({
      clientName,
      email,
      phone,
      date,
      timeSlot,
      location,
      notes: notes || `Customizer spec: ${garmentType} (Motif: ${batikMotif}, Buttons: ${buttonAccent}, Collar: ${collarStyle})`,
      garmentType,
      motif: batikMotif,
      accents: buttonAccent,
      collar: collarStyle,
    });

    setModalLoading(false);
    if (result.success && result.orderId) {
      setCustomOrderId(result.orderId);
      setSubmitSuccess(true);
      // Reset booking inputs
      setClientName("");
      setEmail("");
      setPhone("");
      setDate("");
      setNotes("");
    } else {
      setSubmitError(result.error || "Failed to finalize order and fitting slot.");
    }
  };

  // Get tomorrow's date for minimum date selection
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Visual Canvas Column */}
      <div className="lg:col-span-1 bg-white border border-[#0C0A09]/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center h-[550px] relative overflow-hidden">
        {/* Soft background watermark */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
          <div className="w-full h-full bg-[#1C1917]" style={{ maskImage: "radial-gradient(circle, black, transparent)" }}></div>
        </div>

        <div className="text-center z-10 w-full">
          <span className="text-[9px] font-bold tracking-widest text-[#CA8A04] uppercase">REAL-TIME RENDERING</span>
          <h3 className="font-cormorant text-xl font-bold mt-1">Bespoke Blueprint</h3>
        </div>

        {/* Dynamic layered SVG canvas */}
        <div className="w-full h-[380px] flex items-center justify-center relative">
          <svg viewBox="0 0 300 400" className="w-full h-full max-h-[360px] drop-shadow-md">
            <defs>
              {/* Static SVG Patterns */}
              <pattern id="custom-parang" width="20" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                <path d="M 10,0 C 5,10 0,20 0,30 C 0,40 5,50 10,60" fill="none" stroke="#CA8A04" strokeWidth="1" opacity="0.4" />
                <circle cx="10" cy="20" r="1.5" fill="#CA8A04" opacity="0.3" />
              </pattern>
              <pattern id="custom-kawung" width="30" height="30" patternUnits="userSpaceOnUse">
                <ellipse cx="15" cy="15" rx="14" ry="7" fill="none" stroke="#CA8A04" strokeWidth="0.8" opacity="0.4" />
                <ellipse cx="15" cy="15" rx="7" ry="14" fill="none" stroke="#CA8A04" strokeWidth="0.8" opacity="0.4" />
                <circle cx="15" cy="15" r="1" fill="#CA8A04" opacity="0.4" />
              </pattern>
              <pattern id="custom-megamendung" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 5,15 C 10,10 20,10 25,15 C 30,12 35,15 40,18 C 35,22 25,22 20,18 C 15,22 5,20 0,18" fill="none" stroke="#CA8A04" strokeWidth="0.8" opacity="0.4" />
              </pattern>

              {/* Dynamic custom image patterns for uploaded motifs */}
              {dynamicMotifs.filter(m => m.image).map(m => (
                <pattern key={`custom-img-${m.id}`} id={`custom-${m.id.toLowerCase()}`} width="80" height="80" patternUnits="userSpaceOnUse">
                  <image href={m.image} x="0" y="0" width="80" height="80" preserveAspectRatio="xMidYMid slice" opacity="0.35" />
                </pattern>
              ))}

              {/* Flat Fill */}
              <linearGradient id="solid-charcoal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D2A26" />
                <stop offset="100%" stopColor="#1C1917" />
              </linearGradient>
            </defs>

            {/* Render Garment Silhouette */}
            {garmentType === "SINGLE_BREASTED" && (
              <g className="animate-fade-in">
                {/* Suit Body */}
                <path d="M 50,70 L 90,70 L 100,90 L 110,250 L 90,345 L 210,345 L 190,250 L 200,90 L 210,70 L 250,70 L 270,160 L 240,170 L 230,120 L 230,335 L 70,335 L 70,120 L 60,170 L 30,160 Z" fill="url(#solid-charcoal)" />
                {batikMotif !== "NONE" && (
                  <path d="M 70,70 L 230,70 L 230,335 L 70,335 Z" fill={`url(#custom-${batikMotif.toLowerCase()})`} />
                )}
                {/* Collar/Lapels based on style */}
                {collarStyle === "CLASSIC" && (
                  <path d="M 100,70 L 120,110 L 115,115 L 135,160 L 150,190 L 165,160 L 185,115 L 180,110 L 200,70 L 175,70 L 150,125 L 125,70 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="0.8" />
                )}
                {collarStyle === "PEAK" && (
                  <path d="M 100,70 L 130,120 L 110,130 L 138,180 L 150,210 L 162,180 L 190,130 L 170,120 L 200,70 L 175,70 L 150,135 L 125,70 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="0.8" />
                )}
                {collarStyle === "MANDARIN" && (
                  <path d="M 120,70 C 130,80 170,80 180,70 L 180,58 C 170,64 130,64 120,58 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="1" />
                )}
                {/* Buttons */}
                <circle cx="150" cy="205" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="150" cy="235" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
              </g>
            )}

            {garmentType === "DOUBLE_BREASTED" && (
              <g className="animate-fade-in">
                {/* Suit Body */}
                <path d="M 50,70 L 90,70 L 100,90 L 110,250 L 90,345 L 210,345 L 190,250 L 200,90 L 210,70 L 250,70 L 270,160 L 240,170 L 230,120 L 230,335 L 70,335 L 70,120 L 60,170 L 30,160 Z" fill="url(#solid-charcoal)" />
                {batikMotif !== "NONE" && (
                  <path d="M 70,70 L 230,70 L 230,335 L 70,335 Z" fill={`url(#custom-${batikMotif.toLowerCase()})`} />
                )}
                {/* Lapels */}
                {collarStyle === "PEAK" || collarStyle === "CLASSIC" ? (
                  <path d="M 100,70 L 130,120 L 110,130 L 138,180 L 150,210 L 162,180 L 190,130 L 170,120 L 200,70 L 175,70 L 150,135 L 125,70 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="0.8" />
                ) : collarStyle === "MANDARIN" ? (
                  <path d="M 120,70 C 130,80 170,80 180,70 L 180,58 C 170,64 130,64 120,58 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="1" />
                ) : null}
                {/* Double breasted buttons (4 buttons) */}
                <circle cx="138" cy="220" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="162" cy="220" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="138" cy="250" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="162" cy="250" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
              </g>
            )}

            {garmentType === "BESKAP_HERITAGE" && (
              <g className="animate-fade-in">
                {/* closed traditional suit body */}
                <path d="M 50,70 L 90,70 L 100,90 L 110,250 L 90,345 L 210,345 L 190,250 L 200,90 L 210,70 L 250,70 L 270,160 L 240,170 L 230,120 L 230,335 L 70,335 L 70,120 L 60,170 L 30,160 Z" fill="url(#solid-charcoal)" />
                {batikMotif !== "NONE" && (
                  <path d="M 70,70 L 230,70 L 230,335 L 70,335 Z" fill={`url(#custom-${batikMotif.toLowerCase()})`} />
                )}
                {/* Closed collar (Mandarin style) */}
                <path d="M 120,70 C 130,80 170,80 180,70 L 180,58 C 170,64 130,64 120,58 Z" fill="#1C1917" stroke="#CA8A04" strokeWidth="1" />
                {/* Asymmetrical diagonal front wrap flap */}
                <path d="M 120,70 L 165,70 L 165,335 L 155,335 L 120,70" fill="#1C1917" opacity="0.4" stroke="#CA8A04" strokeWidth="0.5" />
                {/* Closed button row (5 buttons going diagonally/vertically on one side) */}
                <circle cx="160" cy="95" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="160" cy="130" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="160" cy="165" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="160" cy="200" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
                <circle cx="160" cy="235" r="3.5" fill={buttonColors[buttonAccent]} stroke="#1C1917" strokeWidth="0.5" />
              </g>
            )}
          </svg>
        </div>

        {/* Pricing Label */}
        <div className="z-10 w-full text-center border-t border-[#0C0A09]/5 pt-4">
          <span className="text-xs text-[#0C0A09]/50">ESTIMATED PRICE</span>
          <p className="font-mono text-lg font-bold text-[#0C0A09] mt-0.5">
            IDR {currentPrice.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Configuration Form Column */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleOpenBookingModal} className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between min-h-[550px]">
          <div className="space-y-6">
            {/* Options Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Garment Cut */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest text-[#0C0A09]/60">1. SUIT SILHOUETTE</label>
                <div className="grid grid-cols-1 gap-2">
                  {(["SINGLE_BREASTED", "DOUBLE_BREASTED", "BESKAP_HERITAGE"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setGarmentType(type);
                        if (type === "BESKAP_HERITAGE") setCollarStyle("MANDARIN");
                        else if (type === "DOUBLE_BREASTED") setCollarStyle("PEAK");
                        else setCollarStyle("CLASSIC");
                      }}
                      className={`py-3 px-3 border rounded-xl text-left text-xs font-semibold tracking-wider transition-all duration-300 ${
                        garmentType === type
                          ? "bg-[#1C1917] border-[#1C1917] text-white shadow-sm"
                          : "bg-white border-[#0C0A09]/10 text-[#0C0A09]/75 hover:border-[#1C1917]"
                      }`}
                    >
                      {type.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Batik Motif — dynamic from admin */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest text-[#0C0A09]/60">2. EMBOSSED BATIK MOTIF</label>
                <select
                  value={batikMotif}
                  onChange={(e) => setBatikMotif(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                >
                  {dynamicMotifs.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title}{m.meaning ? ` — ${m.meaning}` : ""}
                    </option>
                  ))}
                  <option value="NONE">Solid Plain Fabric</option>
                </select>
              </div>

              {/* Accent Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest text-[#0C0A09]/60">3. BUTTON ACCENTS / PINS</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["GOLD", "SILVER", "BRONZE"] as const).map((accent) => (
                    <button
                      key={accent}
                      type="button"
                      onClick={() => setButtonAccent(accent)}
                      className={`py-3 px-2 border rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 ${
                        buttonAccent === accent
                          ? "bg-[#1C1917] border-[#1C1917] text-white shadow-sm"
                          : "bg-white border-[#0C0A09]/10 text-[#0C0A09]/75 hover:border-[#1C1917]"
                      }`}
                    >
                      {accent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collar Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest text-[#0C0A09]/60">4. LAPEL / COLLAR TYPE</label>
                {garmentType === "BESKAP_HERITAGE" ? (
                  <input
                    type="text"
                    value="Mandarin Collar (Closed)"
                    disabled
                    className="w-full px-4 py-3 bg-stone-100 border border-[#0C0A09]/10 rounded-xl text-sm text-[#0C0A09]/50"
                  />
                ) : (
                  <select
                    value={collarStyle}
                    onChange={(e) => setCollarStyle(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                  >
                    <option value="CLASSIC">Notch Lapel</option>
                    <option value="PEAK">Peak Lapel</option>
                    <option value="MANDARIN">Mandarin Collar</option>
                  </select>
                )}
              </div>
            </div>

            {/* Philosophy Box — dynamic from admin */}
            <div className="p-5 bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-2xl flex gap-3 items-start mt-6">
              <Sparkles className="text-[#CA8A04] flex-shrink-0 mt-0.5" size={16} />
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#CA8A04] uppercase">MOTIF PHILOSOPHY — {getMotifTitle(batikMotif)}</span>
                <p className="text-xs font-light leading-relaxed text-[#0C0A09]/70 mt-1">
                  {getMotifPhilosophy(batikMotif)}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="space-y-4 pt-4 border-t border-[#0C0A09]/5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-[#0C0A09]/50">
                Measurements and details will be confirmed in your private fitting session.
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 py-3 px-8 bg-[#1C1917] hover:bg-[#CA8A04] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-sm"
              >
                <Send size={12} /> ORDER & BOOK FITTING
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Booking Form Dialog Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 border border-[#0C0A09]/5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X size={18} />
              </button>

              {!submitSuccess ? (
                <form onSubmit={handleConfirmOrderAndBooking} className="space-y-6">
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-[#CA8A04] uppercase">ORDER CONFIRMATION</span>
                    <h3 className="font-cormorant text-2xl md:text-3xl font-bold mt-1 text-[#0C0A09]">
                      Book Your Fitting Appointment
                    </h3>
                    <p className="text-xs text-[#0C0A09]/60 font-light mt-1">
                      Ageman suits are strictly handcrafted. Please schedule a private measurement session at our studio to complete your order.
                    </p>
                  </div>

                  <hr className="border-stone-100" />

                  {/* Summary of customized item */}
                  <div className="p-4 bg-[#FAFAF9] rounded-2xl border border-stone-100 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">Garment Style</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{garmentType.replace("_", " ")}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">Batik Motif</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{batikMotif}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">Accent / Lapel</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{buttonAccent} buttons + {collarStyle} style</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#0C0A09]/40 uppercase tracking-widest">Estimated Total</span>
                      <p className="font-bold text-[#CA8A04] mt-0.5">IDR {currentPrice.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                        <User size={12} className="text-[#CA8A04]" /> FULL NAME
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Raden Mas Bagus"
                        className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                          <Mail size={12} className="text-[#CA8A04]" /> EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. client@ageman.com"
                          className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                          <Phone size={12} className="text-[#CA8A04]" /> WHATSAPP NUMBER
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +62 812-3456-7890"
                          className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#CA8A04]" /> STUDIO LOCATION
                        </label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04]"
                        >
                          <option value="YOGYAKARTA">YOGYAKARTA</option>
                          <option value="SURAKARTA">SURAKARTA</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#CA8A04]" /> DATE
                        </label>
                        <input
                          type="date"
                          min={minDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1.5">
                          <Clock size={12} className="text-[#CA8A04]" /> TIME SLOT
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04]"
                        >
                          <option value="10:30 - 12:00">10:30 - 12:00</option>
                          <option value="13:00 - 14:30">13:00 - 14:30</option>
                          <option value="15:30 - 17:00">15:30 - 17:00</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5">MEASUREMENT / OTHER REQUESTS (OPTIONAL)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Specify measurement notes or sizing details if known..."
                        rows={2}
                        className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                      <AlertCircle size={14} />
                      {submitError}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="py-2.5 px-5 bg-transparent border border-stone-200 text-stone-700 text-xs font-semibold rounded-full hover:bg-stone-50 transition-all duration-300"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="flex items-center gap-1.5 py-2.5 px-6 bg-[#1C1917] hover:bg-[#CA8A04] disabled:bg-[#1C1917]/50 text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                      {modalLoading ? "REGISTERING ORDER..." : "CONFIRM ORDER & BOOK"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check size={28} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#CA8A04] tracking-widest uppercase">BESPOKE ORDER CREATED</span>
                    <h3 className="font-cormorant text-3xl font-bold text-[#0C0A09]">
                      Order Registered successfully!
                    </h3>
                    <p className="text-xs text-[#0C0A09]/60 font-light max-w-sm mx-auto leading-relaxed">
                      Your tailoring order has been created and synced with our workshop. We have reserved a measurement session for you.
                    </p>
                  </div>

                  {/* Confirmed Order & Appointment summary */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 max-w-md mx-auto text-xs space-y-3">
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-[#0C0A09]/50">Order Tracking Code:</span>
                      <span className="font-mono font-bold text-[#CA8A04] text-sm bg-[#CA8A04]/10 px-2 py-0.5 rounded">
                        {customOrderId}
                      </span>
                    </div>
                    <div className="flex justify-between text-left">
                      <span className="text-[#0C0A09]/50">Garment Cut:</span>
                      <span className="font-semibold text-stone-800">{garmentType.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-left">
                      <span className="text-[#0C0A09]/50">Studio Location:</span>
                      <span className="font-semibold text-stone-800">{location} Studio</span>
                    </div>
                    <div className="flex justify-between text-left">
                      <span className="text-[#0C0A09]/50">Date & Slot:</span>
                      <span className="font-semibold text-stone-800">{date} at {timeSlot}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl max-w-md mx-auto text-[11px] leading-relaxed text-left flex gap-2">
                    <Sparkles size={16} className="text-[#CA8A04] flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Important:</strong> Please write down your tracking code <strong>{customOrderId}</strong>. You can use it on the <strong>Track Order</strong> page to watch our tailors proceed through the artisan lifecycle stages (Nyanting, Dyeing, Boiling, Cutting, Tailoring).
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="py-3 px-8 bg-[#1C1917] hover:bg-[#CA8A04] text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                      RETURN TO CANVAS
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
