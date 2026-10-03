import { useEffect, useMemo, useRef, useState } from "react";
import { AppProvider, homeFor, useApp } from "./context/AppContext";
// @ts-ignore JavaScript modules intentionally stay swappable mock services.
import { makeTranslator, languages } from "./i18n/translations";
// @ts-ignore JavaScript modules intentionally stay swappable mock services.
import { useVoice } from "./hooks/useVoice";
// @ts-ignore JavaScript modules intentionally stay swappable quiz data.
import { quiz, quizQuestions } from "./data/quiz";
// @ts-ignore JavaScript service layer has no TS types.
import {
  bookMentorSlot,
  connectGoogleCalendar,
  getChatReply,
  getLearnerCourses,
  getMentorsForUser,
  getOpportunities,
  getRoadmap,
  getRoadmapProgress,
  getSchemes,
  listenMentorRequests,
  listenMentorStatus,
  loginUser,
  registerUser,
  respondToRequest,
  saveRoadmapProgress,
  submitMentorDocuments,
  submitReadiness,
// @ts-ignore
} from "./services/api";
// @ts-ignore
import { detectPlace } from "./services/geo";
// @ts-ignore
import { EDUCATION, EDUCATION_FOLLOWUP, FAMILY, FAMILY_FOLLOWUP, HOURS, NOTHING_YET, RESOURCES, SKILLS, resourceLabels, resourcesForSkills, skillLabels } from "./data/onboarding";
import "./index.css";

const schemesFallback: any[] = [];
const languageOptions = languages as { code: string; label: string; short: string }[];

function SpeakButton({ text, t, lang, id = "listen" }: { text: string; t: (key: string, vars?: any) => string; lang: string; id?: string }) {
  const { speak } = useVoice();
  return <button className="icon-button" type="button" aria-label={t("listen")} data-testid={`button-${id}`} onClick={() => speak(text, lang)} title={t("listen")}>🔊</button>;
}

function VoiceButton({ t, lang, onResult, id }: { t: (key: string, vars?: any) => string; lang: string; onResult: (value: string) => void; id: string }) {
  const { startListening, isListening, isSupported } = useVoice();
  if (!isSupported) return <span className="field-hint" data-testid={`hint-${id}`}>{t("voiceHint")}</span>;
  return <button className="icon-button" type="button" aria-label={t("listen")} data-testid={`button-${id}`} onClick={() => startListening(lang, onResult)}>{isListening ? "⏺️" : "🎤"}</button>;
}

function Topbar({ t, title, onBack, lang, onLanguage }: { t: any; title: string; onBack?: () => void; lang: string; onLanguage: (lang: string) => void }) {
  const { update } = useApp();
  return <header className="topbar">
    {onBack ? <button className="icon-button" type="button" data-testid="button-back" aria-label={t("back")} onClick={onBack}>←</button> : <span style={{ width: 56 }} />}
    <strong className="topbar-title">{title}</strong>
    <button className="icon-button" type="button" aria-label={t("language")} data-testid="button-language" onClick={() => { const next = lang === "en" ? "hi" : lang === "hi" ? "kn" : "en"; onLanguage(next); update({ lang: next }); }}>🌐</button>
  </header>;
}

function BottomNav({ active, t, onNavigate, role = "entrepreneur" }: { active: string; t: any; onNavigate: (screen: string) => void; role?: string }) {
  const items = role === "mentor"
    ? [["mentor-home", "📥", "mentorRequests"], ["mentees", "💬", "mentees"], ["calendar", "📅", "calendar"], ["profile", "👤", "profile"]]
    : [["home", "🏠", "home"], ["schemes", "📋", "schemes"], ["mentors", "🤝", "mentors"], ["profile", "👤", "profile"]];
  return <nav className="bottom-nav" aria-label={t("home")} data-testid="nav-bottom">{items.map(([screen, icon, key]) =>
    <button className={`nav-item ${active === screen ? "active" : ""}`} type="button" key={screen} data-testid={`nav-${screen}`} onClick={() => onNavigate(screen)}><span>{icon}</span>{t(key)}</button>)}</nav>;
}

function Shell({ children, t, title, lang, onLanguage, onBack, nav, active, onNavigate, role }: any) {
  return <div className="screen-wrap"><div className="content-width"><Topbar t={t} title={title} lang={lang} onLanguage={onLanguage} onBack={onBack} />{children}</div>{nav && <BottomNav active={active} t={t} onNavigate={onNavigate} role={role} />}</div>;
}

function Splash({ t, lang, setLang, onContinue }: any) {
  const { speak } = useVoice();
  return <main className="splash dark-surface"><div className="splash-inner">
    <div className="brand-mark">PRABHA</div><div className="brand-native">प्रभा</div><p className="tagline">{t("brandTagline")}</p><SpeakButton t={t} lang={lang} text={`${t("welcome")}. ${t("brandTagline")}`} id="splash-listen" />
    <span className="eyebrow">{t("chooseLanguage")}</span>
    <div className="language-grid">{languageOptions.map((item) => <button className={`language-pill ${lang === item.code ? "selected" : ""}`} type="button" data-testid={`button-language-${item.code}`} key={item.code} onClick={() => { setLang(item.code); speak(item.code === "hi" ? "PRABHA में आपका स्वागत है" : item.code === "kn" ? "PRABHA ಗೆ ಸ್ವಾಗತ" : "Welcome to PRABHA", item.code === "hi" ? "hi" : item.code === "kn" ? "kn" : "en"); }}>{item.label}{lang === item.code ? " ✓" : ""}</button>)}</div>
    <button className="btn btn-primary btn-wide" type="button" disabled={!lang} data-testid="button-lets-go" onClick={onContinue}>{t("letsGo")}</button>
  </div></main>;
}

function RoleScreen({ t, lang, onChoose }: any) {
  const roles = [["entrepreneur", "🌾", "entrepreneur", "entrepreneurDesc", "role-card"], ["mentor", "🤝", "mentor", "mentorDesc", "role-card mentor"], ["learner", "📚", "learner", "learnerDesc", "role-card learner"]];
  return <div className="screen-wrap"><div className="content-width"><Topbar t={t} title="PRABHA" lang={lang} onLanguage={() => undefined} /><div className="hero-card"><span className="eyebrow">{t("welcome")}</span><div className="section-heading"><h1>{t("whoAreYou")}</h1><SpeakButton t={t} lang={lang} text={t("whoAreYou")} /></div><p>{t("readyToBegin")}</p></div><div className="role-grid">{roles.map(([value, icon, title, desc, cls]) => <button className={cls} type="button" key={value} data-testid={`button-role-${value}`} onClick={() => onChoose(value)}><h2>{icon} {t(title)}</h2><p>{t(desc)}</p></button>)}</div></div></div>;
}

