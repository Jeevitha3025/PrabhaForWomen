// Curated opportunities + roadmap templates.
// buildRoadmap() turns a template into a personal plan by adding/removing
// steps based on what the entrepreneur told us during onboarding.
import { RESOURCES, SKILL_BY_ID } from "./onboarding";

const hoursOf = (h = "") => (h.startsWith("10") ? 10 : h.startsWith("5") ? 5 : 2);

export const OPPORTUNITIES = [
  {
    id: "uniform", emoji: "🏫", name: "School uniform stitching", domain: "Textiles",
    desc: "Demand peaks before the June and December school terms.",
    startup: "₹8,000", time: "8 hrs/wk", demand: "High 🔥", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["tailoring"], needs: ["sewingMachine"], helps: ["fabricStock", "embroidery"], minHours: 5,
    steps: [
      { id: "sample", title: "Stitch 2 sample uniforms", detail: "Use the most common local school's design. These become your showpieces." },
      { id: "price", title: "Work out your price per set", detail: "Add cloth + thread + buttons + your hours. Add 30% for profit." },
      { id: "school", title: "Visit 2 nearby schools or the PTA", detail: "Show samples and offer a per-class rate before the term starts." },
      { id: "order", title: "Take your first bulk order with 50% advance", detail: "The advance pays for cloth so you don't use savings." },
    ],
  },
  {
    id: "handloom", emoji: "🧶", name: "Handloom stoles & sarees online", domain: "Textiles",
    desc: "City buyers pay more for handwoven pieces with a story.",
    startup: "₹10,000", time: "10 hrs/wk", demand: "Growing 📈", scheme: "PM Vishwakarma (up to ₹3 lakh)",
    skills: ["weaving"], needs: ["loom"], helps: ["yarn", "smartphone"], minHours: 5,
    steps: [
      { id: "range", title: "Pick 3 designs you weave best", detail: "A small, consistent range is easier to sell than many one-offs." },
      { id: "photos", title: "Photograph each piece in daylight", detail: "Show the full piece, a close-up of the weave, and it being worn." },
      { id: "esaras", title: "List on eSaras or a WhatsApp catalogue", detail: "Start with 3 listings and your weaving story." },
      { id: "gi", title: "Check for a handloom mark / GI tag", detail: "Tagged products get better prices and buyer trust." },
    ],
  },
  {
    id: "millet", emoji: "🌾", name: "Millet snack production", domain: "Food",
    desc: "Health-conscious buyers want local millet snacks.",
    startup: "₹12,000", time: "10 hrs/wk", demand: "Growing 📈", scheme: "PMFME (35% subsidy)",
    skills: ["cooking"], needs: ["kitchen"], helps: ["mixer", "oven"], minHours: 5,
    steps: [
      { id: "recipe", title: "Fix 2 recipes and measure exactly", detail: "Same taste every time is what brings repeat buyers." },
      { id: "fssai", title: "Get FSSAI basic registration", detail: "Costs about ₹100/year for home kitchens and lets you sell to shops." },
      { id: "pack", title: "Pack 20 trial packets with a simple label", detail: "Name, weight, date, your phone number." },
      { id: "sell", title: "Sell at a weekly market or 2 local shops", detail: "Ask shopkeepers for feedback after one week." },
    ],
  },
  {
    id: "tiffin", emoji: "🍱", name: "Home tiffin service", domain: "Food",
    desc: "Steady daily income from students and working people nearby.",
    startup: "₹5,000", time: "10+ hrs/wk", demand: "High 🔥", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["cooking"], needs: ["kitchen"], helps: ["fridge", "vehicle"], minHours: 10,
    steps: [
      { id: "menu", title: "Plan a 6-day rotating menu", detail: "Simple, home-style meals keep costs predictable." },
      { id: "trial", title: "Offer a 3-day trial to 5 customers", detail: "Hostels, PG rooms and offices are good first customers." },
      { id: "fssai", title: "Get FSSAI basic registration", detail: "Required once you sell food regularly." },
      { id: "monthly", title: "Move trial customers to monthly plans", detail: "Monthly advance payment gives you steady cash." },
    ],
  },
  {
    id: "organic", emoji: "🥬", name: "Organic vegetables & kitchen garden kits", domain: "Agri",
    desc: "Direct-to-home vegetable boxes sell well near towns.",
    startup: "₹6,000", time: "10 hrs/wk", demand: "Growing 📈", scheme: "DAY-NRLM (SHG enterprise support)",
    skills: ["farming"], needs: ["land"], helps: ["water", "farmTools"], minHours: 5,
    steps: [
      { id: "crops", title: "Choose 4 fast-growing vegetables", detail: "Greens, tomato, beans and brinjal give harvests within weeks." },
      { id: "buyers", title: "Find 10 households for a weekly box", detail: "Neighbours, teachers and apartment groups are a good start." },
      { id: "fpo", title: "Join a local FPO or SHG for selling", detail: "Group selling gets you better prices and transport." },
      { id: "upi", title: "Collect weekly payments on UPI", detail: "Keeps records clean for future loans." },
    ],
  },
  {
    id: "dairy", emoji: "🐄", name: "Milk & dairy products", domain: "Agri",
    desc: "Ghee, paneer and curd earn more than selling raw milk.",
    startup: "₹15,000", time: "10+ hrs/wk", demand: "Steady 📊", scheme: "DAY-NRLM / NABARD dairy support",
    skills: ["farming", "cooking"], needs: ["livestock"], helps: ["fridge"], minHours: 10,
    steps: [
      { id: "society", title: "Register with the local milk society", detail: "Assured daily buyer for surplus milk." },
      { id: "value", title: "Make ghee or paneer from 20% of milk", detail: "Value-added products earn 2–3x more." },
      { id: "fssai", title: "Get FSSAI registration", detail: "Needed to sell ghee and paneer to shops." },
      { id: "vet", title: "Book a free vet check-up", detail: "Healthy animals give more milk. Ask your panchayat about camps." },
    ],
  },
  {
    id: "beauty", emoji: "💅", name: "Home-based beauty services", domain: "Beauty",
    desc: "High repeat-customer rate in local neighbourhoods.",
    startup: "₹4,000", time: "5 hrs/wk", demand: "High 🔥", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["beauty"], needs: ["beautyKit"], helps: ["parlourSpace", "smartphone"], minHours: 0,
    steps: [
      { id: "menu", title: "Write a price card for 5 services", detail: "Threading, facial, mehendi, bridal, haircut — whatever you do best." },
      { id: "hygiene", title: "Set up a clean, hygienic corner", detail: "Clean towels and sealed products build trust fast." },
      { id: "festival", title: "Offer a festival / wedding package", detail: "Seasonal packages bring the biggest earnings." },
      { id: "referral", title: "Give a discount for every referral", detail: "Word of mouth is your main marketing." },
    ],
  },
  {
    id: "pottery", emoji: "🏺", name: "Handmade pottery & décor", domain: "Craft",
    desc: "Urban buyers pay a premium for handmade home décor.",
    startup: "₹6,000", time: "6 hrs/wk", demand: "Growing 📈", scheme: "PM Vishwakarma (up to ₹3 lakh)",
    skills: ["pottery", "art"], needs: ["wheel"], helps: ["kiln", "artSupplies"], minHours: 0,
    steps: [
      { id: "line", title: "Make a small line: planters, diyas, cups", detail: "Pick items that are easy to pack and ship." },
      { id: "paint", title: "Add your own painted pattern", detail: "A signature style makes your work recognisable." },
      { id: "fair", title: "Book a stall at a craft fair or Diwali mela", detail: "Fairs give fast feedback on what sells." },
      { id: "online", title: "List your 5 best pieces online", detail: "eSaras, Amazon Karigar or Instagram." },
    ],
  },
  {
    id: "jewellery", emoji: "📿", name: "Handmade jewellery", domain: "Craft",
    desc: "Low-cost materials, high margins, easy to ship.",
    startup: "₹3,000", time: "5 hrs/wk", demand: "High 🔥", scheme: "PM Vishwakarma (up to ₹3 lakh)",
    skills: ["jewellery", "art"], needs: ["jewelleryTools"], helps: ["smartphone"], minHours: 0,
    steps: [
      { id: "collection", title: "Make a 10-piece starter collection", detail: "Earrings and bangles sell fastest." },
      { id: "photos", title: "Photograph on a plain background", detail: "A white cloth and daylight are enough." },
      { id: "whatsapp", title: "Share a WhatsApp catalogue with 50 contacts", detail: "Ask friends to forward it." },
      { id: "bulk", title: "Approach one boutique for bulk orders", detail: "Wholesale gives steady volume." },
    ],
  },
  {
    id: "tuition", emoji: "📚", name: "Home tuition centre", domain: "Education",
    desc: "Parents everywhere look for trusted after-school help.",
    startup: "₹1,000", time: "10 hrs/wk", demand: "High 🔥", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["teaching"], needs: [], helps: ["teachingSpace", "books"], minHours: 5,
    steps: [
      { id: "classes", title: "Choose which classes and subjects", detail: "Start with what you are most confident teaching." },
      { id: "batch", title: "Start one batch of 5 children", detail: "Small batches let you give personal attention." },
      { id: "fees", title: "Fix a monthly fee and collect in advance", detail: "Ask what others charge nearby and stay close to it." },
      { id: "results", title: "Share progress with parents every month", detail: "Happy parents bring more students." },
    ],
  },
  {
    id: "herbal", emoji: "🌿", name: "Herbal & home-remedy products", domain: "Health",
    desc: "A steady market for trusted, locally made wellness products.",
    startup: "₹5,000", time: "5 hrs/wk", demand: "Steady 📊", scheme: "PMFME / PM Vishwakarma",
    skills: ["herbal"], needs: [], helps: ["herbGarden", "dryingSpace"], minHours: 0,
    steps: [
      { id: "product", title: "Pick one product: hair oil, herbal powder or soap", detail: "Master one before adding more." },
      { id: "label", title: "Make a label with ingredients and date", detail: "Clear labels build trust." },
      { id: "license", title: "Check AYUSH / FSSAI rules for your product", detail: "Ask your mentor which applies." },
      { id: "sell", title: "Sell through SHG melas and local stores", detail: "Start with 30 units and track what sells." },
    ],
  },
  {
    id: "florist", emoji: "🌺", name: "Garlands & event flower decoration", domain: "Craft",
    desc: "Daily temple demand plus weddings and functions.",
    startup: "₹2,000", time: "10 hrs/wk", demand: "Steady 📊", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["floristry"], needs: ["flowerSupply"], helps: ["fridge", "vehicle"], minHours: 5,
    steps: [
      { id: "temple", title: "Supply daily garlands to 1–2 temples or shops", detail: "Gives you steady daily income." },
      { id: "photos", title: "Photograph your decoration work", detail: "Your portfolio wins event orders." },
      { id: "events", title: "Contact 3 function halls and caterers", detail: "Offer decoration packages for weddings and naming ceremonies." },
      { id: "supplier", title: "Fix a regular flower supplier", detail: "Buying daily at fixed rates protects your margin." },
    ],
  },
  {
    id: "digital", emoji: "🖥️", name: "Digital services & data entry", domain: "Digital",
    desc: "Remote work for local shops and online clients.",
    startup: "₹0", time: "10 hrs/wk", demand: "High 🔥", scheme: "PMEGP (up to ₹10 lakh)",
    skills: ["digital", "photography"], needs: ["laptop"], helps: ["internet", "smartphone"], minHours: 5,
    steps: [
      { id: "service", title: "Choose 2 services to offer", detail: "Data entry, form filling, Canva posters or social media for shops." },
      { id: "local", title: "Offer your service to 5 local shops", detail: "Local businesses often need help going online." },
      { id: "csc", title: "Explore becoming a CSC operator", detail: "Common Service Centres earn per government service delivered." },
      { id: "profile", title: "Create a profile on a freelance site", detail: "Add 3 sample works." },
    ],
  },
  {
    id: "photo", emoji: "📷", name: "Event & product photography", domain: "Digital",
    desc: "Small shops and families need good photos.",
    startup: "₹2,000", time: "6 hrs/wk", demand: "Growing 📈", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: ["photography"], needs: ["camera"], helps: ["laptop"], minHours: 0,
    steps: [
      { id: "portfolio", title: "Shoot 20 portfolio photos", detail: "Products for local shops and portraits of friends." },
      { id: "package", title: "Make 3 simple packages", detail: "Product shoot, birthday, small function." },
      { id: "instagram", title: "Post your work on Instagram/WhatsApp", detail: "Tag the shops you shoot for." },
      { id: "edit", title: "Learn free editing with Snapseed", detail: "Quick edits make photos look professional." },
    ],
  },
  {
    id: "repair", emoji: "🔧", name: "Mobile & appliance repair", domain: "Logistics",
    desc: "Every household needs quick, trusted repairs.",
    startup: "₹7,000", time: "10 hrs/wk", demand: "High 🔥", scheme: "PM Vishwakarma (up to ₹3 lakh)",
    skills: ["repair"], needs: ["repairTools"], helps: ["vehicle"], minHours: 5,
    steps: [
      { id: "skill", title: "Pick your repair focus", detail: "Mobiles, mixers, fans or sewing machines." },
      { id: "certify", title: "Take a short certified course (PMKVY)", detail: "Free and builds customer trust." },
      { id: "spares", title: "Find a spare-parts wholesaler", detail: "Good parts at fair rates protect your margin." },
      { id: "spot", title: "Set up a corner in a busy shop or market", detail: "Visibility brings walk-in customers." },
    ],
  },
  {
    id: "custom", emoji: "✍️", name: "Your own idea", domain: "Other",
    desc: "A plan built around the skill you described.",
    startup: "₹2,000+", time: "5 hrs/wk", demand: "To check 🔎", scheme: "Mudra Shishu (up to ₹50,000)",
    skills: [], needs: [], helps: ["smartphone"], minHours: 0,
    steps: [
      { id: "buyers", title: "Talk to 5 people who might buy", detail: "Ask what they would pay and how often." },
      { id: "sample", title: "Make one sample or do one trial job", detail: "Real feedback beats guessing." },
      { id: "price", title: "Work out your cost and price", detail: "Cost of materials + your time + profit." },
      { id: "first", title: "Get your first paid order", detail: "Even a small one proves the idea works." },
    ],
  },
];

