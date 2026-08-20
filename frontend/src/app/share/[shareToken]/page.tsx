'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Resume = {
  _id: string;
  title?: string;
  template?: string;
  personal?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  summary?: string;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startYear?: string;
    endYear?: string;
  }>;
  skills?: string[];
  experience?: Array<{
    position?: string;
    company?: string;
    location?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }>;
  projects?: Array<{
    projectName?: string;
    technologies?: string;
    projectLink?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }>;
  additionalInformation?: Array<{
    title?: string;
    content?: unknown;
  }>;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/api/resumes`;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-[#2c241c]/20 pb-2 text-[10px] uppercase tracking-[0.28em] text-[#806b50]">
      {children}
    </h2>
  );
}

function ClassicResume({ resume }: { resume: Resume }) {
  const personal = resume.personal || {};

  return (
    <article className="mx-auto w-full max-w-[850px] bg-[#fffdf8] px-8 py-10 text-[#2c241c] shadow-[0_15px_50px_rgba(44,36,28,0.12)] sm:px-12 sm:py-14">
      <header className="border-b border-[#2c241c]/30 pb-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#806b50]">Curriculum Vitae</p>

        <h1 className="mt-3 font-serif text-4xl leading-none sm:text-6xl">
          {personal.fullName || resume.title || 'Your Name'}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#5e5143]">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </header>

      {resume.summary && (
        <section className="mt-7">
          <SectionTitle>Profile</SectionTitle>
          <p className="text-sm leading-7 text-[#5e5143]">{resume.summary}</p>
        </section>
      )}

      {resume.education?.length ? (
        <section className="mt-7">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-5">
            {resume.education.map((item, index) => (
              <div key={index}>
                <h3 className="font-serif text-lg">{item.degree}</h3>
                <p className="mt-1 text-xs text-[#806b50]">
                  {item.institution}
                  {item.location ? ` · ${item.location}` : ''}
                  {item.startYear || item.endYear
                    ? ` · ${item.startYear || ''} — ${item.endYear || ''}`
                    : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {resume.experience?.length ? (
        <section className="mt-7">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-6">
            {resume.experience.map((item, index) => (
              <div key={index}>
                <h3 className="font-serif text-lg">{item.position}</h3>
                <p className="mt-1 text-xs text-[#806b50]">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ''}
                  {item.startYear || item.endYear
                    ? ` · ${item.startYear || ''} — ${item.endYear || ''}`
                    : ''}
                </p>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-[#5e5143]">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {resume.skills?.length ? (
        <section className="mt-7">
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="border border-[#2c241c]/20 px-3 py-1 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {resume.projects?.length ? (
        <section className="mt-7">
          <SectionTitle>Projects</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-serif text-lg">{project.projectName}</h3>
                {project.technologies && (
                  <p className="mt-1 text-xs text-[#806b50]">{project.technologies}</p>
                )}
                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-[#5e5143]">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {resume.additionalInformation?.length ? (
        <section className="mt-7">
          <SectionTitle>Additional Information</SectionTitle>
          <div className="space-y-4">
            {resume.additionalInformation.map((item, index) => (
              <div key={index}>
                {item.title && <h3 className="font-serif text-base">{item.title}</h3>}
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#5e5143]">
                  {Array.isArray(item.content)
                    ? item.content.join(' · ')
                    : String(item.content ?? '')}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function ExecutiveResume({ resume }: { resume: Resume }) {
  const personal = resume.personal || {};

  return (
    <article className="mx-auto grid w-full max-w-[850px] overflow-hidden bg-[#fffdf8] text-[#2c241c] shadow-[0_15px_50px_rgba(44,36,28,0.12)] md:grid-cols-[220px_1fr]">
      <aside className="bg-[#2c241c] p-7 text-[#f4efe4]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f4efe4]/30 font-serif text-lg">
          {(personal.fullName || 'CV')
            .split(/\s+/)
            .slice(0, 2)
            .map((part: string) => part[0])
            .join('')
            .toUpperCase()}
        </div>

        <h1 className="mt-6 font-serif text-3xl leading-tight">
          {personal.fullName || resume.title || 'Your Name'}
        </h1>

        <div className="mt-6 space-y-2 text-xs leading-5 text-[#c8b99f]">
          {personal.email && <p className="break-words">{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.website && <p>{personal.website}</p>}
        </div>

        {resume.skills?.length ? (
          <div className="mt-9">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#c8b99f]">Skills</p>
            <div className="mt-3 space-y-2 text-xs text-[#f4efe4]/90">
              {resume.skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <div className="p-7 sm:p-10">
        {resume.summary && (
          <section>
            <SectionTitle>Profile</SectionTitle>
            <p className="text-sm leading-7 text-[#5e5143]">{resume.summary}</p>
          </section>
        )}

        {resume.experience?.length ? (
          <section className="mt-8">
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-6">
              {resume.experience.map((item, index) => (
                <div key={index}>
                  <h2 className="font-serif text-xl">{item.position}</h2>
                  <p className="mt-1 text-xs text-[#806b50]">
                    {item.company}
                    {item.startYear || item.endYear
                      ? ` · ${item.startYear || ''} — ${item.endYear || ''}`
                      : ''}
                  </p>
                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-[#5e5143]">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {resume.education?.length ? (
          <section className="mt-8">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-5">
              {resume.education.map((item, index) => (
                <div key={index}>
                  <h2 className="font-serif text-lg">{item.degree}</h2>
                  <p className="mt-1 text-xs text-[#806b50]">
                    {item.institution}
                    {item.startYear || item.endYear
                      ? ` · ${item.startYear || ''} — ${item.endYear || ''}`
                      : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {resume.projects?.length ? (
          <section className="mt-8">
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-5">
              {resume.projects.map((project, index) => (
                <div key={index}>
                  <h2 className="font-serif text-lg">{project.projectName}</h2>
                  {project.technologies && (
                    <p className="mt-1 text-xs text-[#806b50]">{project.technologies}</p>
                  )}
                  {project.description && (
                    <p className="mt-2 text-sm leading-6 text-[#5e5143]">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function EditorialResume({ resume }: { resume: Resume }) {
  const personal = resume.personal || {};

  return (
    <article className="mx-auto w-full max-w-[850px] bg-[#f8f3ea] px-7 py-10 text-[#2c241c] shadow-[0_15px_50px_rgba(44,36,28,0.12)] sm:px-12 sm:py-14">
      <header className="grid gap-6 border-b border-[#2c241c]/20 pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#806b50]">
            Selected Work & Experience
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.9] sm:text-7xl">
            {personal.fullName || resume.title || 'Your Name'}
          </h1>
        </div>

        <div className="text-xs leading-6 text-[#5e5143] md:text-right">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.website && <p>{personal.website}</p>}
        </div>
      </header>

      {resume.summary && (
        <section className="mt-9 grid gap-5 md:grid-cols-[150px_1fr]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#806b50]">Profile</p>
          <p className="max-w-2xl text-sm leading-7 text-[#5e5143]">{resume.summary}</p>
        </section>
      )}

      {resume.experience?.length ? (
        <section className="mt-10">
          <SectionTitle>Experience</SectionTitle>
          <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
            {resume.experience.map((item, index) => (
              <div key={index}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#806b50]">
                  {item.startYear || ''} {item.endYear ? `— ${item.endYear}` : ''}
                </p>
                <h2 className="mt-2 font-serif text-2xl">{item.position}</h2>
                <p className="mt-1 text-xs text-[#806b50]">{item.company}</p>
                {item.description && (
                  <p className="mt-3 text-sm leading-6 text-[#5e5143]">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {resume.education?.length ? (
        <section className="mt-10">
          <SectionTitle>Education</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            {resume.education.map((item, index) => (
              <div key={index}>
                <h2 className="font-serif text-xl">{item.degree}</h2>
                <p className="mt-1 text-xs text-[#806b50]">
                  {item.institution}
                  {item.startYear || item.endYear
                    ? ` · ${item.startYear || ''} — ${item.endYear || ''}`
                    : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {resume.skills?.length ? (
        <section className="mt-10">
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5e5143]">
            {resume.skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </section>
      ) : null}

      {resume.projects?.length ? (
        <section className="mt-10">
          <SectionTitle>Projects</SectionTitle>
          <div className="grid gap-7 md:grid-cols-2">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h2 className="font-serif text-xl">{project.projectName}</h2>
                {project.technologies && (
                  <p className="mt-1 text-xs text-[#806b50]">{project.technologies}</p>
                )}
                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-[#5e5143]">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function ResumeView({ resume }: { resume: Resume }) {
  const template = resume.template?.toLowerCase() || 'classic';

  if (template === 'executive') {
    return <ExecutiveResume resume={resume} />;
  }

  if (template === 'editorial') {
    return <EditorialResume resume={resume} />;
  }

  return <ClassicResume resume={resume} />;
}

export default function PublicResumePage() {
  const params = useParams<{ shareToken: string }>();
  const shareToken = params?.shareToken;

  const trackedTokenRef = useRef<string | null>(null);

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shareToken) {
      return;
    }

    // Prevent React Strict Mode from counting
    // the same page visit twice during development.
    if (trackedTokenRef.current === shareToken) {
      return;
    }

    trackedTokenRef.current = shareToken;

    const loadPublicResume = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/public/${encodeURIComponent(shareToken)}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'This resume is not available.');
        }

        setResume(data.resume);
      } catch (error) {
        console.error('Public resume error:', error);

        setError(error instanceof Error ? error.message : 'This resume is not available.');
      } finally {
        setLoading(false);
      }
    };

    loadPublicResume();
  }, [shareToken]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#e7dfd1] text-[#2c241c]">
        <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">Loading resume...</p>
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#e7dfd1] px-6 text-[#2c241c]">
        <div className="w-full max-w-md border border-[#2c241c]/20 bg-[#f4efe4] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">Resume unavailable</p>

          <h1 className="mt-4 font-serif text-4xl">This link is no longer available.</h1>

          <p className="mt-4 text-sm leading-6 text-[#5e5143]">
            The resume may have been made private or the link may be invalid.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex bg-[#2c241c] px-6 py-3 text-xs uppercase tracking-[0.18em] text-[#f4efe4] transition hover:bg-[#4a3b2d]"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7dfd1] px-4 py-8 text-[#2c241c] sm:px-8 sm:py-12">
      <div className="mx-auto mb-6 flex w-full max-w-[850px] items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-[0.2em] transition hover:opacity-60">
          CVÉRÉ
        </Link>

        <span className="text-[10px] uppercase tracking-[0.2em] text-[#806b50]">
          {resume.template || 'Classic'}
        </span>
      </div>

      <ResumeView resume={resume} />

      <footer className="mx-auto mt-8 flex w-full max-w-[850px] items-center justify-between border-t border-[#2c241c]/15 pt-5 text-[10px] uppercase tracking-[0.18em] text-[#806b50]">
        <span>CVÉRÉ</span>
        <span>Resumes with character.</span>
      </footer>
    </main>
  );
}
