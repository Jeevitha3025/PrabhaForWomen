// Single source of truth for onboarding options.
// Profiles store stable ids (e.g. "tailoring"), never the emoji labels,
// so labels can be translated or renamed without breaking saved data.

export const SKILLS = [
  { id: "tailoring",   emoji: "🧵", label: "Tailoring",   domain: "Textiles" },
  { id: "cooking",     emoji: "🍲", label: "Cooking",     domain: "Food" },
  { id: "weaving",     emoji: "🧶", label: "Weaving",     domain: "Textiles" },
  { id: "farming",     emoji: "🌾", label: "Farming",     domain: "Agri" },
  { id: "beauty",      emoji: "💅", label: "Beauty",      domain: "Beauty" },
  { id: "pottery",     emoji: "🏺", label: "Pottery",     domain: "Craft" },
  { id: "jewellery",   emoji: "📿", label: "Jewellery",   domain: "Craft" },
  { id: "teaching",    emoji: "📚", label: "Teaching",    domain: "Education" },
  { id: "herbal",      emoji: "🌿", label: "Herbal",      domain: "Health" },
  { id: "art",         emoji: "🎨", label: "Art",         domain: "Craft" },
  { id: "digital",     emoji: "🖥️", label: "Digital",     domain: "Digital" },
  { id: "photography", emoji: "📷", label: "Photography", domain: "Digital" },
  { id: "floristry",   emoji: "🌺", label: "Floristry",   domain: "Craft" },
  { id: "repair",      emoji: "🔧", label: "Repair",      domain: "Logistics" },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// Every resource the app knows about.
export const RESOURCES = {
  sewingMachine:  { emoji: "🧵", label: "Sewing machine" },
  embroidery:     { emoji: "🪡", label: "Embroidery / pico machine" },
  fabricStock:    { emoji: "👗", label: "Fabric or material stock" },
  loom:           { emoji: "🧶", label: "Loom" },
  yarn:           { emoji: "🧺", label: "Yarn / thread supply" },
  kitchen:        { emoji: "🔥", label: "Kitchen & gas stove" },
  mixer:          { emoji: "🥣", label: "Mixer / grinder" },
  oven:           { emoji: "🍞", label: "Oven" },
  fridge:         { emoji: "🧊", label: "Fridge" },
  land:           { emoji: "🌱", label: "Land / farm plot" },
  livestock:      { emoji: "🐄", label: "Livestock" },
  water:          { emoji: "💧", label: "Water / irrigation" },
  farmTools:      { emoji: "⛏️", label: "Farm tools" },
  beautyKit:      { emoji: "💄", label: "Beauty kit & products" },
  parlourSpace:   { emoji: "🪞", label: "Space for a parlour" },
  wheel:          { emoji: "🏺", label: "Potter's wheel" },
  kiln:           { emoji: "♨️", label: "Kiln / firing access" },
  jewelleryTools: { emoji: "📿", label: "Beads, wire & tools" },
  artSupplies:    { emoji: "🎨", label: "Paints & art supplies" },
  teachingSpace:  { emoji: "🏠", label: "Room to teach in" },
  books:          { emoji: "📖", label: "Books & study material" },
  herbGarden:     { emoji: "🪴", label: "Herb garden" },
  dryingSpace:    { emoji: "☀️", label: "Drying / storage space" },
  camera:         { emoji: "📷", label: "Camera" },
  flowerSupply:   { emoji: "💐", label: "Nearby flower supply" },
  repairTools:    { emoji: "🧰", label: "Repair tool kit" },
  smartphone:     { emoji: "📱", label: "Smartphone" },
  laptop:         { emoji: "💻", label: "Laptop / PC" },
  internet:       { emoji: "📶", label: "Internet connection" },
  vehicle:        { emoji: "🛵", label: "Vehicle" },
  savings:        { emoji: "💰", label: "Some savings" },
  shg:            { emoji: "🤝", label: "Self-help group (SHG)" },
};

// What is worth asking about, given each skill.
export const RESOURCES_BY_SKILL = {
  tailoring:   ["sewingMachine", "embroidery", "fabricStock"],
  weaving:     ["loom", "yarn"],
  cooking:     ["kitchen", "mixer", "oven", "fridge"],
  farming:     ["land", "livestock", "water", "farmTools"],
  beauty:      ["beautyKit", "parlourSpace"],
  pottery:     ["wheel", "kiln"],
  jewellery:   ["jewelleryTools"],
  art:         ["artSupplies"],
  teaching:    ["teachingSpace", "books"],
  herbal:      ["herbGarden", "dryingSpace", "kitchen"],
  digital:     ["laptop", "internet"],
  photography: ["camera", "laptop"],
  floristry:   ["flowerSupply", "fridge"],
  repair:      ["repairTools"],
};

// Asked for everyone – they matter for any small business.
export const COMMON_RESOURCES = ["smartphone", "vehicle", "savings", "shg"];

export const NOTHING_YET = "nothingYet";

/** Resource ids to show on step 4, based on the skills picked on step 1. */
export function resourcesForSkills(skillIds = []) {
  const specific = skillIds.flatMap((id) => RESOURCES_BY_SKILL[id] || []);
  return [...new Set([...specific, ...COMMON_RESOURCES])];
}

export const HOURS = ["<5 hrs", "5–10 hrs", "10+ hrs"];

// ── Step 5: asked one after another, each follow-up only when relevant ──
export const EDUCATION = [
  { id: "none",    label: "No formal schooling" },
  { id: "school",  label: "School" },
  { id: "college", label: "College" },
];

export const EDUCATION_FOLLOWUP = {
  none: {
    key: "literacy",
    question: "Are you comfortable reading short messages?",
    options: [
      { id: "voice", label: "I prefer listening (voice)" },
      { id: "some",  label: "I can read a little" },
      { id: "yes",   label: "Yes, comfortably" },
    ],
  },
  school: {
    key: "schoolLevel",
    question: "Up to which class did you study?",
    options: [
      { id: "upto5",  label: "Up to 5th" },
      { id: "upto8",  label: "Up to 8th" },
      { id: "upto10", label: "10th (SSLC)" },
      { id: "upto12", label: "12th (PUC)" },
    ],
  },
  college: {
    key: "collegeLevel",
    question: "What did you study?",
    options: [
      { id: "diploma",  label: "Diploma / ITI" },
      { id: "graduate", label: "Graduate" },
      { id: "postgrad", label: "Post-graduate" },
    ],
  },
};

export const FAMILY = [
  { id: "supportive", label: "Supportive" },
  { id: "needsTime",  label: "Needs time" },
  { id: "iDecide",    label: "I decide" },
];

export const FAMILY_FOLLOWUP = {
  needsTime: {
    key: "familyHelp",
    question: "What would help your family feel comfortable?",
    options: [
      { id: "startSmall", label: "Starting small, from home" },
      { id: "stories",    label: "Seeing other women succeed" },
      { id: "mentorTalk", label: "A mentor talking to them" },
      { id: "income",     label: "Seeing the first earnings" },
    ],
  },
};

// ── Back-compat: older profiles stored "🧵 Tailoring" style strings ──
const stripEmoji = (s) => String(s).replace(/^[^\p{L}\p{N}]+/u, "").trim().toLowerCase();

export function normalizeSkills(list = []) {
  const ids = [];
  let other = "";
  for (const raw of list) {
    if (SKILL_BY_ID[raw]) { ids.push(raw); continue; }
    const plain = stripEmoji(raw);
    const hit = SKILLS.find((s) => s.label.toLowerCase() === plain);
    if (hit) ids.push(hit.id);
    else if (plain && !plain.startsWith("other")) other = plain;
  }
  return { ids: [...new Set(ids)], other };
}

export function normalizeResources(list = []) {
  const ids = [];
  for (const raw of list) {
    if (RESOURCES[raw] || raw === NOTHING_YET) { ids.push(raw); continue; }
    const plain = stripEmoji(raw);
    const hit = Object.entries(RESOURCES).find(([, r]) => r.label.toLowerCase().startsWith(plain.split("/")[0].trim()));
    if (hit) ids.push(hit[0]);
    else if (plain === "nothing yet") ids.push(NOTHING_YET);
  }
  return [...new Set(ids)];
}

/** Human-readable labels for display (profile screen, emails, mentor cards). */
export function skillLabels(profile = {}) {
  const labels = (profile.skills || []).map((id) => SKILL_BY_ID[id]?.label || id);
  if (profile.otherSkill) labels.push(profile.otherSkill);
  return labels;
}
export function resourceLabels(profile = {}) {
  const labels = (profile.resources || []).map((id) => (id === NOTHING_YET ? "Nothing yet" : RESOURCES[id]?.label || id));
  if (profile.otherResource) labels.push(profile.otherResource);
  return labels;
}

/** Domains (matching the mentor onboarding list) an entrepreneur needs help in. */
export function domainsForProfile(profile = {}) {
  const domains = (profile.skills || []).map((id) => SKILL_BY_ID[id]?.domain).filter(Boolean);
  // Learners: match mentors to the skill they want to learn.
  if (profile.learning?.dreamDomain) domains.push(profile.learning.dreamDomain);
  // Everyone starting out benefits from money/scheme help.
  domains.push("Finance");
  return [...new Set(domains)];
}