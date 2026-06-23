"use client";

import React, { useState } from "react";
import { createBookingAction } from "@/app/book/actions";
import { Calendar, MapPin, Clock, Phone, Mail, User, Check, AlertCircle } from "lucide-react";

export const BookClient: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:30 - 12:00");
  const [location, setLocation] = useState("YOGYAKARTA");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await createBookingAction({
      clientName,
      email,
      phone,
      date,
      timeSlot,
      location,
      notes,
    });

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setClientName("");
      setEmail("");
      setPhone("");
      setDate("");
      setNotes("");
    } else {
      setError(result.error || "Failed to create appointment booking.");
    }
  };

  // Get tomorrow's date for minimum date selection
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info Group */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">1. CLIENT INFORMATION</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <User size={12} className="text-[#CA8A04]" /> FULL NAME
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Raden Mas Bagus"
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <Mail size={12} className="text-[#CA8A04]" /> EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. client@ageman.com"
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <Phone size={12} className="text-[#CA8A04]" /> PHONE NUMBER (WHATSAPP)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +62 812-3456-7890"
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                required
              />
            </div>
          </div>
        </div>

        <hr className="border-[#0C0A09]/5" />

        {/* Schedule & Slot Group */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">2. APPOINTMENT SPECIFICS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Studio Location */}
            <div>
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#CA8A04]" /> STUDIO LOCATION
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
              >
                <option value="YOGYAKARTA">Yogyakarta Studio (Dalem Kraton)</option>
                <option value="SURAKARTA">Surakarta Studio (Laweyan)</option>
              </select>
            </div>

            {/* Fitting Date */}
            <div>
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <Calendar size={12} className="text-[#CA8A04]" /> FITTING DATE
              </label>
              <input
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                required
              />
            </div>

            {/* Time Slot */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1.5">
                <Clock size={12} className="text-[#CA8A04]" /> PREFERRED TIME SLOT
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["09:00 - 10:30", "10:30 - 12:00", "13:00 - 14:30", "14:30 - 16:00"].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-3 border rounded-xl text-xs font-semibold text-center transition-all duration-300 ${
                      timeSlot === slot
                        ? "bg-[#1C1917] border-[#1C1917] text-white shadow-sm"
                        : "bg-white border-[#0C0A09]/10 text-[#0C0A09]/70 hover:border-[#1C1917]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">SPECIAL INSTRUCTIONS / DESIGN IDEAS</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention if this is for a wedding, special ceremony, or if you have chosen custom motifs from our customizer studio..."
                rows={3}
                className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#0C0A09]/5" />

        {/* Success/Error Alerts */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm animate-fade-in">
            <Check size={18} />
            Bespoke fitting appointment scheduled successfully! We will contact you on WhatsApp.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
            <AlertCircle size={18} />
            Error: {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 py-3 px-8 bg-[#1C1917] hover:bg-[#CA8A04] disabled:bg-[#1C1917]/50 text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm"
          >
            {loading ? "SCHEDULING APPOINTMENT..." : "CONFIRM FITTING BOOKING"}
          </button>
        </div>
      </form>
    </div>
  );
};
