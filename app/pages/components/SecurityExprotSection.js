import { Button } from "../../components/ui/button";

import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function SecurityExportSection(){
    return(
           <section className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="reveal-left">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Talk to a Security Expert
                      </h2>
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Ready to strengthen your security posture? Our team of
                        cybersecurity experts is available 24/7 to assess your needs and
                        recommend the right protection.
                      </p>
                      <div className="space-y-4">
                        {[
                          {
                            Icon: MapPin,
                            label: "VertexTech HQ",
                            sub: "123 Tech Street, San Francisco, CA 94105",
                          },
                          { Icon: Phone, label: "+1 (555) 123-4567", sub: "" },
                          { Icon: Mail, label: "contact@vertextech.com", sub: "" },
                        ].map(({ Icon, label, sub }) => (
                          <div key={label} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg theme-gradient flex items-center justify-center shrink-0">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {label}
                              </div>
                              {sub && (
                                <div className="text-sm text-gray-500 mt-0.5">
                                  {sub}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="reveal-right rounded-2xl border border-gray-200 p-8 bg-white shadow-sm">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Office Hours
                      </h3>
                      <div className="space-y-4">
                        {[
                          { day: "Monday – Friday", hours: "7:00 AM – 6:00 PM PST" },
                          { day: "Saturday", hours: "8:00 AM – 2:00 PM PST" },
                          { day: "Sunday", hours: "Closed" },
                        ].map(({ day, hours }) => (
                          <div key={day} className="flex items-center gap-3">
                            <Clock
                              className="h-5 w-5 shrink-0"
                              style={{ color: "var(--theme-primary)" }}
                            />
                            <span className="text-sm text-gray-700">
                              <strong>{day}:</strong> {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8">
                        <Link href="/contact">
                          <Button
                            size="lg"
                            className="theme-btn rounded-xl w-full h-12 font-bold"
                          >
                            Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    )
}