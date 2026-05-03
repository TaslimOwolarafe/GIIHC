"use client";

import {
  LOGO_DATA_URL,
  PHOTO_BASHIR, PHOTO_OLUWAGBEMI, PHOTO_SIMEON, PHOTO_MUSAB,
  PHOTO_AJIDAHUN, PHOTO_GEORGE, PHOTO_RAE, PHOTO_KELECHI,
// @ts-ignore
} from "../lib/photos";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  RefObject,
} from "react";

/* ─── Types ─────────────────────────────────── */
type Step = "form" | "card" | "done";

/* ─── Venue ──────────────────────────────────── */
const VENUE_LABEL = "OAK Park Conference Hall, ICT Center, OAU";
const VENUE_MAPS_URL = "https://maps.google.com/?q=OAK+Park+Conference+Hall+ICT+Center+Obafemi+Awolowo+University+Ile-Ife";

/* ─── Tiny icon helpers ──────────────────────── */
const Icon = {
  Camera: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Upload: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Share: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Flip: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

/* ─── Attendance card (the image that gets downloaded) ─── */
function AttendanceCard({
  name,
  photo,
  cardRef,
}: {
  name: string;
  photo: string | null;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const FONT = "system-ui, -apple-system, Arial, sans-serif";
  return (
    <div
      ref={cardRef}
      style={{
        width: 520,
        background: "linear-gradient(160deg, #0C180D 0%, #071209 100%)",
        borderRadius: 24,
        overflow: "hidden",
        fontFamily: FONT,
        position: "relative",
      }}
    >
      {/* Top accent stripe */}
      <div style={{ height: 5, background: "linear-gradient(90deg, #6FCF4A 0%, #3EC9BE 50%, #F5C518 100%)" }} />

      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(111,207,74,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(62,201,190,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ padding: "28px 32px 26px" }}>
        {/* Header: logo + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={LOGO_DATA_URL}
              alt="GIHC Logo"
              style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 6, background: "#000" }}
              crossOrigin="anonymous"
            />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: "white", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
                Great <span style={{ color: "#3EC9BE" }}>IFE</span>{" "}
                <span style={{ color: "#F5C518", fontWeight: 700 }}>2026</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "1.2px", textTransform: "uppercase", marginTop: 2 }}>
                International Health Conference
              </div>
            </div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #3EC9BE, #6FCF4A)",
            borderRadius: 100, padding: "6px 16px",
            fontSize: 11, fontWeight: 800, color: "#071209", letterSpacing: "1px", fontFamily: FONT,
          }}>
            ✓ I&apos;LL BE THERE
          </div>
        </div>

        {/* Person */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #3EC9BE, #6FCF4A)", padding: 3,
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#0C180D", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
              ) : (
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                </svg>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#3EC9BE", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>Attending as</div>
            <div style={{
              fontSize: name.length > 22 ? 20 : name.length > 16 ? 24 : 28,
              fontWeight: 800, color: "white", lineHeight: 1.15,
              letterSpacing: "-0.5px", wordBreak: "break-word", fontFamily: FONT,
            }}>
              {name}
            </div>
          </div>
        </div>

        {/* Mind & Machine topic pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 10, padding: "8px 14px", marginBottom: 16,
        }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>🧠</span>
          <div style={{ fontFamily: FONT }}>
            <span style={{ fontWeight: 700, color: "#a78bfa", fontSize: 11 }}>The Mind &amp; The Machine: </span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Mental Health-Tech</span>
          </div>
        </div>

        {/* Event details pill */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "14px 18px", marginBottom: 16,
          display: "flex", gap: 20,
        }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4, fontFamily: FONT }}>Date</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: FONT }}>Thursday, 7th May 2026</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4, fontFamily: FONT }}>Venue</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: FONT }}>{VENUE_LABEL}</div>
          </div>
        </div>

        {/* Theme */}
        <div style={{
          background: "rgba(62,201,190,0.06)", border: "1px solid rgba(62,201,190,0.15)",
          borderRadius: 12, padding: "11px 16px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 9, color: "#3EC9BE", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 4, fontFamily: FONT }}>Theme</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontFamily: FONT }}>
            Surviving to Succeed: Addressing Health, Well-being, and Welfare Challenges in the Student Environment
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500, fontFamily: FONT }}>@greatife_su · #GIHC2026</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: FONT }}>Office of the Welfare Officer, GISU · OAU</div>
        </div>
      </div>
    </div>
  );
}

