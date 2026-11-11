export interface PresetService {
  title: string;
  category: string;
  description: string;
  priceLabel: string;
  turnaround: string;
  featured: boolean;
  sortOrder: number;
}

export interface PresetProject {
  title: string;
  clientName: string;
  category: string;
  summary: string;
  metricLabel: string;
  imageUrl: string;
  sortOrder: number;
}

export interface PresetTestimonial {
  authorName: string;
  authorRole: string;
  quote: string;
  rating: number;
}

export interface BusinessPreset {
  key: string;
  label: string;
  shortDescription: string;
  profile: {
    businessName: string;
    tagline: string;
    industry: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroImageUrl: string;
    aboutHeading: string;
    aboutBody: string;
    accentColor: string;
    email: string;
    phone: string;
    address: string;
    hours: string;
    instagramUrl?: string;
    heroEyebrowAr?: string;
    heroHeadlineAr?: string;
    heroSubheadlineAr?: string;
    heroCtaSecondaryAr?: string;
    aboutHeadingAr?: string;
    aboutBodyAr?: string;
    facebookUrl?: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  services: PresetService[];
  projects: PresetProject[];
  testimonials: PresetTestimonial[];
}

export const BUSINESS_PRESETS: BusinessPreset[] = [
  {
    key: "electronics",
    label: "ALYAZEN Electronics",
    shortDescription: "Phones, laptops, boards & electronics",
    profile: {
      businessName: "ALYAZEN",
      tagline: "اليزن للإلكترونيات · Phones, Laptops, Boards & Electronics",
      industry: "Electronics Store",
      heroEyebrow: "Online Shop · Click & Collect · No Delivery",
      heroHeadline: "Your trusted store for phones, laptops & electronics.",
      heroSubheadline:
        "Latest smartphones, powerful laptops, development boards, accessories and electronic components — 100% original with warranty and the best prices. Visit our store to see, test and buy in person.",
      heroCtaPrimary: "Ask for Price / Reserve",
      heroCtaSecondary: "Contact Us",
      heroImageUrl: "/images/alyazen-hero.png",
      aboutHeading: "Quality you can trust, prices you'll love.",
      aboutBody:
        "ALYAZEN Electronics (اليزن للإلكترونيات) brings you genuine devices from top brands like Apple, Samsung, Xiaomi, HP, Dell and Lenovo, plus Arduino, Raspberry Pi and electronic boards for makers and engineers. Every product is checked, guaranteed, and backed by friendly after-sales support. Note: we do not offer delivery — all purchases are made in-store.",
      accentColor: "#C9A227",
      heroEyebrowAr: "متجر إلكتروني · استلم من المتجر · لا يوجد توصيل",
      heroHeadlineAr: "متجرك الموثوق للهواتف واللابتوبات والإلكترونيات.",
      heroSubheadlineAr: "أحدث الهواتف الذكية ولابتوبات قوية ولوحات تطوير وإكسسوارات ومكونات إلكترونية — أصلية 100% مع ضمان وأفضل الأسعار. زر متجرنا لترى المنتجات وتجربها وتشتريها بنفسك.",
      heroCtaSecondaryAr: "تواصل معنا",
      aboutHeadingAr: "جودة تثق بها وأسعار تعجبك.",
      aboutBodyAr: "اليزن للإلكترونيات تقدم لك أجهزة أصلية من علامات مثل Apple وSamsung وXiaomi وHP وDell وLenovo، إضافة إلى Arduino وRaspberry Pi ولوحات التطوير للهواة والمهندسين. كل منتج مفحوص ومضمون ويحظى بدعم ودي بعد البيع. ملاحظة: لا نقدم خدمة توصيل — جميع المشتريات تتم في المتجر.",
      email: "alyazn.tel@gmail.com",
      instagramUrl: "https://www.instagram.com/alyazen.for.marketing",
      facebookUrl: "https://www.facebook.com/alyazen.tek",
      phone: "+963 982 627 253",
      address: "حمص الحميدية، سوريا · Al-Hamidiyah, Homs, Syria",
      hours: "10:00 AM – 8:00 PM",
      stat1Value: "100%",
      stat1Label: "Original Products",
      stat2Value: "In-Store",
      stat2Label: "Pickup Only",
      stat3Value: "5,000+",
      stat3Label: "Happy Customers",
    },
    services: [
      {
        title: "Smartphones",
        category: "Phones",
        description:
          "iPhone, Samsung Galaxy, Xiaomi, Oppo and more — new models, all storage options, with official warranty.",
        priceLabel: "Best Price",
        turnaround: "In stock",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Laptops & Computers",
        category: "Laptops",
        description:
          "Gaming, business and student laptops from HP, Dell, Lenovo, Asus and Apple MacBook. Custom upgrades available.",
        priceLabel: "Best Price",
        turnaround: "In stock",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Development Boards",
        category: "Boards",
        description:
          "Arduino, Raspberry Pi, ESP32, sensors, modules and kits for students, engineers and DIY projects.",
        priceLabel: "From low prices",
        turnaround: "In stock",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Electronics & Accessories",
        category: "Electronics",
        description:
          "Chargers, cables, power banks, headphones, smart watches, components and everyday electronics.",
        priceLabel: "Best Price",
        turnaround: "In stock",
        featured: false,
        sortOrder: 4,
      },
      {
        title: "Repair & Maintenance",
        category: "Services",
        description:
          "Screen and battery replacement, software fixes, and laptop cleaning by experienced technicians.",
        priceLabel: "Ask for quote",
        turnaround: "Same day",
        featured: false,
        sortOrder: 5,
      },
    ],
    projects: [
      {
        title: "Latest Smartphones",
        clientName: "Apple · Samsung · Xiaomi",
        category: "Phones",
        summary: "The newest flagship and budget phones, original with warranty.",
        metricLabel: "New Arrivals",
        imageUrl: "/images/alyazen-phones.png",
        sortOrder: 1,
      },
      {
        title: "Powerful Laptops",
        clientName: "HP · Dell · Lenovo · MacBook",
        category: "Laptops",
        summary: "For gaming, work and study — pick the perfect machine for you.",
        metricLabel: "Top Brands",
        imageUrl: "/images/alyazen-laptops.png",
        sortOrder: 2,
      },
      {
        title: "Boards & Components",
        clientName: "Arduino · Raspberry Pi · ESP32",
        category: "Boards",
        summary: "Everything makers and engineers need to build their projects.",
        metricLabel: "Maker Friendly",
        imageUrl: "/images/alyazen-boards.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Ahmed",
        authorRole: "Customer",
        quote: "Bought my iPhone from ALYAZEN — original, great price and fast service.",
        rating: 5,
      },
      {
        authorName: "Sara",
        authorRole: "University Student",
        quote: "They helped me pick the perfect laptop for my studies within my budget.",
        rating: 5,
      },
      {
        authorName: "Omar",
        authorRole: "Engineer",
        quote: "Best place to find Arduino and ESP32 boards. Always in stock!",
        rating: 5,
      },
    ],
  },
  {
    key: "agency",
    label: "Digital & Brand Studio",
    shortDescription: "Web design, brand identity & growth retainers",
    profile: {
      businessName: "Vanguard & Co.",
      tagline: "Brand Identity, Web Engineering & Growth Systems",
      industry: "Creative & Digital Studio",
      heroEyebrow: "Modern Brand & Digital Partner",
      heroHeadline: "We turn ambitious businesses into unmistakable category leaders.",
      heroSubheadline:
        "From sharp visual identity to high-converting websites and custom web software, we partner with founders ready to scale with confidence.",
      heroCtaPrimary: "Start a Project",
      heroCtaSecondary: "Explore Our Work",
      heroImageUrl: "/images/hero-studio.png",
      aboutHeading: "Built for speed, obsessed with craft.",
      aboutBody:
        "We are a tight-knit team of brand strategists, product designers, and full-stack engineers. Instead of handing you off to junior account reps, you work directly with senior builders who measure success by qualified leads, revenue lift, and long-term brand authority.",
      accentColor: "#1D4ED8",
      email: "hello@vanguardco.studio",
      phone: "(415) 890-4410",
      address: "548 Market St, Suite 420, San Francisco, CA",
      hours: "Mon–Fri · 9:00 AM – 6:00 PM PST",
      stat1Value: "140+",
      stat1Label: "Launches Shipped",
      stat2Value: "3.4x",
      stat2Label: "Avg. Lead Lift",
      stat3Value: "4.9/5",
      stat3Label: "Client Rating",
    },
    services: [
      {
        title: "Flagship Website & Funnel Build",
        category: "Web & Product",
        description:
          "Custom conversion-engineered Next.js website tailored to your brand positioning, complete with CMS editing, booking flows, and technical SEO.",
        priceLabel: "From $4,500",
        turnaround: "3–4 weeks",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Complete Brand Identity System",
        category: "Brand Strategy",
        description:
          "Logo suite, typography, color system, packaging templates, and practical brand guidelines built for digital and print consistency.",
        priceLabel: "From $3,200",
        turnaround: "2–3 weeks",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Custom Client Portal & Booking App",
        category: "Software",
        description:
          "Bespoke customer dashboard, automated appointment scheduling, CRM sync, and payment-ready workflows built around your daily operations.",
        priceLabel: "From $6,800",
        turnaround: "4–6 weeks",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Monthly Growth & Design Retainer",
        category: "Ongoing Growth",
        description:
          "Dedicated senior design and engineering hours each month for landing pages, campaign creative, analytics experiments, and continuous shipping.",
        priceLabel: "$2,400 / mo",
        turnaround: "48h turnaround",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "Tactile Identity & Packaging Overhaul",
        clientName: "Atelier Solis",
        category: "Brand Identity",
        summary:
          "Repositioned an artisanal botanical skincare line with minimalist packaging, custom typography, and a wholesale buyer portal.",
        metricLabel: "+148% Wholesale Orders",
        imageUrl: "/images/project-1.png",
        sortOrder: 1,
      },
      {
        title: "High-Conversion SaaS & Booking Experience",
        clientName: "PulseOps Logistics",
        category: "Web Engineering",
        summary:
          "Rebuilt their marketing site and instant freight quote calculator, cutting time-to-lead from 4 days to under 3 minutes.",
        metricLabel: "3.1x Qualified Demo Requests",
        imageUrl: "/images/project-2.png",
        sortOrder: 2,
      },
      {
        title: "Flagship Showroom Experience & Digital Guide",
        clientName: "Kanso Architecture",
        category: "Digital & Spatial",
        summary:
          "Unified physical consultation spaces with an interactive portfolio archive and private client project tracker.",
        metricLabel: "$1.8M Pipeline Added",
        imageUrl: "/images/project-3.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Elena Vance",
        authorRole: "Founder, Atelier Solis",
        quote:
          "Within six weeks of launching the new brand and storefront, our inbound wholesale inquiries more than doubled. Best investment we made all year.",
        rating: 5,
      },
      {
        authorName: "Marcus Thorne",
        authorRole: "CEO, PulseOps Logistics",
        quote:
          "Zero fluff and ridiculously fast execution. They understood our sales cycle on day one and delivered a site that actually closes pipeline.",
        rating: 5,
      },
      {
        authorName: "Hannah Sato",
        authorRole: "Managing Partner, Kanso Architecture",
        quote:
          "Our clients constantly compliment how effortless it feels to book a consultation and review project milestones online.",
        rating: 5,
      },
    ],
  },
  {
    key: "barber",
    label: "Barber & Grooming Lounge",
    shortDescription: "Precision cuts, hot towel shaves & memberships",
    profile: {
      businessName: "Crown & Blade",
      tagline: "Precision Grooming, Hot Towel Shaves & Modern Classic Cuts",
      industry: "Barber & Men's Grooming",
      heroEyebrow: "Appointments & Walk-Ins Welcome",
      heroHeadline: "Sharp cuts, clean fades, and an unhurried lounge experience.",
      heroSubheadline:
        "Master barbers specializing in tailored scissor work, skin fades, beard sculpting, and steamed eucalyptus hot-towel shaves.",
      heroCtaPrimary: "Book Your Chair",
      heroCtaSecondary: "View Services",
      heroImageUrl: "/images/project-3.png",
      aboutHeading: "Crafted around detail, hospitality, and consistency.",
      aboutBody:
        "We opened Crown & Blade to bring back the ritual of a great neighborhood barbershop—without the rushed assembly-line energy. Enjoy complimentary espresso or cold brew, precision consultation, and effortless online booking.",
      accentColor: "#B45309",
      email: "bookings@crownandblade.com",
      phone: "(312) 555-0194",
      address: "814 W Fulton Market, Chicago, IL",
      hours: "Tue–Sat · 9:00 AM – 8:00 PM · Sun 10–5",
      stat1Value: "12,000+",
      stat1Label: "Cuts Delivered",
      stat2Value: "8",
      stat2Label: "Master Barbers",
      stat3Value: "4.98",
      stat3Label: "Google Rating",
    },
    services: [
      {
        title: "Signature Tailored Haircut",
        category: "Haircuts",
        description:
          "Detailed consultation, precision clipper & scissor work, straight-razor neck finish, rinse, and custom styling.",
        priceLabel: "$55",
        turnaround: "45 mins",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "The Crown Cut & Beard Sculpt",
        category: "Full Service",
        description:
          "Our signature haircut paired with razor-sharp beard linework, warm lather, and conditioning beard oil treatment.",
        priceLabel: "$85",
        turnaround: "75 mins",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Royal Hot Towel Straight Shave",
        category: "Shave Ritual",
        description:
          "Three steamed eucalyptus towels, rich sandalwood lather, two-pass straight razor shave, and soothing cold towel finish.",
        priceLabel: "$50",
        turnaround: "45 mins",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Monthly Grooming Club Membership",
        category: "Membership",
        description:
          "Unlimited cleanups between cuts, two full haircut & beard sessions monthly, and priority weekend chair access.",
        priceLabel: "$135 / mo",
        turnaround: "Priority booking",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "Grooming Apothecary & Take-Home Line",
        clientName: "House Formulation",
        category: "Signature Care",
        summary:
          "Small-batch matte clay, cedarwood beard elixir, and sea salt texture spray crafted exclusively for our clients.",
        metricLabel: "100% Natural Botanicals",
        imageUrl: "/images/project-1.png",
        sortOrder: 1,
      },
      {
        title: "Private Wedding Party Lounge Takeovers",
        clientName: "Groom & Groomsmen",
        category: "Events",
        summary:
          "Reserve our entire shop for morning-of cuts, hot shaves, espresso bar, and tailored prep before the ceremony.",
        metricLabel: "Up to 10 Guests",
        imageUrl: "/images/project-3.png",
        sortOrder: 2,
      },
      {
        title: "Seamless 30-Second Chair Booking",
        clientName: "Member Portal",
        category: "Hospitality",
        summary:
          "Pick your barber, save your exact cut preferences, and rebook your preferred Friday slot in seconds.",
        metricLabel: "Zero Wait Time",
        imageUrl: "/images/hero-studio.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Devon Brooks",
        authorRole: "Regular Member",
        quote:
          "Cleanest skin fade in Chicago, hands down. Every barber takes their time and the hot towel finish makes your whole week better.",
        rating: 5,
      },
      {
        authorName: "Julian Ortiz",
        authorRole: "Groom Party Booking",
        quote:
          "Booked the lounge for six groomsmen on wedding morning. Best decision ever—everyone looked razor-sharp for photos.",
        rating: 5,
      },
      {
        authorName: "Samir Patel",
        authorRole: "Creative Director",
        quote:
          "The Monthly Club pays for itself after two visits and I never stress before client shoots or travel anymore.",
        rating: 5,
      },
    ],
  },
  {
    key: "coffee",
    label: "Specialty Coffee & Bakery",
    shortDescription: "Small-batch roastery, cafe & event catering",
    profile: {
      businessName: "Oakhaven Roasters",
      tagline: "Single-Origin Coffee, Sourdough Pastries & Event Catering",
      industry: "Specialty Coffee & Cafe",
      heroEyebrow: "Roasted Fresh Every Tuesday",
      heroHeadline: "Thoughtfully sourced coffee, warm hospitality, every single morning.",
      heroSubheadline:
        "Direct-trade micro-lots roasted in-house alongside laminated sourdough pastries, seasonal espresso tonics, and custom office coffee programs.",
      heroCtaPrimary: "Book Event Catering",
      heroCtaSecondary: "Explore Menu & Beans",
      heroImageUrl: "/images/project-3.png",
      aboutHeading: "From harvest to your morning cup.",
      aboutBody:
        "At Oakhaven, we partner directly with family-owned farms in Colombia, Ethiopia, and Guatemala. Every roast profile is dialed for clarity and sweetness—whether you're stopping in for a cortado or stocking your studio kitchen.",
      accentColor: "#0F766E",
      email: "hello@oakhavenroasters.com",
      phone: "(503) 555-0148",
      address: "1120 NW Everett St, Portland, OR",
      hours: "Daily · 6:30 AM – 5:00 PM",
      stat1Value: "14",
      stat1Label: "Origin Partner Farms",
      stat2Value: "48h",
      stat2Label: "Roast-to-Door",
      stat3Value: "4.9/5",
      stat3Label: "Local Favorite",
    },
    services: [
      {
        title: "Mobile Espresso Bar Catering",
        category: "Events & Pop-Ups",
        description:
          "Two seasoned baristas, commercial La Marzocco cart, custom menu cards, and bottomless specialty lattes for weddings or summits.",
        priceLabel: "From $950",
        turnaround: "Up to 150 guests",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Office & Studio Bean Program",
        category: "Wholesale",
        description:
          "Weekly freshly roasted whole-bean deliveries, grinder calibration, and barista training tailored to your team size.",
        priceLabel: "From $240 / mo",
        turnaround: "Weekly delivery",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Morning Pastry & Coffee Box",
        category: "Corporate Catering",
        description:
          "Batch-brewed single-origin coffee carafes paired with warm cardamom knots, almond croissants, and seasonal galettes.",
        priceLabel: "$115 / box",
        turnaround: "Next-day ready",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Private Pour-Over & Cupping Workshop",
        category: "Experiences",
        description:
          "Interactive 90-minute tasting session covering roast science, water chemistry, and home brewing mastery.",
        priceLabel: "$65 / guest",
        turnaround: "90 mins",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "Seasonal Single-Origin Reserve Boxes",
        clientName: "Direct Trade Releases",
        category: "Roastery",
        summary:
          "Compostable matte canisters filled with washed Ethiopian heirloom and honey-processed Costa Rican micro-lots.",
        metricLabel: "89+ Cupping Score",
        imageUrl: "/images/project-1.png",
        sortOrder: 1,
      },
      {
        title: "Tech Summit Espresso Cart Activation",
        clientName: "Pacific Design Week",
        category: "Event Catering",
        summary:
          "Served 1,100+ handcrafted oat flat whites and yuzu espresso tonics across a three-day downtown conference.",
        metricLabel: "1,100+ Drinks Served",
        imageUrl: "/images/project-3.png",
        sortOrder: 2,
      },
      {
        title: "Wholesale Partner Ordering Portal",
        clientName: "45 Local Cafes & Studios",
        category: "Wholesale",
        summary:
          "Streamlined recurring roast scheduling and automatic grind-spec tracking for partner restaurants and offices.",
        metricLabel: "Zero Missed Deliveries",
        imageUrl: "/images/hero-studio.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Claire Donovan",
        authorRole: "Event Producer",
        quote:
          "Oakhaven's mobile espresso bar was the highlight of our three-day conference. Smooth logistics and unbelievable coffee.",
        rating: 5,
      },
      {
        authorName: "Liam Foster",
        authorRole: "Studio Operations Lead",
        quote:
          "Switching our office to their weekly bean program completely elevated morning morale—and their pastry boxes disappear in ten minutes.",
        rating: 5,
      },
      {
        authorName: "Maya Lin",
        authorRole: "Neighborhood Regular",
        quote:
          "The cardamom latte and warm sourdough croissants make this my favorite corner in the city.",
        rating: 5,
      },
    ],
  },
  {
    key: "fitness",
    label: "Strength & Coaching Studio",
    shortDescription: "1-on-1 training, athletic conditioning & recovery",
    profile: {
      businessName: "Kinetic Lab",
      tagline: "Evidence-Based Strength Coaching, Conditioning & Longevity",
      industry: "Health & Performance",
      heroEyebrow: "Private & Small-Group Training",
      heroHeadline: "Train smarter, build lasting strength, and move without pain.",
      heroSubheadline:
        "Personalized strength programming, biomechanics assessments, and high-accountability coaching inside a distraction-free performance lab.",
      heroCtaPrimary: "Book Free Assessment",
      heroCtaSecondary: "Training Programs",
      heroImageUrl: "/images/hero-studio.png",
      aboutHeading: "No crowded floors. Just measurable progress.",
      aboutBody:
        "Every client begins with a comprehensive movement and strength baseline. From busy executives rebuilding energy to competitive athletes chasing personal records, our coaches design sustainable training that fits your real schedule.",
      accentColor: "#DC2626",
      email: "coaching@kineticlab.fit",
      phone: "(512) 555-0167",
      address: "1705 E Cesar Chavez St, Austin, TX",
      hours: "Mon–Sat · 5:30 AM – 8:00 PM",
      stat1Value: "450+",
      stat1Label: "Active Athletes",
      stat2Value: "94%",
      stat2Label: "12-Mo Retention",
      stat3Value: "100%",
      stat3Label: "Certified Coaches",
    },
    services: [
      {
        title: "1-on-1 Private Strength Coaching",
        category: "Personal Training",
        description:
          "Custom weekly periodization, live form coaching, nutrition targets, and quarterly body-composition & force-plate testing.",
        priceLabel: "From $480 / mo",
        turnaround: "2–4x weekly",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Semi-Private Small Group Lab",
        category: "Small Group",
        description:
          "Maximum 4 clients per coach. Individualized programs delivered with the energy and camaraderie of a tight crew.",
        priceLabel: "$295 / mo",
        turnaround: "Unlimited sessions",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Movement & Mobility Diagnostic",
        category: "Assessment",
        description:
          "60-minute deep-dive screening identifying joint restrictions, strength asymmetries, and a custom 8-week corrective roadmap.",
        priceLabel: "$125 one-time",
        turnaround: "60 mins",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Remote Hybrid Coaching App Plan",
        category: "Remote",
        description:
          "Train anywhere with video form reviews, weekly coach check-ins, and travel-friendly hotel or home gym adaptations.",
        priceLabel: "$199 / mo",
        turnaround: "Weekly updates",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "12-Week Executive Longevity Transformation",
        clientName: "Founders Cohort",
        category: "Case Study",
        summary:
          "Helped 28 time-strapped founders add lean muscle, eliminate chronic lower-back stiffness, and boost VO2 max.",
        metricLabel: "+22% Avg Strength Gain",
        imageUrl: "/images/hero-studio.png",
        sortOrder: 1,
      },
      {
        title: "Post-Rehab Return to Sport Protocol",
        clientName: "Austin Track Club",
        category: "Performance",
        summary:
          "Bridged the gap between physical therapy discharge and full sprint & plyometric capacity.",
        metricLabel: "Zero Re-Injuries",
        imageUrl: "/images/project-2.png",
        sortOrder: 2,
      },
      {
        title: "Recovery & Sauna Contrast Lounge",
        clientName: "Member Amenity",
        category: "Recovery",
        summary:
          "Dedicated cedar infrared sauna, cold plunge, and Normatec compression boots built right into our studio floor.",
        metricLabel: "Included for Members",
        imageUrl: "/images/project-3.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Trevor Wallace",
        authorRole: "Tech Founder",
        quote:
          "First gym I've ever stuck with for two straight years. My back pain vanished in month two and my deadlift hit an all-time best.",
        rating: 5,
      },
      {
        authorName: "Natalie Cruz",
        authorRole: "Marathon Runner",
        quote:
          "The semi-private setup gives you real coaching without the chaotic bootcamp vibe. Cut 14 minutes off my marathon time.",
        rating: 5,
      },
      {
        authorName: "David Kim",
        authorRole: "Hybrid Member",
        quote:
          "Even when I travel every other week, my coach adjusts my workouts in the app so I never lose momentum.",
        rating: 5,
      },
    ],
  },
  {
    key: "remodeling",
    label: "Custom Remodeling & Craft",
    shortDescription: "Kitchens, baths, architectural millwork & builds",
    profile: {
      businessName: "Northline Craft",
      tagline: "Architectural Home Remodeling, Custom Kitchens & Millwork",
      industry: "Design-Build & Construction",
      heroEyebrow: "Licensed · Bonded · Insured",
      heroHeadline: "Timeless residential remodeling delivered on schedule and on budget.",
      heroSubheadline:
        "Transparent pricing, dedicated project managers, and master finish carpenters transforming kitchens, baths, and living spaces.",
      heroCtaPrimary: "Request Free Estimate",
      heroCtaSecondary: "View Completed Homes",
      heroImageUrl: "/images/project-3.png",
      aboutHeading: "Craftsmanship backed by transparent communication.",
      aboutBody:
        "Homeowners dread contractor surprises. At Northline Craft, every build starts with fixed-scope drawings, clear milestone schedules, and daily photo updates—so your renovation feels exciting, never stressful.",
      accentColor: "#111827",
      email: "estimates@northlinecraft.com",
      phone: "(206) 555-0183",
      address: "4210 Ballard Ave NW, Seattle, WA",
      hours: "Mon–Fri · 7:30 AM – 5:30 PM",
      stat1Value: "210+",
      stat1Label: "Homes Transformed",
      stat2Value: "5-Yr",
      stat2Label: "Workmanship Warranty",
      stat3Value: "98%",
      stat3Label: "On-Schedule Finish",
    },
    services: [
      {
        title: "Full Architectural Kitchen Remodel",
        category: "Kitchens",
        description:
          "Custom rift-sawn oak cabinetry, stone fabrication, lighting upgrades, plumbing relocation, and appliance integration.",
        priceLabel: "From $45,000",
        turnaround: "6–8 weeks",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Spa Bathroom & Wet Room Build",
        category: "Bathrooms",
        description:
          "Heated tile floors, curbless glass showers, custom floating vanities, and waterproof Schluter systems built to last decades.",
        priceLabel: "From $24,000",
        turnaround: "3–4 weeks",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Built-In Millwork & Architectural Trim",
        category: "Finish Carpentry",
        description:
          "Floor-to-ceiling mudrooms, home office shelving, fluted accent walls, and fireplace surrounds milled to exact tolerances.",
        priceLabel: "From $6,500",
        turnaround: "1–2 weeks",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Whole-Home Refresh & Flooring",
        category: "Interior Renovations",
        description:
          "Engineered hardwood installation, drywall skim-coating, recessed lighting layouts, and structural wall openings.",
        priceLabel: "Custom Quote",
        turnaround: "4–10 weeks",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "Warm Modern Kitchen & Arched Pantry",
        clientName: "Queen Anne Residence",
        category: "Kitchen Remodel",
        summary:
          "Removed a load-bearing partition to create a sunlit chef's kitchen with honed travertine island and concealed pantry.",
        metricLabel: "Finished 4 Days Early",
        imageUrl: "/images/project-3.png",
        sortOrder: 1,
      },
      {
        title: "Custom White Oak Executive Studio",
        clientName: "Mercer Island Home",
        category: "Millwork",
        summary:
          "Designed and built acoustic wall paneling, integrated brass task lighting, and floating desk cabinetry.",
        metricLabel: "Zero Change Orders",
        imageUrl: "/images/hero-studio.png",
        sortOrder: 2,
      },
      {
        title: "Material Sample & Design Kit Service",
        clientName: "Pre-Build Planning",
        category: "Design-Build",
        summary:
          "We bring curated stone, hardware, and wood finish boards right to your living room before demolition ever begins.",
        metricLabel: "Fixed-Price Guarantee",
        imageUrl: "/images/project-1.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Greg & Laura Bennett",
        authorRole: "Homeowners, Seattle",
        quote:
          "They hit every single weekly milestone and kept our house spotless every evening. Our new kitchen feels straight out of a magazine.",
        rating: 5,
      },
      {
        authorName: "Rachel Simmons",
        authorRole: "Interior Architect",
        quote:
          "Northline's finish carpenters execute complex architectural details without cutting corners. My go-to referral for clients.",
        rating: 5,
      },
      {
        authorName: "Omar Hassan",
        authorRole: "Homeowner, Bellevue",
        quote:
          "No hidden fees, clear digital tracking, and a 5-year warranty that gives total peace of mind.",
        rating: 5,
      },
    ],
  },
  {
    key: "consulting",
    label: "Advisory & Fractional CFO",
    shortDescription: "Financial strategy, tax optimization & scaling ops",
    profile: {
      businessName: "Harbor Advisory",
      tagline: "Fractional CFO, Tax Strategy & Financial Clarity for Founders",
      industry: "B2B Advisory & Finance",
      heroEyebrow: "Trusted by $1M–$25M Companies",
      heroHeadline: "Turn financial complexity into clean decisions and higher margins.",
      heroSubheadline:
        "Hands-on CFO leadership, proactive tax planning, and real-time cashflow forecasting built for service businesses, e-commerce, and SaaS teams.",
      heroCtaPrimary: "Schedule Discovery Call",
      heroCtaSecondary: "Advisory Packages",
      heroImageUrl: "/images/project-2.png",
      aboutHeading: "Financial partners who speak plain English.",
      aboutBody:
        "Most founders get historical spreadsheets weeks too late. We install clean monthly reporting, forward-looking 13-week cash models, and strategic tax structuring so you keep more of every dollar you earn.",
      accentColor: "#1D4ED8",
      email: "advisory@harborcfo.com",
      phone: "(617) 555-0132",
      address: "100 Federal St, Floor 19, Boston, MA",
      hours: "Mon–Fri · 8:30 AM – 6:00 PM EST",
      stat1Value: "$180M+",
      stat1Label: "Client Revenue Guided",
      stat2Value: "$42k",
      stat2Label: "Avg. Annual Tax Saved",
      stat3Value: "10th",
      stat3Label: "Monthly Close Guarantee",
    },
    services: [
      {
        title: "Fractional CFO & Board Reporting",
        category: "Strategic CFO",
        description:
          "Monthly executive financial reviews, 13-week cash flow forecasting, unit-economics tracking, and pricing model optimization.",
        priceLabel: "$3,500 / mo",
        turnaround: "Monthly cadence",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Proactive Business Tax Strategy",
        category: "Tax & Compliance",
        description:
          "Entity structuring, S-Corp optimization, R&D credits, quarterly projections, and full year-end federal & state filings.",
        priceLabel: "From $4,200 / yr",
        turnaround: "Year-round support",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Clean Books & Controller Package",
        category: "Accounting",
        description:
          "Accrual-basis bookkeeping closed by the 10th of every month, payroll reconciliation, AP/AR workflows, and audit-ready ledgers.",
        priceLabel: "$1,450 / mo",
        turnaround: "Closed by the 10th",
        featured: false,
        sortOrder: 3,
      },
      {
        title: "Fundraise & Exit Readiness Sprint",
        category: "Transactions",
        description:
          "Three-statement financial model, clean data room prep, KPI deck review, and buyer due-diligence support.",
        priceLabel: "$5,500 fixed",
        turnaround: "2 weeks",
        featured: false,
        sortOrder: 4,
      },
    ],
    projects: [
      {
        title: "Margin Turnaround for Multi-Location Agency",
        clientName: "Beacon Media Group",
        category: "CFO Advisory",
        summary:
          "Restructured project retainers and utilization reporting, expanding net profit margin from 11% to 24% within two quarters.",
        metricLabel: "+13 pts Net Margin",
        imageUrl: "/images/project-2.png",
        sortOrder: 1,
      },
      {
        title: "Live Executive Cashflow Command Center",
        clientName: "ScaleReady Brands",
        category: "Forecasting",
        summary:
          "Automated weekly cash, inventory, and ad-spend dashboards giving founders daily visibility across four storefronts.",
        metricLabel: "$310K Working Capital Freed",
        imageUrl: "/images/hero-studio.png",
        sortOrder: 2,
      },
      {
        title: "Pre-Acquisition Data Room & Valuation Model",
        clientName: "Northstar Software",
        category: "Exit Readiness",
        summary:
          "Audited three years of deferred revenue and built a defensible cohort model that supported an 8.2x EBITDA exit.",
        metricLabel: "8.2x Exit Multiple",
        imageUrl: "/images/project-1.png",
        sortOrder: 3,
      },
    ],
    testimonials: [
      {
        authorName: "Derek Alvarez",
        authorRole: "CEO, Beacon Media Group",
        quote:
          "Harbor paid for their annual fee in the first 45 days just by fixing our pricing tiers and quarterly tax elections.",
        rating: 5,
      },
      {
        authorName: "Priya Nair",
        authorRole: "Founder, ScaleReady Brands",
        quote:
          "Having clean books closed by the 10th and a real CFO on call completely changed how confidently we hire and invest.",
        rating: 5,
      },
      {
        authorName: "Tom Henderson",
        authorRole: "Co-Founder, Northstar Software",
        quote:
          "When buyers opened our data room, every single metric reconciled cleanly. Smooth exit from start to wire.",
        rating: 5,
      },
    ],
  },
];

export function getPresetByKey(key: string): BusinessPreset {
  return (
    BUSINESS_PRESETS.find((preset) => preset.key === key) ?? BUSINESS_PRESETS[0]
  );
}
