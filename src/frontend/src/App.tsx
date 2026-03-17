import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Flower2,
  Hand,
  Loader2,
  MapPin,
  Menu,
  Palette,
  Phone,
  Scissors,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "./backend.d";
import {
  useGetBookings,
  useGetServices,
  useIsAdmin,
  useSubmitBooking,
  useUpdateBookingStatus,
} from "./hooks/useQueries";

// ─── Service Icon Map ─────────────────────────────────────────────────────────
const serviceIconMap: Record<string, React.ElementType> = {
  default: Star,
  hair: Scissors,
  facial: Sparkles,
  bridal: Crown,
  mehndi: Flower2,
  threading: Hand,
  nail: Palette,
};

function getServiceIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes("hair")) return Scissors;
  if (lower.includes("facial") || lower.includes("face")) return Sparkles;
  if (lower.includes("bridal") || lower.includes("bride")) return Crown;
  if (lower.includes("mehndi") || lower.includes("henna")) return Flower2;
  if (lower.includes("thread") || lower.includes("eyebrow")) return Hand;
  if (lower.includes("nail")) return Palette;
  return serviceIconMap.default;
}

// ─── Fallback Services ────────────────────────────────────────────────────────
const FALLBACK_SERVICES = [
  {
    name: "Bridal Makeup",
    description: "Complete bridal look with jewelry, draping & makeup",
    price_inr: BigInt(0),
  },
  {
    name: "Hair Styling",
    description: "Professional cuts, blowout, straightening & coloring",
    price_inr: BigInt(0),
  },
  {
    name: "Facial Treatment",
    description: "Deep cleansing, gold facial & skin brightening",
    price_inr: BigInt(0),
  },
  {
    name: "Mehndi / Henna",
    description: "Traditional & modern Rajasthani mehndi designs",
    price_inr: BigInt(0),
  },
  {
    name: "Eyebrow Threading",
    description: "Precision eyebrow shaping & upper lip threading",
    price_inr: BigInt(0),
  },
  {
    name: "Nail Art",
    description: "Creative nail extensions, gel polish & nail art",
    price_inr: BigInt(0),
  },
];

