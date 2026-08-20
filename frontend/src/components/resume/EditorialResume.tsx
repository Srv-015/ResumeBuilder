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

export default function EditorialResume({
  personal,
  summary,
  education,
  skills,
  experience,
  projects,
}: ResumeTemplateProps) {
  return (
    <div
      className="text-black"
      data-resume-page-root
      style={{
        width: '100%',
        minHeight: '269mm',
        boxSizing: 'border-box',
        fontFamily: 'Calibri, Arial, sans-serif',
      }}
    >
      {/* HEADER */}
      <header className="grid grid-cols-2 gap-6" data-resume-page-section>
        <div>
          <p className="uppercase tracking-[0.3em] text-[#806b50]" style={{ fontSize: '8pt' }}>
            Curriculum Vitae
          </p>

          <h1
            className="mt-3 leading-[0.9]"
            style={{
              fontSize: '21pt',
              fontWeight: 700,
            }}
          >
            {personal.fullName || 'Your Name'}
          </h1>

          <p className="mt-3 text-[#806b50]" style={{ fontSize: '9pt' }}>
            {experience[0]?.position || 'Professional'}
          </p>
        </div>

        <div className="text-right leading-4 text-[#806b50]" style={{ fontSize: '9pt' }}>
          {personal.location && <p>{personal.location}</p>}
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.website && <p>{personal.website}</p>}
        </div>
      </header>

      {/* EDITORIAL BROWN BAR */}
      <div className="mt-5 h-20 bg-[#2c241c]" data-resume-page-section />

      {/* SUMMARY */}
      {summary && (
        <section className="mt-7" data-resume-page-section style={{ breakInside: 'avoid' }}>
          <ResumeHeading title="About" />

          <p className="max-w-xl leading-5 text-[#5e5143]" style={{ fontSize: '11pt' }}>
            {summary}
          </p>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section className="mt-7" data-resume-page-section style={{ breakInside: 'avoid' }}>
          <ResumeHeading title="Education" />

          {education.map((item, index) => (
            <div key={index} className="mb-4" data-resume-page-block>
              <h3
                className="font-semibold"
                style={{
                  fontSize: '11pt',
                  lineHeight: '1.3',
                }}
              >
                {item.degree}
              </h3>

              <p
                className="mt-1 text-[#806b50]"
                style={{
                  fontSize: '10.5pt',
                  lineHeight: '1.3',
                }}
              >
                {item.institution}
                {(item.startYear || item.endYear) && ' · '}
                {item.startYear}
                {item.startYear || item.endYear ? ' — ' : ''}
                {item.endYear}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE + SKILLS */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          {experience.length > 0 && (
            <section className="mt-7" data-resume-page-section>
              <ResumeHeading title="Experience" />

              {experience.map((item, index) => (
                <div key={index} className="mb-5" data-resume-page-block>
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: '11pt',
                      lineHeight: '1.3',
                    }}
                  >
                    {item.position}
                  </h3>

                  <p
                    className="mt-1 text-[#806b50]"
                    style={{
                      fontSize: '10.5pt',
                      lineHeight: '1.3',
                    }}
                  >
                    {item.company}
                    {(item.startYear || item.endYear) && ' · '}
                    {item.startYear}
                    {item.startYear || item.endYear ? ' — ' : ''}
                    {item.endYear}
                  </p>

                  {item.description && (
                    <EditorialBulletList text={item.description} className="mt-2" />
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        <div>
          {skills.length > 0 && (
            <section className="mt-7" data-resume-page-section>
              <ResumeHeading title="Skills" />

              <ul
                className="space-y-2 text-[#5e5143]"
                style={{
                  fontSize: '10.5pt',
                  lineHeight: '1.35',
                }}
              >
                {skills.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mt-7" data-resume-page-section style={{ breakInside: 'avoid' }}>
          <ResumeHeading title="Projects" />

          <div className="grid grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="mb-4" data-resume-page-block>
                <h3
                  className="font-semibold"
                  style={{
                    fontSize: '11pt',
                    lineHeight: '1.3',
                  }}
                >
                  {project.name}
                </h3>

                {project.technologies && (
                  <p
                    className="mt-1 text-[#806b50]"
                    style={{
                      fontSize: '10.5pt',
                      lineHeight: '1.3',
                    }}
                  >
                    {project.technologies}
                  </p>
                )}

                {project.description && (
                  <EditorialBulletList text={project.description} className="mt-2" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EditorialBulletList({ text, className = '' }: { text: string; className?: string }) {
  const items = text
    .split(/\n|•/)
    .map((item) => item.replace(/^[\s•▪◦\-–—]+/, '').trim())
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <ul
      className={`list-disc space-y-1 pl-5 text-[#5e5143] ${className}`}
      style={{
        fontSize: '10.5pt',
        lineHeight: '1.35',
      }}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
