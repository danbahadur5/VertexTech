import { Badge } from "../../components/ui/badge";

export default function  HowItWork(){
      const howItWorks = [
    {
      step: "01",
      title: " Consultation ",
      desc: "We begin by understanding your business goals, challenges, and digital requirements through detailed consultation.",
    },
    {
      step: "02",
      title: "Strategy & Planning ",
      desc: "Our technology experts develop a strategic roadmap that outlines the most effective solution for your business. ",
    },
    {
      step: "03",
      title: " Development & Implementation ",
      desc: "Our engineers design and develop secure, scalable systems using modern technology stacks. ",
    },
    {
      step: "04",
      title: " Deployment & Optimization",
      desc: "After deployment, we continuously monitor, optimize, and maintain your system to ensure long-term success.",
    },
  ];
    return(
         <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Deployed in Hours. Defending in Minutes.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              Our four-step framework delivers comprehensive protection from day
              one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div
                  key={item.step}
                  className="reveal text-center group"
                  style={{ transitionDelay: `${idx * 0.12}s` }}
                >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "var(--theme-glow)",
                      filter: "blur(12px)",
                      zIndex: -1,
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}