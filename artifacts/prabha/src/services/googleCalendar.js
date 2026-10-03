// Real Google Calendar for mentors, done entirely in the browser.
// Uses Google Identity Services (GIS) to get a short-lived access token
// with permission to create events on the mentor's own calendar.
// Google then emails the invite to the entrepreneur (attendee) automatically.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const SCOPE = "https://www.googleapis.com/auth/calendar.events";
const TIME_ZONE = "Asia/Kolkata";

let gisPromise = null;
let tokenClient = null;
let token = null;          // { value, expiresAt }
let pending = null;        // { resolve, reject } while the Google popup is open

export const calendarConfigured = () => Boolean(CLIENT_ID);

/** Load the Google script early (on page load) so the popup can open instantly on click. */
export function preloadGoogle() {
  if (!CLIENT_ID) return Promise.resolve(false);
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => { gisPromise = null; reject(new Error("Could not load Google sign-in")); };
      document.head.appendChild(s);
    }).then(() => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (resp) => {
          const p = pending; pending = null;
          if (resp.error) return p?.reject(new Error(resp.error_description || resp.error));
          token = { value: resp.access_token, expiresAt: Date.now() + (Number(resp.expires_in) - 60) * 1000 };
          p?.resolve(token.value);
        },
        error_callback: (err) => {
          const p = pending; pending = null;
          p?.reject(new Error(err?.type === "popup_closed" ? "Google window was closed" : "Google sign-in failed"));
        },
      });
      return true;
    });
  }
  return gisPromise;
}

export const hasValidToken = () => Boolean(token && Date.now() < token.expiresAt);

/**
 * Get an access token. MUST be called directly inside a click handler
 * (before any await) so the browser allows the Google popup.
 * @param {boolean} firstTime show the full consent screen
 */
export function getCalendarToken(firstTime = false) {
  if (hasValidToken()) return Promise.resolve(token.value);
  if (!CLIENT_ID) return Promise.reject(new Error("Google Calendar is not set up (VITE_GOOGLE_CLIENT_ID missing)"));
  if (!tokenClient) return Promise.reject(new Error("Google is still loading. Try again in a moment."));
  return new Promise((resolve, reject) => {
    pending = { resolve, reject };
    tokenClient.requestAccessToken({ prompt: firstTime ? "consent" : "" });
  });
}

export function disconnectCalendar() {
  if (token && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(token.value, () => {});
  token = null;
}

/** "2026-10-06 · 09:30" or { date, time } → start/end in IST */
function sessionTimes(request, minutes = 30) {
  let date = request.date;
  let time = request.time;
  if (!date || !time) {
    const m = String(request.slot || "").match(/(\d{4}-\d{2}-\d{2}).*?(\d{1,2}:\d{2})/);
    if (!m) throw new Error("Session has no valid date/time");
    [, date, time] = m;
  }
  const [h, min] = time.split(":").map(Number);
  const total = h * 60 + min + minutes;
  const pad = (n) => String(n).padStart(2, "0");
  const endDate = new Date(`${date}T00:00:00`);
  endDate.setDate(endDate.getDate() + Math.floor(total / 1440));
  const end = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(Math.floor((total % 1440) / 60))}:${pad(total % 60)}:00`;
  return { start: `${date}T${pad(h)}:${pad(min)}:00`, end };
}

/**
 * Creates the event on the mentor's primary calendar and invites the entrepreneur.
 * Video sessions get a Google Meet link.
 */
export async function createSessionEvent(accessToken, request) {
  const { start, end } = sessionTimes(request);
  const isVideo = request.mode === "Video";
  const how = { Phone: "Phone call", Chat: "Chat on PRABHA", Video: "Video call (Google Meet)" }[request.mode] || request.mode;
  const body = {
    summary: `PRABHA mentoring · ${request.entrepreneurName || "Entrepreneur"}`,
    description: [
      `Mentoring session booked on PRABHA.`,
      `Mentor: ${request.mentorName || ""}`,
      `Entrepreneur: ${request.entrepreneurName || ""}`,
      request.skills ? `Skills: ${request.skills}` : "",
      request.village ? `Place: ${request.village}` : "",
      `How: ${how}`,
    ].filter(Boolean).join("\n"),
    start: { dateTime: start, timeZone: TIME_ZONE },
    end: { dateTime: end, timeZone: TIME_ZONE },
    attendees: request.entrepreneurEmail ? [{ email: request.entrepreneurEmail, displayName: request.entrepreneurName }] : [],
    reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }, { method: "email", minutes: 24 * 60 }] },
    ...(isVideo ? { conferenceData: { createRequest: { requestId: `prabha-${request.id}`, conferenceSolutionKey: { type: "hangoutsMeet" } } } } : {}),
  };
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all${isVideo ? "&conferenceDataVersion=1" : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { token = null; throw new Error("Google session expired. Tap Connect again."); }
  if (!res.ok) throw new Error(data?.error?.message || `Calendar error ${res.status}`);
  return {
    calendarEventId: data.id,
    calendarLink: data.htmlLink || "",
    meetLink: data.hangoutLink || data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri || "",
  };
}