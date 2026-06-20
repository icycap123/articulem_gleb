export default function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 30 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div className="serif" style={{ fontSize: 21, color: "#cda96a" }}>Articulem</div>
        <div style={{ fontSize: 13, color: "#6f6c65" }}>Журнал идей и текстов · © 2026</div>
      </div>
    </footer>
  );
}