const labelOf = (id) => RESOURCES[id]?.label?.toLowerCase() || id;

/** Rank opportunities for a profile. */
export function rankOpportunities(profile = {}) {
  const skills = new Set(profile.skills || []);
  const resources = new Set(profile.resources || []);
  const hours = hoursOf(profile.hours);

  const scored = OPPORTUNITIES.filter((o) => o.id !== "custom").map((o) => {
    let score = 0;
    o.skills.forEach((s) => { if (skills.has(s)) score += 5; });
    o.needs.forEach((r) => { score += resources.has(r) ? 3 : -1; });
    o.helps.forEach((r) => { if (resources.has(r)) score += 1; });
    score += hours >= o.minHours ? 1 : -2;
    return { ...o, _score: score };
  });

  const matched = scored.filter((o) => o.skills.some((s) => skills.has(s))).sort((a, b) => b._score - a._score);
  if (profile.otherSkill) {
    const custom = OPPORTUNITIES.find((o) => o.id === "custom");
    matched.splice(Math.min(1, matched.length), 0, {
      ...custom, name: `${profile.otherSkill[0].toUpperCase()}${profile.otherSkill.slice(1)} business`, _score: 4,
    });
  }
  const rest = scored.filter((o) => !matched.includes(o)).sort((a, b) => b._score - a._score);
  return [...matched, ...rest].slice(0, 3);
}

