"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateThemeConfig, updateProductAction, createProductAction, deleteProductAction, updateOrderStatusAction, deleteBookingAction, approveOrderWithSpecsAction } from "@/app/admin/actions";
import { ThemeConfig } from "@/lib/schema";
import { Save, RefreshCw, Check, AlertCircle, Sparkles, Layout, ShoppingBag, Plus, Trash2, Image, X, Scissors, Calendar, Clock, MapPin, User, Mail, Phone, ChevronRight } from "lucide-react";
import { BatikBackground } from "../batik/BatikBackground";

const compressAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface Product {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  price: number;
  image: string;
  category: string;
}

interface Booking {
  id: string;
  createdAt: any;
  clientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  location: string;
  notes: string | null;
}

interface Order {
  id: string;
  createdAt: any;
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

interface AdminClientProps {
  theme: ThemeConfig;
  initialProducts: Product[];
  initialBookings: Booking[];
  initialOrders: Order[];
}

export const AdminClient: React.FC<AdminClientProps> = ({ theme, initialProducts, initialBookings, initialOrders }) => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<"THEME" | "PRODUCTS" | "TAILORING">("THEME");

  // --- Theme Configurator State ---
  const [heroTitle, setHeroTitle] = useState(theme.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(theme.heroSubtitle);
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor);
  const [accentColor, setAccentColor] = useState(theme.accentColor);
  const [activeBatikPattern, setActiveBatikPattern] = useState(theme.activeBatikPattern);
  const [enableAnimations, setEnableAnimations] = useState(theme.enableAnimations);

  // Load initial custom philosophies or default values
  const defaultMotifs = [
    {
      id: "PARANG",
      title: "Parang Rusak Gendreh",
      meaning: "The Wave of Resilience",
      description: "Originating from the royal courts of Mataram, the diagonal S-curves represent ocean waves crashing against rocks. It symbolizes the relentless spirit of leadership, moral resilience, and the power to overcome self-obstacles.",
      image: ""
    },
    {
      id: "KAWUNG",
      title: "Kawung Picis",
      meaning: "The Circle of Cosmic Balance",
      description: "A geometric motif representing four palm fruit lobes arranged around a central axis. It stands for purity of mind, justice, self-control, and the perfect harmony between humans, nature, and the universe.",
      image: ""
    },
    {
      id: "MEGAMENDUNG",
      title: "Megamendung Cirebon",
      meaning: "The Calm Cloud of Patience",
      description: "Represented by layered, dynamic cloud contours in warm or cool gradients. It symbolises the necessity of maintaining patience, emotional stability, and keeping a cool mind in times of distress.",
      image: ""
    }
  ];

  const getInitialMotifs = () => {
    let initial = defaultMotifs;
    try {
      if (theme.customStylesJson) {
        const parsed = JSON.parse(theme.customStylesJson);
        if (parsed.motifs && Array.isArray(parsed.motifs) && parsed.motifs.length > 0) {
          initial = parsed.motifs;
        }
      }
    } catch (e) {
      console.error("Failed to parse initial custom motifs:", e);
    }
    return initial;
  };

  const [motifsList, setMotifsList] = useState(getInitialMotifs());

  const updateMotifField = (index: number, field: string, value: string) => {
    const newList = [...motifsList];
    newList[index] = { ...newList[index], [field]: value };
    setMotifsList(newList);
  };

  const addMotif = () => {
    const newId = "CUSTOM_" + Date.now();
    const newMotif = {
      id: newId,
      title: "New Custom Motif",
      meaning: "The Wisdom of Attire",
      description: "Describe the history and cultural philosophy of this custom Javanese motif here.",
      image: ""
    };
    setMotifsList([...motifsList, newMotif]);
  };

  const removeMotif = (index: number) => {
    if (motifsList.length <= 1) {
      alert("You must keep at least one motif in your collection.");
      return;
    }
    if (confirm("Are you sure you want to remove this motif? This action is permanent once saved.")) {
      const newList = motifsList.filter((_, idx) => idx !== index);
      setMotifsList(newList);
    }
  };

