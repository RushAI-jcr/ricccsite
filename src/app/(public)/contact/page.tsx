import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/contact/inquiry-form";

export const metadata: Metadata = {
  title: "Contact & Collaborate",
  description:
    "Connect with RICCC at Rush University, Chicago — academic collaborations, trainees, and selective engagement with press, media, podcasts, webinars, or external partners when mission and governance align.",
};

export default function ContactPage() {
  return (
    <main className="bg-rush-surface text-rush-on-surface">
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-6 block">
              Contact & Collaborate
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-8">
              Work With Us
            </h1>
            <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
              We are a small group, and we like working with people who share our interests
              in ICU data science, federated research, and clinical trials. If that sounds
              like you, let us know.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership bento */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-rush-surface-container p-10 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-rush-on-surface">
                Academic Partnerships
              </h3>
              <p className="text-base leading-relaxed mb-6 text-rush-on-surface-variant">
                Multi-center clinical trials, federated data studies through the CLIF Consortium,
                and joint grant applications. Rush is a founding site in the CLIF network (17
                institutions, 62 hospitals).
              </p>
            </div>
            <div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">&#10003;</span>{" "}
                  Multi-center study design
                </li>
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">&#10003;</span>{" "}
                  Joint grant applications
                </li>
              </ul>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-rush-teal transition-all hover:gap-4 text-rush-dark-green"
              >
                Discuss Collaboration &rarr;
              </a>
            </div>
          </div>

          <div className="md:col-span-1 bg-rush-secondary-container p-10 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-rush-dark-green">
                Trainees &amp; Students
              </h3>
              <p className="text-base leading-relaxed mb-6 text-rush-dark-green/70">
                Rush students, residents, and fellows, as well as trainees at other institutions,
                are welcome to reach out about research opportunities. Availability varies, so
                get in touch to see what we have open.
              </p>
            </div>
            <div>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-rush-teal transition-all hover:gap-4 text-rush-dark-green"
              >
                Contact Us &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-rush-surface-container-high p-10 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-rush-dark-green">
                Press, Media &amp; Programs
              </h3>
              <p className="text-base leading-relaxed mb-6 text-rush-on-surface-variant">
                Available for press, podcasts, webinars, and panels on ICU care,
                clinical AI, health equity, and data science in healthcare.
              </p>
            </div>
            <div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">
                    &#10003;
                  </span>{" "}
                  Grounded in published work
                </li>
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">
                    &#10003;
                  </span>{" "}
                  Accurate attribution
                </li>
              </ul>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-rush-teal transition-all hover:gap-4 text-rush-dark-green"
              >
                Media Inquiry &rarr;
              </a>
            </div>
          </div>

          <div className="bg-rush-surface-container p-10 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-rush-on-surface">
                External Collaborators
              </h3>
              <p className="text-base leading-relaxed mb-6 text-rush-on-surface-variant">
                Investigators at other institutions or industry partners interested in
                collaborative research, data sharing, or joint projects.
              </p>
            </div>
            <div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">
                    &#10003;
                  </span>{" "}
                  Research integrity
                </li>
                <li className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rush-dark-green">
                  <span aria-hidden="true" className="text-rush-teal font-bold">
                    &#10003;
                  </span>{" "}
                  Mission alignment
                </li>
              </ul>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-rush-teal transition-all hover:gap-4 text-rush-dark-green"
              >
                Inquire &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section
        id="inquiry"
        className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-32 scroll-mt-24"
        aria-labelledby="inquiry-heading"
      >
        <div className="bg-rush-surface-container rounded-sm p-1 overflow-hidden">
          <div className="bg-rush-surface p-10 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left: description + trust signals */}
            <div>
              <h2
                id="inquiry-heading"
                className="text-4xl font-bold tracking-tight text-rush-dark-green mb-6"
              >
                Get in Touch
              </h2>
              <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-12">
                Tell us a bit about what you are working on and how it might connect with our
                research. We will get back to you.
              </p>

              <div className="mt-12 pt-8 border-t border-rush-outline-variant/20">
                <p className="text-sm text-rush-on-surface-variant">
                  You can also reach us directly at{" "}
                  <a
                    href="mailto:info@riccc-lab.com"
                    className="text-rush-dark-green font-semibold underline underline-offset-4"
                  >
                    info@riccc-lab.com
                  </a>
                </p>
              </div>
            </div>

            {/* Right: form */}
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-rush-surface-container-low py-24 border-t border-rush-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Learn More
            </span>
            <h2 className="text-3xl font-bold text-rush-dark-green mb-4 tracking-tight">
              Explore Our Work
            </h2>
            <p className="text-rush-on-surface-variant mb-8 leading-relaxed">
              Want to learn more about what we do before reaching out? Start here.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/research"
                className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
              >
                Research Portfolio
              </Link>
              <Link
                href="/publications"
                className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
              >
                Publications
              </Link>
              <Link
                href="/tools"
                className="inline-block border border-rush-outline-variant text-rush-dark-green px-6 py-3 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
              >
                Tools & Infrastructure
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
