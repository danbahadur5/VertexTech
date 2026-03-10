import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function SecurityExportSection() {
  const [data, setData] = useState({
    title: "Talk to a Security Expert",
    subtitle:
      "Ready to strengthen your security posture? Our team of cybersecurity experts is available 24/7 to assess your needs and recommend the right protection.",
    contact: {
      address: "123 Tech Street, San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      email: "contact@vertextech.com",
    },
    cta: { label: "Get In Touch", href: "/contact" },
    hours: [
      { day: "Monday – Friday", hours: "7:00 AM – 6:00 PM PST" },
      { day: "Saturday", hours: "8:00 AM – 2:00 PM PST" },
      { day: "Sunday", hours: "Closed" },
    ],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/security-exports", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.item?.data || {};
        setData((prev) => ({
          ...prev,
          title: d.title || prev.title,
          subtitle: d.subtitle || prev.subtitle,
          contact: {
            address: d?.contact?.address || prev.contact.address,
            phone: d?.contact?.phone || prev.contact.phone,
            email: d?.contact?.email || prev.contact.email,
          },
          cta: {
            label: d?.cta?.label || prev.cta.label,
            href: d?.cta?.href || prev.cta.href,
          },
          hours: Array.isArray(d.hours) && d.hours.length ? d.hours : prev.hours,
        }));
      } catch {}
    })();
  }, []);

  const rows = [
    { Icon: MapPin, label: data.contact.address ? "VertexTech HQ" : "", sub: data.contact.address },
    { Icon: Phone, label: data.contact.phone, sub: "" },
    { Icon: Mail, label: data.contact.email, sub: "" },
  ].filter((r) => r.label || r.sub);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="reveal-left">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{data.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{data.subtitle}</p>
            <div className="space-y-4">
              {rows.map(({ Icon, label, sub }, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg theme-gradient flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    {!!label && <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{label}</div>}
                    {!!sub && <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right rounded-2xl border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Office Hours</h3>
            <div className="space-y-4">
              {data.hours.map(({ day, hours }, i) => (
                <div key={`${day}-${i}`} className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0" style={{ color: "var(--theme-primary)" }} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>{day}:</strong> {hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href={data.cta.href || "/contact"}>
                <Button size="lg" className="theme-btn rounded-xl w-full h-12 font-bold">
                  {data.cta.label || "Get In Touch"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
