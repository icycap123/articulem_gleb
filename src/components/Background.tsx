export default function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-22vh", left: "-12vw", width: "62vw", height: "62vw", background: "radial-gradient(circle, rgba(205,169,106,0.16), transparent 62%)", filter: "blur(38px)", animation: "artBlobA 26s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-26vh", right: "-14vw", width: "58vw", height: "58vw", background: "radial-gradient(circle, rgba(120,108,196,0.14), transparent 64%)", filter: "blur(44px)", animation: "artBlobB 32s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "34vh", right: "18vw", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(82,150,140,0.10), transparent 66%)", filter: "blur(46px)", animation: "artBlobC 38s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.04), transparent 55%)" }} />
    </div>
  );
}
