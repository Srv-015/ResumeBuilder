'use client';

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const templates = [
  {
    id: "classic",
    number: "01",
    name: "The Classic",
    category: "Professional",
    tagline: "Quiet confidence.",
    description:
      "A timeless resume design with clean typography and balanced spacing. Ideal for students, developers and professionals.",
    bestFor: "Students · Developers · Professionals",
  },
  {
    id: "executive",
    number: "02",
    name: "The Executive",
    category: "Executive",
    tagline: "Distinguished by design.",
    description:
      "A structured and authoritative layout created for experienced professionals, managers and leadership positions.",
    bestFor: "Managers · Consultants · Leaders",
  },
  {
    id: "editorial",
    number: "03",
    name: "The Editorial",
    category: "Creative",
    tagline: "Creative by nature.",
    description:
      "An expressive editorial-inspired design for creatives who want their resume to have a stronger visual identity.",
    bestFor: "Designers · Creatives · Marketing",
  },
];

function TemplatesPageContent() {

  const searchParams = useSearchParams();

  // If this exists, we are changing the template
  // of an existing resume.
  const resumeId = searchParams.get("resumeId");

  const getTemplateUrl = (templateId: string) => {
    if (resumeId) {
      return `/resume?id=${resumeId}&template=${templateId}`;
    }

    return `/resume?template=${templateId}`;
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">

      {/* NAVBAR */}
      <nav className="border-b border-[#2c241c]/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.2em]"
          >
            CVÉRÉ
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/dashboard"
              className="text-sm transition hover:opacity-60"
            >
              Dashboard
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c241c] text-xs text-[#f4efe4]">
              AB
            </div>

          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-8 pb-12 pt-20">

        <div className="max-w-4xl">

          <p className="text-xs uppercase tracking-[0.35em] text-[#806b50]">
            {resumeId ? "Change Your Design" : "The Collection"}
          </p>

          <h1 className="mt-5 font-serif text-6xl leading-[0.95] md:text-8xl">
            {resumeId ? (
              <>
                Change your
                <br />
                <span className="italic">template.</span>
              </>
            ) : (
              <>
                Choose your
                <br />
                <span className="italic">template.</span>
              </>
            )}
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-[#5e5143]">
            {resumeId
              ? "Choose a new visual style for your existing resume. Your personal information, education, skills, experience and projects will remain unchanged."
              : "Select a design that fits your experience, personality and professional identity. Your information stays the same while the visual presentation changes."}
          </p>

        </div>

        {/* FILTERS */}
        <div className="mt-12 flex flex-wrap gap-3 border-t border-[#2c241c]/20 pt-6">

          <button
            type="button"
            className="bg-[#2c241c] px-5 py-2 text-xs uppercase tracking-[0.15em] text-[#f4efe4]"
          >
            All Templates
          </button>

          <button
            type="button"
            className="border border-[#2c241c]/30 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
          >
            Professional
          </button>

          <button
            type="button"
            className="border border-[#2c241c]/30 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
          >
            Executive
          </button>

          <button
            type="button"
            className="border border-[#2c241c]/30 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
          >
            Creative
          </button>

        </div>
      </section>

      {/* TEMPLATE COLLECTION */}
      <section className="mx-auto max-w-7xl px-8 pb-28">

        <div className="grid gap-12 lg:grid-cols-3">

          {templates.map((template) => (

            <article
              key={template.id}
              className="group"
            >

              {/* A4 PREVIEW */}
              <div className="relative overflow-hidden border border-[#2c241c]/20 bg-[#e5dccd] p-6">

                <div className="mx-auto aspect-[210/297] w-full max-w-[360px] overflow-hidden bg-[#cec3b1] p-5">

                  <TemplatePreview
                    template={template.id}
                  />

                  {/* DESKTOP BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#2c241c]/70 opacity-0 transition duration-300 group-hover:opacity-100">

                    <Link
                      href={getTemplateUrl(template.id)}
                      className="bg-[#f4efe4] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#2c241c] transition hover:bg-white"
                    >
                      {resumeId
                        ? "Use This Template"
                        : "Use This Template"}
                    </Link>

                  </div>

                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-7">

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#806b50]">
                      {template.category}
                    </p>

                    <h2 className="mt-2 font-serif text-3xl">
                      {template.name}
                    </h2>

                    <p className="mt-2 font-serif text-lg italic text-[#806b50]">
                      {template.tagline}
                    </p>

                  </div>

                  <span className="font-serif text-2xl text-[#806b50]">
                    {template.number}
                  </span>

                </div>

                <p className="mt-4 text-sm leading-6 text-[#5e5143]">
                  {template.description}
                </p>

                <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-[#806b50]">
                  Best for
                </p>

                <p className="mt-1 text-xs text-[#5e5143]">
                  {template.bestFor}
                </p>

                {/* MOBILE BUTTON */}
                <Link
                  href={getTemplateUrl(template.id)}
                  className="mt-6 inline-block border border-[#2c241c]/30 px-6 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4] lg:hidden"
                >
                  {resumeId
                    ? "Use Template"
                    : "Use Template"}
                </Link>

              </div>

            </article>

          ))}

        </div>
      </section>

      {/* INFORMATION */}
      <section className="border-y border-[#2c241c]/15 bg-[#e9e0d1]">

        <div className="mx-auto max-w-7xl px-8 py-20">

          <div className="grid gap-12 md:grid-cols-3">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                Your Information
              </p>

              <h3 className="mt-4 font-serif text-3xl">
                Enter it once.
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#5e5143]">
                Add your personal information, education, skills, experience
                and projects in the resume editor.
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                Your Design
              </p>

              <h3 className="mt-4 font-serif text-3xl">
                Change it anytime.
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#5e5143]">
                Your resume content stays intact while you can switch between
                different CVÉRÉ templates.
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                Your Resume
              </p>

              <h3 className="mt-4 font-serif text-3xl">
                Ready to apply.
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#5e5143]">
                Review your resume through the live preview before exporting
                your final document.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      {!resumeId && (
        <section className="px-8 py-24 text-center">

          <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">
            Begin your story
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            The right design can change
            <br />
            <span className="italic">
              how your story is remembered.
            </span>
          </h2>

          <Link
            href="/resume?template=classic"
            className="mt-10 inline-block bg-[#2c241c] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d]"
          >
            Start with The Classic
          </Link>

        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#2c241c] px-8 py-10 text-[#f4efe4]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em]"
          >
            CVÉRÉ
          </Link>

          <p className="text-xs text-[#c8b99f]">
            Resumes with character.
          </p>

          <p className="text-xs text-[#c8b99f]">
            © 2026 CVÉRÉ. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}


/* =========================================
   TEMPLATE PREVIEW
========================================= */

function TemplatePreview({
  template,
}: {
  template: string;
}) {
  if (template === "executive") {
    return <ExecutivePreview />;
  }

  if (template === "editorial") {
    return <EditorialPreview />;
  }

  return <ClassicPreview />;
}


/* =========================================
   CLASSIC
========================================= */

function ClassicPreview() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#fffdf8] p-5 shadow-2xl">

      <div className="border-b border-[#2c241c]/30 pb-3">

        <p className="text-[5px] uppercase tracking-[0.35em] text-[#806b50]">
          Curriculum Vitae
        </p>

        <h2 className="mt-2 font-serif text-2xl leading-[0.88]">
          Alexander
          <br />
          Bennett
        </h2>

        <p className="mt-2 text-[5px] italic text-[#806b50]">
          Creative Director
        </p>

        <div className="mt-2 flex flex-wrap gap-x-2 text-[4px] text-[#806b50]">
          <span>✉️ alex@example.com</span>
          <span>📞 +44 20 1234 5678</span>
          <span>London</span>
        </div>

      </div>

      <PreviewSection title="Profile">
        <TextLines count={4} />
      </PreviewSection>

      <PreviewSection title="Education">
        <PreviewItem
          title="Master of Design"
          subtitle="Royal College of Art · 2017 — 2019"
        />
      </PreviewSection>

      <PreviewSection title="Skills">
        <div className="flex flex-wrap gap-1">
          <SmallTag text="React" />
          <SmallTag text="Design" />
          <SmallTag text="Strategy" />
          <SmallTag text="Typography" />
        </div>
      </PreviewSection>

      <PreviewSection title="Experience">
        <PreviewItem
          title="Creative Director"
          subtitle="Atelier & Co. · 2022 — Present"
        />

        <PreviewItem
          title="Senior Designer"
          subtitle="Maison Studio · 2019 — 2022"
        />
      </PreviewSection>

      <PreviewSection title="Projects">
        <PreviewItem
          title="Portfolio Website"
          subtitle="Next.js · TypeScript · Tailwind CSS"
        />

        <PreviewItem
          title="Brand Identity System"
          subtitle="Figma · Illustrator · Photoshop"
        />
      </PreviewSection>

      <PreviewSection title="Additional Information">
        <PreviewItem
          title="Certifications"
          subtitle="Google UX Design · 2024"
        />

        <PreviewItem
          title="Languages"
          subtitle="English · Professional"
        />
      </PreviewSection>

    </div>
  );
}


/* =========================================
   EXECUTIVE
========================================= */

function ExecutivePreview() {
  return (
    <div className="grid h-full grid-cols-[32%_68%] bg-[#fffdf8] shadow-2xl">

      <div className="bg-[#2c241c] p-4 text-[#f4efe4]">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#f4efe4]/40 text-[7px]">
          AB
        </div>

        <div className="mt-7">

          <p className="text-[5px] uppercase tracking-[0.2em] text-[#c8b99f]">
            Contact
          </p>

          <div className="mt-2 space-y-2">
            <DarkLine />
            <DarkLine width="80%" />
            <DarkLine />
          </div>

        </div>

        <div className="mt-7">

          <p className="text-[5px] uppercase tracking-[0.2em] text-[#c8b99f]">
            Skills
          </p>

          <div className="mt-2 space-y-2">
            <DarkLine />
            <DarkLine width="80%" />
            <DarkLine width="65%" />
            <DarkLine />
          </div>

        </div>

        <div className="mt-7">

          <p className="text-[5px] uppercase tracking-[0.2em] text-[#c8b99f]">
            Languages
          </p>

          <div className="mt-2 space-y-2">
            <DarkLine width="80%" />
            <DarkLine width="60%" />
          </div>

        </div>

      </div>

      <div className="p-5">

        <p className="text-[5px] uppercase tracking-[0.3em] text-[#806b50]">
          Executive Resume
        </p>

        <h2 className="mt-2 font-serif text-2xl leading-[0.88]">
          Alexander
          <br />
          Bennett
        </h2>

        <p className="mt-2 text-[5px] italic text-[#806b50]">
          Creative Director
        </p>

        <div className="mt-3 h-px bg-[#2c241c]/20" />

        <PreviewSection title="Profile">
          <TextLines count={3} />
        </PreviewSection>

        <PreviewSection title="Education">
          <PreviewItem
            title="Master of Design"
            subtitle="Royal College of Art"
          />
        </PreviewSection>

        <PreviewSection title="Experience">
          <PreviewItem
            title="Creative Director"
            subtitle="Atelier & Co. · 2022 — Present"
          />

          <PreviewItem
            title="Senior Designer"
            subtitle="Maison Studio · 2019 — 2022"
          />
        </PreviewSection>

        <PreviewSection title="Projects">
          <PreviewItem
            title="Portfolio Website"
            subtitle="Next.js · TypeScript"
          />
        </PreviewSection>

      </div>

    </div>
  );
}


/* =========================================
   EDITORIAL
========================================= */

function EditorialPreview() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#fffdf8] p-5 shadow-2xl">

      <div className="grid grid-cols-2 gap-3">

        <div>

          <p className="text-[5px] uppercase tracking-[0.3em] text-[#806b50]">
            Curriculum Vitae
          </p>

          <h2 className="mt-2 font-serif text-2xl leading-[0.88]">
            Alexander
          </h2>

          <h2 className="font-serif text-2xl italic leading-[0.88]">
            Bennett
          </h2>

          <p className="mt-2 text-[5px] text-[#806b50]">
            Creative Director
          </p>

        </div>

        <div className="flex justify-end">

          <p className="text-right text-[5px] leading-3 text-[#806b50]">
            London
            <br />
            New York
            <br />
            Paris
          </p>

        </div>

      </div>

      <div className="mt-4 h-16 bg-[#2c241c]" />

      <PreviewSection title="Profile">
        <TextLines count={4} />
      </PreviewSection>

      <PreviewSection title="Education">
        <PreviewItem
          title="Master of Design"
          subtitle="Royal College of Art"
        />
      </PreviewSection>

      <div className="grid grid-cols-2 gap-5">

        <div>

          <PreviewSection title="Experience">
            <PreviewItem
              title="Creative Director"
              subtitle="Atelier & Co."
            />

            <PreviewItem
              title="Senior Designer"
              subtitle="Maison Studio"
            />
          </PreviewSection>

        </div>

        <div>

          <PreviewSection title="Skills">
            <TextLines count={4} />
          </PreviewSection>

        </div>

      </div>

      <PreviewSection title="Projects">
        <PreviewItem
          title="Portfolio Website"
          subtitle="Next.js · TypeScript"
        />
      </PreviewSection>

      <PreviewSection title="Additional Information">
        <TextLines count={3} />
      </PreviewSection>

    </div>
  );
}


