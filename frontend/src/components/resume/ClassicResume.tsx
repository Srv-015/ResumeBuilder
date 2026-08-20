import type { ResumeTemplateProps } from './ResumeRenderer';

export default function ClassicResume({
  personal,
  summary,
  education,
  skills,
  experience,
  projects,
  additionalSections,
  certifications,
  languages,
  interests,
  hobbies,
  achievements,
  awards,
  volunteerExperience,
}: ResumeTemplateProps) {
  return (
    <div
      className="bg-white text-black"
      data-resume-page-root
      style={{
        width: '100%',
        minHeight: '269mm',
        boxSizing: 'border-box',
        fontFamily: 'Calibri, Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.25',
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pb-6" data-resume-page-section>
        <div>
          {/* NAME */}
          <h1
            className="text-center font-bold uppercase text-black"
            style={{
              fontSize: '21pt',
              lineHeight: '1.2',
              letterSpacing: '0.01em',
            }}
          >
            {personal.fullName || 'Your Name'}
          </h1>

          {/* CONTACT INFORMATION */}
          <div
            className="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-black"
            style={{
              fontSize: '9pt',
              lineHeight: '1.4',
            }}
          >
            {personal.location && <span>{personal.location}</span>}

            {personal.email && (
              <>
                <span>|</span>
                <span>{personal.email}</span>
              </>
            )}

            {personal.phone && (
              <>
                <span>|</span>
                <span>{personal.phone}</span>
              </>
            )}

            {personal.website && (
              <>
                <span>|</span>
                <span>{personal.website}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          PROFESSIONAL SUMMARY
      ===================================================== */}

      {summary && (
        <ClassicSection title="PROFESSIONAL SUMMARY">
          <p
            className="text-black"
            style={{
              fontSize: '10pt',
              lineHeight: '1.3',
            }}
          >
            {summary}
          </p>
        </ClassicSection>
      )}

      {/* =====================================================
          TECHNICAL SKILLS
      ===================================================== */}

      {skills.length > 0 && (
        <ClassicSection title="SKILLS">
          <div
            className="grid grid-cols-4 gap-x-8 gap-y-1"
            style={{
              fontSize: '10pt',
              lineHeight: '1.2',
            }}
          >
            {skills.map((skill, index) => (
              <div key={index}>• {skill}</div>
            ))}
          </div>
        </ClassicSection>
      )}

      {/* =====================================================
          EDUCATION
      ===================================================== */}

      {education.length > 0 && (
        <ClassicSection title="EDUCATION">
          <div className="space-y-4">
            {education.map((item, index) => (
              <div key={index} data-resume-page-block>
                <div className="flex items-start justify-between gap-6">
                  {/* UNIVERSITY */}
                  <div className="min-w-0">
                    <p
                      className="font-bold text-black"
                      style={{
                        fontSize: '11pt',
                        lineHeight: '1.2',
                      }}
                    >
                      {item.institution || 'Institution'}
                    </p>

                    {/* DEGREE */}
                    {item.degree && (
                      <p
                        className="mt-1 text-black"
                        style={{
                          fontSize: '9pt',
                          lineHeight: '1.2',
                        }}
                      >
                        {item.degree}
                      </p>
                    )}

                    {/* LOCATION */}
                    {item.location && (
                      <p
                        className="mt-1 text-black"
                        style={{
                          fontSize: '9pt',
                          lineHeight: '1.2',
                        }}
                      >
                        {item.location}
                      </p>
                    )}
                  </div>

                  {/* YEAR */}
                  <p
                    className="shrink-0 text-right font-bold text-black"
                    style={{
                      fontSize: '11pt',
                    }}
                  >
                    {formatResumeDate(item.startYear, item.endYear)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {/* =====================================================
          EXPERIENCE / INTERNSHIP
      ===================================================== */}

      {experience.length > 0 && (
        <ClassicSection title="INTERNSHIP">
          <div className="space-y-5">
            {experience.map((item, index) => (
              <div key={index} data-resume-page-block>
                {/* POSITION + DATE */}
                <div className="flex items-start justify-between gap-6">
                  <p
                    className="font-bold text-black"
                    style={{
                      fontSize: '11pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {item.position}

                    {item.company && (
                      <>
                        {', '}
                        {item.company}
                      </>
                    )}
                  </p>

                  <p
                    className="shrink-0 text-right font-bold text-black"
                    style={{
                      fontSize: '11pt',
                    }}
                  >
                    {formatResumeDate(item.startYear, item.endYear)}
                  </p>
                </div>

                {/* LOCATION */}
                {item.location && (
                  <p
                    className="mt-1 text-black"
                    style={{
                      fontSize: '10pt',
                    }}
                  >
                    {item.location}
                  </p>
                )}

                {/* DESCRIPTION */}
                {item.description && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {formatDescriptionAsBullets(item.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      {projects.length > 0 && (
        <ClassicSection title="PROJECTS">
          <div className="space-y-5">
            {projects.map((project, index) => (
              <div key={index} data-resume-page-block>
                {/* PROJECT TITLE + DATE */}
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p
                      className="font-bold text-black"
                      style={{
                        fontSize: '10.5pt',
                        lineHeight: '1.2',
                      }}
                    >
                      {project.name}
                    </p>

                    {/* TECHNOLOGIES */}
                    {project.technologies && (
                      <p
                        className="mt-1 text-black"
                        style={{
                          fontSize: '10pt',
                        }}
                      >
                        {project.technologies}
                      </p>
                    )}
                  </div>

                  {/* DATE */}
                  <p
                    className="shrink-0 text-right font-bold text-black"
                    style={{
                      fontSize: '10.5pt',
                    }}
                  >
                    {formatResumeDate(project.startYear, project.endYear)}
                  </p>
                </div>

                {/* DESCRIPTION */}
                {project.description && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.3',
                    }}
                  >
                    {formatDescriptionAsBullets(project.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}

      {/* =====================================================
          ADDITIONAL INFORMATION
      ===================================================== */}

      {additionalSections.length > 0 && (
        <ClassicSection title="ADDITIONAL INFORMATION">
          <div className="space-y-4">
            {additionalSections.map((section) => (
              <div key={section.id} data-resume-page-block>
                <p
                  className="font-bold text-black"
                  style={{
                    fontSize: '10pt',
                  }}
                >
                  {section.title}
                </p>

                {/* CERTIFICATIONS */}
                {section.id === 'certifications' && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {certifications.map((item, index) => (
                      <p key={index}>
                        {item.name}

                        {item.issuer && (
                          <>
                            {', '}
                            {item.issuer}
                          </>
                        )}

                        {item.year && (
                          <>
                            {', '}
                            {item.year}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                )}

                {/* LANGUAGES */}
                {section.id === 'languages' && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {languages.map((item, index) => (
                      <p key={index}>
                        {item.name}

                        {item.level && (
                          <>
                            {' — '}
                            {item.level}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                )}

                {/* INTERESTS */}
                {section.id === 'interests' && (
                  <p
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                    }}
                  >
                    {interests.filter(Boolean).join(' • ')}
                  </p>
                )}

                {/* HOBBIES */}
                {section.id === 'hobbies' && (
                  <p
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                    }}
                  >
                    {hobbies.filter(Boolean).join(' • ')}
                  </p>
                )}

                {/* ACHIEVEMENTS */}
                {section.id === 'achievements' && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {achievements.filter(Boolean).map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                )}

                {/* AWARDS */}
                {section.id === 'awards' && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {awards.filter(Boolean).map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                )}

                {/* VOLUNTEER EXPERIENCE */}
                {section.id === 'volunteer-experience' && (
                  <div
                    className="mt-1 text-black"
                    style={{
                      fontSize: '9pt',
                      lineHeight: '1.2',
                    }}
                  >
                    {volunteerExperience.filter(Boolean).map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ClassicSection>
      )}
    </div>
  );
}

/* =========================================================
   CLASSIC SECTION
========================================================= */

function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6" data-resume-page-section style={{ breakInside: 'avoid' }}>
      {/* SECTION TITLE */}
      <div className="mb-5">
        <h2
          className="font-bold text-black"
          style={{
            fontSize: '12pt',
            lineHeight: '1.2',
            paddingBottom: '2px',
          }}
        >
          {title}
        </h2>

        {/* SINGLE UNDERLINE — deliberately separated from the text */}
        <div
          className="mt-2 w-full bg-black"
          style={{
            height: '1.45px',
            minHeight: '1.45px',
          }}
        />
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatResumeDate(startYear: string, endYear: string) {
  if (!startYear && !endYear) {
    return '';
  }

  if (!startYear) {
    return endYear;
  }

  if (!endYear) {
    return startYear;
  }

  return `${startYear} to ${endYear}`;
}

/* =========================================================
   DESCRIPTION → BULLETS
========================================================= */

function formatDescriptionAsBullets(description: string) {
  const items = description
    .split(/\n|(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="list-disc space-y-0.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
