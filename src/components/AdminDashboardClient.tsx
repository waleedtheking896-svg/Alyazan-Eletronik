"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Check,
  ExternalLink,
  FolderKanban,
  Inbox,
  Mail,
  MessageSquareQuote,
  Palette,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import type {
  BusinessProfile,
  InquiryItem,
  ProjectItem,
  ServiceItem,
  SubscriberItem,
  TestimonialItem,
} from "@/db/schema";
import { BUSINESS_PRESETS } from "@/lib/presets";
import LogoutButton from "@/components/LogoutButton";

interface AdminDashboardClientProps {
  initialProfile: BusinessProfile;
  initialServices: ServiceItem[];
  initialProjects: ProjectItem[];
  initialTestimonials: TestimonialItem[];
  initialInquiries: InquiryItem[];
  initialSubscribers: SubscriberItem[];
}

type AdminTab =
  | "inquiries"
  | "brand"
  | "services"
  | "projects"
  | "reviews";

const ACCENT_OPTIONS = [
  { label: "Cobalt", hex: "#1D4ED8" },
  { label: "Emerald", hex: "#0F766E" },
  { label: "Amber", hex: "#B45309" },
  { label: "Crimson", hex: "#DC2626" },
  { label: "Violet", hex: "#6D28D9" },
  { label: "Obsidian", hex: "#111827" },
];

