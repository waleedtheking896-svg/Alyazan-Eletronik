"use client";

import { LanguageToggle, useLang } from "@/components/LanguageProvider";
import { ltext } from "@/lib/i18n";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Phone,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type {
  BusinessProfile,
  ProjectItem,
  ServiceItem,
  TestimonialItem,
} from "@/db/schema";
import { BUSINESS_PRESETS } from "@/lib/presets";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import AlyazenLogo from "@/components/AlyazenLogo";

interface BusinessSiteClientProps {
  initialProfile: BusinessProfile;
  initialServices: ServiceItem[];
  initialProjects: ProjectItem[];
  initialTestimonials: TestimonialItem[];
}

const ACCENT_SWATCHES = [
  { label: "Cobalt", hex: "#1D4ED8" },
  { label: "Emerald", hex: "#0F766E" },
  { label: "Amber", hex: "#B45309" },
  { label: "Crimson", hex: "#DC2626" },
  { label: "Violet", hex: "#6D28D9" },
  { label: "Obsidian", hex: "#111827" },
];

export default function BusinessSiteClient({
  initialProfile,
  initialServices,
  initialProjects,
  initialTestimonials,
}: BusinessSiteClientProps) {
  const { t, lang } = useLang();
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(initialTestimonials);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Quick Customize Drawer
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [applyingPreset, setApplyingPreset] = useState<string | null>(null);
  const [customizerStatus, setCustomizerStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    businessName: initialProfile.businessName,
    tagline: initialProfile.tagline,
    industry: initialProfile.industry,
    heroHeadline: initialProfile.heroHeadline,
    heroSubheadline: initialProfile.heroSubheadline,
    accentColor: initialProfile.accentColor,
    email: initialProfile.email,
    phone: initialProfile.phone,
    address: initialProfile.address,
    hours: initialProfile.hours,
  });

  // Inquiry / Booking Form State
  const [inquiryForm, setInquiryForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest:
      initialServices[0]?.title ?? "General Consultation",
    budgetRange: "Standard / Mid-Tier",
    preferredDate: "",
    message: "",
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<number | null>(
    null
  );

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<{
    loading: boolean;
    message: string | null;
    error: string | null;
  }>({ loading: false, message: null, error: null });

  const accent = profile.accentColor || "#1D4ED8";

  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.category)));
    return ["All", ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const syncDraftFromProfile = (p: BusinessProfile) => {
    setDraft({
      businessName: p.businessName,
      tagline: p.tagline,
      industry: p.industry,
      heroHeadline: p.heroHeadline,
      heroSubheadline: p.heroSubheadline,
      accentColor: p.accentColor,
      email: p.email,
      phone: p.phone,
      address: p.address,
      hours: p.hours,
    });
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setInquiryForm((prev) => ({
      ...prev,
      serviceInterest: serviceTitle,
    }));
    setSubmittedInquiryId(null);
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);
    setSubmittingInquiry(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setInquiryError(data.error || "Unable to send inquiry.");
      } else {
        setSubmittedInquiryId(data.inquiry?.id ?? 1);
        setInquiryForm((prev) => ({
          ...prev,
          fullName: "",
          email: "",
          phone: "",
          company: "",
          preferredDate: "",
          message: "",
        }));
      }
    } catch {
      setInquiryError("Network error while submitting. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterState({ loading: true, message: null, error: null });
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNewsletterState({
          loading: false,
          message: null,
          error: data.error || "Subscription failed",
        });
      } else {
        setNewsletterEmail("");
        setNewsletterState({
          loading: false,
          message: data.alreadySubscribed
            ? "You're already on our VIP list."
            : "Subscribed! Welcome aboard.",
          error: null,
        });
      }
    } catch {
      setNewsletterState({
        loading: false,
        message: null,
        error: "Could not subscribe right now.",
      });
    }
  };

  const handleApplyPreset = async (presetKey: string) => {
    setApplyingPreset(presetKey);
    setCustomizerStatus(null);
    try {
      const res = await fetch("/api/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetKey }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setServices(data.services ?? []);
        setProjects(data.projects ?? []);
        setTestimonials(data.testimonials ?? []);
        syncDraftFromProfile(data.profile);
        setSelectedCategory("All");
        setInquiryForm((prev) => ({
          ...prev,
          serviceInterest:
            data.services?.[0]?.title ?? "General Consultation",
        }));
        setCustomizerStatus("Switched template & saved to database!");
      }
    } finally {
      setApplyingPreset(null);
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setCustomizerStatus(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        syncDraftFromProfile(data.profile);
        setCustomizerStatus("Live business website updated!");
      } else {
        setCustomizerStatus(data.error || "Could not save profile.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  void profile.businessName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#C9A227]/30 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3 group">
<AlyazenLogo className="h-11 w-11 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#F2D16B]">
                {profile.businessName}
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:block">
                {profile.industry}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-400 lg:flex">
            <Link href="/shop" className="font-semibold text-[#F2D16B] transition hover:text-white">
              {t("nav.shop")}
            </Link>
            <a href="#services" className="transition hover:text-[#F2D16B]">
              {t("nav.services")}
            </a>
            <a href="#work" className="transition hover:text-[#F2D16B]">
              {t("nav.showcase")}
            </a>
            <a href="#about" className="transition hover:text-[#F2D16B]">
              {t("nav.about")}
            </a>
            <a href="#testimonials" className="transition hover:text-[#F2D16B]">
              {t("nav.reviews")}
            </a>
            <a href="#contact" className="transition hover:text-[#F2D16B]">
              {t("nav.contact")}
            </a>
          </nav>

          {/* Header Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <button
              type="button"
              onClick={() => {
                syncDraftFromProfile(profile);
                setCustomizerStatus(null);
                setCustomizerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#161616] px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-xs transition hover:border-slate-400 hover:bg-[#222] cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("nav.customize")}
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#161616] px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-xs transition hover:border-slate-400 hover:bg-[#222]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              {t("nav.owner")}
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-black shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              {t("nav.shopNow")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <LanguageToggle />
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#161616] p-2 text-slate-300 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#2a2a2a] bg-[#161616] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-1 font-semibold text-[#F2D16B]">
                🛒 Shop Online
              </Link>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
              >
                {t("nav.services")}
              </a>
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
              >
                {t("nav.showcase")}
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
              >
                {t("nav.about")}
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
              >
                {t("nav.reviews")}
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
              >
                {t("nav.contact")}
              </a>
              <div className="mt-2 flex flex-col gap-2 border-t border-[#2a2a2a] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    syncDraftFromProfile(profile);
                    setCustomizerOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("mobile.customize")}
                </button>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#161616] px-4 py-2.5 text-sm font-semibold text-slate-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("mobile.owner")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-editorial-grid pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#161616] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-300 shadow-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {ltext(lang, profile.heroEyebrow, profile.heroEyebrowAr)}
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#F2D16B] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
                {ltext(lang, profile.heroHeadline, profile.heroHeadlineAr)}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {ltext(lang, profile.heroSubheadline, profile.heroSubheadlineAr)}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:opacity-95"
                  style={{ backgroundColor: accent }}
                >
                  {t("hero.shopOnline")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#161616] px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-xs transition hover:border-slate-400 hover:bg-[#222]"
                >
                  {ltext(lang, profile.heroCtaSecondary, profile.heroCtaSecondaryAr)}
                </a>
              </div>

              {/* KPI Metrics Strip */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#2a2a2a] pt-8 sm:max-w-lg sm:gap-8">
                <div>
                  <p className="font-mono text-2xl font-bold tracking-tight text-[#F2D16B] sm:text-3xl">
                    {profile.stat1Value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {profile.stat1Label}
                  </p>
                </div>
                <div className="border-l border-[#2a2a2a] pl-4 sm:pl-8">
                  <p className="font-mono text-2xl font-bold tracking-tight text-[#F2D16B] sm:text-3xl">
                    {profile.stat2Value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {profile.stat2Label}
                  </p>
                </div>
                <div className="border-l border-[#2a2a2a] pl-4 sm:pl-8">
                  <p className="font-mono text-2xl font-bold tracking-tight text-[#F2D16B] sm:text-3xl">
                    {profile.stat3Value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {profile.stat3Label}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Framed Media */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-[#C9A227]/40 bg-[#161616] p-2 shadow-2xl">
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl bg-[#222]">
                  <img
                    src={profile.heroImageUrl}
                    alt={profile.businessName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/20 bg-black/80 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {profile.tagline}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-100">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {profile.hours}
                        </p>
                      </div>
                      <a
                        href="#contact"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-105"
                        style={{ backgroundColor: accent }}
                        aria-label="Inquire Now"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Packages Section */}
      <section id="services" className="border-t border-[#2a2a2a] bg-[#161616] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {t("sec.servicesTitle")}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F2D16B] sm:text-4xl">
                {t("sec.servicesSub")}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                {t("sec.servicesBody")}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? "text-white shadow-sm"
                        : "border border-[#2a2a2a] bg-[#111111] text-slate-400 hover:border-[#3a3a3a] hover:text-slate-100"
                    }`}
                    style={active ? { backgroundColor: accent } : undefined}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#141414] p-7 transition hover:border-[#3a3a3a] hover:bg-[#161616] hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {service.category}
                    </span>
                    {service.featured && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {t("ui.popular")}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#F2D16B]">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {service.description}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2a2a] pt-5">
                  <div>
                    <p className="font-mono text-lg font-bold text-[#F2D16B]">
                      {service.priceLabel}
                    </p>
                    <p className="text-xs text-slate-500">
                      Timeline: {service.turnaround}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectServiceForInquiry(service.title)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#161616] px-4 py-2 text-xs font-semibold text-slate-200 transition group-hover:border-transparent group-hover:text-white cursor-pointer"
                    style={
                      undefined
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accent;
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#161616";
                      e.currentTarget.style.color = "#e2e8f0";
                    }}
                  >
                    {t("ui.selectRequest")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work / Showcase Section */}
      <section id="work" className="border-t border-[#2a2a2a] bg-[#111111] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: accent }}
            >
              {t("sec.showcaseTitle")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F2D16B] sm:text-4xl">
              {t("sec.showcaseSub")}
            </h2>
            <p className="mt-3 text-base text-slate-400">
              {t("sec.showcaseBody")}
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#161616] shadow-xs transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-[#222]">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-slate-200 shadow-xs backdrop-blur-xs">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {project.clientName}
                    </span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: accent }}
                    >
                      {project.metricLabel}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#F2D16B] group-hover:underline">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                    {project.summary}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-200">
                    {t("ui.readSpotlight")}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About & Direct Contact Details Section */}
      <section id="about" className="border-t border-[#2a2a2a] bg-[#161616] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {t("nav.about")} {profile.businessName}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F2D16B] sm:text-4xl">
                {ltext(lang, profile.aboutHeading, profile.aboutHeadingAr)}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
                {ltext(lang, profile.aboutBody, profile.aboutBodyAr)}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Transparent Scope",
                    desc: "Clear upfront pricing and zero surprise fees.",
                  },
                  {
                    title: "Direct Access",
                    desc: "Work directly with senior makers and leads.",
                  },
                  {
                    title: "In-Store Service",
                    desc: "Visit us to see, test, and buy in person — no delivery.",
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4"
                  >
                    <CheckCircle2
                      className="h-5 w-5"
                      style={{ color: accent }}
                    />
                    <h3 className="mt-2.5 text-sm font-bold text-[#F2D16B]">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Obsidian Location & Info Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[#0F172A] p-8 text-white shadow-xl">
                <span className="inline-block rounded-full bg-[#161616]/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200">
                  {t("sec.contactTitle")}
                </span>
                <h3 className="mt-4 text-2xl font-bold">
                  {t("sec.contactSub")}
                </h3>

                <div className="mt-6 space-y-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        {t("info.location")}
                      </p>
                      <p className="mt-0.5 font-medium text-white">
                        {profile.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        {t("info.hours")}
                      </p>
                      <p className="mt-0.5 font-medium text-white">
                        {profile.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        {t("info.phone")}
                      </p>
                      <p className="mt-0.5 font-medium text-white">
                        {profile.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          {t("info.email")}
                        </p>
                        <p className="mt-0.5 font-medium text-white">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#161616]/10 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#161616]/20 cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          {t("info.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          {t("info.copy")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="border-t border-[#2a2a2a] bg-[#111111] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: accent }}
            >
              {t("sec.reviewsTitle")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F2D16B] sm:text-4xl">
              {t("sec.reviewsSub")}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#161616] p-7 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    “{t.quote}”
                  </p>
                </div>

                <div className="mt-6 border-t border-[#2a2a2a] pt-4">
                  <p className="text-sm font-bold text-[#F2D16B]">
                    {t.authorName}
                  </p>
                  <p className="text-xs text-slate-500">{t.authorRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Inquiry / Booking Section */}
      <section id="contact" className="border-t border-[#2a2a2a] bg-[#161616] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {t("sec.bookTitle")}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F2D16B] sm:text-4xl">
                {t("sec.bookHeadline")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                {t("sec.bookBody")}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    step: "01",
                    title: "Submit your details",
                    desc: "Pick the service or appointment type that fits best.",
                  },
                  {
                    step: "02",
                    title: "Fast personal response",
                    desc: "We review your notes and reply within 1 business day.",
                  },
                  {
                    step: "03",
                    title: "Clear next steps",
                    desc: "Lock in your slot, scope, or custom estimate smoothly.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#F2D16B]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#111111] p-6 sm:p-8 shadow-sm">
                {submittedInquiryId ? (
                  <div className="py-10 text-center">
                    <div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <Check className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-2xl font-extrabold text-[#F2D16B]">
                      {t("form.received")}
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                      {t("form.reference")}{" "}
                      <span className="font-mono font-semibold text-slate-100">
                        #INQ-{String(submittedInquiryId).padStart(4, "0")}
                      </span>{" "}
                      {t("form.savedBody")}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSubmittedInquiryId(null)}
                        className="rounded-full border border-[#3a3a3a] bg-[#161616] px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#222] cursor-pointer"
                      >
                        {t("form.sendAnother")}
                      </button>
                      <Link
                        href="/admin"
                        className="rounded-full px-5 py-2.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        View in Owner Portal →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.fullName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Alex Rivera"
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="alex@company.com"
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          {t("form.phone")}
                        </label>
                        <input
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="(555) 234-5678"
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          {t("form.company")}
                        </label>
                        <input
                          type="text"
                          value={inquiryForm.company}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              company: e.target.value,
                            })
                          }
                          placeholder={t("form.yourCompany")}
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          {t("form.serviceInterest")}
                        </label>
                        <select
                          value={inquiryForm.serviceInterest}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              serviceInterest: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>
                              {s.title} ({s.priceLabel})
                            </option>
                          ))}
                          <option value="Custom Consultation">
                            {t("form.customConsult")}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                          {t("form.preferredDate")}
                        </label>
                        <input
                          type="text"
                          value={inquiryForm.preferredDate}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              preferredDate: e.target.value,
                            })
                          }
                          placeholder={t("form.preferredDatePh")}
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        Project or Appointment Details *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={inquiryForm.message}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            message: e.target.value,
                          })
                        }
                        placeholder={t("form.messagePh")}
                        className="w-full rounded-xl border border-[#3a3a3a] bg-[#161616] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    {inquiryError && (
                      <p className="rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
                        {inquiryError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60 cursor-pointer"
                      style={{ backgroundColor: accent }}
                    >
                      {submittingInquiry
                        ? "Sending Request..."
                        : `Send Inquiry to ${profile.businessName}`}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Footer with Newsletter */}
      <footer className="bg-[#0B0F17] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
<AlyazenLogo className="h-10 w-10" />
                <span className="text-lg font-bold tracking-tight">
                  {profile.businessName}
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                {profile.tagline}
              </p>
              {(profile.instagramUrl || profile.facebookUrl) && (
                <div className="mt-5 flex items-center gap-3">
                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/40 text-[#F2D16B] transition hover:bg-[#C9A227] hover:text-black"
                    >
                      <InstagramIcon className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {profile.facebookUrl && (
                    <a
                      href={profile.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/40 text-[#F2D16B] transition hover:bg-[#C9A227] hover:text-black"
                    >
                      <FacebookIcon className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#161616]/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#161616]/10"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {t("foot.ownerPortal")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    syncDraftFromProfile(profile);
                    setCustomizerOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#161616]/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#161616]/10 cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {t("foot.quickCustomize")}
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t("foot.navigation")}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li>
                  <a href="#services" className="hover:text-white">
                    {t("sec.servicesTitle")}
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white">
                    {t("sec.showcaseTitle")}
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    {t("foot.aboutUs")}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    {t("foot.bookContact")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t("foot.stayInLoop")}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {t("foot.stayInLoopBody")}
              </p>
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-[#161616]/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-white/40"
                />
                <button
                  type="submit"
                  disabled={newsletterState.loading}
                  className="shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  {newsletterState.loading ? "..." : "Join"}
                </button>
              </form>
              {newsletterState.message && (
                <p className="mt-2 text-xs text-emerald-400">
                  {newsletterState.message}
                </p>
              )}
              {newsletterState.error && (
                <p className="mt-2 text-xs text-rose-400">
                  {newsletterState.error}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {profile.businessName}. {t("foot.allRights")}
            </p>
            <p>{profile.address}</p>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-[#161616] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-[#222]">
              <img
                src={activeProject.imageUrl}
                alt={activeProject.title}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-slate-100 shadow-md hover:bg-[#161616] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#222] px-3 py-1 text-xs font-semibold text-slate-300">
                  {activeProject.category} · {activeProject.clientName}
                </span>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: accent }}
                >
                  {activeProject.metricLabel}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-extrabold text-[#F2D16B]">
                {activeProject.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {activeProject.summary}
              </p>
              <div className="mt-6 flex justify-end gap-3 border-t border-[#2a2a2a] pt-5">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="rounded-full border border-[#3a3a3a] px-5 py-2 text-xs font-semibold text-slate-300 hover:bg-[#222] cursor-pointer"
                >
                  {t("ui.close")}
                </button>
                <a
                  href="#contact"
                  onClick={() => setActiveProject(null)}
                  className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {t("ui.inquireAbout")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Quick Business Customizer Drawer */}
      {customizerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
          onClick={() => setCustomizerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-lg flex-col bg-[#161616] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
              <div>
                <h2 className="text-base font-extrabold text-[#F2D16B]">
                  Quick Business Customizer
                </h2>
                <p className="text-xs text-slate-500">
                  Switch industry preset or tailor your brand live.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomizerOpen(false)}
                className="rounded-lg border border-[#2a2a2a] p-1.5 text-slate-400 hover:bg-[#222] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Industry Template Switcher */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1-Click Business Type Templates
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {BUSINESS_PRESETS.map((preset) => {
                    const isCurrent =
                      profile.businessName === preset.profile.businessName;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        disabled={applyingPreset !== null}
                        onClick={() => handleApplyPreset(preset.key)}
                        className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                          isCurrent
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-[#2a2a2a] bg-[#111111] text-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <p className="text-xs font-bold">
                          {applyingPreset === preset.key
                            ? "Applying..."
                            : preset.label}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] ${
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

              {/* Brand & Info Form */}
              <form onSubmit={handleSaveDraft} className="space-y-4 border-t border-[#2a2a2a] pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customize Your Exact Business Info
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={draft.businessName}
                      onChange={(e) =>
                        setDraft({ ...draft, businessName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Industry / Category
                    </label>
                    <input
                      type="text"
                      value={draft.industry}
                      onChange={(e) =>
                        setDraft({ ...draft, industry: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={draft.tagline}
                    onChange={(e) =>
                      setDraft({ ...draft, tagline: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Main Hero Headline
                  </label>
                  <textarea
                    rows={2}
                    value={draft.heroHeadline}
                    onChange={(e) =>
                      setDraft({ ...draft, heroHeadline: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Brand Accent Color
                  </label>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {ACCENT_SWATCHES.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() =>
                          setDraft({ ...draft, accentColor: sw.hex })
                        }
                        className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold cursor-pointer ${
                          draft.accentColor === sw.hex
                            ? "border-slate-900 bg-[#222]"
                            : "border-[#2a2a2a] bg-[#161616]"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: sw.hex }}
                        />
                        {sw.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      {t("info.email")}
                    </label>
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) =>
                        setDraft({ ...draft, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      {t("info.phone")}
                    </label>
                    <input
                      type="text"
                      value={draft.phone}
                      onChange={(e) =>
                        setDraft({ ...draft, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Address
                    </label>
                    <input
                      type="text"
                      value={draft.address}
                      onChange={(e) =>
                        setDraft({ ...draft, address: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Hours
                    </label>
                    <input
                      type="text"
                      value={draft.hours}
                      onChange={(e) =>
                        setDraft({ ...draft, hours: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#3a3a3a] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                {customizerStatus && (
                  <p className="rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                    {customizerStatus}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: draft.accentColor || accent }}
                  >
                    {savingProfile ? "Saving Changes..." : "Save & Update Live Site"}
                  </button>
                  <Link
                    href="/admin"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#161616] py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#222]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Edit Services, Portfolio & View Leads in Owner Portal
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
