export default function MiniFooter() {
  return (
    <footer
      className="py-5 text-center"
      style={{ background: "oklch(0.220 0.012 55)", borderTop: "1px solid oklch(0.320 0.012 55)" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/refund-policy"
          className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase underline underline-offset-2 transition-colors duration-300"
          style={{ color: "oklch(0.500 0.010 90)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.500 0.010 90)"; }}
        >
          退貨與退款政策
        </a>
        <span style={{ color: "oklch(0.380 0.010 90)" }} className="hidden sm:inline">·</span>
        <p
          className="text-xs font-['Lato'] font-300 tracking-wide"
          style={{ color: "oklch(0.440 0.010 90)" }}
        >
          © {new Date().getFullYear()} Ying-Li. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
