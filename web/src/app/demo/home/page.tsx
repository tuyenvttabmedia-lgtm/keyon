/**
 * Demo iframe — Design System home (không thay / ).
 * Static HTML: /demo/home-v7/index.html
 */
export default function DemoHomePage() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#fff" }}>
      <iframe
        src="/demo/home-v7/index.html"
        title="KEYON Home Design System Demo"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}