  // --- Product Catalog State ---
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // --- Product Form State ---
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPhilosophy, setProdPhilosophy] = useState("");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodImage, setProdImage] = useState("");
  const [prodCategory, setProdCategory] = useState("SUITS");

  // --- Tailoring Orders & Appointments State ---
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  // --- Order Approval Modal State ---
  const [approvingOrder, setApprovingOrder] = useState<Order | null>(null);
  const [measurements, setMeasurements] = useState("");
  const [clothType, setClothType] = useState("Premium Silk");
  const [liningColor, setLiningColor] = useState("Golden Sogan");
  const [tailorNotes, setTailorNotes] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

  // --- Global UX Status State ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Theme Form Handlers ---
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const customStylesJson = JSON.stringify({
      motifs: motifsList
    });

    const result = await updateThemeConfig({
      heroTitle,
      heroSubtitle,
      primaryColor,
      secondaryColor,
      accentColor,
      activeBatikPattern,
      enableAnimations,
      customStylesJson,
    });

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update configuration.");
    }
  };

  const handleResetTheme = () => {
    setHeroTitle(theme.heroTitle);
    setHeroSubtitle(theme.heroSubtitle);
    setPrimaryColor(theme.primaryColor);
    setSecondaryColor(theme.secondaryColor);
    setAccentColor(theme.accentColor);
    setActiveBatikPattern(theme.activeBatikPattern);
    setEnableAnimations(theme.enableAnimations);
    setMotifsList(getInitialMotifs());
    setError(null);
  };

  // --- Product Operations Handlers ---
  const selectProductForEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsEditing(true);
    setIsAdding(false);
    setProdName(prod.name);
    setProdDescription(prod.description);
    setProdPhilosophy(prod.philosophy);
    setProdPrice(prod.price);
    setProdImage(prod.image);
    setProdCategory(prod.category.toUpperCase());
    setError(null);
    setSuccess(false);
  };

  const selectForAdd = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsAdding(true);
    setProdName("");
    setProdDescription("");
    setProdPhilosophy("");
    setProdPrice(0);
    setProdImage("");
    setProdCategory("SUITS");
    setError(null);
    setSuccess(false);
  };

  const handleCancelProductEdit = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsAdding(false);
    setError(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!prodImage) {
      setError("Product image is required. Please upload an image.");
      setLoading(false);
      return;
    }

    if (isEditing && selectedProduct) {
      const result = await updateProductAction({
        id: selectedProduct.id,
        name: prodName,
        description: prodDescription,
        philosophy: prodPhilosophy,
        price: prodPrice,
        image: prodImage,
        category: prodCategory,
      });

      setLoading(false);
      if (result.success && result.product) {
        setProducts(products.map(p => p.id === selectedProduct.id ? (result.product as Product) : p));
        setSuccess(true);
        setIsEditing(false);
        setSelectedProduct(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update product.");
      }
    } else if (isAdding) {
      const result = await createProductAction({
        name: prodName,
        description: prodDescription,
        philosophy: prodPhilosophy,
        price: prodPrice,
        image: prodImage,
        category: prodCategory,
      });

      setLoading(false);
      if (result.success && result.product) {
        setProducts([result.product as Product, ...products]);
        setSuccess(true);
        setIsAdding(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to add product.");
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product item? This action is permanent.")) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await deleteProductAction(id);
    setLoading(false);
    if (result.success) {
      setProducts(products.filter(p => p.id !== id));
      setSuccess(true);
      handleCancelProductEdit();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to delete product.");
    }
  };

  // --- Tailoring Actions ---
  const handleUpdateStep = async (orderId: string, newStep: number) => {
    setSavingOrderId(orderId);
    setError(null);
    setSuccess(false);

    const result = await updateOrderStatusAction(orderId, newStep);
    setSavingOrderId(null);
    if (result.success && result.order) {
      setOrders(orders.map(o => o.id === orderId ? (result.order as Order) : o));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update order step.");
    }
  };

  const handleApproveOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingOrder) return;

    setApprovalLoading(true);
    setError(null);
    setSuccess(false);

    const result = await approveOrderWithSpecsAction({
      orderId: approvingOrder.id,
      measurements,
      clothType,
      liningColor,
      tailorNotes,
    });

    setApprovalLoading(false);
    if (result.success && result.order) {
      setOrders(orders.map(o => o.id === approvingOrder.id ? (result.order as Order) : o));
      setSuccess(true);
      setApprovingOrder(null);
      setMeasurements("");
      setClothType("Premium Silk");
      setLiningColor("Golden Sogan");
      setTailorNotes("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to approve and initialize order specs.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this fitting booking appointment?")) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await deleteBookingAction(bookingId);
    setLoading(false);
    if (result.success) {
      setBookings(bookings.filter(b => b.id !== bookingId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to cancel fitting booking.");
    }
  };

  // Preview styling
  const previewStyles = {
    "--color-primary": primaryColor,
    "--color-secondary": secondaryColor,
    "--color-accent": accentColor,
    backgroundColor: "#FAFAF9",
  } as React.CSSProperties;

  const stepLabels = [
    "",
    "1. Nyanting (Waxing)",
    "2. Nyolet (Dyeing)",
    "3. Melorod (Boiling)",
    "4. Polan (Cutting)",
    "5. Jahit (Tailoring)"
  ];

  const pendingApprovalOrders = orders.filter(o => o.statusStep === 0);
  const activeOrders = orders.filter(o => o.statusStep > 0);

  return (
    <div className="space-y-8">
      {/* Dynamic Navigation Tabs */}
      <div className="flex border-b border-[#0C0A09]/10">
        <button
          onClick={() => { setActiveTab("THEME"); setError(null); setSuccess(false); }}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-cormorant text-xl tracking-wider transition-all duration-300 ${
            activeTab === "THEME"
              ? "border-[#CA8A04] text-[#CA8A04] font-bold"
              : "border-transparent text-[#0C0A09]/50 hover:text-[#0C0A09]"
          }`}
        >
          <Layout size={18} /> STOREFRONT CUSTOMIZER
        </button>
        <button
          onClick={() => { setActiveTab("PRODUCTS"); setError(null); setSuccess(false); }}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-cormorant text-xl tracking-wider transition-all duration-300 ${
            activeTab === "PRODUCTS"
              ? "border-[#CA8A04] text-[#CA8A04] font-bold"
              : "border-transparent text-[#0C0A09]/50 hover:text-[#0C0A09]"
          }`}
        >
          <ShoppingBag size={18} /> PRODUCT CATALOG MANAGER
        </button>
        <button
          onClick={() => { setActiveTab("TAILORING"); setError(null); setSuccess(false); }}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-cormorant text-xl tracking-wider transition-all duration-300 ${
            activeTab === "TAILORING"
              ? "border-[#CA8A04] text-[#CA8A04] font-bold"
              : "border-transparent text-[#0C0A09]/50 hover:text-[#0C0A09]"
          }`}
        >
          <Scissors size={18} /> ORDERS & APPOINTMENTS
        </button>
      </div>

      {/* Success/Error Alerts (Common for Products/Tailoring tabs) */}
      {success && activeTab !== "THEME" && (
        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm max-w-lg">
          <Check size={18} /> Operation successfully synced with store database.
        </div>
      )}

      {error && activeTab !== "THEME" && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm max-w-lg">
          <AlertCircle size={18} /> Error: {error}
        </div>
      )}

      {/* --- TAB 1: THEME CUSTOMIZER --- */}
      {activeTab === "THEME" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveTheme} className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              {/* Hero Content Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">HERO SECTION</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">HERO TITLE</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">HERO SUBTITLE</label>
                    <textarea
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <hr className="border-[#0C0A09]/5" />

              {/* Color Palettes Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">COLOR SCHEME</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">PRIMARY (CHARCOAL)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-grow px-3 py-2 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">SECONDARY (MUTED EARTH)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-grow px-3 py-2 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">ACCENT/CTA (GOLD)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-grow px-3 py-2 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-[#0C0A09]/5" />

              {/* Motif & Animations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">BATIK CONFIGURATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">ACTIVE WATERMARK PATTERN</label>
                    <select
                      value={activeBatikPattern}
                      onChange={(e) => setActiveBatikPattern(e.target.value as "PARANG" | "KAWUNG" | "MEGAMENDUNG" | "NONE")}
                      className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                    >
                      <option value="PARANG">Parang (Resilience)</option>
                      <option value="KAWUNG">Kawung (Cosmic Balance)</option>
                      <option value="MEGAMENDUNG">Megamendung (Patience)</option>
                      <option value="NONE">None (Plain Background)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableAnimations}
                        onChange={(e) => setEnableAnimations(e.target.checked)}
                        className="w-4 h-4 rounded border-[#0C0A09]/10 text-[#CA8A04] focus:ring-[#CA8A04]"
                      />
                      <span className="text-sm font-semibold text-[#0C0A09]/80">ENABLE DECORATIVE ANIMATIONS</span>
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-[#0C0A09]/5" />

              {/* Batik Motif Philosophies Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#0C0A09]/5 pb-3">
                  <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">BATIK MOTIF PHILOSOPHIES ({motifsList.length})</h3>
                  <button
                    type="button"
                    onClick={addMotif}
                    className="flex items-center gap-1 py-1 px-3.5 bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-white text-[10px] font-bold rounded-full transition-all duration-200"
                  >
                    <Plus size={10} /> ADD MOTIF
                  </button>
                </div>
                
                {motifsList.map((item, index) => (
                  <div key={item.id} className="bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#0C0A09]/5 pb-2">
                      <h4 className="text-xs font-bold text-[#CA8A04]">
                        MOTIF {index + 1}: {item.title || "Untitled"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeMotif(index)}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-0.5 border border-red-200 hover:border-red-300 rounded-full px-2 py-0.5"
                      >
                        <Trash2 size={10} /> REMOVE
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-semibold text-[#0C0A09]/70 mb-1.5">MOTIF ID / CODE</label>
                            <input
                              type="text"
                              value={item.id}
                              onChange={(e) => updateMotifField(index, "id", e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                              className="w-full px-3 py-2 bg-white border border-[#0C0A09]/10 rounded-xl text-xs font-mono focus:outline-none focus:border-[#CA8A04]"
                              placeholder="e.g. PARANG"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-[#0C0A09]/70 mb-1.5">TITLE</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateMotifField(index, "title", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04]"
                              placeholder="e.g. Parang Rusak"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#0C0A09]/70 mb-1.5">MEANING / TRANSLATION</label>
                          <input
                            type="text"
                            value={item.meaning}
                            onChange={(e) => updateMotifField(index, "meaning", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04]"
                            placeholder="e.g. The Wave of Resilience"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#0C0A09]/70 mb-1.5">DESCRIPTION</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateMotifField(index, "description", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-[#0C0A09]/10 rounded-xl text-xs focus:outline-none focus:border-[#CA8A04] resize-none"
                            placeholder="Describe the motif philosophy..."
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 justify-center items-center">
                        <label className="block text-[10px] font-semibold text-[#0C0A09]/70 self-start mb-0.5">MOTIF PICTURE</label>
                        <input
                          id={`motif-image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressAndResizeImage(file);
                                updateMotifField(index, "image", compressed);
                              } catch (err) {
                                console.error("Failed to process motif image file:", err);
                                setError("Failed to process motif image file. Please try another one.");
                              }
                            }
                          }}
                          className="hidden"
                        />
                        
                        <div className="flex gap-3 w-full items-center justify-center">
                          <div
                            onClick={() => document.getElementById(`motif-image-upload-${index}`)?.click()}
                            className="flex-grow relative border-2 border-dashed border-[#0C0A09]/10 rounded-2xl p-4 hover:border-[#CA8A04]/40 hover:bg-[#CA8A04]/[0.02] transition-all bg-white cursor-pointer flex flex-col items-center justify-center gap-1 group h-24 text-center"
                          >
                            <Image size={16} className="text-[#0C0A09]/40 group-hover:text-[#CA8A04] transition-colors" />
                            <span className="text-[10px] font-semibold text-[#0C0A09]/75 group-hover:text-[#CA8A04] transition-colors">
                              Upload picture
                            </span>
                            <span className="text-[8px] text-[#0C0A09]/30">PNG, JPG</span>
                          </div>

                          {item.image ? (
                            <div className="relative w-24 h-24 border border-[#0C0A09]/10 rounded-2xl overflow-hidden flex-shrink-0 bg-white flex items-center justify-center shadow-sm">
                              <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => updateMotifField(index, "image", "")}
                                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                                title="Remove picture"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-24 h-24 border border-[#0C0A09]/5 rounded-2xl flex-shrink-0 bg-stone-100 flex flex-col items-center justify-center gap-1 text-[9px] text-[#0C0A09]/30 text-center p-2 font-mono">
                              <BatikBackground pattern={item.id} className="w-6 h-6 opacity-30 text-stone-600" />
                              <span>SVG Native</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-[#0C0A09]/5" />

              {/* Success/Error Alerts inside Form */}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm">
                  <Check size={18} />
                  Theme changes saved successfully! Storefront revalidated.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                  <AlertCircle size={18} />
                  Error: {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleResetTheme}
                  className="flex items-center gap-1.5 py-2.5 px-4 bg-transparent border border-[#0C0A09]/10 hover:border-[#0C0A09]/30 text-xs font-semibold text-[#0C0A09]/80 rounded-full transition-colors duration-200"
                >
                  <RefreshCw size={12} /> RESET TO LOADED
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 py-2.5 px-6 bg-[#1C1917] hover:bg-[#CA8A04] disabled:bg-[#1C1917]/50 text-white text-xs font-semibold rounded-full transition-colors duration-200 shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> SAVING CHANGES...
                    </>
                  ) : (
                    <>
                      <Save size={12} /> SAVE CONFIGURATION
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mini Live Preview Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-[#0C0A09]/45 uppercase">LIVE STOREFRONT PREVIEW</h3>
            <div 
              className="relative h-[550px] border border-[#0C0A09]/10 rounded-3xl p-6 overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-500"
              style={previewStyles}
            >
              {activeBatikPattern !== "NONE" && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.035] text-[#0C0A09]">
                  <BatikBackground pattern={activeBatikPattern} />
                </div>
              )}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none" style={{ backgroundColor: accentColor }}></div>
              
              <div className="flex items-center justify-between border-b border-[#0C0A09]/5 pb-4 z-10">
                <span className="font-cormorant text-md font-bold tracking-widest text-[#0C0A09]">
                  {heroTitle.toUpperCase()}
                </span>
                <span className="text-[9px] font-bold text-[#0C0A09]/40">NAVBAR</span>
              </div>

              <div className="text-center py-10 space-y-4 z-10 flex-grow flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-widest text-[#CA8A04] bg-[#CA8A04]/10 border border-[#CA8A04]/20 mx-auto">
                  <Sparkles size={8} /> PREVIEW MODE
                </div>
                <h2 className="font-cormorant text-4xl font-bold tracking-tight text-[#0C0A09] leading-none">
                  {heroTitle}
                </h2>
                <p className="font-cormorant text-sm font-light italic text-[#44403C] max-w-xs mx-auto">
                  {heroSubtitle}
                </p>
                <div className="h-[1px] w-12 mx-auto my-3" style={{ backgroundColor: accentColor }}></div>
                <button type="button" className="mx-auto flex items-center gap-1 text-white font-medium py-2 px-5 rounded-full text-[9px] tracking-wider transition-colors duration-200" style={{ backgroundColor: primaryColor }}>
                  SHOP NOW
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-[#0C0A09]/5 rounded-xl p-3 z-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <BatikBackground pattern={activeBatikPattern} className="w-full h-full text-stone-600 opacity-20" />
                </div>
                <div className="flex-grow">
                  <span className="text-[8px] font-bold text-[#CA8A04] uppercase font-semibold">SUITS</span>
                  <h4 className="font-cormorant text-xs font-bold text-[#0C0A09]">Prada Kencana Jas Batik</h4>
                  <p className="text-[8px] text-[#0C0A09]/50 font-light mt-0.5">Philosophy: Prada Nobles</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0C0A09]">IDR 1.2M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PRODUCT CATALOG MANAGER --- */}
      {activeTab === "PRODUCTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 shadow-sm space-y-4 h-[700px] flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto pr-1 flex-grow">
              <div className="flex items-center justify-between pb-2 border-b border-[#0C0A09]/5">
                <h3 className="text-sm font-bold tracking-widest text-[#0C0A09]/60">STORE CATALOG ({products.length})</h3>
                <button
                  onClick={selectForAdd}
                  className="flex items-center gap-1 py-1 px-3 bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-white text-[10px] font-bold rounded-full transition-all duration-300"
                >
                  <Plus size={10} /> ADD ITEM
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-10 text-xs font-light text-[#0C0A09]/40">
                  No products found. Click Add Item to begin!
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => selectProductForEdit(prod)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                        (selectedProduct?.id === prod.id || (isAdding && prod.id === "new"))
                          ? "border-[#CA8A04] bg-[#CA8A04]/5 shadow-sm"
                          : "border-[#0C0A09]/5 hover:border-[#0C0A09]/20"
                      }`}
                    >
                      <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold tracking-wider text-[#CA8A04] uppercase">{prod.category}</span>
                          <span className="text-[9px] font-mono font-semibold text-[#0C0A09]/60">IDR {prod.price.toLocaleString("id-ID")}</span>
                        </div>
                        <h4 className="font-cormorant text-sm font-bold text-[#0C0A09] truncate mt-0.5">{prod.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {!isEditing && !isAdding ? (
              <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-8 shadow-sm h-[700px] flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag size={48} className="text-[#0C0A09]/15" />
                <h3 className="font-cormorant text-2xl font-bold text-[#0C0A09]/80">No Item Selected</h3>
                <p className="text-xs font-light text-[#0C0A09]/50 max-w-xs leading-relaxed">
                  Select an item from the list on the left to edit its details, update the image, and customize the description, or click "+ Add Item" to register a new product.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveProduct} className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 shadow-sm h-[700px] flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0C0A09]/5">
                    <h3 className="font-cormorant text-2xl font-bold tracking-wide text-[#0C0A09]">
                      {isAdding ? "Add New Product" : `Edit: ${prodName || "Product Item"}`}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCancelProductEdit}
                      className="p-1.5 hover:bg-[#0C0A09]/5 rounded-full text-[#0C0A09]/50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">PRODUCT NAME</label>
                      <input
                        type="text"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">CATEGORY</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                      >
                        <option value="SUITS">Jas Batik (Suits)</option>
                        <option value="SHIRTS">Batik Shirts</option>
                        <option value="ACCESSORIES">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">PRICE (IDR)</label>
                      <input
                        type="number"
                        value={prodPrice || ""}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm font-mono focus:outline-none focus:border-[#CA8A04]"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">PRODUCT IMAGE</label>
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-grow w-full">
                          <div
                            onClick={() => document.getElementById("product-image-upload")?.click()}
                            className="relative border-2 border-dashed border-[#0C0A09]/10 rounded-2xl p-6 hover:border-[#CA8A04]/40 hover:bg-[#CA8A04]/[0.02] transition-all duration-300 bg-[#FAFAF9] cursor-pointer flex flex-col items-center justify-center gap-2 group"
                          >
                            <input
                              id="product-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressAndResizeImage(file);
                                    setProdImage(compressed);
                                  } catch (err) {
                                    console.error("Failed to process image file:", err);
                                    setError("Failed to process image file. Please try another one.");
                                  }
                                }
                              }}
                              className="hidden"
                            />
                            <div className="p-3 bg-[#0C0A09]/5 rounded-full text-[#0C0A09]/60 group-hover:text-[#CA8A04] group-hover:bg-[#CA8A04]/10 transition-colors">
                              <Image size={20} className="text-[#0C0A09]/50" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-semibold text-[#0C0A09]/80 group-hover:text-[#CA8A04] transition-colors">
                                Click or drag to upload product image
                              </p>
                              <p className="text-[10px] text-[#0C0A09]/40 mt-1">
                                Supports PNG, JPG, WEBP (resized automatically)
                              </p>
                            </div>
                          </div>
                        </div>

                        {prodImage && (
                          <div className="relative w-28 h-28 border border-[#0C0A09]/10 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-50 flex items-center justify-center shadow-md">
                            <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setProdImage("")}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                              title="Remove image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2">PRODUCT DESCRIPTION</label>
                      <textarea
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-2 flex items-center gap-1">
                        <Sparkles size={12} className="text-[#CA8A04]" /> BATIK PHILOSOPHY
                      </label>
                      <textarea
                        value={prodPhilosophy}
                        onChange={(e) => setProdPhilosophy(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#0C0A09]/5 mt-4">
                  {isEditing && selectedProduct ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                      className="flex items-center gap-1 py-2 px-4 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200 hover:border-red-300 transition-colors"
                    >
                      DELETE ITEM
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelProductEdit}
                      className="py-2.5 px-4 bg-transparent border border-[#0C0A09]/10 hover:border-[#0C0A09]/20 text-xs font-semibold text-[#0C0A09]/80 rounded-full transition-colors duration-200"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-1.5 py-2.5 px-6 bg-[#1C1917] hover:bg-[#CA8A04] disabled:bg-[#1C1917]/50 text-white text-xs font-semibold rounded-full transition-colors duration-200 shadow-sm"
                    >
                      {loading ? "SAVING..." : "SAVE PRODUCT"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: TAILORING ORDERS & APPOINTMENTS --- */}
      {activeTab === "TAILORING" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fitting Appointments List */}
          <div className="bg-white border border-[#0C0A09]/5 rounded-3xl p-6 shadow-sm space-y-6 h-[720px] overflow-y-auto flex flex-col justify-start">
            <div className="pb-3 border-b border-[#0C0A09]/5 flex items-center gap-2">
              <Calendar className="text-[#CA8A04]" size={16} />
              <h3 className="text-sm font-bold tracking-widest text-[#0C0A09]/60">FITTING APPOINTMENTS ({bookings.length})</h3>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-10 text-xs font-light text-[#0C0A09]/40 flex-grow flex items-center justify-center">
                No bookings scheduled.
              </div>
            ) : (
              <div className="space-y-4 flex-grow">
                {bookings.map((book) => (
                  <div key={book.id} className="p-4 bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-2xl space-y-3 relative group">
                    {/* Delete Appointment */}
                    <button
                      onClick={() => handleCancelBooking(book.id)}
                      className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-50 text-[#0C0A09]/30 hover:text-red-600 transition-colors"
                      title="Cancel Booking"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="space-y-1">
                      <span className="text-[8px] font-bold tracking-wider text-[#CA8A04] uppercase flex items-center gap-1">
                        <MapPin size={8} /> {book.location}
                      </span>
                      <h4 className="font-cormorant text-md font-bold text-[#0C0A09]">{book.clientName}</h4>
                    </div>

                    <div className="space-y-1 text-[10px] text-[#0C0A09]/60 font-light">
                      <p className="flex items-center gap-1.5"><Calendar size={10} /> {book.date}</p>
                      <p className="flex items-center gap-1.5"><Clock size={10} /> {book.timeSlot}</p>
                      <p className="flex items-center gap-1.5"><Mail size={10} /> {book.email}</p>
                      <p className="flex items-center gap-1.5"><Phone size={10} /> {book.phone}</p>
                    </div>

                    {book.notes && (
                      <div className="p-2 bg-white border border-[#0C0A09]/5 rounded-xl text-[10px] font-light leading-relaxed text-[#0C0A09]/70 italic">
                        " {book.notes} "
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Artisan Orders Management */}
          <div className="lg:col-span-2 bg-white border border-[#0C0A09]/5 rounded-3xl p-6 md:p-8 shadow-sm h-[720px] overflow-y-auto flex flex-col justify-start space-y-8">
            
            {/* A. ORDERS WAITING FOR PHYSICAL FITTING & APPROVAL */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#0C0A09]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-[#CA8A04] animate-pulse" size={18} />
                  <h3 className="font-cormorant text-2xl font-bold tracking-wide text-[#0C0A09]">
                    Orders Waiting for Approval ({pendingApprovalOrders.length})
                  </h3>
                </div>
                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  PRE-PRODUCTION FITTING
                </span>
              </div>
              <p className="text-xs font-light text-[#0C0A09]/50 leading-relaxed">
                These customer customizer orders are pending their face-to-face fitting appointments. Meet with the customer to take their exact measurements, verify fabric selections, and input specifications to trigger production.
              </p>

              {pendingApprovalOrders.length === 0 ? (
                <div className="text-center py-8 bg-[#FAFAF9] border border-[#0C0A09]/5 border-dashed rounded-2xl text-xs font-light text-[#0C0A09]/40">
                  No orders waiting for approval.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovalOrders.map((ord) => (
                    <div key={ord.id} className="p-5 bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-[#CA8A04] bg-[#CA8A04]/10 px-2 py-0.5 rounded">
                          {ord.id}
                        </span>
                        <h4 className="font-cormorant text-lg font-bold text-[#0C0A09] pt-1">{ord.clientName}</h4>
                        <p className="text-[10px] text-[#0C0A09]/50 font-mono">{ord.email}</p>
                        <div className="text-xs text-[#0C0A09]/70 pt-1 space-y-0.5">
                          <p>Bespoke Customization Spec: <span className="font-semibold text-[#0C0A09]">{ord.garmentType.replace("_", " ")}</span></p>
                          <p>Batik Motif: <span className="font-semibold text-[#0C0A09]">{ord.motif}</span> ({ord.accents} + {ord.collar})</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setApprovingOrder(ord);
                          setMeasurements("");
                          setClothType("Premium Silk");
                          setLiningColor("Golden Sogan");
                          setTailorNotes("");
                        }}
                        className="py-2.5 px-5 bg-[#1C1917] hover:bg-[#CA8A04] text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm whitespace-nowrap self-end md:self-center"
                      >
                        Meet & Input Specifications
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-[#0C0A09]/5" />

            {/* B. ACTIVE PRODUCTION ORDERS */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#0C0A09]/5 flex items-center gap-2">
                <Scissors className="text-[#CA8A04]" size={18} />
                <h3 className="font-cormorant text-2xl font-bold tracking-wide text-[#0C0A09]">
                  Artisan Production Orders ({activeOrders.length})
                </h3>
              </div>

              {activeOrders.length === 0 ? (
                <div className="text-center py-10 bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-2xl text-xs font-light text-[#0C0A09]/40">
                  No active orders in production.
                </div>
              ) : (
                <div className="space-y-6">
                  {activeOrders.map((ord) => (
                    <div key={ord.id} className="p-6 bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {/* Order Details */}
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#CA8A04] bg-[#CA8A04]/10 px-2 py-0.5 rounded">
                            {ord.id}
                          </span>
                          <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            ACTIVE
                          </span>
                        </div>
                        <div>
                          <h4 className="font-cormorant text-lg font-bold text-[#0C0A09]">{ord.clientName}</h4>
                          <p className="text-[10px] font-light text-[#0C0A09]/50">{ord.email}</p>
                        </div>
                        <div className="text-xs text-[#0C0A09]/75 space-y-0.5 border-t border-stone-200/60 pt-2">
                          <p>Garment: <span className="font-semibold">{ord.garmentType.replace("_", " ")}</span></p>
                          <p>Motif: <span className="font-semibold">{ord.motif}</span></p>
                          <p>Design: <span className="font-semibold">{ord.accents} + {ord.collar}</span></p>
                        </div>
                        {/* Render physical tailor input if available */}
                        {ord.measurements && (
                          <div className="text-[10px] text-stone-600 bg-stone-200/50 p-2.5 rounded-xl space-y-1 leading-relaxed mt-2 border border-stone-200/50">
                            <p><strong>Size/Specs:</strong> {ord.measurements}</p>
                            <p><strong>Fabric:</strong> {ord.clothType}</p>
                            <p><strong>Lining:</strong> {ord.liningColor}</p>
                            {ord.tailorNotes && <p className="italic font-light">" {ord.tailorNotes} "</p>}
                          </div>
                        )}
                      </div>

                      {/* Status Slider Controller */}
                      <div className="md:col-span-2 space-y-4 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#0C0A09]/50">ARTISAN STAGE CONTROL</span>
                          <span className="font-bold text-[#CA8A04] uppercase tracking-wide">
                            {stepLabels[ord.statusStep]}
                          </span>
                        </div>

                        {/* Slider Input */}
                        <div className="relative pt-1">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={ord.statusStep}
                            onChange={(e) => handleUpdateStep(ord.id, Number(e.target.value))}
                            disabled={savingOrderId === ord.id}
                            className="w-full h-2 bg-[#0C0A09]/10 rounded-lg appearance-none cursor-pointer accent-[#CA8A04] disabled:opacity-50"
                          />
                          <div className="flex justify-between text-[8px] font-bold text-[#0C0A09]/40 mt-2">
                            <span>1. WAXING</span>
                            <span>2. DYEING</span>
                            <span>3. BOILING</span>
                            <span>4. CUTTING</span>
                            <span>5. TAILORED</span>
                          </div>
                        </div>

                        {/* Sync Indicator */}
                        {savingOrderId === ord.id && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#CA8A04] justify-end animate-pulse">
                            <RefreshCw size={10} className="animate-spin" /> SYNCHRONIZING WITH SERVER...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tailor Specifications & Approval Input Modal */}
      <AnimatePresence>
        {approvingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 border border-[#0C0A09]/5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setApprovingOrder(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X size={18} />
              </button>

              <form onSubmit={handleApproveOrderSubmit} className="space-y-6">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-[#CA8A04] uppercase">PHYSICAL FITTING SESSION</span>
                  <h3 className="font-cormorant text-2xl md:text-3xl font-bold mt-1 text-[#0C0A09]">
                    Approve Order & Input Tailor Specs
                  </h3>
                  <p className="text-xs text-[#0C0A09]/60 font-light mt-1">
                    Enter the client's official physical sizing measurements and material selection gathered during their fitting appointment.
                  </p>
                </div>

                <hr className="border-stone-100" />

                {/* Client Order Summary */}
                <div className="p-4 bg-[#FAFAF9] rounded-2xl border border-stone-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Order ID</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{approvingOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Customer</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{approvingOrder.clientName}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Garment Blueprint</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{approvingOrder.garmentType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Batik Design</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{approvingOrder.motif} ({approvingOrder.accents})</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5 flex items-center gap-1">
                      <Scissors size={12} className="text-[#CA8A04]" /> PHYSICAL MEASUREMENTS
                    </label>
                    <input
                      type="text"
                      value={measurements}
                      onChange={(e) => setMeasurements(e.target.value)}
                      placeholder="e.g. Chest: 104cm, Waist: 92cm, Shoulder: 45cm, Sleeve: 62cm"
                      className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5">CLOTH / FABRIC TYPE</label>
                      <input
                        type="text"
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        placeholder="e.g. Cashmere Wool, Premium Silk Silk"
                        className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5">ACCENT LINING COLOR</label>
                      <input
                        type="text"
                        value={liningColor}
                        onChange={(e) => setLiningColor(e.target.value)}
                        placeholder="e.g. Golden Sogan, Royal Crimson"
                        className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0C0A09]/70 mb-1.5">SPECIAL ADJUSTMENTS / NOTES</label>
                    <textarea
                      value={tailorNotes}
                      onChange={(e) => setTailorNotes(e.target.value)}
                      placeholder="e.g. Add shoulder pads, double vents in back, custom initials inside lapel..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#FAFAF9] border border-[#0C0A09]/10 rounded-xl text-sm focus:outline-none focus:border-[#CA8A04] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setApprovingOrder(null)}
                    className="py-2.5 px-5 bg-transparent border border-stone-200 text-stone-700 text-xs font-semibold rounded-full hover:bg-stone-50 transition-all duration-300"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={approvalLoading}
                    className="flex items-center gap-1.5 py-2.5 px-6 bg-[#CA8A04] hover:bg-[#CA8A04]/90 disabled:bg-[#CA8A04]/50 text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm"
                  >
                    {approvalLoading ? "SAVING..." : "APPROVE & START PRODUCTION"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
