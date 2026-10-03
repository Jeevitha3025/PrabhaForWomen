import { Router, type IRouter } from "express";
import { requireFirebaseUser, firebaseProjectId, type FirebaseUser } from "../lib/firebaseAuth";
import { emailConfigured, escapeHtml, sendEmail } from "../lib/email";

const router: IRouter = Router();

// One confirmation per user per minute – stops accidental double-sends and abuse.
const lastSent = new Map<string, number>();
const COOLDOWN_MS = 60_000;

/**
 * POST /api/mentor/submitted
 * Called by the app right after a mentor uploads verification documents.
 * The email always goes to the address on the verified Firebase token,
 * never to an address supplied in the request body.
 */
router.post("/submitted", requireFirebaseUser, async (req, res) => {
  const user = res.locals.firebaseUser as FirebaseUser;
  if (!user.email) return res.status(400).json({ error: "Your account has no email address" });
  if (!emailConfigured()) {
    req.log.warn("RESEND_API_KEY missing – skipping mentor confirmation email");
    return res.status(503).json({ error: "Email is not configured on the server" });
  }
  const now = Date.now();
  if (now - (lastSent.get(user.uid) || 0) < COOLDOWN_MS) return res.status(429).json({ error: "Please wait a minute" });
  lastSent.set(user.uid, now);

  const { name, domains, years, docCount } = req.body ?? {};
  const displayName = String(name || user.name || "there").slice(0, 80);
  const areas = Array.isArray(domains) ? domains.slice(0, 12).map(String).join(", ") : "";

  try {
    await sendEmail({
      to: user.email,
      subject: "We've received your PRABHA mentor application",
      text: [
        `Hi ${displayName},`,
        "",
        "Thank you for offering to guide women entrepreneurs on PRABHA.",
        `We've received your application${docCount ? ` and ${docCount} document(s)` : ""}.`,
        areas ? `Areas: ${areas}` : "",
        typeof years === "number" ? `Experience: ${years} years` : "",
        "",
        "Our team usually reviews applications within 2–3 working days.",
        "The app will update automatically once you're approved.",
        "",
        "— Team PRABHA",
      ].filter((l) => l !== null).join("\n"),
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:auto;color:#1f1a00">
          <div style="background:#ffda03;border-radius:16px 16px 0 0;padding:20px 24px;font-weight:900;font-size:22px;letter-spacing:.04em">PRABHA</div>
          <div style="border:2px solid #f3e3a0;border-top:0;border-radius:0 0 16px 16px;padding:24px">
            <p style="font-size:18px;margin-top:0">Hi ${escapeHtml(displayName)},</p>
            <p>Thank you for offering to guide women entrepreneurs on PRABHA. We've received your application${docCount ? ` and <strong>${Number(docCount)}</strong> document(s)` : ""}.</p>
            ${areas ? `<p><strong>Areas:</strong> ${escapeHtml(areas)}</p>` : ""}
            ${typeof years === "number" ? `<p><strong>Experience:</strong> ${Number(years)} years</p>` : ""}
            <p>Our team usually reviews applications within <strong>2–3 working days</strong>. The app will update automatically once you're approved — no need to check back.</p>
            <p style="color:#6b5b2e;margin-bottom:0">— Team PRABHA</p>
          </div>
        </div>`,
    });

    // Optional heads-up to the reviewer, with a direct link to the toggle.
    const admin = process.env.ADMIN_EMAIL;
    if (admin) {
      const link = `https://console.firebase.google.com/project/${firebaseProjectId()}/firestore/databases/-default-/data/~2Fmentors~2F${user.uid}`;
      sendEmail({
        to: admin,
        subject: `New mentor to verify: ${displayName}`,
        text: `${displayName} (${user.email}) submitted ${docCount || 0} document(s).\nAreas: ${areas}\nReview: ${link}\nSet verificationStatus to "approved" or "rejected".`,
        html: `<p><strong>${escapeHtml(displayName)}</strong> (${escapeHtml(user.email)}) submitted ${Number(docCount) || 0} document(s).</p><p>Areas: ${escapeHtml(areas)}</p><p><a href="${link}">Open in Firebase console</a> and set <code>verificationStatus</code> to <code>approved</code> or <code>rejected</code>.</p>`,
      }).catch((err) => req.log.error({ err }, "Admin notification failed"));
    }

    return res.json({ ok: true });
  } catch (err) {
    lastSent.delete(user.uid);
    req.log.error({ err }, "Mentor confirmation email failed");
    return res.status(502).json({ error: "Could not send email" });
  }
});

export default router;