/** "Why this fits you" lines, built from real answers. */
export function whyFits(opp, profile = {}) {
  const lines = [];
  const skill = opp.skills.find((s) => (profile.skills || []).includes(s));
  if (skill) lines.push(`Uses your ${SKILL_BY_ID[skill].label.toLowerCase()} skill.`);
  else if (opp.id === "custom" && profile.otherSkill) lines.push(`Built around your skill: ${profile.otherSkill}.`);
  const have = [...opp.needs, ...opp.helps].filter((r) => (profile.resources || []).includes(r));
  if (have.length) lines.push(`You already have: ${have.map(labelOf).join(", ")}.`);
  if (profile.location) lines.push(`Can be started in ${profile.location.split(",")[0]}.`);
  if (hoursOf(profile.hours) >= opp.minHours) lines.push(`Fits the ${profile.hours || "time"} you can give each week.`);
  return lines.length ? lines : ["A good starting point while you build skills."];
}

/**
 * Personal roadmap: template steps + conditional steps from the profile.
 * Each step: { id, title, detail, tag? }  tag explains why it was added.
 */
export function buildRoadmap(opp, profile = {}) {
  const resources = new Set(profile.resources || []);
  const hours = hoursOf(profile.hours);
  const before = [];
  const after = [];

  // Family first — nothing works without home support.
  if (profile.family === "needsTime") {
    const how = {
      startSmall: "Show them you'll start small, from home, without big loans.",
      stories: "Share a success story from a woman in a similar situation.",
      mentorTalk: "Ask your mentor to join a short call with your family.",
      income: "Agree on a 1-month trial and show them the first earnings.",
    }[profile.familyHelp] || "Explain the plan, the time needed, and the first goal.";
    before.push({ id: "family", title: "Talk with your family about the plan", detail: how, tag: "Because your family needs time" });
  }

  // Missing essentials → how to get them.
  opp.needs.filter((r) => !resources.has(r)).forEach((r) => {
    before.push({
      id: `get-${r}`,
      title: `Get access to a ${labelOf(r)}`,
      detail: `Borrow or rent one first. To buy, ask about ${opp.scheme} or your SHG's revolving fund.`,
      tag: "You don't have this yet",
    });
  });

  if (hours < opp.minHours) {
    before.push({ id: "small", title: "Start with a very small first batch", detail: "Begin with what fits your time now and grow when you're ready.", tag: "Fits your available time" });
  }

  const steps = [...opp.steps];

  if (!resources.has("smartphone")) {
    after.push({ id: "upi", title: "Get set up for UPI payments", detail: "A basic smartphone (or a family member's) with BHIM/PhonePe. Your SHG or bank mitra can help.", tag: "No smartphone yet" });
  } else {
    after.push({ id: "whatsapp", title: "Create a WhatsApp Business profile", detail: "Add your products, prices and timings so customers can order directly.", tag: "You have a smartphone" });
  }

  if (resources.has("shg")) {
    after.push({ id: "shg-loan", title: "Ask your SHG for a starter loan", detail: "SHG loans have low interest and simple paperwork.", tag: "You're in an SHG" });
  } else if (!resources.has("savings")) {
    after.push({ id: "scheme", title: `Apply for ${opp.scheme}`, detail: "Keep Aadhaar, bank passbook and a 1-page plan ready. Yojana Mitra can guide you.", tag: "No savings to start with" });
  }

  if (profile.literacy === "voice" || profile.literacy === "some") {
    after.push({ id: "voice-records", title: "Keep accounts as voice notes", detail: "Record each sale and expense on WhatsApp to yourself. Your mentor can help turn them into a register.", tag: "Voice works best for you" });
  } else {
    after.push({ id: "accounts", title: "Keep a simple daily register", detail: "Write each sale and expense. It helps with loans later.", tag: null });
  }

  after.push({ id: "mentor", title: "Book your first mentor session", detail: "Share this roadmap and ask what to do first.", tag: null });

  return [...before, ...steps, ...after];
}
