// Bite-sized business lessons for learners.
// Each lesson: 3–4 short points (read aloud with 🔊), one "try this today" task,
// and a 1–2 question quick check. Kept simple on purpose for first-time learners.

export const MODULES = [
  // ── Foundations (everyone) ───────────────────────────────────────────────
  {
    id: "money", emoji: "💰", title: "Money basics", domain: "all",
    lessons: [
      {
        id: "money-price", title: "How to price what you make",
        points: [
          "Add up the cost of materials for one piece — cloth, oil, packets, transport.",
          "Add the value of your time. Even ₹50 an hour counts — your time is not free.",
          "Add 20 to 30 percent on top as profit. That is your selling price.",
          "Check what others nearby charge. If you are much higher, explain why yours is better.",
        ],
        task: "Pick one thing you make. Write its material cost, your time, and a selling price.",
        quiz: [
          { q: "Which should be part of your price?", options: ["Only materials", "Materials + your time + profit", "Whatever the neighbour charges"], answer: 1 },
        ],
      },
      {
        id: "money-register", title: "Keep a daily money register",
        points: [
          "Use one notebook, or a voice note to yourself on WhatsApp, only for business.",
          "Every day write two lines: money that came in, money that went out.",
          "At the end of the week, add them up. In minus out is your profit.",
          "Banks ask for this record when you apply for a loan — it builds trust.",
        ],
        task: "Start your register today. Write today's date and one entry, even if it is ₹0.",
        quiz: [
          { q: "Profit for the week is…", options: ["Money in minus money out", "Only money that came in", "Money in your purse"], answer: 0 },
        ],
      },
      {
        id: "money-separate", title: "Keep home money and business money apart",
        points: [
          "Mixing household and business money hides whether you are really earning.",
          "Use a separate purse, box or bank account for the business.",
          "Pay yourself a fixed amount each week from the business, like a salary.",
          "Leave the rest in the business to buy materials for the next order.",
        ],
        task: "Choose one purse or box that will hold only business money from today.",
        quiz: [
          { q: "Why keep business money separate?", options: ["To hide it from family", "To know if the business is really earning", "Banks require two purses"], answer: 1 },
        ],
      },
    ],
  },
  {
    id: "customers", emoji: "🛍️", title: "Finding customers", domain: "all",
    lessons: [
      {
        id: "cust-first10", title: "Your first 10 customers",
        points: [
          "Your first customers are people you already know — neighbours, relatives, SHG members.",
          "Make a list of 10 names. Tell each one what you make and the price.",
          "Offer a small first-time discount or a free sample to get them to try.",
          "Ask every happy customer to tell two friends.",
        ],
        task: "Write down 10 names of people who could buy from you this month.",
        quiz: [
          { q: "Who are the easiest first customers?", options: ["Big shops in the city", "People who already know you", "Online buyers abroad"], answer: 1 },
        ],
      },
      {
        id: "cust-feedback", title: "Listen to your customers",
        points: [
          "After every sale, ask: what did you like, and what should I change?",
          "If three people say the same thing, change it.",
          "Note down who buys what, and how often.",
          "Call regular customers before festivals — they are your easiest sales.",
        ],
        task: "Ask your last customer one question about what to improve.",
        quiz: [
          { q: "When should you change your product?", options: ["Never", "When several customers say the same thing", "Every day"], answer: 1 },
        ],
      },
      {
        id: "cust-repeat", title: "Turn buyers into regulars",
        points: [
          "Keeping an old customer is cheaper than finding a new one.",
          "Offer a monthly plan, or the 6th item free after 5 purchases.",
          "Keep their number and send a short message when you have something new.",
          "Deliver on time, every time. Trust is your best advertisement.",
        ],
        task: "Think of one simple reward for customers who come back.",
        quiz: [
          { q: "What brings customers back most?", options: ["Being on time and reliable", "Changing prices often", "Long messages every day"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "digital", emoji: "📱", title: "Phone & UPI for business", domain: "all",
    lessons: [
      {
        id: "dig-upi", title: "Accept UPI payments safely",
        points: [
          "Any UPI app (BHIM, PhonePe, Google Pay, Paytm) linked to your bank account works.",
          "To RECEIVE money you never need to enter your PIN. Anyone asking you to is a cheat.",
          "Never share an OTP or PIN with anyone — not even someone saying they are from the bank.",
          "Print or save your QR code so customers can scan and pay.",
        ],
        task: "Open your UPI app and find your QR code. Save a photo of it.",
        quiz: [
          { q: "Someone says 'enter your PIN to receive ₹500'. You should…", options: ["Enter the PIN", "Refuse — receiving money never needs your PIN", "Share the OTP instead"], answer: 1 },
        ],
      },
      {
        id: "dig-whatsapp", title: "A shop on WhatsApp Business",
        points: [
          "WhatsApp Business is a free app with a business profile and a catalogue.",
          "Add your business name, timings, location and a short description.",
          "Add each product with a clear photo, price and one line about it.",
          "Use 'Status' to show new items — your contacts see it every day.",
        ],
        task: "Take one good daylight photo of your best product.",
        quiz: [
          { q: "WhatsApp Business lets you…", options: ["Show a product catalogue for free", "Get a government loan", "Avoid customers"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "schemes", emoji: "📋", title: "Loans & government schemes", domain: "all",
    lessons: [
      {
        id: "sch-mudra", title: "Mudra Shishu: your first loan",
        points: [
          "Mudra Shishu gives collateral-free loans up to ₹50,000 for small businesses.",
          "You can apply online on JanSamarth or at any bank branch.",
          "Banks want to see a simple plan: what you will buy and how you will repay.",
          "Borrow only what you need. Repaying on time makes your next loan easier.",
        ],
        task: "Write 3 lines: what you will buy with a loan, its cost, and how much you can repay each month.",
        quiz: [
          { q: "Mudra Shishu needs property as security?", options: ["Yes", "No, it is collateral-free"], answer: 1 },
        ],
      },
      {
        id: "sch-docs", title: "Keep your documents ready",
        points: [
          "Almost every scheme asks for Aadhaar, bank passbook and a photo.",
          "Make sure your Aadhaar is linked to your mobile number and bank account.",
          "Keep photocopies and phone photos of each document in one folder.",
          "Free Udyam registration gives your business an official identity.",
        ],
        task: "Check: is your Aadhaar linked to your mobile number? If not, visit an Aadhaar centre.",
        quiz: [
          { q: "Udyam registration costs…", options: ["₹5,000", "Nothing — it is free", "₹500 per year"], answer: 1 },
        ],
      },
    ],
  },

  // ── Skill tracks (one per dream domain) ──────────────────────────────────
  {
    id: "food", emoji: "🍲", title: "Food business basics", domain: "Food",
    lessons: [
      {
        id: "food-fssai", title: "FSSAI registration & hygiene",
        points: [
          "Anyone selling food needs FSSAI registration. Small home businesses need only basic registration.",
          "Cover hair, wash hands, and keep raw and cooked food apart.",
          "Store dry items in sealed containers away from the floor.",
          "Clean kitchens get repeat customers — people notice.",
        ],
        task: "List the 3 things in your kitchen you would improve for hygiene.",
        quiz: [{ q: "Selling food from home needs…", options: ["No registration", "Basic FSSAI registration"], answer: 1 }],
      },
      {
        id: "food-pack", title: "Packing and labels",
        points: [
          "A label needs: product name, weight, date made, best-before date, and your phone number.",
          "Good packing keeps food fresh and looks trustworthy in shops.",
          "Start with simple pouches and a printed sticker.",
          "Test how many days your product stays fresh before selling to shops.",
        ],
        task: "Design a label on paper for one of your products.",
        quiz: [{ q: "Which must be on a food label?", options: ["Your favourite colour", "Date made and best-before date"], answer: 1 }],
      },
    ],
  },
  {
    id: "textiles", emoji: "🧵", title: "Tailoring & textile business", domain: "Textiles",
    lessons: [
      {
        id: "tex-measure", title: "Measurements & a size chart",
        points: [
          "Write every customer's measurements in a book with their name and date.",
          "Make a simple S / M / L / XL chart for ready-made pieces.",
          "Ready-made sizes let you stitch in bulk when you have free time.",
          "Always confirm the delivery date before taking an order.",
        ],
        task: "Start a measurement book with your next customer's details.",
        quiz: [{ q: "A size chart helps you…", options: ["Stitch in bulk for ready-made sales", "Charge more"], answer: 0 }],
      },
      {
        id: "tex-bulk", title: "Taking bulk orders",
        points: [
          "Schools, offices and shops order uniforms and bags in bulk.",
          "Make 2 samples to show. Quote a per-piece price for the full order.",
          "Take 30–50 percent advance to buy cloth.",
          "If the order is big, share work with other women from your SHG.",
        ],
        task: "Name one school, shop or office near you that might need bulk stitching.",
        quiz: [{ q: "Why take an advance?", options: ["To buy material without using savings", "It is rude not to"], answer: 0 }],
      },
    ],
  },
  {
    id: "digital-work", emoji: "🖥️", title: "Earning with digital skills", domain: "Digital",
    lessons: [
      {
        id: "dw-services", title: "Services local shops need",
        points: [
          "Many shops need help with posters, menus, WhatsApp catalogues and Google Maps listings.",
          "Free tools like Canva can make posters on a phone.",
          "Charge per job at first — for example ₹200 per poster.",
          "Show 3 samples of your work to every shop you visit.",
        ],
        task: "Make one sample poster for a shop near you.",
        quiz: [{ q: "A good way to win your first client is…", options: ["Show samples of your work", "Wait for them to call"], answer: 0 }],
      },
      {
        id: "dw-csc", title: "Become a service point",
        points: [
          "Common Service Centres (CSCs) earn a fee for every government service they deliver.",
          "Village Level Entrepreneurs help people with forms, bills and certificates.",
          "You need basic computer skills, a device and internet.",
          "Ask at your nearest CSC how to register.",
        ],
        task: "Find out where your nearest CSC is.",
        quiz: [{ q: "A CSC operator earns by…", options: ["A fee per service delivered", "A government salary"], answer: 0 }],
      },
    ],
  },
  {
    id: "agri", emoji: "🌿", title: "Farm & dairy business", domain: "Agri",
    lessons: [
      {
        id: "agri-value", title: "Add value, earn more",
        points: [
          "Selling raw produce earns least. Cleaned, dried or processed products earn more.",
          "Milk → ghee or paneer. Chillies → chilli powder. Mangoes → pickle.",
          "Start with one product you already make at home.",
          "Group selling through your SHG or FPO gets better prices.",
        ],
        task: "Pick one raw product you have and one way to add value to it.",
        quiz: [{ q: "Which earns more?", options: ["Raw milk", "Ghee made from that milk"], answer: 1 }],
      },
      {
        id: "agri-direct", title: "Sell directly to homes",
        points: [
          "Weekly vegetable boxes for 10–20 homes give steady income.",
          "Fix a delivery day and a weekly price.",
          "Collect payment by UPI every week.",
          "Ask customers what they want you to grow next season.",
        ],
        task: "Write the names of 5 homes that might buy a weekly box.",
        quiz: [{ q: "A weekly box gives you…", options: ["Steady, predictable income", "No income"], answer: 0 }],
      },
    ],
  },
  {
    id: "beauty", emoji: "💅", title: "Beauty services business", domain: "Beauty",
    lessons: [
      {
        id: "beauty-card", title: "Your price card",
        points: [
          "List your 5 best services with clear prices.",
          "Show the price card to every customer before starting.",
          "Make festival and bridal packages — they bring the most money.",
          "Keep a photo record of your work, with permission.",
        ],
        task: "Write your price card for 5 services.",
        quiz: [{ q: "Which bring the biggest earnings?", options: ["Bridal & festival packages", "Single threading"], answer: 0 }],
      },
      {
        id: "beauty-hygiene", title: "Hygiene builds trust",
        points: [
          "Use clean towels for every customer and wash tools after each use.",
          "Use sealed products and check expiry dates.",
          "A neat corner with good light makes customers feel safe.",
          "Customers who trust you will bring their sisters and friends.",
        ],
        task: "Check the expiry date on every product in your kit.",
        quiz: [{ q: "Towels should be…", options: ["Shared all day", "Fresh for every customer"], answer: 1 }],
      },
    ],
  },
  {
    id: "craft", emoji: "🏺", title: "Handicraft business", domain: "Craft",
    lessons: [
      {
        id: "craft-photo", title: "Photos that sell",
        points: [
          "Take photos in daylight near a window, on a plain cloth.",
          "Show the whole piece, a close-up, and the item in use.",
          "Keep the phone steady and clean the lens first.",
          "Good photos matter more than an expensive phone.",
        ],
        task: "Photograph one product three ways: whole, close-up, in use.",
        quiz: [{ q: "Best light for product photos?", options: ["Daylight near a window", "A torch at night"], answer: 0 }],
      },
      {
        id: "craft-market", title: "Where to sell crafts",
        points: [
          "Craft fairs and melas give quick feedback on what sells.",
          "SHG members can sell online through eSARAS.",
          "Boutiques and gift shops buy in small bulk.",
          "Tell your craft's story — buyers pay more for handmade with meaning.",
        ],
        task: "Find the next craft fair or mela in your district.",
        quiz: [{ q: "Why tell your product's story?", options: ["Buyers value handmade with meaning", "It is required by law"], answer: 0 }],
      },
    ],
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));
export const LESSON_INDEX = Object.fromEntries(MODULES.flatMap((m) => m.lessons.map((l, i) => [l.id, { module: m, lesson: l, index: i }])));

/** Weekly lesson goal from "time per week" answer. */
export const weeklyGoal = (hours = "") => (hours.startsWith("10") ? 6 : hours.startsWith("5") ? 4 : 2);

/** Ordered list of modules for this learner: money first, then her dream skill, then the rest. */
export function buildPath(learning = {}) {
  const dream = MODULES.filter((m) => m.domain !== "all" && m.domain === learning.dreamDomain);
  const order = ["money", ...dream.map((m) => m.id), "customers", "digital", "schemes"];
  return order.map((id) => MODULE_BY_ID[id]).filter(Boolean);
}

/** The first lesson not yet done along the path. */
export function nextLesson(path, done = {}) {
  for (const m of path) for (const l of m.lessons) if (!done[l.id]) return { module: m, lesson: l };
  return null;
}

/** Free, official places to keep learning. */
export const FREE_TRAINING = [
  { emoji: "🏫", title: "RSETI — free residential training", detail: "Rural Self Employment Training Institutes run free courses (tailoring, beauty, dairy, food and more) with food and stay. Ask at your bank branch or block office for your district's RSETI.", url: "" },
  { emoji: "🎓", title: "Skill India Digital Hub", detail: "The government's free skilling platform with courses and digital certificates.", url: "https://www.skillindiadigital.gov.in/" },
  { emoji: "🤝", title: "Your SHG / Sanjeevini", detail: "SHG federations run entrepreneurship trainings and can connect you to bank loans.", url: "" },
];