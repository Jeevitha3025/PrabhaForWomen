// Turns GPS coordinates into "Area, District, State".
// Uses two free, key-less services; the second is a fallback.

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("unsupported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  });
}

const join = (...parts) => [...new Set(parts.filter(Boolean).map((p) => String(p).trim()))].join(", ");

async function bigDataCloud(lat, lon, lang) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`bdc ${r.status}`);
  const d = await r.json();
  // administrative entries are ordered from country → smallest area
  const admin = d.localityInfo?.administrative || [];
  const district = admin.find((a) => /district/i.test(a.description || ""))?.name;
  const place = d.locality || d.city;
  const text = join(place, district || d.city, d.principalSubdivision);
  if (!text) throw new Error("bdc empty");
  return { text, city: d.city || place || "", district: district || "", state: d.principalSubdivision || "" };
}

async function nominatim(lat, lon, lang) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&lat=${lat}&lon=${lon}&accept-language=${lang}`;
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`osm ${r.status}`);
  const a = (await r.json()).address || {};
  const place = a.village || a.suburb || a.town || a.city || a.hamlet;
  const district = a.state_district || a.county || a.city_district;
  const text = join(place, district, a.state);
  if (!text) throw new Error("osm empty");
  return { text, city: a.city || a.town || place || "", district: district || "", state: a.state || "" };
}

/**
 * @returns {Promise<{ text: string, city: string, district: string, state: string, lat: number, lon: number }>}
 * Rejects with Error("denied") if the user blocks location.
 */
export async function detectPlace(lang = "en") {
  let pos;
  try { pos = await getPosition(); }
  catch (e) { throw new Error(e?.code === 1 ? "denied" : "unavailable"); }
  const lat = Number(pos.coords.latitude.toFixed(4));
  const lon = Number(pos.coords.longitude.toFixed(4));
  const l = ["hi", "kn"].includes(lang) ? lang : "en";
  for (const fn of [bigDataCloud, nominatim]) {
    try { return { ...(await fn(lat, lon, l)), lat, lon }; } catch { /* try next */ }
  }
  // Both lookups failed (offline?) – still return coordinates so nothing is lost.
  return { text: "", city: "", district: "", state: "", lat, lon };
}
