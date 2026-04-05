import { RESEARCH_PILLARS } from "@/lib/research-pillars";

export function LabMission() {
  return (
    <section className="bg-rush-surface-container-low py-32 px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left sidebar: 4 cols */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
          <h2 className="text-3xl font-bold text-rush-dark-green mb-4">
            Our Mission
          </h2>
          <div className="h-1 w-12 bg-rush-teal mb-6" />
          <p className="text-rush-on-surface-variant leading-relaxed mb-6">
            Critical care generates enormous data, and most of it goes unused
            at the bedside. RICCC at Rush University System for Health builds
            the methods, tools, and evidence to change that through pragmatic
            trials embedded in real ICU workflows, and interdisciplinary team
            science across medicine, respiratory therapy, and informatics. We
            turn ICU data into practice-changing insights for critically ill
            patients.
          </p>
        </div>

        {/* Right: 8 cols, numbered goals */}
        <div className="lg:col-span-8 space-y-16">
          {RESEARCH_PILLARS.map((pillar, index) => (
            <div key={pillar.id}>
              <p className="font-mono text-rush-teal text-lg mb-2">
                {String(index + 1).padStart(2, "0")}.
              </p>
              <h3 className="text-2xl font-bold text-rush-dark-green mb-3">
                {pillar.title}
              </h3>
              <p className="text-lg text-rush-on-surface-variant leading-relaxed">
                {pillar.id === "federated" ? (
                  <>Rush is a founding site in the <a href="https://clif-icu.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-rush-dark-green underline underline-offset-4">CLIF Consortium</a>, an open-source ICU data standard now spanning 12 institutions, 62 hospitals, and 808,000+ patients.</>
                ) : (
                  pillar.short
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
