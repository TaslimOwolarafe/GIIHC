"use client";

import { useState, useEffect, useCallback } from "react";

type Attendee = {
  id: string;
  name: string;
  email?: string | null;
  faculty?: string | null;
  image_url: string | null;
  created_at: string;
};

function Avatar({ src, name }: { src: string | null; name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    );
  }
  return (
    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{initials}</span>
  );
}

export default function AdminPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [facultyFilter, setFacultyFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/register");
      const data = await res.json();
      if (data.attendees) {
        setAttendees(data.attendees);
        setLastFetched(new Date());
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 30_000);
    return () => clearInterval(t);
  }, [fetchData]);

  const exportCSV = () => {
    const rows = [["Name", "Email", "Faculty / Department", "Registered At", "Has Photo", "ID"]];
    attendees.forEach((a) =>
      rows.push([
        a.name,
        a.email ?? "",
        a.faculty ?? "",
        new Date(a.created_at).toLocaleString(),
        a.image_url ? "Yes" : "No",
        a.id,
      ])
    );
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `GIHC2026-attendees-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const faculties = Array.from(
    new Set(attendees.map((a) => a.faculty).filter(Boolean) as string[])
  ).sort();

  const filtered = attendees.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (a.faculty ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFaculty = !facultyFilter || a.faculty === facultyFilter;
    return matchSearch && matchFaculty;
  });

  const today = attendees.filter(
    (a) => new Date(a.created_at).toDateString() === new Date().toDateString()
  ).length;
  const withPhotos = attendees.filter((a) => a.image_url).length;
  const withEmail = attendees.filter((a) => a.email).length;
  const withFaculty = attendees.filter((a) => a.faculty).length;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font)" }}>
      <div style={{
        padding: "24px 32px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
              <path d="M100,100 L100,20 Q80,20 65,30 Q50,42 50,60 Q50,76 62,84 Q72,90 72,100 Z" fill="#6FCF4A"/>
              <path d="M100,100 L100,20 Q120,20 135,30 Q150,42 150,60 Q150,76 138,84 Q128,90 128,100 Z" fill="#3EC9BE"/>
              <path d="M100,100 L100,180 Q120,180 135,170 Q150,158 150,140 Q150,124 138,116 Q128,110 128,100 Z" fill="#F5C518"/>
              <path d="M100,100 L100,180 Q80,180 65,170 Q50,158 50,140 Q50,124 62,116 Q72,110 72,100 Z" fill="#2DADA3"/>
            </svg>
            <span style={{ fontSize: 13, color: "#3EC9BE", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>GIHC 2026</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: 4 }}>Attendance Dashboard</h1>
          {lastFetched && (
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Last updated: {lastFetched.toLocaleTimeString()} · Auto-refreshes every 30s</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" style={{ fontSize: 14, padding: "10px 18px" }} onClick={fetchData}>↻ Refresh</button>
          <button className="btn btn-primary" style={{ fontSize: 14, padding: "10px 18px" }} onClick={exportCSV}>↓ Export CSV</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total Registered", value: attendees.length, color: "#3EC9BE" },
            { label: "Registered Today", value: today, color: "#F5C518" },
            { label: "With Photos", value: withPhotos, color: "#6FCF4A" },
            { label: "With Email", value: withEmail, color: "#a78bfa" },
            { label: "With Faculty", value: withFaculty, color: "#ff9f43" },
            { label: "No Photo", value: attendees.length - withPhotos, color: "rgba(255,255,255,0.35)" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6 }}>
                {loading ? "—" : s.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            type="search"
            placeholder="Search by name, email or faculty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220 }}
          />
          {faculties.length > 0 && (
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              style={{
                fontFamily: "var(--font)", fontSize: 14, color: "var(--text)",
                background: "var(--surface2)", border: "1.5px solid var(--border)",
                borderRadius: 14, padding: "12px 16px", outline: "none", cursor: "pointer",
              }}
            >
              <option value="">All Faculties</option>
              {faculties.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
            {search || facultyFilter ? "No results found." : "No registrations yet."}
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden", overflowX: "auto" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "48px 1fr 180px 160px 150px 80px",
              padding: "12px 20px", background: "var(--surface2)",
              borderBottom: "1px solid var(--border)",
              fontSize: 11, fontWeight: 700, color: "var(--muted)",
              textTransform: "uppercase", letterSpacing: "0.08em", minWidth: 760,
            }}>
              <div /><div>Name</div><div>Email</div><div>Faculty</div><div>Registered</div><div>Photo</div>
            </div>

            {filtered.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "grid", gridTemplateColumns: "48px 1fr 180px 160px 150px 80px",
                  alignItems: "center", padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s", minWidth: 760,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--surface2)", border: "1.5px solid var(--border)",
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Avatar src={a.image_url} name={a.name} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "white", paddingRight: 12 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: a.email ? "var(--muted)" : "rgba(255,255,255,0.2)", paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.email ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: a.faculty ? "var(--muted)" : "rgba(255,255,255,0.2)", paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.faculty ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {new Date(a.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, borderRadius: 100, padding: "4px 10px",
                    background: a.image_url ? "rgba(111,207,74,0.12)" : "rgba(255,255,255,0.05)",
                    color: a.image_url ? "#6FCF4A" : "var(--muted)",
                    border: `1px solid ${a.image_url ? "rgba(111,207,74,0.25)" : "var(--border)"}`,
                  }}>
                    {a.image_url ? "✓ Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "right" }}>
          Showing {filtered.length} of {attendees.length} attendees
        </div>
      </div>
    </div>
  );
}
