'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

type StoredUser = {
  id?: string;
  name?: string;
  email?: string;
};

type Resume = {
  _id: string;
  title: string;
  template: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  shareToken?: string;
  views?: number;
  lastViewedAt?: string;

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
function DashboardResumePreview({
  resume,
}: {
  resume: Resume;
}) {
  const template = resume.template?.toLowerCase() || 'classic';

  if (template === 'executive') {
    return <ExecutiveDashboardPreview resume={resume} />;
  }

  if (template === 'editorial') {
    return <EditorialDashboardPreview resume={resume} />;
  }

  return <ClassicDashboardPreview resume={resume} />;
}

function getInitials(name?: string) {
  if (!name?.trim()) {
    return 'CV';
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function displayName(resume: Resume) {
  return resume.personal?.fullName?.trim() || resume.title || 'Untitled Resume';
}

function shortText(value?: string, fallback = '') {
  const text = value?.trim() || fallback;

  if (text.length <= 90) {
    return text;
  }

  return `${text.slice(0, 87)}...`;
}

function ClassicDashboardPreview({
  resume,
}: {
  resume: Resume;
}) {
  const name = displayName(resume);
  const summary = shortText(resume.summary, 'Professional summary');
  const education = resume.education?.[0];
  const experience = resume.experience?.[0];

  return (
    <div className="h-full w-44 overflow-hidden bg-[#fffdf8] p-4 shadow-[0_8px_25px_rgba(44,36,28,0.12)]">
      <div className="border-b border-[#2c241c]/30 pb-2">
        <p className="truncate font-serif text-[13px] font-semibold leading-tight">
          {name}
        </p>

        <p className="mt-1 truncate text-[5px] text-[#806b50]">
          {resume.personal?.email || resume.personal?.location || 'Professional Resume'}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
          Profile
        </p>

        <p className="mt-1 text-[5px] leading-[1.5] text-[#5e5143]">
          {summary}
        </p>
      </div>

      {education && (
        <div className="mt-3">
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Education
          </p>

          <p className="mt-1 truncate text-[6px] font-medium">
            {education.degree || 'Education'}
          </p>

          <p className="truncate text-[5px] text-[#806b50]">
            {education.institution || ''}
          </p>
        </div>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <div className="mt-3">
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Skills
          </p>

          <p className="mt-1 line-clamp-2 text-[5px] leading-[1.5] text-[#5e5143]">
            {resume.skills.slice(0, 6).join(' · ')}
          </p>
        </div>
      )}

      {experience && (
        <div className="mt-3">
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Experience
          </p>

          <p className="mt-1 truncate text-[6px] font-medium">
            {experience.position || 'Experience'}
          </p>

          <p className="truncate text-[5px] text-[#806b50]">
            {experience.company || ''}
          </p>
        </div>
      )}
    </div>
  );
}

function ExecutiveDashboardPreview({
  resume,
}: {
  resume: Resume;
}) {
  const name = displayName(resume);
  const summary = shortText(resume.summary, 'Professional summary');
  const experience = resume.experience?.[0];

  return (
    <div className="grid h-full w-44 grid-cols-[34%_66%] overflow-hidden bg-[#fffdf8] shadow-[0_8px_25px_rgba(44,36,28,0.12)]">
      <div className="bg-[#2c241c] p-3 text-[#f4efe4]">
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#f4efe4]/40 text-[5px]">
          {getInitials(resume.personal?.fullName)}
        </div>

        <div className="mt-5">
          <p className="text-[4px] uppercase tracking-[0.2em] text-[#c8b99f]">
            Contact
          </p>

          <div className="mt-2 space-y-1.5 text-[4px] leading-tight text-[#f4efe4]/80">
            {resume.personal?.email && (
              <p className="break-all">{resume.personal.email}</p>
            )}

            {resume.personal?.phone && (
              <p>{resume.personal.phone}</p>
            )}

            {resume.personal?.location && (
              <p>{resume.personal.location}</p>
            )}
          </div>
        </div>

        {resume.skills && resume.skills.length > 0 && (
          <div className="mt-5">
            <p className="text-[4px] uppercase tracking-[0.2em] text-[#c8b99f]">
              Skills
            </p>

            <p className="mt-2 text-[4px] leading-[1.6] text-[#f4efe4]/80">
              {resume.skills.slice(0, 6).join(' · ')}
            </p>
          </div>
        )}
      </div>

      <div className="overflow-hidden p-4">
        <p className="truncate font-serif text-[12px] font-semibold leading-tight">
          {name}
        </p>

        <p className="mt-1 truncate text-[5px] text-[#806b50]">
          {experience?.position || 'Professional'}
        </p>

        <div className="mt-3 h-px bg-[#2c241c]/20" />

        <div className="mt-4">
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Profile
          </p>

          <p className="mt-1 text-[5px] leading-[1.5] text-[#5e5143]">
            {summary}
          </p>
        </div>

        {experience && (
          <div className="mt-4">
            <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
              Experience
            </p>

            <p className="mt-1 truncate text-[6px] font-medium">
              {experience.position || 'Experience'}
            </p>

            <p className="truncate text-[5px] text-[#806b50]">
              {experience.company || ''}
            </p>
          </div>
        )}

        {resume.education?.[0] && (
          <div className="mt-4">
            <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
              Education
            </p>

            <p className="mt-1 truncate text-[6px]">
              {resume.education[0].degree || 'Education'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EditorialDashboardPreview({
  resume,
}: {
  resume: Resume;
}) {
  const name = displayName(resume);
  const nameParts = name.split(/\s+/);
  const firstName = nameParts[0] || 'Your';
  const lastName = nameParts.slice(1).join(' ') || 'Resume';
  const summary = shortText(resume.summary, 'Professional summary');
  const experience = resume.experience?.[0];

  return (
    <div className="h-full w-44 overflow-hidden bg-[#fffdf8] p-4 shadow-[0_8px_25px_rgba(44,36,28,0.12)]">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[4px] uppercase tracking-[0.25em] text-[#806b50]">
            Curriculum Vitae
          </p>

          <p className="mt-1 truncate font-serif text-[13px] leading-none">
            {firstName}
          </p>

          <p className="truncate font-serif text-[13px] italic leading-none">
            {lastName}
          </p>

          <p className="mt-1 truncate text-[5px] text-[#806b50]">
            {experience?.position || 'Professional'}
          </p>
        </div>

        <div className="text-right text-[4px] leading-[1.5] text-[#806b50]">
          {resume.personal?.location && (
            <p className="truncate">{resume.personal.location}</p>
          )}

          {resume.personal?.email && (
            <p className="truncate">{resume.personal.email}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex h-7 items-center bg-[#2c241c] px-2">
        <p className="line-clamp-2 text-[4px] leading-[1.4] text-[#f4efe4]/80">
          {summary}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Experience
          </p>

          {experience ? (
            <>
              <p className="mt-1 truncate text-[6px] font-medium">
                {experience.position || 'Experience'}
              </p>

              <p className="truncate text-[5px] text-[#806b50]">
                {experience.company || ''}
              </p>
            </>
          ) : (
            <p className="mt-1 text-[5px] text-[#5e5143]">
              No experience added
            </p>
          )}
        </div>

        <div>
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Skills
          </p>

          <p className="mt-1 line-clamp-4 text-[5px] leading-[1.5] text-[#5e5143]">
            {resume.skills?.length
              ? resume.skills.slice(0, 5).join(' · ')
              : 'No skills added'}
          </p>
        </div>
      </div>

      {resume.education?.[0] && (
        <div className="mt-4">
          <p className="text-[5px] uppercase tracking-[0.2em] text-[#806b50]">
            Education
          </p>

          <p className="mt-1 truncate text-[6px] font-medium">
            {resume.education[0].degree || 'Education'}
          </p>

          <p className="truncate text-[5px] text-[#806b50]">
            {resume.education[0].institution || ''}
          </p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const [renameResume, setRenameResume] = useState<Resume | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const [shareResume, setShareResume] = useState<Resume | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const loadResumes = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch(
          `${API_URL}/api/resumes/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            router.replace('/login');
            return;
          }

          throw new Error(
            data.message || 'Failed to load resumes'
          );
        }

        setResumes(data.resumes || []);
      } catch (error) {
        console.error('Load resumes error:', error);

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load resumes'
        );
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, [router]);

  const deleteResume = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resume?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/api/resumes/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          router.replace('/login');
          return;
        }

        throw new Error(
          data.message || 'Failed to delete resume'
        );
      }

      setResumes((currentResumes) =>
        currentResumes.filter(
          (resume) => resume._id !== id
        )
      );
    } catch (error) {
      console.error('Delete resume error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete resume'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const duplicateResume = async (resume: Resume) => {
    try {
      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      setDuplicatingId(resume._id);
      setError('');

      const duplicateData = {
        title: `${resume.title || 'My Resume'} Copy`,
        template: resume.template || 'classic',
        personal: resume.personal || {},
        summary: resume.summary || '',
        education: resume.education || [],
        skills: resume.skills || [],
        experience: resume.experience || [],
        projects: resume.projects || [],
        additionalInformation: resume.additionalInformation || [],
      };

      const response = await fetch(
        `${API_URL}/api/resumes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(duplicateData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          router.replace('/login');
          return;
        }

        throw new Error(
          data.message || 'Failed to duplicate resume'
        );
      }

      if (data.resume) {
        setResumes((currentResumes) => [
          data.resume,
          ...currentResumes,
        ]);
      }
    } catch (error) {
      console.error('Duplicate resume error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to duplicate resume'
      );
    } finally {
      setDuplicatingId(null);
    }
  };

  const saveRename = async () => {
    if (!renameResume) {
      return;
    }

    const trimmedTitle = renameTitle.trim();

    if (!trimmedTitle) {
      setError('Please enter a resume name.');
      return;
    }

    try {
      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      setIsRenaming(true);
      setError('');

      const response = await fetch(
        `${API_URL}/api/resumes/${renameResume._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trimmedTitle,
            template: renameResume.template || 'classic',
            personal: renameResume.personal || {},
            summary: renameResume.summary || '',
            education: renameResume.education || [],
            skills: renameResume.skills || [],
            experience: renameResume.experience || [],
            projects: renameResume.projects || [],
            additionalInformation:
              renameResume.additionalInformation || [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          router.replace('/login');
          return;
        }

        throw new Error(
          data.message || 'Failed to rename resume'
        );
      }

      const updatedResume = data.resume || {
        ...renameResume,
        title: trimmedTitle,
      };

      setResumes((currentResumes) =>
        currentResumes.map((resume) =>
          resume._id === renameResume._id
            ? updatedResume
            : resume
        )
      );

      setRenameResume(null);
      setRenameTitle('');
    } catch (error) {
      console.error('Rename resume error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to rename resume'
      );
    } finally {
      setIsRenaming(false);
    }
  };

  const toggleResumeSharing = async () => {
    if (!shareResume) {
      return;
    }

    try {
      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      setIsSharing(true);
      setError('');
      setShareCopied(false);

      const response = await fetch(
        `${API_URL}/api/resumes/${shareResume._id}/share`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          router.replace('/login');
          return;
        }

        throw new Error(
          data.message || 'Failed to update sharing settings'
        );
      }

      setResumes((currentResumes) =>
        currentResumes.map((resume) =>
          resume._id === shareResume._id
            ? {
                ...resume,
                isPublic: data.isPublic,
                shareToken: data.isPublic
                  ? data.shareToken || resume.shareToken
                  : resume.shareToken,
              }
            : resume
        )
      );

      setShareResume((current) =>
        current
          ? {
              ...current,
              isPublic: data.isPublic,
              shareToken: data.isPublic
                ? data.shareToken || current.shareToken
                : current.shareToken,
            }
          : null
      );
    } catch (error) {
      console.error('Share resume error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update sharing settings'
      );
    } finally {
      setIsSharing(false);
    }
  };

  const getShareUrl = () => {
    if (!shareResume?.shareToken || typeof window === 'undefined') {
      return '';
    }

    return `${window.location.origin}/share/${shareResume.shareToken}`;
  };

  const copyShareLink = async () => {
    const shareUrl = getShareUrl();

    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);

      window.setTimeout(() => {
        setShareCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy share link error:', error);
      setError('Unable to copy the share link.');
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return 'Recently';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="border-b border-[#2c241c]/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">

          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.2em]"
          >
            CVÉRÉ
          </Link>

          <div className="flex items-center gap-4">

            <Link
              href="/templates"
              className="hidden text-xs uppercase tracking-[0.18em] transition hover:opacity-60 md:block"
            >
              Templates
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowProfileMenu((current) => !current)
                }
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                className="flex h-10 w-10 items-center justify-center border border-[#2c241c]/30 bg-[#f4efe4] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5"
                  />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-64 border border-[#2c241c]/20 bg-[#f4efe4] shadow-[0_18px_45px_rgba(44,36,28,0.15)]">
                  <div className="border-b border-[#2c241c]/15 px-5 py-4">
                    <p className="truncate font-serif text-lg">
                      {user?.name || 'User'}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#806b50]">
                      {user?.email || ''}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-5 py-3 text-sm transition hover:bg-[#e9e0d1]"
                    >
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');

                        setUser(null);
                        setShowProfileMenu(false);

                        router.replace('/login');
                      }}
                      className="w-full border-t border-[#2c241c]/15 px-5 py-3 text-left text-sm transition hover:bg-[#e9e0d1]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">

        {/* Header */}

        <div className="flex flex-col justify-between gap-8 border-b border-[#2c241c]/15 pb-10 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">
              Dashboard
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
              Your resumes.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5e5143]">
              Create, edit and manage your professional
              resumes in one place.
            </p>

          </div>

          <Link
            href="/templates"
            className="inline-flex w-fit items-center justify-center bg-[#2c241c] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d]"
          >
            + New Resume
          </Link>

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-8 border border-red-900/20 bg-red-900/5 px-5 py-4 text-sm text-red-900">
            {error}
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="py-20 text-center">

            <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
              Loading your resumes...
            </p>

          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && !error && resumes.length === 0 && (
          <div className="py-24 text-center">

            <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">
              No resumes yet
            </p>

            <h2 className="mt-5 font-serif text-4xl">
              Start your first resume.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#5e5143]">
              Choose a template and start building a resume
              that represents your experience and ambitions.
            </p>

            <Link
              href="/templates"
              className="mt-8 inline-flex bg-[#2c241c] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d]"
            >
              Create Resume
            </Link>

          </div>
        )}

        {/* =====================================================
            RESUME GRID
        ===================================================== */}

        {!loading && resumes.length > 0 && (
          <div className="pt-10">

            <div className="mb-6 flex items-center justify-between">

              <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                My Resumes
              </p>

              <p className="text-xs text-[#806b50]">
                {resumes.length}{' '}
                {resumes.length === 1
                  ? 'resume'
                  : 'resumes'}
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {resumes.map((resume) => (
                <article
                  key={resume._id}
                  className="group border border-[#2c241c]/20 bg-[#eee7d8] transition hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(44,36,28,0.08)]"
                >

                  {/* Resume Preview */}

                  <div className="relative flex h-64 items-center justify-center overflow-hidden border-b border-[#2c241c]/15 bg-[#e7decd] p-6">

                    <DashboardResumePreview
                      resume={resume}
                    />

                    {/* Template Label */}

                    <div className="absolute left-4 top-4 border border-[#2c241c]/20 bg-[#f4efe4]/90 px-3 py-1">
                      <span className="text-[10px] uppercase tracking-[0.15em]">
                        {resume.template || 'Classic'}
                      </span>
                    </div>

                    {/* Preview Actions */}

                    <div className="absolute right-4 top-4 flex items-center gap-2">
                      {/* Duplicate / Copy */}

                      <button
                        type="button"
                        onClick={() => duplicateResume(resume)}
                        disabled={duplicatingId === resume._id}
                        aria-label={`Duplicate ${resume.title || 'resume'}`}
                        title="Duplicate resume"
                        className="flex h-10 w-10 items-center justify-center border border-[#2c241c]/20 bg-[#f4efe4]/90 text-xl leading-none transition hover:bg-[#2c241c] hover:text-[#f4efe4] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {duplicatingId === resume._id ? (
                          '…'
                        ) : (
                          '⧉'
                        )}
                      </button>

                      {/* Share */}

                      <button
                        type="button"
                        onClick={() => {
                          setShareResume(resume);
                          setShareCopied(false);
                          setError('');
                        }}
                        aria-label={`Share ${resume.title || 'resume'}`}
                        title="Share resume"
                        className="flex h-10 w-10 items-center justify-center border border-[#2c241c]/20 bg-[#f4efe4]/90 text-[#2c241c] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="h-[18px] w-[18px] fill-current"
                          aria-hidden="true"
                        >
                          <path d="M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z" />
                        </svg>
                      </button>
                    </div>

                  </div>

                  {/* Resume Information */}

                  <div className="p-6">

                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl">
                        {resume.title || 'Untitled Resume'}
                      </h2>

                      <button
                        type="button"
                        onClick={() => {
                          setRenameResume(resume);
                          setRenameTitle(
                            resume.title || 'Untitled Resume'
                          );
                          setError('');
                        }}
                        aria-label={`Rename ${resume.title || 'resume'}`}
                        title="Rename resume"
                        className="flex h-9 w-9 items-center justify-center text-[#2c241c] transition hover:opacity-60"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 512 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M44 84C44 61.9 61.9 44 84 44H253C269.6 44 283 57.4 283 74C283 90.6 269.6 104 253 104H104V408H408V259C408 242.4 421.4 229 438 229C454.6 229 468 242.4 468 259V428C468 450.1 450.1 468 428 468H84C61.9 468 44 450.1 44 428V84Z"
                            fill="currentColor"
                          />
                          <path
                            d="M193 235L359 69L443 153L277 319L198 336L193 235Z"
                            fill="currentColor"
                          />
                          <path
                            d="M381 47L397 31C414.1 13.9 441.9 13.9 459 31L481 53C498.1 70.1 498.1 97.9 481 115L465 131L381 47Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-[#806b50]">
                      <span>Updated {formatDate(resume.updatedAt)}</span>

                      {resume.isPublic && (
                        <>
                          <span className="text-[#2c241c]/25">•</span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6f7650]" />
                            Public
                          </span>
                          <span className="text-[#2c241c]/25">•</span>
                          <span>{resume.views ?? 0} Views</span>

                          {resume.lastViewedAt && (
                            <>
                              <span className="text-[#2c241c]/25">•</span>
                              <span>
                                Last viewed {formatDate(resume.lastViewedAt)}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      <Link
                        href={`/resume?id=${resume._id}&template=${resume.template || 'classic'}`}
                        className="flex-1 bg-[#2c241c] px-4 py-3 text-center text-xs uppercase tracking-[0.15em] text-[#f4efe4] transition hover:bg-[#4a3b2d]"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/templates?resumeId=${resume._id}`}
                        className="border border-[#2c241c]/30 px-4 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
                      >
                        Template
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          deleteResume(resume._id)
                        }
                        disabled={
                          deletingId === resume._id
                        }
                        className="border border-[#2c241c]/30 px-4 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === resume._id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          </div>
        )}

      </section>

      {/* =====================================================
          SHARE MODAL
      ===================================================== */}

      {shareResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c241c]/35 px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSharing) {
              setShareResume(null);
              setShareCopied(false);
            }
          }}
        >
          <div className="w-full max-w-md border border-[#2c241c]/20 bg-[#f4efe4] p-7 shadow-[0_20px_60px_rgba(44,36,28,0.18)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                  Share Resume
                </p>

                <h2 className="mt-3 font-serif text-3xl">
                  {shareResume.isPublic
                    ? 'Your resume is public.'
                    : 'Make your resume public.'}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#5e5143]">
                  {shareResume.isPublic
                    ? 'Anyone with the link can view this resume.'
                    : 'Create a private share link that you can send to employers or anyone you choose.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isSharing) {
                    setShareResume(null);
                    setShareCopied(false);
                  }
                }}
                aria-label="Close share dialog"
                className="text-xl leading-none text-[#806b50] transition hover:text-[#2c241c] disabled:opacity-50"
                disabled={isSharing}
              >
                ×
              </button>
            </div>

            {shareResume.isPublic && shareResume.shareToken && (
              <div className="mt-7">
                <label
                  htmlFor="share-url"
                  className="mb-2 block text-xs uppercase tracking-[0.2em]"
                >
                  Public Link
                </label>

                <div className="flex border border-[#2c241c]/20 bg-white/30">
                  <input
                    id="share-url"
                    readOnly
                    value={getShareUrl()}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-xs outline-none"
                  />

                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="shrink-0 border-l border-[#2c241c]/20 px-4 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
                  >
                    {shareCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {shareResume.isPublic && (
                <button
                  type="button"
                  onClick={toggleResumeSharing}
                  disabled={isSharing}
                  className="border border-[#2c241c]/30 px-5 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4] disabled:opacity-50"
                >
                  {isSharing ? 'Updating...' : 'Disable Public Link'}
                </button>
              )}

              {!shareResume.isPublic && (
                <button
                  type="button"
                  onClick={toggleResumeSharing}
                  disabled={isSharing}
                  className="bg-[#2c241c] px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSharing ? 'Making Public...' : 'Make Public'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RENAME MODAL
      ===================================================== */}

      {renameResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c241c]/35 px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isRenaming) {
              setRenameResume(null);
              setRenameTitle('');
            }
          }}
        >
          <div className="w-full max-w-md border border-[#2c241c]/20 bg-[#f4efe4] p-7 shadow-[0_20px_60px_rgba(44,36,28,0.18)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">
                  Rename Resume
                </p>

                <h2 className="mt-3 font-serif text-3xl">
                  Give it a new name.
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isRenaming) {
                    setRenameResume(null);
                    setRenameTitle('');
                  }
                }}
                aria-label="Close rename dialog"
                className="text-xl leading-none text-[#806b50] transition hover:text-[#2c241c] disabled:opacity-50"
                disabled={isRenaming}
              >
                ×
              </button>
            </div>

            <div className="mt-8">
              <label
                htmlFor="resume-title"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Resume Name
              </label>

              <input
                id="resume-title"
                type="text"
                value={renameTitle}
                onChange={(event) =>
                  setRenameTitle(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !isRenaming) {
                    saveRename();
                  }
                }}
                autoFocus
                disabled={isRenaming}
                className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition focus:border-[#2c241c] disabled:opacity-50"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isRenaming) {
                    setRenameResume(null);
                    setRenameTitle('');
                  }
                }}
                disabled={isRenaming}
                className="border border-[#2c241c]/30 px-5 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveRename}
                disabled={isRenaming || !renameTitle.trim()}
                className="bg-[#2c241c] px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRenaming ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#2c241c]/15 px-6 py-8 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs uppercase tracking-[0.15em] text-[#806b50] md:flex-row">

          <p>
            CVÉRÉ — Resumes with character.
          </p>

          <p>
            Your work. Your story.
          </p>

        </div>

      </footer>

    </main>
  );
}