// ─── Section Fade Hook ────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-dark opacity-60" />
        <span className="text-gold text-xs tracking-[0.4em] font-body">✦</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-dark opacity-60" />
      </div>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground font-body text-sm tracking-wide max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-muted" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold-dark" />
        <div className="h-px w-24 bg-gradient-to-r from-gold-dark to-transparent opacity-50" />
        <div className="w-1 h-1 rotate-45 bg-gold opacity-70" />
        <div className="h-px w-24 bg-gradient-to-l from-gold-dark to-transparent opacity-50" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold-dark" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-muted" />
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-deep-black/95 backdrop-blur-md shadow-[0_2px_20px_oklch(0_0_0/0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-3 group"
            onClick={() => handleNavClick("#home")}
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/logo-transparent.dim_300x300.png"
              alt="Priyanshi Beauty Zone Logo"
              className="h-12 w-12 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold text-gold-light hidden sm:block">
                PRIYANSHI
              </span>
              <span className="font-display text-sm font-medium text-gold-muted hidden sm:block tracking-widest">
                BEAUTY ZONE
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="font-body text-sm font-medium text-muted-foreground hover:text-gold-light transition-colors duration-200 tracking-wide"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick("#booking")}
              className="btn-gold px-5 py-2 rounded text-sm font-body font-semibold tracking-wider"
              data-ocid="nav.primary_button"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden text-gold-light p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-deep-black/97 backdrop-blur-md border-t border-gold-faint">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="font-body text-base font-medium text-muted-foreground hover:text-gold-light transition-colors py-1"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick("#booking")}
              className="btn-gold px-5 py-3 rounded text-sm font-body font-semibold tracking-wider mt-2"
              data-ocid="nav.primary_button"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x700.jpg')",
        }}
      />
      <div className="hero-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,oklch(0.75_0.12_75/0.07)_0%,transparent_65%)]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 text-gold-muted text-sm tracking-[0.3em] font-body uppercase">
            <div className="w-12 h-px bg-gold-dark" />
            Rajasthan's Finest
            <div className="w-12 h-px bg-gold-dark" />
          </div>
        </div>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
          style={{ animation: "fade-up 0.8s ease-out 0.2s both" }}
        >
          <span className="text-gold-shimmer">PRIYANSHI</span>
          <br />
          <span className="text-cream text-4xl sm:text-5xl md:text-6xl">
            BEAUTY ZONE
          </span>
        </h1>

        <p
          className="font-display text-xl md:text-2xl text-gold-muted italic mb-8 tracking-wide"
          style={{ animation: "fade-up 0.8s ease-out 0.4s both" }}
        >
          Where Beauty Meets Elegance
        </p>

        {/* Location & Phone */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 text-sm text-muted-foreground font-body"
          style={{ animation: "fade-up 0.8s ease-out 0.6s both" }}
        >
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-gold-dark" />
            Subhah Colony, Kuchaman - Sikar - Didwana Rd, Didwana, Rajasthan
            341303
          </span>
          <span className="hidden sm:block text-gold-faint">•</span>
          <a
            href="tel:07737639334"
            className="flex items-center gap-2 hover:text-gold-light transition-colors"
          >
            <Phone size={14} className="text-gold-dark" />
            077376 39334
          </a>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fade-up 0.8s ease-out 0.8s both" }}
        >
          <button
            type="button"
            onClick={() => handleScroll("#booking")}
            className="btn-gold px-8 py-3.5 rounded text-base font-body font-semibold tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center"
            data-ocid="hero.primary_button"
          >
            <Crown size={16} />
            Book Appointment
          </button>
          <button
            type="button"
            onClick={() => handleScroll("#services")}
            className="btn-gold-outline px-8 py-3.5 rounded text-base font-body font-semibold tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center"
            data-ocid="hero.secondary_button"
          >
            View Services
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-faint text-xs font-body tracking-widest animate-bounce">
        <span>SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold-faint to-transparent" />
      </div>
    </section>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const { data: services, isLoading } = useGetServices();
  const { ref, visible } = useFadeIn();
  const displayServices =
    services && services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section
      id="services"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 bg-surface-1 fade-in-section ${visible ? "visible" : ""}`}
      data-ocid="services.section"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Our Services"
          subtitle="Indulge in our premium beauty treatments curated for every occasion"
        />

        {isLoading ? (
          <div
            className="flex justify-center items-center py-16"
            data-ocid="services.loading_state"
          >
            <Loader2 className="animate-spin text-gold" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, idx) => {
              const Icon = getServiceIcon(service.name);
              const ocid = `services.item.${idx + 1}` as const;
              const isFeatured = idx === 0;
              return (
                <div
                  key={service.name}
                  className={`card-gold-hover bg-card rounded-lg p-6 flex flex-col gap-4 ${isFeatured ? "card-featured" : ""}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  data-ocid={ocid}
                >
                  {isFeatured && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-gold text-[10px] font-body tracking-[0.2em] uppercase">
                      <Star size={10} fill="currentColor" />
                      Popular
                    </div>
                  )}
                  <div className="icon-well">
                    <Icon size={22} className="text-gold-light" />
                  </div>
                  <div>
                    <h3
                      className={`font-display text-xl font-bold mb-2 ${isFeatured ? "text-gold-light" : "text-cream"}`}
                    >
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gold-faint/50 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.querySelector("#booking");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[11px] font-body text-gold-muted hover:text-gold-light transition-colors tracking-[0.15em] uppercase"
                    >
                      Book →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Booking Section ──────────────────────────────────────────────────────────
