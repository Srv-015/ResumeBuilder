import type { ResumeTemplateProps } from './ResumeRenderer';

function ResumeHeading({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2
        className="uppercase tracking-[0.25em] text-black"
        style={{
          fontSize: '9pt',
          lineHeight: '1.25',
          paddingBottom: '2px',
        }}
      >
        {title}
      </h2>

      <div
        className="mt-2 w-full bg-[#2c241c]/20"
        style={{
          height: '0.6px',
          minHeight: '0.6px',
        }}
      />
    </div>
  );
}

export default function ExecutiveResume({
  personal,
  summary,
  education,
  skills,
  experience,
  projects,
}: ResumeTemplateProps) {
  return (
    <div
      data-resume-page-root
      style={{
        width: '100%',
        minHeight: '269mm',
        boxSizing: 'border-box',
        fontFamily: 'Calibri, Arial, sans-serif',
      }}
    >
      <div className="grid min-h-[269mm] grid-cols-[30%_70%]" style={{ minHeight: '269mm' }}>
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="bg-[#2c241c] p-6 text-[#f4efe4]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f4efe4]/40 text-xs">
            AB
          </div>

          {/* CONTACT */}

          <div className="mt-10">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#c8b99f]">Contact</p>

            <div className="mt-3 space-y-2 text-[8px] leading-4 text-[#c8b99f]">
              {personal.email && <p>{personal.email}</p>}

              {personal.phone && <p>{personal.phone}</p>}

              {personal.location && <p>{personal.location}</p>}

              {personal.website && <p>{personal.website}</p>}
            </div>
          </div>

          {/* SKILLS */}

          <div className="mt-10">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#c8b99f]">Skills</p>

            <div className="mt-3 space-y-2 text-[8px] text-[#c8b99f]">
              {skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="p-7">
          <p className="text-[8px] uppercase tracking-[0.3em] text-[#806b50]">Executive Resume</p>

          <h1 className="mt-3 text-5xl leading-[0.9]">{personal.fullName}</h1>

          <div className="mt-3 h-px bg-[#2c241c]/20" />

          {/* PROFILE */}

          {summary && (
            <section className="mt-6" data-resume-page-section>
              <ResumeHeading title="Profile" />

              <p className="text-[9px] leading-5 text-black">{summary}</p>
            </section>
          )}

          {/* EDUCATION */}

          {education.length > 0 && (
            <section className="mt-6" data-resume-page-section>
              <ResumeHeading title="Education" />

              {education.map((item, index) => (
                <div key={index} className="mb-4" data-resume-page-block>
                  <h3 className="text-base">{item.degree}</h3>

                  <p className="mt-1 text-[8px] text-[#c8b99f]">
                    {item.institution} · {item.startYear} — {item.endYear}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* EXPERIENCE */}

          {experience.length > 0 && (
            <section className="mt-6" data-resume-page-section>
              <ResumeHeading title="Experience" />

              {experience.map((item, index) => (
                <div key={index} className="mb-5" data-resume-page-block>
                  <h3 className="text-base">{item.position}</h3>

                  <p className="mt-1 text-[8px] text-black">
                    {item.company} · {item.startYear} — {item.endYear}
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-black">{item.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS */}

          {projects.length > 0 && (
            <section className="mt-6" data-resume-page-section>
              <ResumeHeading title="Projects" />

              {projects.map((project, index) => (
                <div key={index} className="mb-5" data-resume-page-block>
                  <h3 className="text-base">{project.name}</h3>

                  <p className="mt-1 text-[8px] text-black">{project.technologies}</p>

                  <p className="mt-2 text-[9px] leading-4 text-black">{project.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
