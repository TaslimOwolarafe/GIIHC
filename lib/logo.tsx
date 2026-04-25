export function GIHCLogo({ size = 48 }: { size?: number }) {
  // Recreating the interlocking puzzle-piece circle logo from the conference branding
  // Colors: green (top-left), teal (top-right), yellow (bottom-left), teal-dark (bottom-right)
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-left piece — green */}
      <path
        d="M60 60 C60 60 18 58 18 30 C18 14 32 4 48 4 C56 4 62 8 62 8 L62 8 C62 8 56 14 56 22 C56 30 62 34 62 34 L60 60Z"
        fill="#6FCF4A"
      />
      {/* Top-right piece — teal */}
      <path
        d="M60 60 C60 60 62 34 68 34 C74 34 80 30 80 22 C80 14 74 8 74 8 C74 8 80 4 88 4 C104 4 106 18 106 30 C106 50 84 58 60 60Z"
        fill="#3EC9BE"
      />
      {/* Bottom-left piece — yellow */}
      <path
        d="M60 60 C60 60 36 62 36 68 C36 74 40 80 48 80 C56 80 60 74 60 74 C60 74 56 80 56 88 C56 104 70 116 84 116 C96 116 106 108 106 96 C106 80 84 60 60 60Z"
        fill="#F5C518"
      />
      {/* Bottom-right piece — teal dark */}
      <path
        d="M60 60 C60 60 38 80 18 80 C8 80 4 70 4 62 C4 54 8 48 16 46 C16 46 22 52 30 52 C38 52 42 46 42 46 L60 60Z"
        fill="#2BA89E"
      />
    </svg>
  );
}

export function GIHCLogoFull({ height = 52 }: { height?: number }) {
  const logoSize = Math.round(height * 0.85);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(height * 0.2) }}>
      <GIHCLogo size={logoSize} />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: Math.round(height * 0.38),
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          Great <span style={{ color: "#3EC9BE" }}>IFE</span>
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            fontSize: Math.round(height * 0.22),
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          International Health Conference
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: Math.round(height * 0.22),
            color: "#F5C518",
          }}
        >
          2026
        </div>
      </div>
    </div>
  );
}
