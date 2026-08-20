'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResumeRenderer, {
  type AdditionalSection,
  type Certification,
  type Education,
  type Experience,
  type Language,
  type Personal,
  type Project,
} from '../../../components/resume/ResumeRenderer';

type Resume = {
  _id: string;
  title?: string;
  template?: string;
  personal?: Partial<Personal>;
  summary?: string;
  education?: Education[];
  skills?: string[];
  experience?: Experience[];
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

const emptyPersonal: Personal = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
};

function sectionId(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

function getAdditionalSection(sections: Resume['additionalInformation'], title: string) {
  return sections?.find((section) => section.title === title)?.content;
}

function getArrayContent<T>(content: unknown): T[] {
  return Array.isArray(content) ? (content as T[]) : [];
}

function buildRendererProps(resume: Resume) {
  const additionalInformation = Array.isArray(resume.additionalInformation)
    ? resume.additionalInformation
    : [];

  const additionalSections: AdditionalSection[] = additionalInformation
    .filter((section) => Boolean(section.title))
    .map((section) => ({
      id: sectionId(section.title as string),
      title: section.title as string,
    }));

  return {
    template: resume.template || 'classic',
    personal: { ...emptyPersonal, ...(resume.personal || {}) },
    summary: resume.summary || '',
    education: resume.education || [],
    skills: resume.skills || [],
    experience: resume.experience || [],
    projects: (resume.projects || []).map((project) => ({
      name: project.projectName || '',
      technologies: project.technologies || '',
      link: project.projectLink || '',
      startYear: project.startYear || '',
      endYear: project.endYear || '',
      description: project.description || '',
    })) as Project[],
    additionalSections,
    certifications: getArrayContent<Certification>(
      getAdditionalSection(additionalInformation, 'Certifications')
    ),
    languages: getArrayContent<Language>(getAdditionalSection(additionalInformation, 'Languages')),
    interests: getArrayContent<string>(getAdditionalSection(additionalInformation, 'Interests')),
    hobbies: getArrayContent<string>(getAdditionalSection(additionalInformation, 'Hobbies')),
    achievements: getArrayContent<string>(
      getAdditionalSection(additionalInformation, 'Achievements')
    ),
    awards: getArrayContent<string>(getAdditionalSection(additionalInformation, 'Awards')),
    volunteerExperience: getArrayContent<string>(
      getAdditionalSection(additionalInformation, 'Volunteer Experience')
    ),
  };
}

export default function PublicResumePage() {
  const params = useParams<{ shareToken: string }>();
  const shareToken = params?.shareToken;
  const trackedTokenRef = useRef<string | null>(null);

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shareToken || trackedTokenRef.current === shareToken) return;
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
      } catch (loadError) {
        console.error('Public resume error:', loadError);
        setError(loadError instanceof Error ? loadError.message : 'This resume is not available.');
      } finally {
        setLoading(false);
      }
    };

    void loadPublicResume();
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

  const rendererProps = buildRendererProps(resume);
  const templateLabel = (resume.template || 'classic').toLowerCase();

  return (
    <main className="min-h-screen bg-[#e7dfd1] px-4 py-8 text-[#2c241c] sm:px-8 sm:py-12">
      <div className="mx-auto mb-6 flex w-full max-w-[210mm] items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-[0.2em] transition hover:opacity-60">
          CVÉRÉ
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#806b50]">
          {templateLabel}
        </span>
      </div>

      <div
        className="mx-auto w-[210mm] max-w-full overflow-hidden bg-white shadow-2xl"
        style={{ boxSizing: 'border-box' }}
      >
        <div
          className="bg-white"
          style={{ width: '100%', boxSizing: 'border-box', padding: '14mm' }}
        >
          <ResumeRenderer {...rendererProps} />
        </div>
      </div>

      <footer className="mx-auto mt-8 flex w-full max-w-[210mm] items-center justify-between border-t border-[#2c241c]/15 pt-5 text-[10px] uppercase tracking-[0.18em] text-[#806b50]">
        <span>CVÉRÉ</span>
        <span>Resumes with character.</span>
      </footer>
    </main>
  );
}