const BUILT_IN_IMAGES = [
  { label: "Studio Architecture", url: "/images/hero-studio.png" },
  { label: "Brand Packaging", url: "/images/project-1.png" },
  { label: "Digital Product", url: "/images/project-2.png" },
  { label: "Flagship Lounge", url: "/images/project-3.png" },
];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminDashboardClient({
  initialProfile,
  initialServices,
  initialProjects,
  initialTestimonials,
  initialInquiries,
  initialSubscribers,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("inquiries");

  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(initialTestimonials);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [subscribers] = useState<SubscriberItem[]>(initialSubscribers);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Inquiries filter
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Brand form state
  const [brandForm, setBrandForm] = useState({ ...initialProfile });
  const [savingBrand, setSavingBrand] = useState(false);
  const [applyingPresetKey, setApplyingPresetKey] = useState<string | null>(
    null
  );

  // Add Service form
  const [newService, setNewService] = useState({
    title: "",
    category: "",
    priceLabel: "",
    turnaround: "",
    description: "",
    featured: true,
  });
  const [creatingService, setCreatingService] = useState(false);

  // Add Project form
  const [newProject, setNewProject] = useState({
    title: "",
    clientName: "",
    category: "",
    metricLabel: "",
    summary: "",
    imageUrl: "/images/project-1.png",
  });
  const [creatingProject, setCreatingProject] = useState(false);

  // Add Testimonial form
  const [newTestimonial, setNewTestimonial] = useState({
    authorName: "",
    authorRole: "",
    quote: "",
    rating: 5,
  });
  const [creatingTestimonial, setCreatingTestimonial] = useState(false);

  const accent = profile.accentColor || "#1D4ED8";

  const stats = useMemo(() => {
    const newLeads = inquiries.filter((i) => i.status === "new").length;
    const bookedLeads = inquiries.filter((i) => i.status === "booked").length;
    return {
      totalLeads: inquiries.length,
      newLeads,
      bookedLeads,
      serviceCount: services.length,
      subscriberCount: subscribers.length,
    };
  }, [inquiries, services.length, subscribers.length]);

  const filteredInquiries = useMemo(() => {
    if (statusFilter === "all") return inquiries;
    return inquiries.filter((inq) => inq.status === statusFilter);
  }, [inquiries, statusFilter]);

  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok && data.inquiry) {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? data.inquiry : item))
      );
      showToast(`Inquiry #${id} marked as ${status}`);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      showToast("Inquiry deleted");
    }
  };

  const handleApplyPreset = async (presetKey: string) => {
    setApplyingPresetKey(presetKey);
    try {
      const res = await fetch("/api/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetKey }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setBrandForm({ ...data.profile });
        setServices(data.services ?? []);
        setProjects(data.projects ?? []);
        setTestimonials(data.testimonials ?? []);
        showToast(`Applied "${data.profile.businessName}" business template`);
      }
    } finally {
      setApplyingPresetKey(null);
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBrand(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setBrandForm({ ...data.profile });
        showToast("Brand profile saved & live on website!");
      }
    } finally {
      setSavingBrand(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingService(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (res.ok && data.service) {
        setServices((prev) => [...prev, data.service]);
        setNewService({
          title: "",
          category: "",
          priceLabel: "",
          turnaround: "",
          description: "",
          featured: true,
        });
        showToast("New service added to live website!");
      }
    } finally {
      setCreatingService(false);
    }
  };

  const handleToggleFeaturedService = async (service: ServiceItem) => {
    const res = await fetch(`/api/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !service.featured }),
    });
    const data = await res.json();
    if (res.ok && data.service) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? data.service : s))
      );
      showToast("Service badge updated");
    }
  };

  const handleDeleteService = async (id: number) => {
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast("Service removed");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProject(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProjects((prev) => [...prev, data.project]);
        setNewProject({
          title: "",
          clientName: "",
          category: "",
          metricLabel: "",
          summary: "",
          imageUrl: "/images/project-1.png",
        });
        showToast("Showcase item published!");
      }
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Showcase item removed");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTestimonial(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      const data = await res.json();
      if (res.ok && data.testimonial) {
        setTestimonials((prev) => [...prev, data.testimonial]);
        setNewTestimonial({
          authorName: "",
          authorRole: "",
          quote: "",
          rating: 5,
        });
        showToast("Client review added!");
      }
    } finally {
      setCreatingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast("Review deleted");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#111827]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#FAF9F6] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Site
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="text-sm font-extrabold text-[#0F172A]">
                {profile.businessName}
              </span>
              <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                Owner Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
          <Link href="/admin/shop" className="inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-4 py-2 text-xs font-bold text-[#F2D16B]">
            🛒 Shop Manager (Orders & Products)
          </Link>
          <Link href="/admin/security" className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
            Passwort ändern
          </Link>
          <LogoutButton />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            View Live Website
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>New Inquiries</span>
              <Inbox className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold text-[#0F172A]">
              {stats.newLeads}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {stats.totalLeads} total submissions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Booked Clients</span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold text-[#0F172A]">
              {stats.bookedLeads}
            </p>
            <p className="mt-1 text-xs text-slate-500">Converted inquiries</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Active Services</span>
              <Briefcase className="h-4 w-4 text-slate-700" />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold text-[#0F172A]">
              {stats.serviceCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">Displayed on homepage</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Subscribers</span>
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold text-[#0F172A]">
              {stats.subscriberCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">Newsletter VIP list</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {[
            { id: "inquiries", label: "Leads & Inquiries", icon: Inbox },
            { id: "brand", label: "Brand & Templates", icon: Palette },
            { id: "services", label: "Services & Pricing", icon: Briefcase },
            { id: "projects", label: "Showcase / Work", icon: FolderKanban },
            {
              id: "reviews",
              label: "Reviews & Subscribers",
              icon: MessageSquareQuote,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                style={active ? { backgroundColor: accent } : undefined}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: INQUIRIES & LEADS */}
        {activeTab === "inquiries" && (
          <section className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-[#0F172A]">
                  Incoming Customer Inquiries
                </h1>
                <p className="text-xs text-slate-500">
                  Leads submitted from the website contact & booking form.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["all", "new", "contacted", "booked", "archived"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize cursor-pointer ${
                      statusFilter === st
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No inquiries matching this filter yet.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Submit a test inquiry on the live homepage to see it appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-slate-400">
                            #INQ-{String(inq.id).padStart(4, "0")}
                          </span>
                          <h3 className="text-base font-bold text-[#0F172A]">
                            {inq.fullName}
                          </h3>
                          {inq.company && (
                            <span className="text-xs font-medium text-slate-500">
                              · {inq.company}
                            </span>
                          )}
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                              STATUS_BADGE[inq.status] || STATUS_BADGE.new
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {inq.email}
                          </span>
                          {inq.phone && <span>Phone: {inq.phone}</span>}
                          <span className="font-semibold text-slate-800">
                            Interest: {inq.serviceInterest}
                          </span>
                          {inq.preferredDate && (
                            <span>Preferred: {inq.preferredDate}</span>
                          )}
                        </div>

                        <p className="mt-3 rounded-xl bg-[#FAF9F6] p-3.5 text-sm leading-relaxed text-slate-700">
                          {inq.message}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleUpdateInquiryStatus(inq.id, e.target.value)
                          }
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="booked">Booked</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          aria-label="Delete inquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: BRAND & TEMPLATES */}
        {activeTab === "brand" && (
          <section className="mt-6 space-y-8">
            {/* Industry Starter Kits */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-extrabold text-[#0F172A]">
                1-Click Business Type Starter Kits
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Instantly switch your website copy, services, showcase, and
                reviews to match your business niche—then fine-tune below.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BUSINESS_PRESETS.map((preset) => {
                  const isCurrent =
                    profile.businessName === preset.profile.businessName;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      disabled={applyingPresetKey !== null}
                      onClick={() => handleApplyPreset(preset.key)}
                      className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                        isCurrent
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-[#FAF9F6] text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {applyingPresetKey === preset.key
                            ? "Applying..."
                            : preset.label}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-1 text-xs ${
                          isCurrent ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {preset.shortDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Business Profile Editor */}
            <form
              onSubmit={handleSaveBrand}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F172A]">
                    Custom Business Details & Hero Copy
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customize every detail shown across your homepage and footer.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingBrand}
                  className="rounded-full px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: brandForm.accentColor || accent }}
                >
                  {savingBrand ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={brandForm.businessName}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, businessName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Industry Label
                  </label>
                  <input
                    type="text"
                    value={brandForm.industry}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, industry: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Hero Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={brandForm.heroEyebrow}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, heroEyebrow: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={brandForm.tagline}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, tagline: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Hero Headline
                  </label>
                  <textarea
                    rows={2}
                    value={brandForm.heroHeadline}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, heroHeadline: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={brandForm.heroSubheadline}
                    onChange={(e) =>
                      setBrandForm({
                        ...brandForm,
                        heroSubheadline: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={brandForm.heroCtaPrimary}
                    onChange={(e) =>
                      setBrandForm({
                        ...brandForm,
                        heroCtaPrimary: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={brandForm.heroCtaSecondary}
                    onChange={(e) =>
                      setBrandForm({
                        ...brandForm,
                        heroCtaSecondary: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Accent Color Picker & Hero Image Picker */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Accent Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {ACCENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.hex}
                        type="button"
                        onClick={() =>
                          setBrandForm({ ...brandForm, accentColor: opt.hex })
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                          brandForm.accentColor === opt.hex
                            ? "border-slate-900 bg-slate-100"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: opt.hex }}
                        />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Hero Photo URL (or select preset)
                  </label>
                  <input
                    type="text"
                    value={brandForm.heroImageUrl}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, heroImageUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {BUILT_IN_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() =>
                          setBrandForm({ ...brandForm, heroImageUrl: img.url })
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="grid gap-4 lg:grid-cols-2 border-t border-slate-100 pt-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    About Heading
                  </label>
                  <input
                    type="text"
                    value={brandForm.aboutHeading}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, aboutHeading: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    About Story
                  </label>
                  <textarea
                    rows={3}
                    value={brandForm.aboutBody}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, aboutBody: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={brandForm.email}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={brandForm.instagramUrl ?? ""}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, instagramUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={brandForm.facebookUrl ?? ""}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, facebookUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={brandForm.phone}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={brandForm.address}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, address: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Hours
                  </label>
                  <input
                    type="text"
                    value={brandForm.hours}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, hours: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </form>
          </section>
        )}

        {/* TAB 3: SERVICES & PRICING */}
        {activeTab === "services" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-extrabold text-[#0F172A]">
                Published Services ({services.length})
              </h2>
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {s.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {s.priceLabel}
                      </span>
                      <span className="text-xs text-slate-400">
                        · {s.turnaround}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold text-[#0F172A]">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {s.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeaturedService(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                        s.featured
                          ? "bg-amber-100 text-amber-800"
                          : "border border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {s.featured ? "★ Popular" : "Mark Popular"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(s.id)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddService}
                className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-slate-700" />
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Add New Service / Package
                  </h3>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newService.title}
                    onChange={(e) =>
                      setNewService({ ...newService, title: e.target.value })
                    }
                    placeholder="e.g. VIP Strategy Intensive"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newService.category}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. Consulting"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Price Label
                    </label>
                    <input
                      type="text"
                      value={newService.priceLabel}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          priceLabel: e.target.value,
                        })
                      }
                      placeholder="e.g. $450 or From $1,500"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Duration / Turnaround
                  </label>
                  <input
                    type="text"
                    value={newService.turnaround}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        turnaround: e.target.value,
                      })
                    }
                    placeholder="e.g. 90 mins or 2 weeks"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                    placeholder="What's included and what outcome the client gets..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newService.featured}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        featured: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Highlight with “Popular” badge
                </label>

                <button
                  type="submit"
                  disabled={creatingService}
                  className="w-full rounded-xl py-3 text-xs font-semibold text-white shadow-sm cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  {creatingService ? "Adding Service..." : "Publish Service"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* TAB 4: PROJECTS / SHOWCASE */}
        {activeTab === "projects" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-extrabold text-[#0F172A]">
                Featured Showcase ({projects.length})
              </h2>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="h-20 w-28 shrink-0 rounded-xl object-cover bg-slate-100"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {proj.category}
                        </span>
                        <span
                          className="font-mono text-xs font-semibold"
                          style={{ color: accent }}
                        >
                          {proj.metricLabel}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-[#0F172A]">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Client: {proj.clientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {proj.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddProject}
                className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-slate-700" />
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Add Showcase Spotlight
                  </h3>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Project / Spotlight Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    placeholder="e.g. Downtown Flagship Launch"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Client / Context
                    </label>
                    <input
                      type="text"
                      value={newProject.clientName}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          clientName: e.target.value,
                        })
                      }
                      placeholder="e.g. Acme Corp"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. Case Study"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Key Outcome Metric
                  </label>
                  <input
                    type="text"
                    value={newProject.metricLabel}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        metricLabel: e.target.value,
                      })
                    }
                    placeholder="e.g. +140% Sales or 5-Star Launch"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newProject.imageUrl}
                    onChange={(e) =>
                      setNewProject({ ...newProject, imageUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {BUILT_IN_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() =>
                          setNewProject({ ...newProject, imageUrl: img.url })
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newProject.summary}
                    onChange={(e) =>
                      setNewProject({ ...newProject, summary: e.target.value })
                    }
                    placeholder="Describe the challenge, execution, and result..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingProject}
                  className="w-full rounded-xl py-3 text-xs font-semibold text-white shadow-sm cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  {creatingProject ? "Publishing..." : "Publish Showcase Item"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* TAB 5: REVIEWS & SUBSCRIBERS */}
        {activeTab === "reviews" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-extrabold text-[#0F172A]">
                Client Testimonials ({testimonials.length})
              </h2>
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">“{t.quote}”</p>
                    <p className="mt-2 text-xs font-bold text-[#0F172A]">
                      {t.authorName}{" "}
                      <span className="font-normal text-slate-500">
                        · {t.authorRole}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Subscribers list */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Newsletter Subscribers ({subscribers.length})
                </h3>
                {subscribers.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    No subscribers yet. Visitors can sign up in the footer.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-slate-100">
                    {subscribers.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <span className="font-medium text-slate-800">
                          {sub.email}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddTestimonial}
                className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-slate-700" />
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Add Client Review
                  </h3>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.authorName}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        authorName: e.target.value,
                      })
                    }
                    placeholder="e.g. Jordan Blake"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Role / Company
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.authorRole}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        authorRole: e.target.value,
                      })
                    }
                    placeholder="e.g. Owner, Summit Goods"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Review Quote *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newTestimonial.quote}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        quote: e.target.value,
                      })
                    }
                    placeholder="What did they love about working with your business?"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingTestimonial}
                  className="w-full rounded-xl py-3 text-xs font-semibold text-white shadow-sm cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  {creatingTestimonial ? "Adding..." : "Publish Review"}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
