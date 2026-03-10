import { Activity, Cloud, Globe, Lock, Shield, Zap } from "lucide-react";
import { Badge } from "../../components/ui/badge";
export default function Capabilities() {
  const capabilities = [
    { label: "Threat Detection Accuracy", value: 99, icon: Shield },
    { label: "Cloud Workload Coverage", value: 95, icon: Cloud },
    { label: "Incident Response Automation", value: 88, icon: Zap },
    { label: "Compliance Framework Support", value: 92, icon: Lock },
    { label: "Global Threat Intelligence", value: 97, icon: Globe },
    { label: "SOC Analyst Efficiency Gain", value: 74, icon: Activity },
  ];
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="reveal">
              <Badge className="mb-4 theme-badge">Platform Capabilities</Badge>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Industry-Leading{" "}
                <span className="theme-gradient-text">Security Metrics</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Our AI-driven platform consistently outperforms the competition
                across every key security measurement — because your protection
                depends on it.
              </p>
            </div>
            <div className="space-y-7">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="reveal"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: "var(--theme-primary)" }}
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {cap.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold theme-gradient-text">
                        {cap.value}%
                      </span>
                    </div>
                    <div className="progress-wrapper">
                      <div
                        className="progress-bar"
                        style={{ "--progress-target": `${cap.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: "Zero-Day Protection",
                desc: "Behavioral AI stops novel threats before signatures exist.",
              },
              {
                icon: Cloud,
                title: "Cloud Native",
                desc: "Seamless coverage across AWS, Azure, and GCP environments.",
              },
              {
                icon: Zap,
                title: "Auto Response",
                desc: "Sub-second automated containment with full audit trails.",
              },
              {
                icon: Lock,
                title: "Zero Trust",
                desc: "Never trust, always verify — enforced across every identity.",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="reveal-scale bg-white dark:bg-gray-950 rounded-2xl p-6 border cursor-pointer dark:border-gray-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  style={{ transitionDelay: `${idx * 0.12}s` }}
                >
                  <div className="w-12 h-12 rounded-xl theme-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{feat.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
