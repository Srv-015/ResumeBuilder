import ClassicResume from './ClassicResume';
import ExecutiveResume from './ExecutiveResume';
import EditorialResume from './EditorialResume';

export type Personal = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
};

export type Experience = {
  position: string;
  company: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
};

export type Project = {
  name: string;
  technologies: string;
  link: string;
  startYear: string;
  endYear: string;
  description: string;
};

export type AdditionalSection = {
  id: string;
  title: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  link: string;
};

export type Language = {
  name: string;
  level: string;
};

export type ResumeTemplateProps = {
  personal: Personal;
  summary: string;
  education: Education[];
  skills: string[];
  experience: Experience[];
  projects: Project[];
  additionalSections: AdditionalSection[];
  certifications: Certification[];
  languages: Language[];
  interests: string[];
  hobbies: string[];
  achievements: string[];
  awards: string[];
  volunteerExperience: string[];
};

export type ResumeRendererProps = Partial<ResumeTemplateProps> & {
  template?: string;
};

const emptyPersonal: Personal = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
};

export default function ResumeRenderer({ template = 'classic', ...props }: ResumeRendererProps) {
  const normalized: ResumeTemplateProps = {
    personal: { ...emptyPersonal, ...(props.personal ?? {}) },
    summary: props.summary ?? '',
    education: props.education ?? [],
    skills: props.skills ?? [],
    experience: props.experience ?? [],
    projects: props.projects ?? [],
    additionalSections: props.additionalSections ?? [],
    certifications: props.certifications ?? [],
    languages: props.languages ?? [],
    interests: props.interests ?? [],
    hobbies: props.hobbies ?? [],
    achievements: props.achievements ?? [],
    awards: props.awards ?? [],
    volunteerExperience: props.volunteerExperience ?? [],
  };

  const normalizedTemplate = template.toLowerCase();

  if (normalizedTemplate === 'executive') {
    return <ExecutiveResume {...normalized} />;
  }

  if (normalizedTemplate === 'editorial') {
    return <EditorialResume {...normalized} />;
  }

  return <ClassicResume {...normalized} />;
}