/* ─── PersonCard with auto height (no truncation) ─── */
function PersonCard({ photo, name, role, tag, tagColor, tagBg, tagBorder, accent }: {
  photo: string; name: string; role: string; tag: string;
  tagColor: string; tagBg: string; tagBorder: string; accent: string;
}) {
  return (
    <div style={{
      background: "rgba(17,28,18,0.95)", border: `1px solid ${accent}30`,
      borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column",
      height: "100%", // Fill grid cell height
    }}>
      {/* Photo area - fixed height, image covers it nicely */}
      <div style={{
        position: "relative",
        height: 240,
        background: `linear-gradient(160deg, ${accent}18 0%, #0a1a0b 100%)`,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <img
          src={photo}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(17,28,18,0.95) 0%, transparent 100%)" }} />
        {/* Tag badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 100,
          background: tagBg, color: tagColor, border: `1px solid ${tagBorder}`,
          letterSpacing: "0.8px", textTransform: "uppercase", backdropFilter: "blur(8px)",
          zIndex: 2,
        }}>
          {tag}
        </div>
      </div>

      {/* Content area - NO truncation, full text displayed */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontWeight: 800, color: "white", fontSize: 15, lineHeight: 1.3 }}>{name}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5, whiteSpace: "normal", wordWrap: "break-word" }}>
          {role}
        </div>
        <div style={{ marginTop: 6, height: 2, width: 32, borderRadius: 2, background: accent }} />
      </div>
    </div>
  );
}

