
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Badge } from "../../components/ui/badge";
export default function FAQSection(){
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/faq", { cache: "no-store" });
        const json = await res.json();
        const items = Array.isArray(json?.item?.data?.items) ? json.item.data.items : [];
        if (items.length) {
          setFaqs(items);
        } else {
          setFaqs([
            { q: "How quickly can we deploy across our organization?", a: "Most customers are fully operational within one week. Our lightweight agent installs silently with no reboots required, and cloud integrations connect via API in minutes." },
            { q: "Does VertexTech replace our existing SIEM?", a: "We complement your SIEM by integrating seamlessly with major platforms and enriching data with detection context and insights." },
            { q: "Do you provide 24/7 coverage?", a: "Yes, our team offers around-the-clock monitoring, triage, and response with defined SLAs on advanced plans." },
            { q: "How do you detect zero‑day threats?", a: "We use behavioral analysis to identify anomalous activity across processes, memory, and network patterns, blocking novel exploits in real time." },
            { q: "Can we start with a pilot?", a: "Absolutely. We can begin with a scoped pilot and expand progressively to full coverage once success criteria are met." },
          ]);
        }
      } catch {
        // fallback defaults
        setFaqs([
          { q: "How quickly can we deploy across our organization?", a: "Most customers are fully operational within one week. Our lightweight agent installs silently with no reboots required, and cloud integrations connect via API in minutes." },
          { q: "Does VertexTech replace our existing SIEM?", a: "We complement your SIEM by integrating seamlessly with major platforms and enriching data with detection context and insights." },
          { q: "Do you provide 24/7 coverage?", a: "Yes, our team offers around-the-clock monitoring, triage, and response with defined SLAs on advanced plans." },
          { q: "How do you detect zero‑day threats?", a: "We use behavioral analysis to identify anomalous activity across processes, memory, and network patterns, blocking novel exploits in real time." },
          { q: "Can we start with a pilot?", a: "Absolutely. We can begin with a scoped pilot and expand progressively to full coverage once success criteria are met." },
        ]);
      }
    })();
  }, []);
  const left = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 === 1);

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <Badge className="mb-4 theme-badge">FAQ</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Common questions about our platform and services.
          </p>
        </div>
        <div className="reveal">
          <div className="grid gap-6 lg:grid-cols-2">
            <Accordion type="single" collapsible className="space-y-3">
              {left.map((item, i) => (
                <AccordionItem
                  key={`l-${i}`}
                  value={`l-item-${i}`}
                  className="bg-gray-50 rounded-xl border border-gray-200 px-6"
                >
                  <AccordionTrigger className="font-semibold text-gray-900 hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion type="single" collapsible className="space-y-3">
              {right.map((item, i) => (
                <AccordionItem
                  key={`r-${i}`}
                  value={`r-item-${i}`}
                  className="bg-gray-50 rounded-xl border border-gray-200 px-6"
                >
                  <AccordionTrigger className="font-semibold text-gray-900 hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