// ─── OTP input with auto-advance ──────────────────────────────────────────────
function OtpInput({ otp, setOtp, t }: { otp: string[]; setOtp: (v: string[]) => void; t: any }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) refs.current[index + 1]?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(next);
      refs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };
  return (
    <div className="otp-row">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          aria-label={`${t("enterOtp")} ${index + 1}`}
          data-testid={`input-otp-${index}`}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

function Login({ t, lang, role, onBack, onDone }: any) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { startListening, isSupported } = useVoice();
  const canSubmit = email.trim() && password.length >= 6 && (mode === "login" || name.trim());

  const submit = async () => {
    if (!canSubmit) {
      setError(mode === "register" ? "Fill in your name, email and a password of at least 6 characters." : "Enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = mode === "register"
        ? await registerUser({ name: name.trim(), email: email.trim(), password, role, lang })
        : await loginUser({ email: email.trim(), password, role, lang });
      onDone(result);
    } catch (err: any) {
      const code = err?.code || "";
      setError(
        code === "auth/email-already-in-use" ? "This email already has an account. Tap Sign in below."
        : ["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(code) ? "Email or password is wrong."
        : code === "auth/invalid-email" ? "That email address doesn't look right."
        : code === "auth/network-request-failed" ? "No internet connection. Check your network and try again."
        : err?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-wrap"><div className="content-width">
      <Topbar t={t} title={t("welcome")} lang={lang} onLanguage={() => undefined} onBack={onBack} />
      <div className="card">
        <span className="eyebrow">{mode === "register" ? "Create your account" : "Welcome back"}</span>
        {mode === "register" && (
          <div className="field">
            <label htmlFor="name">{t("yourName")}</label>
            <div className="input-with-action">
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" data-testid="input-name" />
              {isSupported && <button className="icon-button" type="button" aria-label={t("yourName")} onClick={() => startListening(lang, setName)}>🎤</button>}
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" data-testid="input-email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoComplete={mode === "register" ? "new-password" : "current-password"} data-testid="input-password" />
        </div>
        {error && <div className="error-note" role="alert">{error}</div>}
        <button className="btn btn-primary btn-wide" type="button" disabled={loading || !canSubmit} onClick={submit} data-testid="button-auth-submit">
          {loading ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
        </button>
        <p className="muted small" style={{ marginTop: 12, textAlign: "center" }}>
          {mode === "register" ? "Already have an account? " : "New here? "}
          <button className="btn-link" type="button"
            style={{ background: "none", border: "none", color: "#8a6100", cursor: "pointer", textDecoration: "underline", padding: 0, font: "inherit", fontWeight: 800 }}
            onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}>
            {mode === "register" ? "Sign in" : "Create account"}
          </button>
        </p>
        <p className="field-hint" style={{ marginTop: 10 }}>🔒 {t("consent")}</p>
      </div>
    </div></div>
  );
}

// ─── Multi-select chips with a working "Other (specify)" option ──────────────
type Option = { id: string; label: string; emoji?: string };
function OptionGrid({ options, selected, onChange, otherValue, onOtherChange, otherLabel = "Other (specify)", otherPlaceholder = "Type it here", exclusiveId, testPrefix }: {
  options: Option[]; selected: string[]; onChange: (ids: string[]) => void;
  otherValue?: string; onOtherChange?: (text: string) => void; otherLabel?: string; otherPlaceholder?: string;
  exclusiveId?: string; testPrefix: string;
}) {
  const allowOther = typeof onOtherChange === "function";
  const [otherOpen, setOtherOpen] = useState(Boolean(otherValue));
  const otherRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (otherOpen) otherRef.current?.focus(); }, [otherOpen]);

  const toggle = (id: string) => {
    if (selected.includes(id)) return onChange(selected.filter((s) => s !== id));
    if (id === exclusiveId) { onOtherChange?.(""); setOtherOpen(false); return onChange([id]); }
    onChange([...selected.filter((s) => s !== exclusiveId), id]);
  };
  const toggleOther = () => {
    if (otherOpen) { setOtherOpen(false); onOtherChange?.(""); return; }
    setOtherOpen(true);
    if (exclusiveId && selected.includes(exclusiveId)) onChange(selected.filter((s) => s !== exclusiveId));
  };

  return <>
    <div className="chip-grid">
      {options.map((o) => <button key={o.id} type="button" className={`chip ${selected.includes(o.id) ? "selected" : ""}`}
        aria-pressed={selected.includes(o.id)} data-testid={`${testPrefix}-${o.id}`} onClick={() => toggle(o.id)}>
        {o.emoji ? `${o.emoji} ` : ""}{o.label}</button>)}
      {allowOther && <button type="button" className={`chip ${otherOpen ? "selected" : ""}`} aria-pressed={otherOpen}
        aria-expanded={otherOpen} data-testid={`${testPrefix}-other`} onClick={toggleOther}>✍️ {otherLabel}</button>}
    </div>
    {allowOther && otherOpen && <div className="field other-field">
      <input ref={otherRef} value={otherValue || ""} maxLength={40} placeholder={otherPlaceholder}
        aria-label={otherLabel} data-testid={`${testPrefix}-other-input`} onChange={(e) => onOtherChange!(e.target.value)} />
      <span className="field-hint">{(otherValue || "").length}/40</span>
    </div>}
  </>;
}

// ─── Single-choice cards (education, family, follow-ups) ─────────────────────
function ChoiceGroup({ label, options, value, onChange, testPrefix }: { label: string; options: Option[]; value?: string; onChange: (id: string) => void; testPrefix: string }) {
  return <div className="field" role="radiogroup" aria-label={label}>
    <label>{label}</label>
    <div className="choice-grid">{options.map((o) => <button key={o.id} type="button" role="radio" aria-checked={value === o.id}
      className={`choice-card ${value === o.id ? "selected" : ""}`} data-testid={`${testPrefix}-${o.id}`} onClick={() => onChange(o.id)}>{o.label}</button>)}</div>
  </div>;
}

function EntrepreneurOnboarding({ t, lang, profile, onBack, onDone }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({
    skills: [], otherSkill: "", location: "", locationMeta: null, hours: "", resources: [], otherResource: "",
    education: "", schoolLevel: "", collegeLevel: "", literacy: "", family: "", familyHelp: "", story: "",
    ...profile,
  });
  const [geo, setGeo] = useState<"idle" | "loading" | "done" | "nameless" | "denied" | "error">(form.location ? "done" : "idle");
  const set = (patch: any) => setForm((cur: any) => ({ ...cur, ...patch }));

  const resourceOptions = useMemo(
    () => [...resourcesForSkills(form.skills).map((id: string) => ({ id, ...RESOURCES[id] })), { id: NOTHING_YET, label: "Nothing yet" }],
    [form.skills],
  );
  // Drop resources that no longer apply if the skills changed.
  const visibleResources = form.resources.filter((id: string) => resourceOptions.some((o: any) => o.id === id));

  const eduFollow = EDUCATION_FOLLOWUP[form.education];
  const famFollow = FAMILY_FOLLOWUP[form.family];
  const eduDone = form.education && (!eduFollow || form[eduFollow.key]);

  const canNext = [
    form.skills.length > 0 || form.otherSkill.trim().length > 1,
    form.location.trim().length > 1,
    Boolean(form.hours),
    visibleResources.length > 0 || form.otherResource.trim().length > 1,
    eduDone && form.family && (!famFollow || form[famFollow.key]),
  ][step - 1];

  const detect = async () => {
    setGeo("loading");
    try {
      const place = await detectPlace(lang);
      set({ location: place.text || form.location, locationMeta: { lat: place.lat, lon: place.lon, city: place.city, district: place.district, state: place.state } });
      setGeo(place.text ? "done" : "nameless");
    } catch (e: any) {
      setGeo(e?.message === "denied" ? "denied" : "error");
    }
  };

  const next = () => {
    if (!canNext) return;
    if (step < 5) return setStep(step + 1);
    onDone({ ...form, otherSkill: form.otherSkill.trim(), otherResource: form.otherResource.trim(), resources: visibleResources, location: form.location.trim() });
  };
  const back = () => (step > 1 ? setStep(step - 1) : onBack());
  const headings = ["chooseSkills", "village", "hours", "resources", "tellMore"];
  const pickedSkills = skillLabels(form);

  return <div className="screen-wrap"><div className="content-width">
    <Topbar t={t} title={t("completeProfile")} lang={lang} onLanguage={() => undefined} onBack={back} />
    <div className="progress-dots">{[1, 2, 3, 4, 5].map((item) => <span key={item} className={`progress-dot ${item < step ? "done" : item === step ? "active" : ""}`} />)}</div>
    <p className="muted">{t("step", { n: step, total: 5 })}</p>
    <div className="card">
      <div className="section-heading"><h2>{t(headings[step - 1])}</h2><SpeakButton t={t} lang={lang} text={t(headings[step - 1])} id="onboarding-listen" /></div>

      {step === 1 && <>
        <p className="muted">{t("chooseSkillsHint")}</p>
        <OptionGrid testPrefix="chip-skill" options={SKILLS} selected={form.skills} onChange={(skills) => set({ skills })}
          otherValue={form.otherSkill} onOtherChange={(otherSkill) => set({ otherSkill })} otherPlaceholder="e.g. Pickle making, Candle making" />
      </>}

      {step === 2 && <div className="field">
        <label htmlFor="village">{t("village")}</label>
        <div className="input-with-action">
          <input id="village" value={form.location} placeholder="e.g. Yelahanka, Bengaluru"
            onChange={(e) => { set({ location: e.target.value }); if (geo !== "loading") setGeo("idle"); }} data-testid="input-village" />
          <button className="btn btn-outline" type="button" data-testid="button-detect-location" disabled={geo === "loading"} onClick={detect}>
            📍 {geo === "loading" ? "Finding…" : t("detectLocation")}</button>
        </div>
        <span className="field-hint" data-testid="status-location" aria-live="polite">{{
          idle: "Type your village, town or district — or tap Detect.",
          loading: "Finding your place…",
          done: t("locationCaptured"),
          nameless: "We found your position but not the place name. Please type it.",
          denied: "Location is blocked. Allow it in your browser settings, or type your place.",
          error: t("locationDenied"),
        }[geo]}</span>
      </div>}

      {step === 3 && <div className="segmented">{HOURS.map((item: string) => <button className={`chip ${form.hours === item ? "selected" : ""}`} type="button" key={item}
        data-testid={`button-hours-${item}`} onClick={() => set({ hours: item })}>{item}</button>)}</div>}

      {step === 4 && <>
        {pickedSkills.length > 0 && <p className="muted">For {pickedSkills.join(", ")} — pick everything you can use.</p>}
        <OptionGrid testPrefix="chip-resource" options={resourceOptions} selected={visibleResources} exclusiveId={NOTHING_YET}
          onChange={(resources) => set({ resources })} otherValue={form.otherResource} onOtherChange={(otherResource) => set({ otherResource })}
          otherLabel="Something else" otherPlaceholder="e.g. Shop space, Bullock cart" />
      </>}

      {step === 5 && <>
        <ChoiceGroup label={t("education")} testPrefix="choice-education" options={EDUCATION} value={form.education}
          onChange={(education) => set({ education, schoolLevel: "", collegeLevel: "", literacy: "" })} />
        {eduFollow && <ChoiceGroup label={eduFollow.question} testPrefix={`choice-${eduFollow.key}`} options={eduFollow.options}
          value={form[eduFollow.key]} onChange={(v) => set({ [eduFollow.key]: v })} />}
        {eduDone && <ChoiceGroup label={t("family")} testPrefix="choice-family" options={FAMILY} value={form.family}
          onChange={(family) => set({ family, familyHelp: "" })} />}
        {famFollow && <ChoiceGroup label={famFollow.question} testPrefix={`choice-${famFollow.key}`} options={famFollow.options}
          value={form[famFollow.key]} onChange={(v) => set({ [famFollow.key]: v })} />}
        {eduDone && form.family && (!famFollow || form[famFollow.key]) && <div className="field">
          <label htmlFor="story">{t("tellMore")} <span className="field-hint">(optional)</span></label>
          <div className="input-with-action">
            <textarea id="story" value={form.story} placeholder={t("tellMoreHint")} onChange={(e) => set({ story: e.target.value })} data-testid="input-story" />
            <VoiceButton t={t} lang={lang} id="voice-story" onResult={(value) => set({ story: `${form.story} ${value}`.trim() })} />
          </div>
        </div>}
      </>}

      <button className="btn btn-primary btn-wide" style={{ marginTop: 20 }} type="button" disabled={!canNext} data-testid="button-onboarding-next" onClick={next}>
        {step === 5 ? t("findOpportunity") : t("next")}</button>
    </div></div></div>;
}

function OpportunityFinder({ t, lang, profile, onBack, onOpen }: any) {
  const [loading, setLoading] = useState(true); const [items, setItems] = useState<any[]>([]); const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => { getOpportunities(profile).then(setItems).finally(() => setLoading(false)); }, [profile]);
  useEffect(() => { if (!loading) return undefined; const timer = window.setInterval(() => setMessageIndex((current) => (current + 1) % 4), 800); return () => window.clearInterval(timer); }, [loading]);
  if (loading) return <main className="screen-wrap dark-surface"><div className="content-width loading-stage"><div><span className="loading-emoji">🔍</span><h1>{t("opportunityFinder")}</h1><p>{t(["analysing", "checkingDemand", "matchingSchemes", "opportunitiesReady"][messageIndex])}</p></div></div></main>;
  return <Shell t={t} title={t("opportunityFinder")} lang={lang} onLanguage={() => undefined} onBack={onBack}><p className="muted">{t("opportunityFinderHint")}</p><div className="section" style={{ display: "grid", gap: 14 }}>{items.map((item, index) => <div className={`card opportunity-card ${index === 0 ? "best" : index === 1 ? "good" : "warm"}`} key={item.id} data-testid={`card-opportunity-${item.rank}`}><div className="opportunity-body"><div className="opportunity-title"><div className="rank">{item.rank}</div><div><h3>{item.emoji} {item.name}</h3><p className="muted">{item.desc}</p></div></div><div className="stat-grid"><div className="stat"><strong>{item.startup}</strong><span>to start</span></div><div className="stat"><strong>{item.time}</strong><span>time</span></div><div className="stat"><strong>{item.demand}</strong><span>demand</span></div></div><p className="scheme-line">✓ {item.whyFits[0]}</p><p className="scheme-line">📋 {item.scheme}</p><button className="btn btn-secondary btn-wide" type="button" data-testid={`button-explore-${item.rank}`} onClick={() => onOpen(item)}>{t("explore")}</button></div></div>)}</div></Shell>;
}

function OpportunityDetail({ t, lang, opportunity, profile, onBack, onQuiz, onChat, onBook, onApply }: any) {
  const steps = useMemo(() => getRoadmap(opportunity, profile), [opportunity, profile]);
  const [done, setDone] = useState<string[]>([]);
  const [mentor, setMentor] = useState<any>(null);
  useEffect(() => { getRoadmapProgress(opportunity.id).then(setDone).catch(() => undefined); }, [opportunity.id]);
  useEffect(() => { getMentorsForUser(profile, { lang, focusDomain: opportunity.domain }).then((list: any[]) => setMentor(list[0] || null)); }, [opportunity.domain, profile, lang]);
  const toggleStep = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
    setDone(next);
    saveRoadmapProgress(opportunity.id, next).catch(() => undefined);
  };
  const nextId = steps.find((s: any) => !done.includes(s.id))?.id;
  const pct = Math.round((steps.filter((s: any) => done.includes(s.id)).length / steps.length) * 100);

  return <Shell t={t} title={`${opportunity.emoji} ${opportunity.name}`} lang={lang} onLanguage={() => undefined} onBack={onBack}>
    <div className="card tint-card"><h2>{t("whyFits")}</h2><ul className="list">{opportunity.whyFits.map((reason: string) => <li key={reason}><span>✓</span>{reason}</li>)}</ul></div>

    <div className="section card">
      <div className="section-heading"><h2>Your roadmap</h2><SpeakButton t={t} lang={lang} text={steps.map((s: any, i: number) => `${i + 1}. ${s.title}`).join(". ")} id="roadmap-listen" /></div>
      <div className="progress-bar" aria-label={`${pct}% done`}><span style={{ width: `${pct}%` }} /></div>
      <ol className="roadmap">{steps.map((s: any) => {
        const isDone = done.includes(s.id);
        return <li key={s.id} className={`roadmap-step ${isDone ? "done" : s.id === nextId ? "next" : ""}`}>
          <button type="button" className="roadmap-check" aria-pressed={isDone} aria-label={isDone ? `Mark "${s.title}" as not done` : `Mark "${s.title}" as done`}
            data-testid={`roadmap-${s.id}`} onClick={() => toggleStep(s.id)}>{isDone ? "✓" : ""}</button>
          <div><strong>{s.title}</strong><p className="muted small">{s.detail}</p>{s.tag && <span className="roadmap-tag">{s.tag}</span>}</div>
        </li>;
      })}</ol>
    </div>

    <div className="section card"><h2>{t("matchedMentor")}</h2>
      {mentor ? <>
        <p>{mentor.avatar} <strong>{mentor.name}</strong>{mentor.isSample && <span className="tag" style={{ marginLeft: 8 }}>Sample</span>}</p>
        <p className="muted">{mentor.domainText} · {mentor.languageText} · {t("years", { n: mentor.years })}</p>
        {mentor.reasons?.length > 0 && <p className="small">🤝 {mentor.reasons.join(" · ")}</p>}
        <div className="button-row"><button className="btn btn-outline" type="button" data-testid="button-message-mentor" onClick={() => onChat("message")}>💬 {t("message")}</button><button className="btn btn-primary" type="button" data-testid="button-book-detail" onClick={() => onBook(mentor)}>📅 {t("book")}</button></div>
      </> : <p className="muted">Finding a mentor for you…</p>}
    </div>

    <div className="section card scheme-card"><h2>📋 {opportunity.scheme}</h2><span className="tag">{t("indicative")}</span><h3>{t("checklist")}</h3><ul className="list">{["Aadhaar card", "Bank details", "Simple business plan"].map((item) => <li key={item}>☐ {item}</li>)}</ul><button className="btn btn-primary btn-wide" type="button" data-testid="button-apply-detail" onClick={onApply}>{t("apply")}</button></div>
    <div className="section card"><div className="section-heading"><h2>📊 {t("readiness")}</h2><SpeakButton t={t} lang={lang} text={t("readiness")} /></div><p className="muted">{t("readinessHint")}</p><button className="btn btn-secondary btn-wide" type="button" data-testid="button-start-quiz-detail" onClick={onQuiz}>{t("startQuizCaps")}</button></div>
    <div className="section hero-card"><p>🛒 {t("esarasBanner")}</p></div>
  </Shell>;
}

function Home({ t, lang, profile, score, onOpportunity, onQuiz, onChat, onNavigate }: any) {
  const name = profile.name || "friend";
  return <Shell t={t} title={t("home")} lang={lang} onLanguage={() => undefined} nav active="home" onNavigate={onNavigate}><div className="hero-card"><span className="eyebrow">{t("readyToBegin")}</span><h1>{t("hello", { name })}</h1><p>{t("nextStepText")}</p><button className="btn btn-primary" type="button" style={{ marginTop: 18 }} data-testid="button-ask-prabha" onClick={onChat}>🎤 {t("askPrabha")}</button></div><div className="section card tint-card"><div className="section-heading"><h2>{t("yourOpportunities")}</h2><span>🌾</span></div><p className="muted">{t("opportunityFinderHint")}</p><button className="btn btn-secondary btn-wide" type="button" data-testid="button-opportunity-finder" onClick={onOpportunity}>{t("opportunityFinder")} →</button></div><div className="section card"><div className="score-layout"><div className="score-ring">{score ?? "—"}</div><div><h2 style={{ margin: 0 }}>{t("readiness")}</h2><p className="muted">{t("readinessHint")}</p></div></div><button className="btn btn-outline btn-wide" type="button" data-testid="button-start-quiz-home" onClick={onQuiz}>{t("startQuiz")}</button></div><div className="section card"><span className="eyebrow">{t("nextStep")}</span><p>{t("nextStepText")}</p></div></Shell>;
}

function Schemes({ t, lang, onNavigate, onChat, onBack, onApply }: any) {
  const [items, setItems] = useState<any[]>(schemesFallback);
  useEffect(() => { getSchemes().then(setItems); }, []);
  return <Shell t={t} title={t("schemes")} lang={lang} onLanguage={() => undefined} onBack={onBack} nav active="schemes" onNavigate={onNavigate}><p className="muted">{t("schemesHint")}</p><button className="btn btn-secondary btn-wide" type="button" data-testid="button-ask-yojana" onClick={onChat}>📋 {t("askYojana")}</button><div className="section" style={{ display: "grid", gap: 12 }}>{items.map((scheme) => <div className="card scheme-card" key={scheme.id} data-testid={`card-scheme-${scheme.id}`}><h2>{scheme.emoji} {scheme.name}</h2><p className="benefit">{scheme.benefit}</p><span className="tag">{t("indicative")}</span><p className="muted small">{t("documents")}: {scheme.docs.join(" · ")}</p><button className="btn btn-primary" type="button" data-testid={`button-apply-${scheme.id}`} onClick={() => onApply(scheme)}>{t("apply")}</button></div>)}</div></Shell>;
}

function MentorList({ t, lang, profile, onNavigate, onBack, onSelect }: any) {
  const [mentors, setMentors] = useState<any[] | null>(null);
  useEffect(() => { getMentorsForUser(profile, { lang }).then(setMentors); }, [profile, lang]);
  return <Shell t={t} title={t("mentors")} lang={lang} onLanguage={() => undefined} onBack={onBack} nav active="mentors" onNavigate={onNavigate}>
    <p className="muted">{t("mentorHint")}</p>
    {mentors?.[0]?.isSample && <p className="field-hint">These are sample mentors. Verified mentors appear here once approved.</p>}
    <div className="section" style={{ display: "grid", gap: 12 }}>
      {mentors === null && <p className="muted">Matching mentors to your skills…</p>}
      {mentors?.map((mentor, i) => <button className="card" style={{ textAlign: "left" }} type="button" key={mentor.id} data-testid={`card-mentor-${mentor.id}`} onClick={() => onSelect(mentor)}>
        <div className="opportunity-title"><span style={{ fontSize: "2rem" }}>{mentor.avatar}</span><div>
          <h2 style={{ margin: 0 }}>{mentor.name}{i === 0 && mentor.reasons.length > 0 && <span className="tag" style={{ marginLeft: 8 }}>Best match</span>}</h2>
          <p className="muted">{mentor.domainText}</p>
          <p className="small">{mentor.languageText} · {t("years", { n: mentor.years })}</p>
          {mentor.reasons.length > 0 && <p className="small">🤝 {mentor.reasons.join(" · ")}</p>}
        </div></div>
      </button>)}
    </div>
  </Shell>;
}

function Booking({ t, mentor, me, onClose, onBooked }: any) {
  const today = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const modes = (mentor.modes?.length ? mentor.modes : ["Phone", "Chat", "Video"]).filter((m: string) => ["Phone", "Chat", "Video"].includes(m));
  const [mode, setMode] = useState(modes[0] || "Phone"); const [slot, setSlot] = useState(mentor.slots[0]); const [date, setDate] = useState(today); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const submit = async () => {
    setBusy(true); setError("");
    try { const booking = await bookMentorSlot(mentor, { slot: `${date} · ${slot}`, mode }, me); onBooked(booking); }
    catch (e: any) { setError(e?.message || "Could not send the request. Try again."); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card"><div className="section-heading"><h2>{t("book")} · {mentor.name}</h2><button className="icon-button" type="button" data-testid="button-close-booking" aria-label={t("close")} onClick={onClose}>×</button></div><p className="muted">{t("sessionType")}</p><div className="choice-grid">{[["Phone", "📞"], ["Chat", "💬"], ["Video", "📹"]].filter(([v]) => modes.includes(v)).map(([value, icon]) => <button className={`choice-card ${mode === value ? "selected" : ""}`} type="button" key={value} data-testid={`choice-mode-${value}`} onClick={() => setMode(value)}>{icon} {t(value === "Phone" ? "phoneCall" : value.toLowerCase())}</button>)}</div><div className="field"><label htmlFor="date">{t("chooseDate")}</label><input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} data-testid="input-booking-date" /></div><div className="field"><label>{t("chooseTime")}</label><div className="button-row">{mentor.slots.map((value: string) => <button className={`btn ${slot === value ? "btn-primary" : "btn-outline"}`} type="button" key={value} data-testid={`button-slot-${value}`} onClick={() => setSlot(value)}>{value}</button>)}</div></div>{error && <div className="error-note" role="alert">{error}</div>}<button className="btn btn-primary btn-wide" type="button" disabled={busy} data-testid="button-confirm-booking" onClick={submit}>{busy ? "…" : t("confirmBooking")}</button></div></div>;
}

function Quiz({ t, lang, onClose, onResult, onLearning }: any) {
  const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<number[]>([]); const [score, setScore] = useState<number | null>(null); const q = quiz[index];
  const choose = async (value: number) => { const next = [...answers, value]; if (index < quiz.length - 1) { setAnswers(next); setIndex(index + 1); } else { const result = await submitReadiness(next); setAnswers(next); setScore(result.score); onResult(result.score); } };
  return <div className="modal-backdrop"><div className="modal-card" style={{ maxHeight: "92dvh", overflow: "auto" }}>{score === null ? <><div className="section-heading"><h2>{t("quizQuestion", { n: index + 1 })}</h2><button className="icon-button" type="button" data-testid="button-close-quiz" aria-label={t("close")} onClick={onClose}>×</button></div><div className="progress-bar"><span style={{ width: `${((index + 1) / 10) * 100}%` }} /></div><div className="section-heading" style={{ marginTop: 22 }}><h2>{quizQuestions[lang][index]}</h2><SpeakButton t={t} lang={lang} text={quizQuestions[lang][index]} id="quiz-listen" /></div><div style={{ display: "grid", gap: 10 }}>{(q.options[lang] as string[]).map((option: string, optionIndex: number) => <button className="choice-card" style={{ minHeight: 70 }} type="button" key={option} data-testid={`quiz-option-${index}-${optionIndex}`} onClick={() => choose(q.scores[optionIndex])}>{option}</button>)}</div></> : <QuizResult t={t} score={score} onClose={onClose} onLearning={onLearning} />}</div></div>;
}

function QuizResult({ t, score, onClose, onLearning }: any) {
  const ready = score >= 75; const almost = score >= 50;
  return <><div className={`card ${ready ? "status-approved" : almost ? "tint-card" : "status-rejected"}`}><div className="score-layout"><div className="score-ring">{score}</div><div><span className="eyebrow">{t("score")}</span><h2>{ready ? t("youreReady") : almost ? t("almostReady") : t("goodStart")}</h2></div></div></div>{ready ? <><p>{t("esarasBanner")}</p><button className="btn btn-primary btn-wide" type="button" data-testid="button-list-esaras" onClick={() => onClose("esAras")}>{t("listEsaras")}</button></> : almost ? <><h3>{t("retake")}</h3><ul className="list"><li>✓ {t("actionOne")}</li><li>✓ {t("actionTwo")}</li><li>✓ {t("actionThree")}</li></ul><button className="btn btn-outline btn-wide" type="button" data-testid="button-close-quiz-result" onClick={onClose}>{t("close")}</button></> : <><p>{t("actionOne")}</p><button className="btn btn-primary btn-wide" type="button" data-testid="button-start-learning" onClick={onLearning}>{t("startLearning")}</button></>}</>;
}

function Chat({ t, lang, onClose }: any) {
  const [messages, setMessages] = useState([{ from: "bot", text: t("chatWelcome") }]); const [input, setInput] = useState(""); const [typing, setTyping] = useState(false); const { startListening, speak } = useVoice();
  const send = async (text = input) => { if (!text.trim()) return; setMessages((current) => [...current, { from: "user", text }]); setInput(""); setTyping(true); const reply = await getChatReply(text, messages, lang); setMessages((current) => [...current, { from: "bot", text: reply }]); setTyping(false); };
  return <div className="chat-overlay"><div className="chat-panel"><div className="chat-header"><h2>📋 {t("chatTitle")}</h2><button className="icon-button" type="button" data-testid="button-close-chat" aria-label={t("close")} onClick={onClose}>×</button></div><div className="chat-messages">{messages.map((message, index) => <div className={`bubble ${message.from}`} key={`${message.text}-${index}`} data-testid={`message-${index}`}>{message.text}{message.from === "bot" && <button className="icon-button" style={{ display: "block", marginTop: 8 }} type="button" data-testid={`button-listen-message-${index}`} aria-label={t("listen")} onClick={() => speak(message.text, lang)}>🔊</button>}</div>)}{typing && <div className="typing">{t("typing")}</div>}</div><div className="suggestions">{[["loan", "loan"], ["whichScheme", "whichScheme"], ["registration", "registration"]].map(([key, query]) => <button className="suggestion" type="button" key={key} data-testid={`button-suggestion-${key}`} onClick={() => send(query)}>{t(key)}</button>)}</div><div className="chat-input"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("typeMessage")} data-testid="input-chat" onKeyDown={(e) => e.key === "Enter" && send()} /><button className="icon-button" type="button" data-testid="button-voice-chat" aria-label={t("listen")} onClick={() => startListening(lang, setInput)}>🎤</button><button className="icon-button" type="button" data-testid="button-send-chat" aria-label={t("submit")} onClick={() => send()}>➤</button></div></div></div>;
}

// ─── MentorOnboarding ─────────────────────────────────────────────────────────
function MentorOnboarding({ t, lang, user, onBack, onDone }: any) {
  const [name, setName] = useState(user?.name || "");
  const [domains, setDomains] = useState<string[]>([]);
  const [spoken, setSpoken] = useState<string[]>([lang]);
  const [years, setYears] = useState(4);
  const [files, setFiles] = useState<File[]>([]);
  const [modes, setModes] = useState<string[]>(["Phone"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const toggle = (list: string[], value: string, setter: any) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const missing = !name.trim() ? "your name" : !domains.length ? "at least one area" : !spoken.length ? "a language" : !modes.length ? "how you can help" : "";
  const submit = async () => {
    if (missing) { setError(`Add ${missing} to continue.`); return; }
    setBusy(true); setError("");
    try {
      const result = await submitMentorDocuments(files, { name: name.trim(), domains, spoken, years, modes });
      onDone(result);
    } catch (e: any) {
      setError(e?.code === "storage/unauthorized" ? "Upload was blocked. Check Firebase Storage rules." : e?.message || "Could not submit. Try again.");
    } finally { setBusy(false); }
  };
  const allDomains = ["Food", "Textiles", "Health", "Agri", "Digital", "Finance", "Legal", "Logistics", "Craft", "Beauty", "Education", "Other"];
  return <div className="screen-wrap"><div className="content-width"><Topbar t={t} title={t("mentorOnboarding")} lang={lang} onLanguage={() => undefined} onBack={onBack} />
    <div className="card">
      <div className="field"><label htmlFor="mentor-name">{t("mentorName")}</label><input id="mentor-name" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-mentor-name" /></div>
      <div className="field"><label>{t("domain")} <span className="field-hint">(select all that apply)</span></label>
        <div className="chip-grid">{allDomains.map((item: string) => <button className={`chip ${domains.includes(item) ? "selected" : ""}`} type="button" key={item} data-testid={`chip-domain-${item}`} onClick={() => toggle(domains, item, setDomains)}>{item}</button>)}</div>
      </div>
      <div className="field"><label>{t("experience")}: <strong>{years} yrs</strong></label>
        <div className="years-stepper">
          <button className="icon-button" type="button" aria-label="Fewer years" data-testid="button-years-down" onClick={() => setYears(Math.max(0, years - 1))}>−</button>
          <span className="years-display">{years}</span>
          <button className="icon-button" type="button" aria-label="More years" data-testid="button-years-up" onClick={() => setYears(Math.min(40, years + 1))}>+</button>
        </div>
      </div>
      <div className="field"><label>{t("spokenLanguages")}</label>
        <div className="chip-grid">{languageOptions.map((item) => <button className={`chip ${spoken.includes(item.code) ? "selected" : ""}`} type="button" key={item.code} data-testid={`button-spoken-${item.code}`} onClick={() => toggle(spoken, item.code, setSpoken)}>{item.label}</button>)}</div>
      </div>
      <div className="field"><label>{t("helpMode")} <span className="field-hint">(select all that apply)</span></label>
        <div className="chip-grid">{[["Phone", "📞 Phone Call"], ["Chat", "💬 Text Chat"], ["Video", "📹 Video Call"], ["In-Person", "🤝 In-Person"], ["Group", "👥 Group Session"]].map(([value, label]) =>
          <button className={`chip ${modes.includes(value) ? "selected" : ""}`} type="button" key={value} data-testid={`choice-help-${value}`} onClick={() => toggle(modes, value, setModes)}>{label}</button>)}
        </div>
      </div>
      <div className="field"><label htmlFor="mentor-files">{t("uploadDocuments")}</label>
        <p className="field-hint">{t("uploadHint")}</p>
        <input id="mentor-files" type="file" accept="image/*,.pdf" multiple data-testid="input-mentor-files" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        {files.map((file) => <div className="file-preview" key={file.name}>📄 {file.name}</div>)}
      </div>
      {error && <div className="error-note" role="alert" style={{ marginTop: 14 }}>{error}</div>}
      <button className="btn btn-primary btn-wide" style={{ marginTop: 20 }} type="button" disabled={busy} data-testid="button-submit-verification" onClick={submit}>{busy ? "Uploading…" : t("submitVerification")}</button>
    </div>
  </div></div>;
}

// ─── MentorPendingPreview: shows what approved state will look like ────────────
function MentorPendingPreview({ t, user }: any) {
  const [showPreview, setShowPreview] = useState(false);
  if (showPreview) {
    return (
      <div className="card status-approved" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>👁️ Preview: After Approval</h3>
          <button className="btn btn-outline" style={{ minHeight: 36, padding: "6px 14px" }} type="button" onClick={() => setShowPreview(false)}>Close preview</button>
        </div>
        <div className="card tint-card" style={{ marginBottom: 12 }}>
          <span className="eyebrow">Mentor</span>
          <h2>{t("hello", { name: user.name })}</h2>
          <p>Welcome to PRABHA! You can now receive and accept mentee requests.</p>
        </div>
        <div className="card" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: "0 0 8px" }}>📥 Incoming Requests</h3>
          <div className="card" style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "0 0 4px" }}>👩🏽 Kavya</h4>
            <p className="muted small">Mandya · Food products · Phone</p>
            <div className="button-row" style={{ marginTop: 8 }}>
              <button className="btn btn-primary" style={{ minHeight: 40 }} type="button">Accept</button>
              <button className="btn btn-outline" style={{ minHeight: 40 }} type="button">Decline</button>
            </div>
          </div>
        </div>
        <p className="field-hint">⬆️ This is what you'll see once verified. Your bottom nav will also unlock with Mentees, Calendar & Profile tabs.</p>
      </div>
    );
  }
  return (
    <button className="btn btn-outline btn-wide" style={{ marginTop: 12 }} type="button" onClick={() => setShowPreview(true)}>
      👁️ Preview: What happens after approval?
    </button>
  );
}

function MentorHome({ t, lang, user, onNavigate, onBack, initialTab = "mentor-home" }: any) {
  const [tab, setTab] = useState(initialTab);
  const [requests, setRequests] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [calendar, setCalendar] = useState(false);
  // Live: flips the moment an admin edits mentors/{uid}.verificationStatus in the console.
  useEffect(() => listenMentorStatus(setStatus), []);
  useEffect(() => (status === "approved" ? listenMentorRequests(setRequests) : undefined), [status]);
  useEffect(() => setTab(initialTab), [initialTab]);
  const respond = (id: string, next: string) => respondToRequest(id, next).catch(() => undefined);

  if (status === null) return <Shell t={t} title={t("mentor")} lang={lang} onLanguage={() => undefined} onBack={onBack}><p className="muted">Checking your status…</p></Shell>;

  if (status === "none") return <Shell t={t} title={t("mentorOnboarding")} lang={lang} onLanguage={() => undefined} onBack={onBack}>
    <div className="card"><h2>Finish your mentor application</h2><p>Upload your documents so we can verify you.</p>
      <button className="btn btn-primary btn-wide" type="button" onClick={() => onBack("mentor-onboarding")}>Continue</button></div>
  </Shell>;

  if (status !== "approved") return <Shell t={t} title={t("verificationPending")} lang={lang} onLanguage={() => undefined} onBack={onBack}>
    <div className={`card status-${status}`}>
      <div style={{ fontSize: "3rem" }}>{status === "rejected" ? "🙏" : "🕊️"}</div>
      <h2>{status === "rejected" ? t("verificationRejected") : t("verificationPending")}</h2>
      <p>{t("verificationCopy")}</p>
      {status === "pending" && <p className="field-hint">This page updates by itself once you're approved — no need to refresh.</p>}
      {status === "rejected" && <button className="btn btn-primary" type="button" data-testid="button-upload-again" onClick={() => onBack("mentor-onboarding")}>{t("uploadAgain")}</button>}
    </div>
    {status === "pending" && <MentorPendingPreview t={t} user={user} />}
  </Shell>;

  const open = requests.filter((r) => r.status === "requested");
  const accepted = requests.filter((r) => r.status === "accepted");
  return <Shell t={t} title={t(tab === "mentor-home" ? "mentorRequests" : tab)} lang={lang} onLanguage={() => undefined} nav active={tab} onNavigate={(next: string) => { setTab(next); onNavigate(next); }} role="mentor">
    <div className="card tint-card"><span className="eyebrow">{t("mentor")} ✓</span><h2>{t("hello", { name: user.name })}</h2><p>{t("readyToBegin")}</p></div>
    {tab === "mentor-home" && <div className="section" style={{ display: "grid", gap: 12 }}>
      {open.length === 0 && <div className="card empty"><span className="emoji">📥</span><p>No new requests yet. Entrepreneurs whose skills match yours will see you first.</p></div>}
      {open.map((r) => <div className="card" key={r.id} data-testid={`card-request-${r.id}`}>
        <h2>👩🏽 {r.entrepreneurName || "Entrepreneur"}</h2>
        <p className="muted">{[r.village, r.skills, r.mode].filter(Boolean).join(" · ")}</p>
        <p className="small">📅 {r.slot}</p>
        <div className="button-row">
          <button className="btn btn-primary" type="button" data-testid={`button-accept-${r.id}`} onClick={() => respond(r.id, "accepted")}>{t("accept")}</button>
          <button className="btn btn-outline" type="button" data-testid={`button-decline-${r.id}`} onClick={() => respond(r.id, "declined")}>{t("decline")}</button>
        </div>
      </div>)}
    </div>}
    {tab === "mentees" && <div className="section" style={{ display: "grid", gap: 12 }}>
      {accepted.length === 0 ? <div className="card empty"><span className="emoji">💬</span><p>{t("mentorHint")}</p></div>
        : accepted.map((r) => <div className="card" key={r.id}><h2>👩🏽 {r.entrepreneurName}</h2><p className="muted">{[r.village, r.skills].filter(Boolean).join(" · ")}</p><p className="small">📅 {r.slot} · {r.mode}</p></div>)}
    </div>}
    {tab === "calendar" && <div className="section"><div className="card">{calendar ? <p className="benefit">{t("calendarConnected")}</p> : <button className="btn btn-primary btn-wide" type="button" data-testid="button-connect-calendar" onClick={() => connectGoogleCalendar().then(() => setCalendar(true))}>📅 {t("calendarConnect")}</button>}</div><div className="card section"><h2>{t("upcoming")}</h2>{accepted.length ? accepted.map((r) => <p key={r.id}>📅 {r.slot} — {r.entrepreneurName} ({r.mode})</p>) : <p className="muted">{t("emptyBookings")}</p>}</div></div>}
  </Shell>;
}

function LearnerOnboarding({ t, lang, onBack, onDone }: any) {
  const [step, setStep] = useState(1); const [form, setForm] = useState<Record<string, string>>({}); const choose = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const lists = step === 1 ? [["homemaker", "🏠"], ["student", "📚"], ["dailyWage", "🌾"], ["employed", "💼"]] : step === 2 ? [["Food", "🍲"], ["Textiles", "🧵"], ["Digital", "📱"], ["Agri", "🌿"], ["Beauty", "💅"], ["Craft", "🏺"]] : step === 3 ? [["<5 hrs", "⏳"], ["5–10 hrs", "🕰️"], ["10+ hrs", "🌞"]] : [["video", "📹"], ["audio", "🎧"], ["reading", "📖"], ["live", "👩🏽‍🏫"]];
  const title = step === 1 ? "currentSituation" : step === 2 ? "dreamDomain" : step === 3 ? "hours" : "learningStyle";
  return <div className="screen-wrap"><div className="content-width"><Topbar t={t} title={t("learnerOnboarding")} lang={lang} onLanguage={() => undefined} onBack={onBack} /><div className="progress-dots">{[1, 2, 3, 4].map((item) => <span key={item} className={`progress-dot ${item < step ? "done" : item === step ? "active" : ""}`} />)}</div><div className="card"><div className="section-heading"><h2>{t(title)}</h2><SpeakButton t={t} lang={lang} text={t(title)} /></div><div className="choice-grid">{lists.map(([value, icon]) => <button className={`choice-card ${form[title] === value ? "selected" : ""}`} type="button" key={value} data-testid={`choice-learner-${value}`} onClick={() => choose(title, value)}>{icon} {t(value) || value}</button>)}</div><button className="btn btn-primary btn-wide" type="button" data-testid="button-learner-next" onClick={() => step < 4 ? setStep(step + 1) : onDone(form)}>{step === 4 ? t("learningPath") : t("next")}</button></div></div></div>;
}

function LearningPath({ t, lang, onBack, onNavigate }: any) {
  const [courses, setCourses] = useState<any[]>([]); useEffect(() => { getLearnerCourses().then(setCourses); }, []);
  return <Shell t={t} title={t("learningPath")} lang={lang} onLanguage={() => undefined} onBack={onBack} nav active="home" onNavigate={onNavigate} role="learner"><div className="hero-card"><span className="eyebrow">{t("learner")}</span><h1>{t("learningPath")}</h1><p>{t("readyToBegin")}</p></div><div className="section course-grid">{courses.map((course) => <div className="card course-card" key={course.title}><span className="course-emoji">{course.emoji}</span><div><h2 style={{ margin: 0 }}>{course.title}</h2><p className="muted">{t("minutes", { n: course.duration })}</p></div><button className="btn btn-primary" type="button" data-testid={`button-start-course-${course.title}`} onClick={() => undefined}>{t("start")}</button></div>)}</div></Shell>;
}

function Profile({ t, lang, user, profile, role, onLanguage, onLogout, onBack, onEdit }: any) {
  const [confirm, setConfirm] = useState(false);
  return <Shell t={t} title={t("profile")} lang={lang} onLanguage={() => undefined} onBack={onBack}><div className="card tint-card"><div style={{ fontSize: "3rem" }}>👩🏽</div><h2>{user?.name}</h2><p className="muted">{user?.email}</p><p><strong>{t(role)}</strong></p></div><div className="section card"><h2>{t("language")}</h2><div className="button-row">{languageOptions.map((item) => <button className={`btn ${lang === item.code ? "btn-primary" : "btn-outline"}`} type="button" key={item.code} data-testid={`button-profile-language-${item.code}`} onClick={() => onLanguage(item.code)}>{item.label}{lang === item.code ? " ✓" : ""}</button>)}</div></div>{role === "entrepreneur" && <div className="section card"><h2>{t("savedData")}</h2><p><strong>{t("location")}:</strong> {profile.location || "—"}</p><p><strong>{t("skills")}:</strong> {skillLabels(profile).join(", ") || "—"}</p><p><strong>{t("resourcesLabel")}:</strong> {resourceLabels(profile).join(", ") || "—"}</p><button className="btn btn-outline btn-wide" type="button" data-testid="button-edit-profile" onClick={onEdit}>Edit my answers</button></div>}<button className="btn btn-secondary btn-wide" type="button" data-testid="button-logout" onClick={() => setConfirm(true)}>{t("signOut")}</button>{confirm && <div className="modal-backdrop"><div className="modal-card"><h2>{t("logoutConfirm")}</h2><div className="button-row"><button className="btn btn-outline" type="button" data-testid="button-cancel-logout" onClick={() => setConfirm(false)}>{t("cancel")}</button><button className="btn btn-secondary" type="button" data-testid="button-confirm-logout" onClick={onLogout}>{t("logoutYes")}</button></div></div></div>}</Shell>;
}

function Main() {
  const { state, update, logout } = useApp(); const t = useMemo(() => makeTranslator(state.lang), [state.lang]); const [chat, setChat] = useState(false); const [quizOpen, setQuizOpen] = useState(false); const [apply, setApply] = useState<any>(null); const [bookingMentor, setBookingMentor] = useState<any>(null); const [toast, setToast] = useState("");
  const setScreen = (screen: string) => update({ screen });
  const setLang = (lang: string) => update({ lang });
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const nav = (screen: string) => setScreen(screen);
  const handleHome = () => setScreen(homeFor(state.role, state.profile));
  const onboardingFor = (role: string) => (role === "mentor" ? "mentor-onboarding" : role === "learner" ? "learner-onboarding" : "entrepreneur-onboarding");
  const renderScreen = () => {
    switch (state.screen) {
      case "splash": return <Splash t={t} lang={state.lang} setLang={setLang} onContinue={() => setScreen("role")} />;
      case "role": return <RoleScreen t={t} lang={state.lang} onChoose={(role: string) => update({ role, screen: "login" })} />;
      case "login": return <Login t={t} lang={state.lang} role={state.role} onBack={() => setScreen("role")} onDone={({ user, profile, isNew }: any) => update({ user, role: user.role, profile, screen: isNew ? onboardingFor(user.role) : homeFor(user.role, profile) })} />;
      case "entrepreneur-onboarding": return <EntrepreneurOnboarding t={t} lang={state.lang} profile={state.profile} onBack={() => (state.profile?.skills?.length ? handleHome() : setScreen("login"))} onDone={(profile: any) => update({ profile, screen: "opportunity-finder" })} />;
      case "opportunity-finder": return <OpportunityFinder t={t} lang={state.lang} profile={state.profile} onBack={() => setScreen("home")} onOpen={(opportunity: any) => update({ opportunity, screen: "opportunity-detail" })} />;
      case "opportunity-detail": return state.opportunity ? <OpportunityDetail t={t} lang={state.lang} opportunity={state.opportunity} profile={state.profile} onBack={() => setScreen("opportunity-finder")} onQuiz={() => setQuizOpen(true)} onChat={() => setChat(true)} onBook={(mentor: any) => setBookingMentor(mentor)} onApply={() => setApply(state.opportunity.scheme)} /> : null;
      case "home": return <Home t={t} lang={state.lang} profile={{ ...state.user, ...state.profile }} score={state.readinessScore} onOpportunity={() => setScreen("opportunity-finder")} onQuiz={() => setQuizOpen(true)} onChat={() => setChat(true)} onNavigate={nav} />;
      case "schemes": return <Schemes t={t} lang={state.lang} onNavigate={nav} onBack={handleHome} onChat={() => setChat(true)} onApply={setApply} />;
      case "mentors": return <MentorList t={t} lang={state.lang} profile={state.profile} onNavigate={nav} onBack={handleHome} onSelect={setBookingMentor} />;
      case "profile": return <Profile t={t} lang={state.lang} user={state.user} profile={state.profile} role={state.role} onLanguage={setLang} onLogout={logout} onBack={handleHome} onEdit={() => setScreen("entrepreneur-onboarding")} />;
      case "mentor-onboarding": return <MentorOnboarding t={t} lang={state.lang} user={state.user} onBack={() => setScreen("mentor-home")} onDone={(result: any) => { notify(result.emailSent ? "Submitted! We've emailed you a confirmation." : "Submitted! We'll review your documents soon."); setScreen("mentor-home"); }} />;
      case "mentor-home": case "mentees": case "calendar": return <MentorHome t={t} lang={state.lang} user={state.user} initialTab={state.screen} onNavigate={nav} onBack={(screen = "login") => (typeof screen === "string" ? setScreen(screen) : setScreen("login"))} />;
      case "learner-onboarding": return <LearnerOnboarding t={t} lang={state.lang} onBack={() => setScreen("login")} onDone={(learning: any) => update({ profile: { ...state.profile, learning }, screen: "learning-path" })} />;
      case "learning-path": return <LearningPath t={t} lang={state.lang} onBack={() => setScreen("login")} onNavigate={nav} />;
      default: return <Splash t={t} lang={state.lang} setLang={setLang} onContinue={() => setScreen("role")} />;
    }
  };
  if (!state.authReady) return <main className="screen-wrap dark-surface"><div className="content-width loading-stage"><div><div className="brand-mark">PRABHA</div><p>Loading your profile…</p></div></div></main>;
  return <div className="prabha-app">{renderScreen()}{state.role === "entrepreneur" && ["home", "schemes", "mentors", "profile", "opportunity-detail"].includes(state.screen) && <button className="floating-chat bounce-chat" type="button" data-testid="button-floating-chat" aria-label={t("chatTitle")} onClick={() => setChat(true)}>📋</button>}{chat && <Chat t={t} lang={state.lang} onClose={() => setChat(false)} />}{quizOpen && <Quiz t={t} lang={state.lang} onClose={(action?: string) => { setQuizOpen(false); if (action === "esAras") setApply(t("officialPortal")); }} onResult={(score: number) => update({ readinessScore: score })} onLearning={() => { setQuizOpen(false); setScreen("learner-onboarding"); }} />}{bookingMentor && <Booking t={t} mentor={bookingMentor} me={{ name: state.user?.name, profile: state.profile }} onClose={() => setBookingMentor(null)} onBooked={(b: any) => { setBookingMentor(null); notify(b.sample ? "This is a sample mentor — requests go to real, verified mentors." : t("bookingSuccess")); }} />}{apply && <div className="modal-backdrop"><div className="modal-card"><h2>{t("applyPortal")}</h2><p>{typeof apply === "string" ? apply : t("officialPortal")}</p><div className="button-row"><button className="btn btn-outline" type="button" data-testid="button-close-apply" onClick={() => setApply(null)}>{t("later")}</button><button className="btn btn-primary" type="button" data-testid="button-open-portal" onClick={() => { setApply(null); notify(t("applyPortal")); }}>{t("officialPortal")}</button></div></div></div>}{toast && <div className="toast" role="status" data-testid="status-toast">{toast}</div>}</div>;
}

export default function App() {
  return <AppProvider><Main /></AppProvider>;
}