/* ─── Conference Info Section ─── */
function ConferenceInfo() {
  const people = [
    {
      photo: PHOTO_BASHIR, name: "Dr. Bashir Agboola",
      role: "DBA, MBA, CHOO, CDH-E, FACHDM · Forbes Tech Council Member · Managing Partner, Interdym Rutgers, The State University of New Jersey, USA",
      tag: "Keynote Speaker", tagColor: "#6FCF4A", tagBg: "rgba(111,207,74,0.15)", tagBorder: "rgba(111,207,74,0.4)", accent: "#6FCF4A",
    },
    {
      photo: PHOTO_OLUWAGBEMI, name: "Dr. Oluwagbemi",
      role: "Consultant, Family Physician at Iwosan Lagoon Hospitals · Fellow of the Faculty of Family Medicine",
      tag: "Guest Speaker", tagColor: "#3EC9BE", tagBg: "rgba(62,201,190,0.15)", tagBorder: "rgba(62,201,190,0.4)", accent: "#3EC9BE",
    },
    {
      photo: PHOTO_SIMEON, name: "Prof. Simeon Adebayo Bamire",
      role: "Vice-Chancellor, Obafemi Awolowo University, Ile-Ife",
      tag: "Chief Host", tagColor: "#F5C518", tagBg: "rgba(245,197,24,0.15)", tagBorder: "rgba(245,197,24,0.4)", accent: "#F5C518",
    },
    {
      photo: PHOTO_MUSAB, name: "Shuaib-Osunleke Musiab",
      role: "Welfare Officer, Great Ife Students' Union",
      tag: "Convener", tagColor: "#ff9f43", tagBg: "rgba(255,159,67,0.15)", tagBorder: "rgba(255,159,67,0.4)", accent: "#ff9f43",
    },
    {
      photo: PHOTO_AJIDAHUN, name: "Dr. Ajidahun Olusina",
      role: "The Bearded Dr Sina · Award-winning Doctor, Internal Medicine Physician · Head of Medical Board, Jane · Co-founder, PRIV",
      tag: "Panelist", tagColor: "#a78bfa", tagBg: "rgba(167,139,250,0.15)", tagBorder: "rgba(167,139,250,0.4)", accent: "#a78bfa",
    },
    {
      photo: PHOTO_GEORGE, name: "Dr. George Uchendu",
      role: "TheTalkDoctor · Medical Doctor · Multimedia Personality · Award-Winning Master of Ceremonies",
      tag: "Panelist", tagColor: "#a78bfa", tagBg: "rgba(167,139,250,0.15)", tagBorder: "rgba(167,139,250,0.4)", accent: "#a78bfa",
    },
    {
      photo: PHOTO_RAE, name: "Rae Timzy",
      role: "5th-year Medical Student · Recognized Content Creator",
      tag: "Panelist", tagColor: "#a78bfa", tagBg: "rgba(167,139,250,0.15)", tagBorder: "rgba(167,139,250,0.4)", accent: "#a78bfa",
    },
    {
      photo: PHOTO_KELECHI, name: "Dr. Kelechi Okoro",
      role: "The Healthertainer · Founder, Heal for Africa Initiative",
      tag: "Panelist", tagColor: "#a78bfa", tagBg: "rgba(167,139,250,0.15)", tagBorder: "rgba(167,139,250,0.4)", accent: "#a78bfa",
    },
  ];

  const schedule = [
    { day: "Day 1", title: "Arrival & Networking", items: ["Arrival of keynote speakers, panelists, guests & delegates", "Press conference with invited guests", "Exclusive dinner for guests, school management & student leaders"] },
    { day: "Day 2", title: "Main Conference", items: ["Keynote speeches", "Panel sessions", "Magazine launch – GIHC International Health Magazine", "Innovation Challenge: Healthy Habits vs Campus Realities", "Award presentations – honoring excellence in healthcare"] },
  ];

  const subthemes = [
    { title: "The Digital Pulse", desc: "Bridging the gap between student life and longevity" },
    { title: "Mind Over Motion", desc: "Navigating academic pressure and mental resilience" },
    { title: "Fueling the Eagle", desc: "Practical nutrition & physical vitality for the Nigerian university lifestyle" },
    { title: "The Mind & The Machine", desc: "Mental Health-Tech" },
  ];

  const cardStyle = { background: "rgba(17,28,18,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 22px", marginBottom: 12 };
  const sectionLabel = { fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" as const, color: "#3EC9BE", marginBottom: 6, display: "inline-block" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 0 80px" }}>
      <div style={{ textAlign: "center", padding: "56px 20px 36px" }}>
        <div style={{ display: "inline-block", background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 100, padding: "6px 18px", fontSize: 13, color: "#F5C518", fontWeight: 600, marginBottom: 16 }}>
          Conference Details
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          What to Expect at{" "}
          <span style={{ background: "linear-gradient(120deg, #3EC9BE, #6FCF4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GIHC 2026
          </span>
        </h2>
      </div>

      {/* Theme + subthemes */}
      <div style={{ ...cardStyle, margin: "0 20px 32px", background: "rgba(62,201,190,0.05)", border: "1px solid rgba(62,201,190,0.15)" }}>
        <span style={sectionLabel}>Conference Theme</span>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1.3, marginBottom: 8 }}>
          Surviving to Succeed: Addressing Health, Well-being, and Welfare Challenges in the Student Environment
        </h3>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "8px 14px", marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <span style={{ fontWeight: 700, color: "#a78bfa", fontSize: 14 }}>The Mind &amp; The Machine:</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Mental Health-Tech</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {subthemes.map((s) => (
            <div key={s.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3EC9BE", marginTop: 7, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 700, color: "#3EC9BE", fontSize: 14 }}>{s.title}:</span>{" "}
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div style={{ marginBottom: 40, padding: "0 20px" }}>
        <div style={{ ...sectionLabel, display: "block", marginBottom: 16 }}>Conference Schedule</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {schedule.map((s) => (
            <div key={s.day} style={{ ...cardStyle, marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ background: "linear-gradient(135deg, #3EC9BE, #6FCF4A)", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: "#071209", letterSpacing: "1px" }}>{s.day}</div>
                <span style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{s.title}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {s.items.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#6FCF4A", fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* People grid - responsive, auto height cards */}
      <div style={{ marginBottom: 40, padding: "0 20px" }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ ...sectionLabel, display: "block" }}>Speakers, Panelists &amp; Hosts</span>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
          alignItems: "start", // Important: allows cards to have different heights
        }}>
          {people.map((p) => (
            <PersonCard key={p.name} {...p} />
          ))}
        </div>
      </div>

      {/* Royal Father */}
      <div style={{ ...cardStyle, margin: "0 20px 32px", background: "rgba(245,197,24,0.04)", border: "1px solid rgba(245,197,24,0.15)" }}>
        <span style={{ ...sectionLabel, color: "#F5C518" }}>Royal Father of the Day</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
          <div style={{ fontSize: 36 }}>👑</div>
          <div style={{ fontWeight: 800, color: "white", fontSize: 16 }}>
            His Royal Majesty, OBA Dr. Victor Adesimbo Ademefun Kiladejo (JILO III)
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "0 20px" }}>
        {[
          { value: "10,000+", label: "Students Reached", icon: "🎓" },
          { value: "200+", label: "Professionals", icon: "🏥" },
          { value: "50+", label: "Innovation Teams", icon: "💡" },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, marginBottom: 0, textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#3EC9BE", letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Logo lockup for nav ─── */
function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14 }}>
      <img
        src={LOGO_DATA_URL}
        alt="GIHC Logo"
        style={{ width: compact ? 36 : 48, height: compact ? 36 : 48, objectFit: "contain", borderRadius: 6, background: "#000" }}
      />
      <div>
        <div style={{ fontFamily: "var(--font)", fontWeight: 800, fontSize: compact ? 16 : 22, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Great <span style={{ color: "#3EC9BE" }}>IFE</span>{" "}
          <span style={{ color: "#F5C518", fontWeight: 700 }}>2026</span>
        </div>
        <div style={{ fontFamily: "var(--font)", fontWeight: 500, fontSize: compact ? 9 : 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
          International Health Conference
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");

  const [cameraMode, setCameraMode] = useState<"off" | "user" | "environment">("off");
  const [cameraError, setCameraError] = useState("");
  const [formError, setFormError] = useState("");
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/register")
      .then((r) => r.json())
      .then((d) => setCount(d.attendees?.length ?? null))
      .catch(() => {});
  }, []);

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    setCameraError("");
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      streamRef.current = stream;
      setCameraMode(facing);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); } }, 80);
    } catch (e) {
      const err = e as DOMException;
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please allow camera access and try again.");
      } else {
        setCameraError("Could not access camera. Try uploading a photo instead.");
      }
      setCameraMode("off");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraMode("off");
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    if (cameraMode === "user") { ctx.translate(size, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    setPhoto(dataUrl);
    canvas.toBlob((blob) => { if (blob) setPhotoFile(new File([blob], "selfie.jpg", { type: "image/jpeg" })); }, "image/jpeg", 0.88);
    stopCamera();
  }, [cameraMode, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [stopCamera]);

  const generateCard = useCallback(async () => {
    if (!name.trim()) { setFormError("Please enter your name first."); return; }
    setFormError("");
    stopCamera();
    setStep("card");
    setGeneratingCard(true);
    setCardDataUrl(null);

    // Small delay so the card DOM can mount
    await new Promise((r) => setTimeout(r, 400));

    // Capture card image
    let capturedUrl: string | null = null;
    try {
      const { default: html2canvas } = await import("html2canvas");
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2.5, useCORS: true, allowTaint: true,
          backgroundColor: "#071209", logging: false, imageTimeout: 5000,
        });
        capturedUrl = canvas.toDataURL("image/png");
        setCardDataUrl(capturedUrl);
      }
    } catch (err) {
      console.error("html2canvas error", err);
    } finally {
      setGeneratingCard(false);
    }

    // Silently register in the background
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (email.trim()) fd.append("email", email.trim());
      if (faculty.trim()) fd.append("faculty", faculty.trim());
      if (photoFile) fd.append("image", photoFile);
      const res = await fetch("/api/register", { method: "POST", body: fd });
      if (res.ok) setCount((c) => (c ?? 0) + 1);
    } catch (_) {}
  }, [name, email, faculty, photoFile, stopCamera]);

  const downloadCard = useCallback(() => {
    if (!cardDataUrl) return;
    const a = document.createElement("a");
    a.href = cardDataUrl;
    a.download = `GIHC2026-${name.replace(/\s+/g, "_")}.png`;
    a.click();
  }, [cardDataUrl, name]);

  const shareCard = useCallback(async () => {
    if (!cardDataUrl) return;
    const blob = await fetch(cardDataUrl).then((r) => r.blob());
    const file = new File([blob], "GIHC2026.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "I'll be at GIHC 2026!",
        text: `${name} will be at the Great IFE International Health Conference 2026! 🎉 #GIHC2026`,
        files: [file],
      }).catch(() => {});
    } else {
      downloadCard();
    }
  }, [cardDataUrl, name, downloadCard]);

  const reset = () => {
    stopCamera();
    setStep("form");
    setName(""); setEmail(""); setFaculty("");
    setPhoto(null); setPhotoFile(null);
    setCardDataUrl(null);
    setFormError(""); setCameraError("");
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        background: "rgba(9,16,10,0.8)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <LogoLockup compact />
        {/* <a href="/admin" style={{
          fontFamily: "var(--font)", fontSize: 13, fontWeight: 600,
          color: "rgba(255,255,255,0.4)", textDecoration: "none",
          padding: "6px 14px", borderRadius: 10, border: "1px solid var(--border)",
        }}>
          Admin →
        </a> */}
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "52px 24px 36px" }}>
        <div className="anim-fadeup" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(62,201,190,0.1)", border: "1px solid rgba(62,201,190,0.25)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 20, fontSize: 13, color: "#3EC9BE", fontWeight: 600,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3EC9BE", display: "inline-block", animation: "pulse-ring 2s ease-in-out infinite" }} />
          {count !== null ? `${count.toLocaleString()} people registered` : "Registrations open"}
        </div>

        <h1 className="anim-fadeup delay-1 font-display" style={{
          fontSize: "clamp(2.4rem, 8vw, 4rem)", fontWeight: 900, lineHeight: 1.05,
          color: "white", letterSpacing: "-0.03em", marginBottom: 16,
        }}>
          I&apos;ll Be{" "}
          <span style={{ background: "linear-gradient(120deg, #3EC9BE, #6FCF4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            There.
          </span>
        </h1>

        <p className="anim-fadeup delay-2" style={{ fontSize: 16, color: "var(--muted)", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Generate your personalised attendance card for GIHC 2026 and share it with the world.
        </p>

        <div className="anim-fadeup delay-3" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {/* Date chip */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 100, padding: "7px 14px", fontSize: 13, color: "var(--muted)",
          }}>
            📅 Thu, 7th May 2026
          </span>
          {/* Time chip */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 100, padding: "7px 14px", fontSize: 13, color: "var(--muted)",
          }}>
            ⏰ 10:00 AM
          </span>
          {/* Venue chip — clickable Maps link */}
          <a
            href={VENUE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--surface)", border: "1px solid rgba(62,201,190,0.35)",
              borderRadius: 100, padding: "7px 14px", fontSize: 13,
              color: "#3EC9BE", textDecoration: "none", cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(62,201,190,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(62,201,190,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(62,201,190,0.35)";
            }}
          >
            <Icon.MapPin /> {VENUE_LABEL}
          </a>
        </div>
      </div>

      {/* Main panel */}
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 20px 40px" }}>

        {step === "form" && (
          <div className="anim-fadeup delay-4">
            <div className="card" style={{ padding: "28px 24px" }}>
              <label style={{ display: "block", marginBottom: 20 }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Your Full Name *
                </span>
                <input
                  type="text" value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(""); }}
                  placeholder="e.g. Amara Okonkwo"
                  onKeyDown={(e) => e.key === "Enter" && generateCard()}
                  maxLength={50} autoComplete="off"
                />
                {formError && <span style={{ display: "block", marginTop: 6, fontSize: 13, color: "#f87171" }}>{formError}</span>}
              </label>

              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Email Address <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. amara@oauife.edu.ng" autoComplete="email" />
              </label>

              <label style={{ display: "block", marginBottom: 20 }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Faculty / Department <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </span>
                <input type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="e.g. Faculty of Science" autoComplete="off" maxLength={80} />
              </label>

              <div>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Your Photo <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </span>

                {cameraMode === "off" && !photo && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <button className="btn btn-ghost" style={{ flexDirection: "column", gap: 8, padding: "20px 16px", height: "auto" }} onClick={() => startCamera("user")}>
                      <Icon.Camera /><span style={{ fontSize: 13 }}>Take Selfie</span>
                    </button>
                    <label className="btn btn-ghost" style={{ flexDirection: "column", gap: 8, padding: "20px 16px", height: "auto", cursor: "pointer" }}>
                      <Icon.Upload /><span style={{ fontSize: 13 }}>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                    </label>
                  </div>
                )}

                {cameraError && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, fontSize: 13, color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {cameraError}
                    <label style={{ display: "block", marginTop: 6, color: "#3EC9BE", cursor: "pointer", fontWeight: 600 }}>
                      Upload instead
                      <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                    </label>
                  </div>
                )}

                {cameraMode !== "off" && (
                  <div>
                    <div className="camera-wrap" style={{ aspectRatio: "1/1", maxHeight: 340 }}>
                      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: cameraMode === "user" ? "scaleX(-1)" : "none" }} />
                      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
                        <button onClick={() => startCamera(cameraMode === "user" ? "environment" : "user")} style={{ width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon.Flip />
                        </button>
                        <button onClick={capturePhoto} style={{ width: 66, height: 66, borderRadius: "50%", border: "4px solid white", cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 3px rgba(255,255,255,0.3)" }} />
                        <button onClick={stopCamera} style={{ width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon.Close />
                        </button>
                      </div>
                    </div>
                    <p style={{ marginTop: 8, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Tap the white button to capture · Use flip to switch camera</p>
                  </div>
                )}

                {photo && cameraMode === "off" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--surface2)", borderRadius: 14, border: "1px solid var(--border)" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(62,201,190,0.4)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 2 }}>Photo ready ✓</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>This will appear on your card</div>
                    </div>
                    <button onClick={() => { setPhoto(null); setPhotoFile(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
                      <Icon.Close />
                    </button>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" style={{ width: "100%", marginTop: 28, padding: "16px", fontSize: 16, borderRadius: 16 }} onClick={generateCard} disabled={!name.trim()}>
                Generate My Card →
              </button>
              <p style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                By generating a card you confirm intent to attend GIHC 2026
              </p>
            </div>
          </div>
        )}

        {step === "card" && (
          <div className="anim-pop">
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>
              Your attendance card is ready — download and share it!
            </p>

            {/* Live card (used for html2canvas capture, hidden once image ready) */}
            <div style={{ overflowX: "auto", marginBottom: cardDataUrl ? 0 : 20, visibility: cardDataUrl ? "hidden" : "visible", height: cardDataUrl ? 0 : "auto", overflow: "hidden" }}>
              <AttendanceCard name={name} photo={photo} cardRef={cardRef} />
            </div>

            {/* Rendered PNG — shown once captured */}
            {cardDataUrl && (
              <div style={{ marginBottom: 20, borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cardDataUrl} alt="Your attendance card" style={{ width: "100%", display: "block" }} />
              </div>
            )}

            {generatingCard && (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)", fontSize: 14 }}>✨ Generating your card…</div>
            )}

            {cardDataUrl && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <button className="btn btn-primary" onClick={downloadCard}><Icon.Download /> Download</button>
                  <button className="btn btn-ghost" onClick={shareCard}><Icon.Share /> Share</button>
                </div>
                {/* Count badge so user knows they're registered */}
                {count !== null && (
                  <div style={{ textAlign: "center", fontSize: 13, color: "#3EC9BE", padding: "8px 0" }}>
                    ✓ You&apos;re registered · {count.toLocaleString()} people attending
                  </div>
                )}
                <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, padding: "8px", textDecoration: "underline" }}>
                  ← Register another person
                </button>
              </div>
            )}
          </div>
        )}

        {/* "done" step is now only reachable if you explicitly call setStep("done") elsewhere;
            card step IS the done step. Keeping it for safety / future use. */}
        {step === "done" && (
          <div className="anim-pop" style={{ textAlign: "center" }}>
            <div className="card" style={{ padding: "40px 28px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 className="font-display" style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>
                You&apos;re In!
              </h2>
              <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
                Welcome aboard, <strong style={{ color: "#3EC9BE" }}>{name}</strong>.<br />
                We can&apos;t wait to see you on 7th May at OAU!
              </p>
              {count !== null && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(62,201,190,0.1)", border: "1px solid rgba(62,201,190,0.25)", borderRadius: 100, padding: "8px 18px", fontSize: 14, color: "#3EC9BE", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3EC9BE", display: "inline-block" }} />
                  {count.toLocaleString()} people registered
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cardDataUrl && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <button className="btn btn-primary" onClick={downloadCard}><Icon.Download /> Download Card</button>
                    <button className="btn btn-ghost" onClick={shareCard}><Icon.Share /> Share Card</button>
                  </div>
                )}
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                  Share on WhatsApp, Instagram &amp; X · <span style={{ color: "#3EC9BE" }}>#GIHC2026</span>
                </p>
                <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
                  ← Register another person
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conference Info */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <ConferenceInfo />
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px 20px 40px", borderTop: "1px solid var(--border)", fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 2 }}>
        <div>Great IFE International Health Conference 2026</div>
        <div>Office of the Welfare Officer · Great Ife Students&apos; Union · OAU</div>
        <div>📞 MUSAB: 07069148992 · AROGS: 09028577438</div>
      </div>
    </div>
  );
}