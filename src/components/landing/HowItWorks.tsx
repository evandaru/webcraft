import { MessageSquare, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Tulis Prompt",
    description:
      "Deskripsikan bisnis, produk, atau layanan kamu dalam satu paragraf. Semakin detail, semakin bagus hasilnya.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Generate",
    description:
      "Claude AI memproses promptmu dan menghasilkan landing page HTML lengkap dengan hero, fitur, CTA, dan footer.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch!",
    description:
      "Download file HTML atau publish langsung ke link publik. Siap digunakan, tidak perlu hosting mahal.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Cara Kerjanya
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Tiga langkah sederhana dari ide ke landing page yang siap live
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="mb-4 text-5xl font-black text-border">
                  {step.step}
                </div>
                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${step.bg} ring-1 ring-white/10`}
                >
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
