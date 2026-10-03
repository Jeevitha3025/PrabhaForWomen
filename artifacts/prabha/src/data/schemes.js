// Government schemes with their OFFICIAL portals (checked Oct 2026).
// applyUrl  = where the application is actually made
// infoUrl   = official scheme page / guidelines
// statusUrl = where an applicant logs in to check status (often same as applyUrl)
// mode      = "online" | "online-or-bank" | "offline"

export const SCHEMES = [
  {
    id: "mudra", emoji: "💰", name: "PM Mudra Yojana (Shishu)", benefit: "Collateral-free loan, Shishu up to ₹50,000",
    who: "Anyone starting or running a small non-farm business",
    mode: "online-or-bank",
    applyUrl: "https://www.jansamarth.in/", applyLabel: "Apply on JanSamarth",
    statusUrl: "https://www.jansamarth.in/",
    infoUrl: "https://www.mudra.org.in/",
    docs: ["Aadhaar card", "PAN card (if you have one)", "Bank passbook / account details", "Passport-size photo", "Short note on your business & how you'll use the loan", "Quotation for machines or stock you'll buy"],
    steps: [
      "Open JanSamarth and choose Business Activity Loan → Mudra",
      "Check eligibility by answering a few questions",
      "Register with your mobile number and Aadhaar",
      "Fill the form and upload your documents",
      "Pick a bank from the list shown and submit",
      "Track status on JanSamarth; the bank may call you",
    ],
    note: "You can also apply directly at any bank branch — ask for a PMMY / Mudra Shishu form.",
  },
  {
    id: "vishwakarma", emoji: "🛠️", name: "PM Vishwakarma", benefit: "Loan up to ₹3 lakh, toolkit support & free training",
    who: "Traditional artisans – tailors, potters, weavers, garland makers and more",
    mode: "online",
    applyUrl: "https://pmvishwakarma.gov.in/", applyLabel: "Open PM Vishwakarma portal",
    statusUrl: "https://pmvishwakarma.gov.in/",
    infoUrl: "https://pmvishwakarma.gov.in/",
    docs: ["Aadhaar card linked to your mobile", "Bank account details", "Ration card (if you have one)", "Proof of your trade, if asked"],
    steps: [
      "Visit your nearest Common Service Centre (CSC) — registration is done there",
      "Complete Aadhaar and mobile verification at the CSC",
      "Fill in your trade and family details",
      "Gram Panchayat / ULB verifies your trade",
      "District and state committees approve",
      "Get your PM Vishwakarma certificate & ID, then attend skill training",
    ],
    note: "Registration is free at CSCs. Status can be checked by logging in on the portal.",
  },
  {
    id: "pmegp", emoji: "🏭", name: "PMEGP", benefit: "15–35% subsidy on project cost for a new unit",
    who: "Anyone 18+ setting up a NEW manufacturing or service unit",
    mode: "online",
    applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp", applyLabel: "Open PMEGP e-portal",
    statusUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    infoUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    docs: ["Aadhaar card", "PAN card", "Project report", "Caste / special category certificate (if applicable)", "Education certificate (8th pass for bigger projects)", "Bank details"],
    steps: [
      "On the PMEGP e-portal, click Apply under 'Application for New Unit'",
      "Fill the online form and choose your district & preferred bank",
      "Upload your project report and documents, then submit",
      "Attend the interview with the District Task Force Committee",
      "Bank appraises and sanctions your loan",
      "Complete the free EDP training (needed before subsidy release)",
    ],
    note: "Save the application ID shown after submission — you need it to log in and track.",
  },
  {
    id: "pmfme", emoji: "🥣", name: "PMFME", benefit: "35% subsidy (up to ₹10 lakh) for food processing units",
    who: "Micro food businesses – pickles, papad, millets, spices, bakery etc.",
    mode: "online",
    applyUrl: "https://pmfme.mofpi.gov.in/", applyLabel: "Open PMFME portal",
    statusUrl: "https://pmfme.mofpi.gov.in/",
    infoUrl: "https://pmfme.mofpi.gov.in/",
    docs: ["Aadhaar card", "PAN card", "Bank statement (6 months)", "Photo of your unit", "Quotation for machinery", "Udyam / FSSAI registration (if available)"],
    steps: [
      "Register on the PMFME portal with your mobile number",
      "Ask for a free District Resource Person (DRP) — they help prepare your project report",
      "Fill the application and upload documents",
      "District committee recommends it to the bank",
      "Bank sanctions the loan; subsidy is credited after disbursement",
    ],
    note: "The District Resource Person's help is free — use it.",
  },
  {
    id: "udyogini", emoji: "🌱", name: "Udyogini (Karnataka)", benefit: "Subsidised bank loan for women entrepreneurs",
    who: "Women in Karnataka, 18–55 years, from low-income families",
    mode: "offline",
    applyUrl: "https://kswdc.karnataka.gov.in/21/udyogini/en", applyLabel: "Open official scheme page",
    statusUrl: "",
    infoUrl: "https://kswdc.karnataka.gov.in/21/udyogini/en",
    docs: ["Aadhaar card", "Income certificate", "Caste certificate (if applicable)", "Address proof", "Bank passbook", "Passport-size photos", "Quotation for what you'll buy"],
    steps: [
      "Collect the application form from the CDPO / WCD Deputy Director office in your taluk",
      "Fill it in and attach your documents",
      "Submit it at the same office",
      "Attend the selection / EDP training if called",
      "Bank sanctions the loan; KSWDC releases the subsidy to the bank",
    ],
    note: "This is an offline scheme — there's no online status. Keep your submission receipt.",
  },
  {
    id: "standup", emoji: "🚀", name: "Stand-Up India", benefit: "Bank loan ₹10 lakh – ₹1 crore for a new enterprise",
    who: "Women and SC/ST entrepreneurs starting a new (greenfield) business",
    mode: "online-or-bank",
    applyUrl: "https://www.standupmitra.in/", applyLabel: "Open Stand-Up Mitra",
    statusUrl: "https://www.standupmitra.in/",
    infoUrl: "https://www.standupmitra.in/",
    docs: ["Aadhaar & PAN", "Business plan / project report", "Address proof", "Bank statements", "Quotations for machinery", "Lease / rent agreement for premises"],
    steps: [
      "Register on Stand-Up Mitra and answer the questions",
      "Choose whether you need handholding support",
      "Submit your loan application to a bank",
      "Bank reviews your project and may visit",
      "Loan is sanctioned and disbursed",
    ],
    note: "",
  },
  {
    id: "nrlm", emoji: "🤲", name: "DAY-NRLM (SHG support)", benefit: "Revolving fund, low-interest SHG loans & training",
    who: "Rural women who are or want to be part of a Self-Help Group",
    mode: "offline",
    applyUrl: "https://nrlm.gov.in/", applyLabel: "Open DAY-NRLM site",
    statusUrl: "",
    infoUrl: "https://nrlm.gov.in/",
    docs: ["Aadhaar card", "SHG membership details", "Bank account (SHG and personal)"],
    steps: [
      "Join an SHG in your village — ask the Gram Panchayat or block NRLM office",
      "Attend regular SHG meetings and save together",
      "SHG gets a revolving fund after grading",
      "Apply for an SHG bank loan through your group",
      "Use the loan for your business and repay through the group",
    ],
    note: "Once in an SHG, you can also sell your products on eSARAS (esaras.in).",
  },
];

export const STAGES = [
  { id: "interested", label: "Interested",          emoji: "⭐" },
  { id: "documents",  label: "Gathering documents", emoji: "📂" },
  { id: "applied",    label: "Applied",             emoji: "📨" },
  { id: "review",     label: "Under review",        emoji: "🔎" },
  { id: "approved",   label: "Approved",            emoji: "🎉" },
  { id: "rejected",   label: "Not approved",        emoji: "↩️" },
];
export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]));

export const SCHEME_BY_ID = Object.fromEntries(SCHEMES.map((s) => [s.id, s]));

/** Match free text like "Mudra Shishu (up to ₹50,000)" to a scheme. */
export function findScheme(text = "") {
  const t = String(text).toLowerCase();
  const rules = [["mudra", "mudra"], ["vishwakarma", "vishwakarma"], ["pmegp", "pmegp"], ["pmfme", "pmfme"],
    ["udyogini", "udyogini"], ["stand", "standup"], ["nrlm", "nrlm"]];
  const hit = rules.find(([k]) => t.includes(k));
  return hit ? SCHEME_BY_ID[hit[1]] : null;
}

export const ESARAS_URL = "https://www.esaras.in/";