/* =========================================
   PREVIEW HELPERS
========================================= */

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3">

      <p className="text-[5px] uppercase tracking-[0.25em] text-[#806b50]">
        {title}
      </p>

      <div className="mt-1">
        {children}
      </div>

    </section>
  );
}


function PreviewItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mt-1.5">

      <div className="h-1.5 w-3/5 bg-[#2c241c]/20" />

      <p className="mt-1 text-[4px] text-[#806b50]">
        {title} · {subtitle}
      </p>

    </div>
  );
}


function TextLines({
  count,
}: {
  count: number;
}) {
  return (
    <div className="space-y-1">

      {Array.from({ length: count }).map(
        (_, index) => (

          <div
            key={index}
            className="h-1 bg-[#2c241c]/10"
            style={{
              width: `${100 - index * 8}%`,
            }}
          />

        )
      )}

    </div>
  );
}


function SmallTag({
  text,
}: {
  text: string;
}) {
  return (
    <span className="border border-[#2c241c]/20 px-1.5 py-0.5 text-[4px]">
      {text}
    </span>
  );
}


function DarkLine({
  width = "100%",
}: {
  width?: string;
}) {
  return (
    <div
      className="h-1 bg-[#f4efe4]/20"
      style={{ width }}
    />
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div>Loading templates...</div>}>
      <TemplatesPageContent />
    </Suspense>
  );
}
