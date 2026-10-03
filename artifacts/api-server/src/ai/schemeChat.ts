import { retrieveSchemes } from "./rag.js";
import { generateWithGemini } from "./llm.js";

type UserProfile = {
  location?: string;
  businessStage?: string;
  skill?: string;
};

type SchemeChatResult = {
  answer: string;
  schemes: Array<{
    name: string;
    benefit: string;
    sourceUrl: string;
  }>;
};

export async function answerSchemeQuestion(
  message: string,
  profile?: UserProfile
): Promise<SchemeChatResult> {
const retrievalQuery = await generateWithGemini(`
Convert the following user question into a short English search query
for finding relevant Indian government schemes.

Keep only the important meaning: business type, support needed,
loan/subsidy/training, location, or target group.

If the question is already in English, return it as a short search query.

Return ONLY the search query. No explanation.

User question:
${message}
`);

const retrievedSchemes = retrieveSchemes(retrievalQuery, 3);
const isKannada = /[\u0C80-\u0CFF]/.test(message);

const responseLanguage = isKannada
  ? "Kannada"
  : "English";
  if (retrievedSchemes.length === 0) {
    return {
      answer:
        "I couldn't find a relevant government scheme in my current database. Please tell me more about your business, skill, location, or what kind of support you need.",
      schemes: [],
    };
  }

  const schemeContext = retrievedSchemes
    .map(
      (scheme, index) => `
SCHEME ${index + 1}

Name:
${scheme.name}

Categories:
${scheme.categories.join(", ")}

Target users:
${scheme.targetUsers.join(", ")}

Benefit:
${scheme.benefit}

Eligibility:
${scheme.eligibility.join("; ")}

Documents:
${scheme.documents.join("; ")}

Official source:
${scheme.sourceUrl}
`
    )
    .join("\n-------------------------\n");

  const profileContext = `
User location: ${profile?.location || "Not provided"}
Business stage: ${profile?.businessStage || "Not provided"}
Skill/business area: ${profile?.skill || "Not provided"}
`;

 const prompt = `
You are Yojana Mitra, a friendly government-scheme assistant
for rural women entrepreneurs in India.

Your job is to explain schemes in a VERY SIMPLE and CONCISE way.

USER PROFILE:
${profileContext}

USER QUESTION:
${message}
RESPONSE LANGUAGE:
${responseLanguage}

The response MUST be written entirely in ${responseLanguage}.
Do not use English if the response language is Kannada.
Do not explain the language choice.
RETRIEVED SCHEME INFORMATION:
${schemeContext}

IMPORTANT RULES:

1. Use ONLY the retrieved scheme information.
2. Never invent scheme names, benefits, amounts, eligibility,
   documents, deadlines or URLs.
3. Never say the user is definitely eligible.
4. If final eligibility depends on additional conditions,
   say that it needs to be verified with the official authority
   or participating institution.
5. Do not ask the user for Aadhaar numbers, OTPs, passwords,
   bank passwords or other sensitive information.
6. Do NOT reproduce all the retrieved information.
7. Give only the information that directly answers the question.
8. Keep the response under 120 words.
9. Use simple everyday language suitable for a first-time entrepreneur.
10. Do NOT use Markdown.
11. Do NOT use headings with #.
12. Do NOT use **bold** syntax.
13. Use short paragraphs and simple bullet points using "•".
14. Mention at most 2 or 3 relevant schemes.
15. Clearly tell the user which scheme appears most relevant
    based on the information provided, without claiming eligibility.
16. End with ONE simple next-step question when appropriate.
17. Answer in the same language as the user's question.
    If the user asks in Kannada, answer completely in Kannada.
    If the user asks in English, answer in English.


Now answer the user's question.
`;

  const answer = await generateWithGemini(prompt);

  return {
    answer,
    schemes: retrievedSchemes.map((scheme) => ({
      name: scheme.name,
      benefit: scheme.benefit,
      sourceUrl: scheme.sourceUrl,
    })),
  };
}