function BookingSection() {
  const { data: services } = useGetServices();
  const { ref, visible } = useFadeIn();
  const submitBooking = useSubmitBooking();
  const displayServices =
    services && services.length > 0 ? services : FALLBACK_SERVICES;

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    serviceName: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = [
    { value: "09:00 AM", label: "9:00 AM – 10:00 AM (Morning)" },
    { value: "10:00 AM", label: "10:00 AM – 11:00 AM (Morning)" },
    { value: "11:00 AM", label: "11:00 AM – 12:00 PM (Morning)" },
    { value: "12:00 PM", label: "12:00 PM – 1:00 PM (Afternoon)" },
    { value: "02:00 PM", label: "2:00 PM – 3:00 PM (Afternoon)" },
    { value: "03:00 PM", label: "3:00 PM – 4:00 PM (Afternoon)" },
    { value: "04:00 PM", label: "4:00 PM – 5:00 PM (Evening)" },
    { value: "05:00 PM", label: "5:00 PM – 6:00 PM (Evening)" },
    { value: "06:00 PM", label: "6:00 PM – 7:00 PM (Evening)" },
    { value: "07:00 PM", label: "7:00 PM – 8:00 PM (Evening)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBookingId(null);

    if (
      !form.customerName ||
      !form.phone ||
      !form.serviceName ||
      !form.preferredDate ||
      !form.preferredTime
    ) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    try {
      const id = await submitBooking.mutateAsync(form);
      setBookingId(id);
      setForm({
        customerName: "",
        phone: "",
        serviceName: "",
        preferredDate: "",
        preferredTime: "",
      });
      toast.success("Booking confirmed! We'll contact you shortly.");
    } catch {
      setError(
        "Failed to submit booking. Please try again or call us directly.",
      );
      toast.error("Booking failed. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="booking"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 bg-surface-1 fade-in-section ${visible ? "visible" : ""}`}
      data-ocid="booking.section"
    >
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          title="Book an Appointment"
          subtitle="Reserve your spot for a transformative beauty experience"
        />

        <div className="card-jewellery rounded-lg p-8 relative overflow-hidden">
          {bookingId !== null && (
            <div
              className="mb-6 p-4 rounded-lg bg-gold-faint border border-gold-dark flex items-start gap-3"
              data-ocid="booking.success_state"
            >
              <CheckCircle2
                className="text-gold-light shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="font-body font-semibold text-gold-light">
                  Booking Confirmed!
                </p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Your booking ID is{" "}
                  <strong className="text-gold">#{bookingId.toString()}</strong>
                  . We'll call you at your provided number to confirm the
                  appointment.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3"
              data-ocid="booking.error_state"
            >
              <AlertCircle
                className="text-destructive shrink-0 mt-0.5"
                size={20}
              />
              <p className="font-body text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="customerName"
                className="font-body text-sm text-muted-foreground tracking-wide"
              >
                Full Name *
              </Label>
              <Input
                id="customerName"
                placeholder="Enter your full name"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                className="bg-surface-2 border-gold-faint focus:border-gold text-cream placeholder:text-muted-foreground/50 font-body"
                data-ocid="booking.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="font-body text-sm text-muted-foreground tracking-wide"
              >
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-surface-2 border-gold-faint focus:border-gold text-cream placeholder:text-muted-foreground/50 font-body"
                data-ocid="booking.phone.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-sm text-muted-foreground tracking-wide">
                Select Service *
              </Label>
              <Select
                value={form.serviceName}
                onValueChange={(val) => setForm({ ...form, serviceName: val })}
              >
                <SelectTrigger
                  className="bg-surface-2 border-gold-faint text-cream font-body"
                  data-ocid="booking.select"
                >
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-faint">
                  {displayServices.map((s) => (
                    <SelectItem
                      key={s.name}
                      value={s.name}
                      className="font-body text-cream focus:bg-gold-faint focus:text-gold-light"
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="preferredDate"
                  className="font-body text-sm text-muted-foreground tracking-wide"
                >
                  Preferred Date *
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={today}
                  value={form.preferredDate}
                  onChange={(e) =>
                    setForm({ ...form, preferredDate: e.target.value })
                  }
                  className="bg-surface-2 border-gold-faint focus:border-gold text-cream font-body [color-scheme:dark]"
                  data-ocid="booking.date.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-body text-sm text-muted-foreground tracking-wide">
                  Preferred Time *
                </Label>
                <Select
                  value={form.preferredTime}
                  onValueChange={(val) =>
                    setForm({ ...form, preferredTime: val })
                  }
                >
                  <SelectTrigger
                    className="bg-surface-2 border-gold-faint text-cream font-body"
                    data-ocid="booking.time.select"
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-faint">
                    {timeSlots.map((slot) => (
                      <SelectItem
                        key={slot.value}
                        value={slot.value}
                        className="font-body text-cream focus:bg-gold-faint focus:text-gold-light"
                      >
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitBooking.isPending}
              className="btn-gold w-full py-3.5 rounded font-body font-semibold tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              data-ocid="booking.submit_button"
            >
              {submitBooking.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Confirm Booking
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs font-body mt-6">
            Prefer to call?{" "}
            <a
              href="tel:07737639334"
              className="text-gold-light hover:text-gold transition-colors"
            >
              077376 39334
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
const galleryItems = [
  {
    src: "/assets/generated/gallery-1.dim_600x600.jpg",
    caption: "Bridal Makeup",
  },
  {
    src: "/assets/generated/gallery-2.dim_600x600.jpg",
    caption: "Hair Styling",
  },
  {
    src: "/assets/generated/gallery-3.dim_600x600.jpg",
    caption: "Facial Treatment",
  },
  {
    src: "/assets/generated/gallery-4.dim_600x600.jpg",
    caption: "Mehndi / Henna",
  },
  {
    src: "/assets/generated/gallery-5.dim_600x600.jpg",
    caption: "Eyebrow Threading",
  },
  { src: "/assets/generated/gallery-6.dim_600x600.jpg", caption: "Nail Art" },
];

function GallerySection() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      id="gallery"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 bg-background fade-in-section ${visible ? "visible" : ""}`}
      data-ocid="gallery.section"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Our Gallery"
          subtitle="A glimpse into our world of beauty transformations"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={item.caption}
              className="relative overflow-hidden rounded-lg border border-gold-faint/50 cursor-pointer group
                transition-all duration-300 ease-out
                hover:border-gold-dark hover:shadow-[0_0_28px_oklch(0.75_0.12_75/0.18),0_8px_32px_oklch(0_0_0/0.5)]
                hover:-translate-y-1"
              style={{ aspectRatio: "1/1" }}
              data-ocid={`gallery.item.${idx + 1}`}
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent
                opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-5
                translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-300 ease-out"
              >
                <p className="font-display text-gold-light text-lg font-bold leading-tight">
                  {item.caption}
                </p>
                <div className="h-px bg-gold mt-1.5 transition-all duration-500 delay-100 w-0 group-hover:w-10" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-black/80 to-transparent p-3 sm:hidden">
                <p className="font-display text-gold-light text-sm font-semibold">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookings();
  const updateStatus = useUpdateBookingStatus();

  if (isAdminLoading || !isAdmin) return null;

  const statusColor: Record<BookingStatus, string> = {
    [BookingStatus.pending]:
      "bg-yellow-500/20 text-yellow-400 border-yellow-600/30",
    [BookingStatus.confirmed]:
      "bg-green-500/20 text-green-400 border-green-600/30",
    [BookingStatus.cancelled]: "bg-red-500/20 text-red-400 border-red-600/30",
  };

  return (
    <section
      className="py-24 px-4 bg-surface-1 border-t border-gold-faint"
      data-ocid="admin.section"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Admin Panel"
          subtitle="Manage all booking requests"
        />

        {isBookingsLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground font-body"
            data-ocid="admin.empty_state"
          >
            No bookings yet.
          </div>
        ) : (
          <div
            className="rounded-lg border border-gold-faint overflow-hidden"
            data-ocid="admin.table"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark border-0 hover:bg-transparent">
                    <TableHead className="text-deep-black font-display font-bold">
                      ID
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Customer
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Phone
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Service
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Date
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Time
                    </TableHead>
                    <TableHead className="text-deep-black font-display font-bold">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, idx) => (
                    <TableRow
                      key={booking.id.toString()}
                      className="border-gold-faint hover:bg-surface-3"
                      data-ocid="admin.row"
                    >
                      <TableCell className="font-body text-gold-muted font-mono text-sm">
                        #{booking.id.toString()}
                      </TableCell>
                      <TableCell className="font-body text-cream font-semibold">
                        {booking.customerName}
                      </TableCell>
                      <TableCell className="font-body text-muted-foreground">
                        {booking.phone}
                      </TableCell>
                      <TableCell className="font-body text-cream">
                        {booking.serviceName}
                      </TableCell>
                      <TableCell className="font-body text-muted-foreground">
                        {booking.preferredDate}
                      </TableCell>
                      <TableCell className="font-body text-muted-foreground">
                        {booking.preferredTime}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(val) => {
                            updateStatus.mutate({
                              bookingId: booking.id,
                              newStatus: val as BookingStatus,
                            });
                          }}
                        >
                          <SelectTrigger
                            className={`w-32 text-xs font-body border ${statusColor[booking.status]} bg-transparent`}
                            data-ocid={`admin.select.${idx + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-gold-faint">
                            {Object.values(BookingStatus).map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className="font-body text-cream capitalize focus:bg-gold-faint"
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer / Contact Section ─────────────────────────────────────────────────
function FooterSection() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Book Now", href: "#booking" },
  ];

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="bg-deep-black border-t border-gold-faint"
      data-ocid="footer.section"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/logo-transparent.dim_300x300.png"
                alt="Priyanshi Beauty Zone"
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="font-display text-xl font-bold text-gold-light">
                  PRIYANSHI
                </p>
                <p className="font-body text-xs text-gold-muted tracking-[0.2em] uppercase">
                  Beauty Zone
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs">
              Bringing elegance and beauty to every woman in Rajasthan with
              premium services and a royal touch.
            </p>
            <div className="mt-6 flex items-center gap-2 text-gold-muted text-sm font-body italic">
              <span>✦</span>
              <span>Where Beauty Meets Elegance</span>
              <span>✦</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-gold font-bold text-lg mb-5 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.href);
                    }}
                    className="font-body text-sm text-muted-foreground hover:text-gold-light transition-colors flex items-center gap-2 group"
                    data-ocid="footer.link"
                  >
                    <span className="text-gold-faint group-hover:text-gold transition-colors">
                      ›
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-gold font-bold text-lg mb-5 tracking-wide">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-dark mt-1 shrink-0" />
                <address className="not-italic font-body text-sm text-muted-foreground leading-relaxed">
                  Priyanshi Beauty Zone,
                  <br />
                  Subhah Colony, Kuchaman - Sikar - Didwana Rd,
                  <br />
                  Didwana, Rajasthan 341303
                </address>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold-dark shrink-0" />
                <a
                  href="tel:07737639334"
                  className="font-body text-sm text-muted-foreground hover:text-gold-light transition-colors"
                >
                  077376 39334
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-gold-dark mt-1 shrink-0" />
                <div className="font-body text-sm text-muted-foreground">
                  <p>Mon–Sat: 9:00 AM – 8:00 PM</p>
                  <p>Sunday: 10:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-faint flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground text-center sm:text-left">
            © {year} Priyanshi Beauty Zone. All rights reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-muted-foreground hover:text-gold-light transition-colors text-center"
          >
            Built with ♥ using{" "}
            <span className="text-gold-muted hover:text-gold transition-colors">
              caffeine.ai
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/917737639334"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      style={{ filter: "drop-shadow(0 4px 16px rgba(37,211,102,0.45))" }}
    >
      {/* Tooltip label */}
      <span
        className="font-body text-sm font-semibold text-white bg-[#128C7E] px-3 py-1.5 rounded-lg
          whitespace-nowrap shadow-lg pointer-events-none
          transition-all duration-200 ease-out origin-right"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "scale(1) translateX(0)"
            : "scale(0.85) translateX(8px)",
        }}
      >
        Chat on WhatsApp
      </span>

      {/* Button */}
      <span
        className="relative flex items-center justify-center w-14 h-14 rounded-full"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: "#25D366", opacity: 0.35 }}
        />
        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7 relative z-10"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.15 0.008 62)",
            border: "1px solid oklch(0.3 0.03 70)",
            color: "oklch(0.95 0.025 80)",
          },
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <ServicesSection />
        <BookingSection />
        <GallerySection />
        <AdminPanel />
      </main>

      <FooterSection />

      <WhatsAppButton />
    </div>
  );
}
