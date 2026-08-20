'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeRenderer from '../../components/resume/ResumeRenderer';

/* =========================================================
   TYPES
========================================================= */

type Education = {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
};

type Experience = {
  position: string;
  company: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
};

type Project = {
  name: string;
  technologies: string;
  link: string;
  startYear: string;
  endYear: string;
  description: string;
};

type Certification = {
  name: string;
  issuer: string;
  year: string;
  link: string;
};

type Language = {
  name: string;
  level: string;
};

type AdditionalSection = {
  id: string;
  title: string;
};

type Personal = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

/* =========================================================
   MAIN PAGE
========================================================= */

function ResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTemplate = searchParams.get('template') || 'classic';
  const resumeId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [previewPageCount, setPreviewPageCount] = useState(1);
  const [pageOffsets, setPageOffsets] = useState<number[]>([0]);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  const saveResumeRef = useRef<((silent?: boolean) => Promise<void>) | null>(null);
  const isSavingRef = useRef(false);
  const autoSavePendingRef = useRef(false);

  const [activeSection, setActiveSection] = useState('personal');

  const [showTemplates, setShowTemplates] = useState(false);

  /* =======================================================
     PERSONAL
  ======================================================= */

  const [personal, setPersonal] = useState<Personal>({
    fullName: 'Alexander Bennett',
    email: 'alex@example.com',
    phone: '+44 20 1234 5678',
    location: 'London, United Kingdom',
    website: 'alexbennett.com',
  });

  /* =======================================================
     SUMMARY
  ======================================================= */

  const [summary, setSummary] = useState(
    'Creative professional with a passion for thoughtful design, strategic thinking and meaningful experiences.'
  );

  /* =======================================================
     EDUCATION
  ======================================================= */

  const [education, setEducation] = useState<Education[]>([
    {
      degree: 'Master of Design',
      institution: 'Royal College of Art',
      location: 'London',
      startYear: '2017',
      endYear: '2019',
    },
  ]);

  /* =======================================================
     SKILLS
  ======================================================= */

  const [skills, setSkills] = useState<string[]>([
    'Creative Direction',
    'Brand Strategy',
    'Art Direction',
    'Editorial Design',
  ]);

  const [newSkill, setNewSkill] = useState('');

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  const [experience, setExperience] = useState<Experience[]>([
    {
      position: 'Creative Director',
      company: 'Atelier & Co.',
      location: 'London',
      startYear: '2022',
      endYear: 'Present',
      description:
        'Led creative direction and developed brand strategies for premium clients across multiple industries.',
    },
    {
      position: 'Senior Designer',
      company: 'Maison Studio',
      location: 'London',
      startYear: '2019',
      endYear: '2022',
      description:
        'Created visual identities, editorial campaigns and digital experiences for international clients.',
    },
  ]);

  /* =======================================================
     PROJECTS
  ======================================================= */

  const [projects, setProjects] = useState<Project[]>([
    {
      name: 'Portfolio Website',
      technologies: 'Next.js, TypeScript, Tailwind CSS',
      link: 'https://example.com',
      startYear: '2025',
      endYear: '2025',
      description:
        'Designed and developed a responsive personal portfolio website showcasing selected creative projects and professional experience.',
    },
    {
      name: 'Brand Identity System',
      technologies: 'Figma, Illustrator, Photoshop',
      link: '',
      startYear: '2024',
      endYear: '2024',
      description:
        'Created a complete visual identity system including typography, color guidelines and digital brand assets.',
    },
  ]);

  /* =======================================================
     ADDITIONAL INFORMATION
  ======================================================= */

  const [additionalSections, setAdditionalSections] = useState<AdditionalSection[]>([]);

  const [showAddSection, setShowAddSection] = useState(false);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      year: '2024',
      link: '',
    },
  ]);

  const [languages, setLanguages] = useState<Language[]>([
    {
      name: 'English',
      level: 'Professional',
    },
  ]);

  const [interests, setInterests] = useState<string[]>(['Photography', 'Travel', 'Typography']);

  const [hobbies, setHobbies] = useState<string[]>(['Cycling', 'Reading']);

  const [achievements, setAchievements] = useState<string[]>(['Winner of Design Excellence Award']);

  const [awards, setAwards] = useState<string[]>(['Best Creative Portfolio — 2024']);

  const [volunteerExperience, setVolunteerExperience] = useState<string[]>([
    'Volunteer Designer — Community Arts Project',
  ]);

  /* =======================================================
     SECTIONS
  ======================================================= */

  const sections = [
    {
      id: 'personal',
      label: 'Personal',
    },
    {
      id: 'summary',
      label: 'Summary',
    },
    {
      id: 'education',
      label: 'Education',
    },
    {
      id: 'skills',
      label: 'Skills',
    },
    {
      id: 'experience',
      label: 'Experience',
    },
    {
      id: 'projects',
      label: 'Projects',
    },
  ];

  /* =======================================================
     TEMPLATE SWITCHING
  ======================================================= */

  const changeTemplate = async (template: string) => {
    if (template === selectedTemplate) {
      setShowTemplates(false);
      return;
    }

    // New resume: just change the URL.
    if (!resumeId) {
      router.push(`/resume?template=${template}`);
      setShowTemplates(false);
      return;
    }

    try {
      const token = getAuthToken();

      if (!token) {
        clearAuthAndRedirect();
        return;
      }

      setSaveMessage('Changing template...');

      const response = await fetch(`${API_URL}/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          template,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthAndRedirect();
          return;
        }

        throw new Error(data.message || 'Failed to change template');
      }

      console.log('Template changed successfully:', data.resume?.template);

      setShowTemplates(false);
      setSaveMessage('Template changed successfully');

      // Now change the URL after the database has been updated.
      router.push(`/resume?id=${resumeId}&template=${template}`);

      window.setTimeout(() => {
        setSaveMessage('');
      }, 2000);
    } catch (error) {
      console.error('Change template error:', error);

      setSaveMessage(error instanceof Error ? error.message : 'Failed to change template');
    }
  };

  /* =======================================================
     PERSONAL UPDATE
  ======================================================= */

  const updatePersonal = (field: keyof Personal, value: string) => {
    setPersonal((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     EDUCATION
  ======================================================= */

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setEducation((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addEducation = () => {
    setEducation((previous) => [
      ...previous,
      {
        degree: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     SKILLS
  ======================================================= */

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    if (skills.includes(skill)) {
      setNewSkill('');
      return;
    }

    setSkills((previous) => [...previous, skill]);

    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    setSkills((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setExperience((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addExperience = () => {
    setExperience((previous) => [
      ...previous,
      {
        position: '',
        company: '',
        location: '',
        startYear: '',
        endYear: '',
        description: '',
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     PROJECTS
  ======================================================= */

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setProjects((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addProject = () => {
    setProjects((previous) => [
      ...previous,
      {
        name: '',
        technologies: '',
        link: '',
        startYear: '',
        endYear: '',
        description: '',
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     ADDITIONAL SECTIONS
  ======================================================= */

  const availableAdditionalSections = [
    'Certifications',
    'Languages',
    'Interests',
    'Hobbies',
    'Achievements',
    'Awards',
    'Volunteer Experience',
  ];

  const addAdditionalSection = (title: string) => {
    const exists = additionalSections.some((section) => section.title === title);

    if (exists) {
      setShowAddSection(false);
      return;
    }

    const id = title.toLowerCase().replace(/\s+/g, '-');

    setAdditionalSections((previous) => [
      ...previous,
      {
        id,
        title,
      },
    ]);

    setShowAddSection(false);
  };

  const removeAdditionalSection = (id: string) => {
    setAdditionalSections((previous) => previous.filter((section) => section.id !== id));
  };

  /* =======================================================
     CERTIFICATIONS
  ======================================================= */

  const addCertification = () => {
    setCertifications((previous) => [
      ...previous,
      {
        name: '',
        issuer: '',
        year: '',
        link: '',
      },
    ]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setCertifications((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeCertification = (index: number) => {
    setCertifications((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     LANGUAGES
  ======================================================= */

  const addLanguage = () => {
    setLanguages((previous) => [
      ...previous,
      {
        name: '',
        level: '',
      },
    ]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    setLanguages((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeLanguage = (index: number) => {
    setLanguages((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  /* =======================================================
     SIMPLE LISTS
  ======================================================= */

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((previous) => [...previous, '']);
  };

  const updateListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((previous) => previous.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const getAuthToken = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    return sessionStorage.getItem('token') || localStorage.getItem('token');
  };

  const clearAuthAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.replace('/login');
  };

  /* =======================================================
     SAVE RESUME
  ======================================================= */

  const buildResumeData = () => {
    const additionalInformation = additionalSections.map((section) => {
      let content: unknown = [];

      switch (section.id) {
        case 'certifications':
          content = certifications;
          break;
        case 'languages':
          content = languages;
          break;
        case 'interests':
          content = interests;
          break;
        case 'hobbies':
          content = hobbies;
          break;
        case 'achievements':
          content = achievements;
          break;
        case 'awards':
          content = awards;
          break;
        case 'volunteer-experience':
          content = volunteerExperience;
          break;
      }

      return {
        title: section.title,
        content,
      };
    });

    return {
      title: personal.fullName ? `${personal.fullName} Resume` : 'My Resume',
      template: selectedTemplate,
      personal,
      summary,
      education,
      skills,
      experience,
      projects: projects.map((project) => ({
        projectName: project.name,
        technologies: project.technologies,
        projectLink: project.link,
        startYear: project.startYear,
        endYear: project.endYear,
        description: project.description,
      })),
      additionalInformation,
    };
  };

  const saveResume = async (silent = false) => {
    try {
      const token = getAuthToken();

      if (!token) {
        router.push('/login');
        return;
      }

      setIsSaving(true);
      isSavingRef.current = true;
      setSaveMessage('');

      const resumeData = buildResumeData();

      const url = resumeId ? `${API_URL}/api/resumes/${resumeId}` : `${API_URL}/api/resumes`;

      const response = await fetch(url, {
        method: resumeId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthAndRedirect();
          return;
        }

        throw new Error(data.message || 'Failed to save resume');
      }

      lastSavedSnapshotRef.current = JSON.stringify(resumeData);
      setSaveMessage(silent ? 'Auto-saved' : 'Saved successfully');

      if (!resumeId && data.resume?._id) {
        router.replace(`/resume?id=${data.resume._id}&template=${selectedTemplate}`);
      }

      window.setTimeout(
        () => {
          setSaveMessage('');
        },
        silent ? 1800 : 3000
      );
    } catch (error) {
      console.error('Save resume error:', error);

      setSaveMessage(error instanceof Error ? error.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;

      // If an edit happened while a save was in flight, schedule one more save.
      if (silent && autoSavePendingRef.current) {
        autoSavePendingRef.current = false;
        window.setTimeout(() => {
          void saveResumeRef.current?.(true);
        }, 250);
      }
    }
  };

  saveResumeRef.current = saveResume;

  /* =======================================================
     AUTO SAVE
  ======================================================= */

  useEffect(() => {
    // A new resume must be created manually once. After that,
    // auto-save handles all subsequent edits.
    if (!resumeId || !lastSavedSnapshotRef.current) {
      return;
    }

    const currentSnapshot = JSON.stringify(buildResumeData());

    // Nothing changed since the last successful server save.
    if (currentSnapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (isSavingRef.current) {
      autoSavePendingRef.current = true;
      return;
    }

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    setSaveMessage('Unsaved changes...');

    autoSaveTimerRef.current = window.setTimeout(() => {
      if (isSavingRef.current) {
        autoSavePendingRef.current = true;
        return;
      }

      void saveResumeRef.current?.(true);
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [
    resumeId,
    selectedTemplate,
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
  ]);

  /* =======================================================
     LOAD RESUME
  ======================================================= */

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) {
        return;
      }

      try {
        const token = getAuthToken();

        if (!token) {
          clearAuthAndRedirect();
          return;
        }

        setIsLoading(true);
        setSaveMessage('');

        const response = await fetch(`${API_URL}/api/resumes/${resumeId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            clearAuthAndRedirect();
            return;
          }

          throw new Error(data.message || 'Failed to load resume');
        }

        const resume = data.resume;

        if (resume.personal) {
          setPersonal({
            fullName: resume.personal.fullName || '',
            email: resume.personal.email || '',
            phone: resume.personal.phone || '',
            location: resume.personal.location || '',
            website: resume.personal.website || '',
          });
        }

        setSummary(resume.summary || '');
        setEducation(resume.education || []);
        setSkills(resume.skills || []);
        setExperience(resume.experience || []);

        if (resume.projects?.length) {
          setProjects(
            resume.projects.map(
              (project: {
                projectName?: string;
                technologies?: string;
                projectLink?: string;
                startYear?: string;
                endYear?: string;
                description?: string;
              }) => ({
                name: project.projectName || '',
                technologies: project.technologies || '',
                link: project.projectLink || '',
                startYear: project.startYear || '',
                endYear: project.endYear || '',
                description: project.description || '',
              })
            )
          );
        } else {
          setProjects([]);
        }

        const loadedSections = Array.isArray(resume.additionalInformation)
          ? resume.additionalInformation
          : [];

        setAdditionalSections(
          loadedSections
            .filter((section: { title?: string }) => Boolean(section.title))
            .map((section: { title: string }) => ({
              id: section.title.toLowerCase().replace(/\s+/g, '-'),
              title: section.title,
            }))
        );

        loadedSections.forEach((section: { title?: string; content?: unknown }) => {
          const content = section.content;

          if (section.title === 'Certifications') {
            setCertifications(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Languages') {
            setLanguages(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Interests') {
            setInterests(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Hobbies') {
            setHobbies(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Achievements') {
            setAchievements(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Awards') {
            setAwards(Array.isArray(content) ? content : []);
          }

          if (section.title === 'Volunteer Experience') {
            setVolunteerExperience(Array.isArray(content) ? content : []);
          }
        });

        // Mark the freshly loaded server state as saved so hydration does not
        // immediately trigger an unnecessary auto-save.
        lastSavedSnapshotRef.current = JSON.stringify({
          title:
            resume.title ||
            (resume.personal?.fullName ? `${resume.personal.fullName} Resume` : 'My Resume'),
          template: resume.template || selectedTemplate,
          personal: resume.personal || {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
          },
          summary: resume.summary || '',
          education: resume.education || [],
          skills: resume.skills || [],
          experience: resume.experience || [],
          projects: (resume.projects || []).map(
            (project: {
              projectName?: string;
              technologies?: string;
              projectLink?: string;
              startYear?: string;
              endYear?: string;
              description?: string;
            }) => ({
              projectName: project.projectName || '',
              technologies: project.technologies || '',
              projectLink: project.projectLink || '',
              startYear: project.startYear || '',
              endYear: project.endYear || '',
              description: project.description || '',
            })
          ),
          additionalInformation: loadedSections.map(
            (section: { title?: string; content?: unknown }) => ({
              title: section.title || '',
              content: section.content ?? [],
            })
          ),
        });

        if (resume.template && resume.template !== selectedTemplate) {
          router.replace(`/resume?id=${resumeId}&template=${resume.template}`);
        }
      } catch (error) {
        console.error('Load resume error:', error);

        setSaveMessage(error instanceof Error ? error.message : 'Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [resumeId, router, selectedTemplate]);

  /* =======================================================
     LIVE A4 PAGINATION
  ======================================================= */

  // One physical page is always A4. The 14mm margins are part of the
  // resume page itself so the browser preview and the exported PDF use
  // the same geometry.
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const A4_MARGIN_MM = 14;
  const A4_CONTENT_HEIGHT_MM = A4_HEIGHT_MM - A4_MARGIN_MM * 2;

  const getPageMetrics = () => {
    const viewport = resumePreviewRef.current;
    if (!viewport) {
      return null;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const viewportHeight = viewportRect.height;

    if (!viewportHeight) {
      return null;
    }

    const pxPerMm = viewportHeight / A4_HEIGHT_MM;

    return {
      viewportHeight,
      pxPerMm,
      pageHeightPx: viewportHeight,
      pageContentHeight: A4_CONTENT_HEIGHT_MM * pxPerMm,
      topMarginPx: A4_MARGIN_MM * pxPerMm,
      bottomMarginPx: A4_MARGIN_MM * pxPerMm,
    };
  };

  const recalculatePreviewPages = () => {
    const content = resumeContentRef.current;
    const metrics = getPageMetrics();

    if (!content || !metrics) {
      return pageOffsets;
    }

    /*
     * Pagination must always be measured against the unshifted document.
     * The visible page is created with translateY(), so measuring while that
     * transform is active would make pagination depend on previewPage.
     */
    const previousTransform = content.style.transform;
    content.style.transform = 'none';

    try {
      const contentRect = content.getBoundingClientRect();

      const getRect = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top - contentRect.top,
          bottom: rect.bottom - contentRect.top,
          height: rect.height,
        };
      };

      const blocks = Array.from(content.querySelectorAll<HTMLElement>('[data-resume-page-block]'));

      const sections = Array.from(
        content.querySelectorAll<HTMLElement>('[data-resume-page-section]')
      );

      /*
       * A section containing logical blocks is represented by those blocks.
       * This is what prevents an entire section from being duplicated when
       * only one project/experience/education item needs to move.
       * Sections without logical blocks remain a single unit.
       */
      const units = [
        ...sections
          .filter((section) => !section.querySelector('[data-resume-page-block]'))
          .map((element) => ({
            element,
            type: 'section' as const,
          })),
        ...blocks.map((element) => ({
          element,
          type: 'block' as const,
        })),
      ].sort((a, b) => {
        if (a.element === b.element) return 0;

        const relation = a.element.compareDocumentPosition(b.element);
        return relation & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

      const offsets: number[] = [0];
      let currentPageStart = 0;

      const getSectionForBlock = (block: HTMLElement) =>
        block.closest('[data-resume-page-section]') as HTMLElement | null;

      const firstBlockBySection = new WeakMap<HTMLElement, HTMLElement>();

      for (const block of blocks) {
        const section = getSectionForBlock(block);

        if (section && !firstBlockBySection.has(section)) {
          firstBlockBySection.set(section, block);
        }
      }

      const addPage = (start: number) => {
        const safeStart = Math.max(0, start);

        if (safeStart <= currentPageStart + 1) {
          return false;
        }

        currentPageStart = safeStart;
        offsets.push(currentPageStart);
        return true;
      };

      const placeUnit = (
        element: HTMLElement,
        section: HTMLElement | null,
        includeSectionHeading: boolean
      ) => {
        const rect = getRect(element);

        const sectionRect = section ? getRect(section) : null;

        const logicalTop =
          includeSectionHeading && sectionRect ? Math.min(sectionRect.top, rect.top) : rect.top;

        const pageContentStart = currentPageStart + metrics.topMarginPx;

        const pageContentEnd = currentPageStart + metrics.pageHeightPx - metrics.bottomMarginPx;

        /*
         * Normal logical blocks should stay intact whenever they can fit on
         * one printable A4 page. If they would cross the bottom margin, move
         * the complete block to the next page.
         */
        if (
          rect.height <= metrics.pageContentHeight + 1 &&
          rect.top >= pageContentStart - 1 &&
          rect.bottom > pageContentEnd + 1
        ) {
          addPage(logicalTop - metrics.topMarginPx);
          return;
        }

        /*
         * A block taller than one printable page cannot be kept intact.
         * Start it cleanly on a page when necessary. The browser can then
         * naturally display its continuation on subsequent physical pages.
         */
        if (
          rect.height > metrics.pageContentHeight + 1 &&
          rect.top >= pageContentStart - 1 &&
          rect.bottom > pageContentEnd + 1
        ) {
          const nextPageStart = Math.max(
            currentPageStart + metrics.pageHeightPx,
            logicalTop - metrics.topMarginPx
          );

          addPage(nextPageStart);
        }
      };

      for (const unit of units) {
        const element = unit.element;

        const section = unit.type === 'block' ? getSectionForBlock(element) : element;

        const firstBlock =
          unit.type === 'block' && section ? firstBlockBySection.get(section) : null;

        placeUnit(element, section, unit.type === 'block' && firstBlock === element);
      }

      /*
       * Final height safety net. Custom/template content that does not have
       * explicit logical blocks must still receive enough A4 pages.
       */
      const pageRoot = content.querySelector('[data-resume-page-root]') as HTMLElement | null;

      const rootRect = pageRoot?.getBoundingClientRect();

      const actualResumeHeight = rootRect
        ? Math.max(1, rootRect.bottom - contentRect.top)
        : Math.max(1, content.scrollHeight);

      const minimumPageCount = Math.max(
        1,
        Math.ceil(Math.max(1, actualResumeHeight - metrics.topMarginPx) / metrics.pageContentHeight)
      );

      while (offsets.length < minimumPageCount) {
        offsets.push(offsets[offsets.length - 1] + metrics.pageHeightPx);
      }

      setPageOffsets(offsets);
      setPreviewPageCount(offsets.length);
      setPreviewPage((current) => Math.min(current, offsets.length - 1));

      return offsets;
    } finally {
      /* Restore the page currently visible to the user. */
      content.style.transform = previousTransform;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const measure = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (cancelled) return;

      window.requestAnimationFrame(() => {
        if (!cancelled) {
          recalculatePreviewPages();
        }
      });
    };

    void measure();

    const observer = new ResizeObserver(() => {
      void measure();
    });

    if (resumeContentRef.current) observer.observe(resumeContentRef.current);
    if (resumePreviewRef.current) observer.observe(resumePreviewRef.current);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [
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
    selectedTemplate,
  ]);

  useEffect(() => {
    setPreviewPage(0);
    setPageOffsets([0]);
  }, [selectedTemplate, resumeId]);

  const downloadPDF = async () => {
    const viewport = resumePreviewRef.current;
    const content = resumeContentRef.current;

    if (!viewport || !content) {
      setSaveMessage('Resume preview is not ready yet');
      return;
    }

    if (isDownloading) return;

    const originalPage = previewPage;

    try {
      setIsDownloading(true);
      setSaveMessage('Preparing PDF...');

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Use the same safe page boundaries as the live preview.
      const calculatedOffsets = recalculatePreviewPages();
      const exportPageOffsets = calculatedOffsets ?? pageOffsets;

      const metrics = getPageMetrics();

      if (!metrics) {
        throw new Error('Could not determine the A4 page dimensions.');
      }

      const pageContentHeight = metrics.pageContentHeight;

      if (!pageContentHeight) {
        throw new Error('Could not determine the A4 content height.');
      }

      const pageCount = Math.max(1, exportPageOffsets.length);
      setPreviewPageCount(pageCount);

      const waitForPaint = () =>
        new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
          });
        });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let page = 0; page < pageCount; page += 1) {
        // Render exactly the same A4 viewport the user sees.
        setPreviewPage(page);
        await waitForPaint();

        const canvas = await html2canvas(viewport, {
          scale: 2.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: viewport.clientWidth,
          height: viewport.clientHeight,
          windowWidth: document.documentElement.clientWidth,
          windowHeight: document.documentElement.clientHeight,

          onclone: (clonedDocument) => {
            const clonedRoot = clonedDocument.querySelector(
              '[data-resume-pdf]'
            ) as HTMLElement | null;

            if (!clonedRoot) return;

            // Never put navigation arrows/page labels into the PDF.
            clonedRoot.querySelectorAll<HTMLElement>('[data-pdf-control]').forEach((control) => {
              control.style.display = 'none';
            });

            // Preserve the exact A4 viewport dimensions and white paper.
            clonedRoot.style.width = '210mm';
            clonedRoot.style.height = '297mm';
            clonedRoot.style.minHeight = '297mm';
            clonedRoot.style.maxHeight = '297mm';
            clonedRoot.style.maxWidth = 'none';
            clonedRoot.style.overflow = 'hidden';
            clonedRoot.style.backgroundColor = '#ffffff';
            clonedRoot.style.padding = '0';
            clonedRoot.style.boxShadow = 'none';

            /*
             * Resolve every visual style in the browser first. This prevents
             * Tailwind v4 lab()/oklab() declarations from reaching html2canvas.
             */
            const elements = [
              clonedRoot,
              ...Array.from(clonedRoot.querySelectorAll<HTMLElement>('*')),
            ];

            elements.forEach((node) => {
              const computed = clonedDocument.defaultView?.getComputedStyle(node);

              if (!computed) return;

              for (let index = 0; index < computed.length; index += 1) {
                const property = computed[index];

                if (
                  property.startsWith('--') ||
                  property === 'content' ||
                  property.startsWith('animation') ||
                  property.startsWith('transition')
                ) {
                  continue;
                }

                const value = computed.getPropertyValue(property);

                if (!value) continue;

                // Browser-computed colors are normally rgb()/rgba(). If a
                // modern color survives, use a safe equivalent for export.
                if (
                  value.includes('lab(') ||
                  value.includes('lch(') ||
                  value.includes('oklab(') ||
                  value.includes('oklch(')
                ) {
                  continue;
                }

                node.style.setProperty(property, value);
              }

              node.style.visibility = 'visible';
            });

            /*
             * Remove the stylesheet sources after all computed values have
             * been copied. html2canvas can therefore never parse Tailwind's
             * unsupported lab()/oklab() declarations.
             */
            clonedDocument
              .querySelectorAll('style, link[rel="stylesheet"]')
              .forEach((styleNode) => styleNode.remove());
          },
        });

        if (!canvas.width || !canvas.height) {
          throw new Error(`Page ${page + 1} produced an empty PDF canvas.`);
        }

        if (page > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const image = canvas.toDataURL('image/png');

        // The canvas is the exact A4 viewport, so place it edge-to-edge.
        pdf.addImage(image, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const safeName =
        (personal.fullName || 'resume')
          .trim()
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-+|-+$/g, '')
          .toLowerCase() || 'resume';

      pdf.save(`${safeName}-${selectedTemplate}.pdf`);

      setSaveMessage(`${pageCount} page${pageCount === 1 ? '' : 's'} downloaded successfully`);

      window.setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('PDF download failed:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to download PDF');
    } finally {
      // Always return the live preview to the page the user was viewing.
      setPreviewPage(originalPage);
      setIsDownloading(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#e7dfd1] text-[#2c241c]">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        [data-resume-page-root],
        [data-resume-page-section],
        [data-resume-page-block] {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        [data-resume-page-section] > h2,
        [data-resume-page-section] > div:first-child {
          break-after: avoid;
          page-break-after: avoid;
        }

        [data-resume-page-block] {
          break-before: auto;
          break-after: auto;
        }

        @media print {
          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }

          [data-resume-pdf] {
            box-shadow: none !important;
          }

          [data-pdf-control] {
            display: none !important;
          }
        }
      `}</style>

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="border-b border-[#2c241c]/20 bg-[#f4efe4]">
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm transition hover:opacity-60">
              ← Dashboard
            </Link>

            <div className="h-6 w-px bg-[#2c241c]/20" />

            <Link href="/" className="text-xl font-bold tracking-[0.2em]">
              CVÉRÉ
            </Link>
          </div>

          {/* RIGHT NAV */}

          <div className="relative flex items-center gap-3">
            {/* TEMPLATE BUTTON */}

            <button
              type="button"
              onClick={() => setShowTemplates((previous) => !previous)}
              className="border border-black/30 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-white hover:text-black"
            >
              Template: {selectedTemplate}
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={() => saveResume()}
              disabled={isSaving}
              className="hidden border border-black/30 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 md:block"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>

            {saveMessage && (
              <span className="hidden text-xs text-black md:block">{saveMessage}</span>
            )}

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={() => downloadPDF()}
              disabled={isDownloading}
              className="bg-white px-5 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? 'Preparing...' : 'Download PDF'}
            </button>

            {/* TEMPLATE MENU */}

            {showTemplates && (
              <div className="absolute right-0 top-12 z-50 w-80 border border-black/20 bg-white p-4 shadow-2xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-black">
                  Choose Template
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    {
                      id: 'classic',
                      name: 'The Classic',
                      description: 'Quiet confidence.',
                    },
                    {
                      id: 'executive',
                      name: 'The Executive',
                      description: 'Distinguished by design.',
                    },
                    {
                      id: 'editorial',
                      name: 'The Editorial',
                      description: 'Creative by nature.',
                    },
                  ].map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => changeTemplate(template.id)}
                      className={`w-full border p-4 text-left transition ${
                        selectedTemplate === template.id
                          ? 'border-[#2c241c] bg-gray-100'
                          : 'border-black/15 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-lg">{template.name}</span>

                        {selectedTemplate === template.id && (
                          <span className="text-[9px] uppercase tracking-[0.15em]">Selected</span>
                        )}
                      </div>

                      <p className="mt-1 text-xs italic text-black">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===================================================
          MAIN EDITOR
      =================================================== */}

      <div className="grid min-h-[calc(100vh-80px)] bg-[#e7dfd1] lg:grid-cols-[440px_1fr]">
        {/* =================================================
            LEFT EDITOR
        ================================================= */}

        <aside className="border-r border-[#2c241c]/15 bg-[#e9e0d1]">
          {/* SECTION NAVIGATION */}

          <div className="border-b border-[#2c241c]/15 p-4">
            <div className="flex gap-2 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`whitespace-nowrap px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                    activeSection === section.id
                      ? 'bg-white text-black'
                      : 'border border-black/20 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* FORM AREA */}

          <div className="max-h-[calc(100vh-145px)] overflow-y-auto p-7">
            {/* =============================================
                PERSONAL
            ============================================= */}

            {activeSection === 'personal' && (
              <EditorSection
                number="01"
                title="Personal Information"
                description="Start with the details employers need to know about you."
              >
                <div className="space-y-6">
                  <Input
                    label="Full Name"
                    value={personal.fullName}
                    onChange={(value) => updatePersonal('fullName', value)}
                  />

                  <Input
                    label="✉️ Email"
                    value={personal.email}
                    onChange={(value) => updatePersonal('email', value)}
                  />

                  <Input
                    label="📞 Phone"
                    value={personal.phone}
                    onChange={(value) => updatePersonal('phone', value)}
                  />

                  <Input
                    label="Location"
                    value={personal.location}
                    onChange={(value) => updatePersonal('location', value)}
                  />

                  <Input
                    label="🔗 Website"
                    value={personal.website}
                    onChange={(value) => updatePersonal('website', value)}
                  />
                </div>
              </EditorSection>
            )}

            {/* =============================================
                SUMMARY
            ============================================= */}

            {activeSection === 'summary' && (
              <EditorSection
                number="02"
                title="Professional Summary"
                description="Give employers a short introduction to your professional background."
              >
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em]">About You</label>

                  <textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    rows={9}
                    className="w-full resize-none border border-black/25 bg-transparent p-4 text-sm leading-6 outline-none transition focus:border-[#2c241c]"
                  />

                  <p className="mt-2 text-right text-xs text-black">{summary.length} characters</p>
                </div>
              </EditorSection>
            )}

            {/* =============================================
                EDUCATION
            ============================================= */}

            {activeSection === 'education' && (
              <EditorSection
                number="03"
                title="Education"
                description="Add your academic background and qualifications."
              >
                <div className="space-y-8">
                  {education.map((item, index) => (
                    <div key={index} className="border border-black/20 p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="font-serif text-xl">Education {index + 1}</p>

                        {education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-xs uppercase tracking-[0.1em] text-red-900"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-5">
                        <Input
                          label="Degree"
                          value={item.degree}
                          onChange={(value) => updateEducation(index, 'degree', value)}
                        />

                        <Input
                          label="Institution"
                          value={item.institution}
                          onChange={(value) => updateEducation(index, 'institution', value)}
                        />

                        <Input
                          label="Location"
                          value={item.location}
                          onChange={(value) => updateEducation(index, 'location', value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Start Year"
                            value={item.startYear}
                            onChange={(value) => updateEducation(index, 'startYear', value)}
                          />

                          <Input
                            label="End Year"
                            value={item.endYear}
                            onChange={(value) => updateEducation(index, 'endYear', value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEducation}
                    className="w-full border border-dashed border-black/30 py-4 text-xs uppercase tracking-[0.15em] transition hover:bg-gray-100"
                  >
                    + Add Education
                  </button>
                </div>
              </EditorSection>
            )}

            {/* =============================================
                SKILLS
            ============================================= */}

            {activeSection === 'skills' && (
              <EditorSection
                number="04"
                title="Skills"
                description="Add the skills that best represent your professional strengths."
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white px-3 py-2 text-xs text-black"
                      >
                        <span>{skill}</span>

                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-black hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(event) => setNewSkill(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill"
                      className="min-w-0 flex-1 border-b border-black/30 bg-transparent px-1 py-3 text-sm outline-none focus:border-[#2c241c]"
                    />

                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-white px-5 text-xs uppercase tracking-[0.15em] text-black"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </EditorSection>
            )}

            {/* =============================================
                EXPERIENCE
            ============================================= */}

            {activeSection === 'experience' && (
              <EditorSection
                number="05"
                title="Experience"
                description="Add your professional experience, starting with your most recent position."
              >
                <div className="space-y-8">
                  {experience.map((item, index) => (
                    <div key={index} className="border border-black/20 p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="font-serif text-xl">Experience {index + 1}</p>

                        {experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-xs uppercase tracking-[0.1em] text-red-900"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-5">
                        <Input
                          label="Position"
                          value={item.position}
                          onChange={(value) => updateExperience(index, 'position', value)}
                        />

                        <Input
                          label="Company"
                          value={item.company}
                          onChange={(value) => updateExperience(index, 'company', value)}
                        />

                        <Input
                          label="Location"
                          value={item.location}
                          onChange={(value) => updateExperience(index, 'location', value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Start Year"
                            value={item.startYear}
                            onChange={(value) => updateExperience(index, 'startYear', value)}
                          />

                          <Input
                            label="End Year"
                            value={item.endYear}
                            onChange={(value) => updateExperience(index, 'endYear', value)}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em]">
                            Description
                          </label>

                          <textarea
                            value={item.description}
                            onChange={(event) =>
                              updateExperience(index, 'description', event.target.value)
                            }
                            rows={6}
                            className="w-full resize-none border border-black/25 bg-transparent p-3 text-sm leading-6 outline-none focus:border-[#2c241c]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className="w-full border border-dashed border-black/30 py-4 text-xs uppercase tracking-[0.15em] transition hover:bg-gray-100"
                  >
                    + Add Experience
                  </button>
                </div>
              </EditorSection>
            )}

            {/* =============================================
                PROJECTS
            ============================================= */}

            {activeSection === 'projects' && (
              <EditorSection
                number="06"
                title="Projects"
                description="Showcase important projects, personal work and practical experience."
              >
                <div className="space-y-8">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-black/20 p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="font-serif text-xl">Project {index + 1}</p>

                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-xs uppercase tracking-[0.1em] text-red-900"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-5">
                        <Input
                          label="Project Name"
                          value={project.name}
                          onChange={(value) => updateProject(index, 'name', value)}
                        />

                        <Input
                          label="Technologies / Tech Stack"
                          value={project.technologies}
                          onChange={(value) => updateProject(index, 'technologies', value)}
                        />

                        <Input
                          label="Project Link"
                          value={project.link}
                          onChange={(value) => updateProject(index, 'link', value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Start Year"
                            value={project.startYear}
                            onChange={(value) => updateProject(index, 'startYear', value)}
                          />

                          <Input
                            label="End Year"
                            value={project.endYear}
                            onChange={(value) => updateProject(index, 'endYear', value)}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em]">
                            Description
                          </label>

                          <textarea
                            value={project.description}
                            onChange={(event) =>
                              updateProject(index, 'description', event.target.value)
                            }
                            rows={6}
                            className="w-full resize-none border border-black/25 bg-transparent p-3 text-sm leading-6 outline-none focus:border-[#2c241c]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addProject}
                    className="w-full border border-dashed border-black/30 py-4 text-xs uppercase tracking-[0.15em] transition hover:bg-gray-100"
                  >
                    + Add Project
                  </button>
                </div>
              </EditorSection>
            )}

            {/* =============================================
                ADDITIONAL INFORMATION
            ============================================= */}

            <div className="mt-14 border-t border-black/20 pt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-black">
                Additional Information
              </p>

              <p className="mt-2 text-xs leading-5 text-black">
                Add optional sections to make your resume more complete.
              </p>

              <button
                type="button"
                onClick={() => setShowAddSection((previous) => !previous)}
                className="mt-5 w-full border border-dashed border-black/30 py-4 text-xs uppercase tracking-[0.15em] transition hover:bg-gray-100"
              >
                + Add Section
              </button>

              {/* ADD MENU */}

              {showAddSection && (
                <div className="mt-3 border border-black/20 bg-white p-3">
                  {availableAdditionalSections.map((section) => {
                    const alreadyAdded = additionalSections.some((item) => item.title === section);

                    return (
                      <button
                        key={section}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addAdditionalSection(section)}
                        className={`block w-full px-3 py-3 text-left text-xs transition ${
                          alreadyAdded ? 'cursor-not-allowed text-black/40' : 'hover:bg-gray-100'
                        }`}
                      >
                        {section}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ADDED SECTIONS */}

              <div className="mt-5 space-y-4">
                {additionalSections.map((section) => (
                  <div key={section.id} className="border border-black/20 bg-white">
                    <div className="flex items-center justify-between border-b border-black/15 p-4">
                      <h3 className="font-serif text-xl">{section.title}</h3>

                      <button
                        type="button"
                        onClick={() => removeAdditionalSection(section.id)}
                        className="text-xs uppercase tracking-[0.1em] text-red-900"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="p-4">
                      {/* CERTIFICATIONS */}

                      {section.id === 'certifications' && (
                        <div className="space-y-6">
                          {certifications.map((item, index) => (
                            <div key={index} className="border border-black/15 p-4">
                              <div className="mb-4 flex justify-between">
                                <p className="font-serif">Certification {index + 1}</p>

                                {certifications.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCertification(index)}
                                    className="text-xs text-red-900"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="space-y-4">
                                <Input
                                  label="Certification Name"
                                  value={item.name}
                                  onChange={(value) => updateCertification(index, 'name', value)}
                                />

                                <Input
                                  label="Issuer"
                                  value={item.issuer}
                                  onChange={(value) => updateCertification(index, 'issuer', value)}
                                />

                                <Input
                                  label="Year"
                                  value={item.year}
                                  onChange={(value) => updateCertification(index, 'year', value)}
                                />

                                <Input
                                  label="Certificate Link"
                                  value={item.link}
                                  onChange={(value) => updateCertification(index, 'link', value)}
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addCertification}
                            className="w-full border border-dashed border-black/30 py-3 text-xs uppercase tracking-[0.15em]"
                          >
                            + Add Certification
                          </button>
                        </div>
                      )}

                      {/* LANGUAGES */}

                      {section.id === 'languages' && (
                        <div className="space-y-6">
                          {languages.map((item, index) => (
                            <div key={index} className="border border-black/15 p-4">
                              <div className="mb-4 flex justify-between">
                                <p className="font-serif">Language {index + 1}</p>

                                {languages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="text-xs text-red-900"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="space-y-4">
                                <Input
                                  label="Language"
                                  value={item.name}
                                  onChange={(value) => updateLanguage(index, 'name', value)}
                                />

                                <Input
                                  label="Proficiency"
                                  value={item.level}
                                  onChange={(value) => updateLanguage(index, 'level', value)}
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addLanguage}
                            className="w-full border border-dashed border-black/30 py-3 text-xs uppercase tracking-[0.15em]"
                          >
                            + Add Language
                          </button>
                        </div>
                      )}

                      {/* INTERESTS */}

                      {section.id === 'interests' && (
                        <SimpleListEditor
                          items={interests}
                          setter={setInterests}
                          addItem={addListItem}
                          updateItem={updateListItem}
                          removeItem={removeListItem}
                          placeholder="Photography"
                          buttonText="Add Interest"
                        />
                      )}

                      {/* HOBBIES */}

                      {section.id === 'hobbies' && (
                        <SimpleListEditor
                          items={hobbies}
                          setter={setHobbies}
                          addItem={addListItem}
                          updateItem={updateListItem}
                          removeItem={removeListItem}
                          placeholder="Cycling"
                          buttonText="Add Hobby"
                        />
                      )}

                      {/* ACHIEVEMENTS */}

                      {section.id === 'achievements' && (
                        <SimpleListEditor
                          items={achievements}
                          setter={setAchievements}
                          addItem={addListItem}
                          updateItem={updateListItem}
                          removeItem={removeListItem}
                          placeholder="Achievement"
                          buttonText="Add Achievement"
                        />
                      )}

                      {/* AWARDS */}

                      {section.id === 'awards' && (
                        <SimpleListEditor
                          items={awards}
                          setter={setAwards}
                          addItem={addListItem}
                          updateItem={updateListItem}
                          removeItem={removeListItem}
                          placeholder="Award"
                          buttonText="Add Award"
                        />
                      )}

                      {/* VOLUNTEER */}

                      {section.id === 'volunteer-experience' && (
                        <SimpleListEditor
                          items={volunteerExperience}
                          setter={setVolunteerExperience}
                          addItem={addListItem}
                          updateItem={updateListItem}
                          removeItem={removeListItem}
                          placeholder="Volunteer Experience"
                          buttonText="Add Experience"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* =================================================
            RIGHT A4 PREVIEW
        ================================================= */}

        <section className="hidden overflow-y-auto bg-[#dcd3c5] p-8 lg:block">
          <div className="mx-auto max-w-[900px]">
            {/* PREVIEW TOP */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">Live Preview</p>

                <p className="mt-1 text-xs capitalize text-[#5e5143]">The {selectedTemplate}</p>
              </div>

              <div className="flex gap-2">
                <button type="button" className="border border-black/20 bg-white px-3 py-2 text-xs">
                  −
                </button>

                <span className="flex items-center bg-white px-3 text-xs">100%</span>

                <button type="button" className="border border-black/20 bg-white px-3 py-2 text-xs">
                  +
                </button>
              </div>
            </div>

            {/* A4 PREVIEW */}

            <div
              ref={resumePreviewRef}
              data-resume-pdf
              className="relative mx-auto overflow-hidden bg-white shadow-2xl"
              style={{
                width: '210mm',
                height: '297mm',
                minWidth: '210mm',
                maxWidth: '210mm',
                minHeight: '297mm',
                maxHeight: '297mm',
                boxSizing: 'border-box',
              }}
            >
              <div
                ref={resumeContentRef}
                className="bg-white"
                style={{
                  width: '210mm',

                  boxSizing: 'border-box',

                  paddingTop: '14mm',

                  paddingRight: '14mm',

                  paddingBottom: '14mm',

                  paddingLeft: '14mm',

                  minHeight: '297mm',

                  transform: `translateY(-${pageOffsets[previewPage] ?? 0}px)`,

                  transition: 'none',
                }}
              >
                <ResumeRenderer
                  template={selectedTemplate}
                  personal={personal}
                  summary={summary}
                  education={education}
                  skills={skills}
                  experience={experience}
                  projects={projects}
                  additionalSections={additionalSections}
                  certifications={certifications}
                  languages={languages}
                  interests={interests}
                  hobbies={hobbies}
                  achievements={achievements}
                  awards={awards}
                  volunteerExperience={volunteerExperience}
                />
              </div>

              {/* Page masks reserve the 14mm margins for the resume.
                  All templates use the same 14mm page margins. */}
              {selectedTemplate !== 'executive' && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-white"
                    style={{ height: '14mm' }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-white"
                    style={{ height: '14mm' }}
                  />
                </>
              )}

              {previewPage > 0 && (
                <button
                  type="button"
                  data-pdf-control
                  aria-label="Previous resume page"
                  onClick={() => setPreviewPage((page) => Math.max(0, page - 1))}
                  className="absolute bottom-4 left-1/2 z-30 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[#2c241c]/20 bg-white text-lg text-[#2c241c] shadow-md transition hover:bg-[#f4efe4]"
                >
                  ←
                </button>
              )}

              {previewPage < previewPageCount - 1 && (
                <button
                  type="button"
                  data-pdf-control
                  aria-label="Next resume page"
                  onClick={() => setPreviewPage((page) => Math.min(previewPageCount - 1, page + 1))}
                  className="absolute bottom-4 left-1/2 z-30 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[#2c241c]/20 bg-white text-lg text-[#2c241c] shadow-md transition hover:bg-[#f4efe4]"
                >
                  →
                </button>
              )}

              {previewPageCount > 1 && (
                <div
                  data-pdf-control
                  className="absolute bottom-4 right-4 z-30 bg-white/95 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#2c241c] shadow-sm"
                >
                  Page {previewPage + 1} / {previewPageCount}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em]">{label}</label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-b border-black/30 bg-transparent px-1 py-3 text-sm outline-none transition focus:border-[#2c241c]"
      />
    </div>
  );
}

/* =========================================================
   EDITOR COMPONENT
========================================================= */

function EditorSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">Section {number}</p>

      <h1 className="mt-3 font-serif text-4xl text-[#2c241c]">{title}</h1>

      <p className="mt-3 text-sm leading-6 text-[#5e5143]">{description}</p>

      <div className="mt-8">{children}</div>
    </section>
  );
}

/* =========================================================
   RESUME HEADING
========================================================= */

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

/* =========================================================
   SIMPLE LIST EDITOR
========================================================= */

function SimpleListEditor({
  items,
  setter,
  addItem,
  updateItem,
  removeItem,
  placeholder,
  buttonText,
}: {
  items: string[];
  setter: React.Dispatch<React.SetStateAction<string[]>>;
  addItem: (setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
  updateItem: (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => void;
  removeItem: (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => void;
  placeholder: string;
  buttonText: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="text"
            value={item}
            placeholder={placeholder}
            onChange={(event) => updateItem(setter, index, event.target.value)}
            className="flex-1 border-b border-black/30 bg-transparent px-1 py-3 text-sm outline-none focus:border-[#2c241c]"
          />

          <button
            type="button"
            onClick={() => removeItem(setter, index)}
            className="text-sm text-red-900"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addItem(setter)}
        className="w-full border border-dashed border-black/30 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-gray-100"
      >
        + {buttonText}
      </button>
    </div>
  );
}
export default function ResumePage() {
  return (
    <Suspense fallback={<div>Loading resume...</div>}>
      <ResumePageContent />
    </Suspense>
  );
}
