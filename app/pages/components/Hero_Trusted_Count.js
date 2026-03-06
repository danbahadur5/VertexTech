export default function Hero_Trusted_Count() {
  return (
    <section className="py-15 theme-gradient">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {[
            { num: "10M", suffix: "+", label: "Endpoints Protected" },
            { num: "500", suffix: "B+", label: "Events Analyzed Daily" },
            { num: "99.9", suffix: "%", label: "Platform Uptime" },
            { num: "24", suffix: "/7", label: "SOC Coverage" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="reveal"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="text-5xl font-extrabold mb-2 text-white/90">
                {s.num}
                {s.suffix}
              </div>
              <div className="text-white/60 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
