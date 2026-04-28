export type OpportunityType = 'job' | 'internship' | 'career';
export type OpportunityStatus = 'published' | 'draft' | 'archived';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  department: string;
  location: string;
  status: OpportunityStatus;
  postedDate: string;
  expiryDate: string;
  description: string;
  requirements: string[];
  applicantCount: number;
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Senior Frontend Engineer',
    type: 'job',
    department: 'Engineering',
    location: 'Remote',
    status: 'published',
    postedDate: '2024-03-15',
    expiryDate: '2024-05-15',
    description: 'We are looking for a Senior Frontend Engineer to lead our dashboard development...',
    requirements: ['5+ years React experience', 'TypeScript mastery', 'UI/UX design sensibility'],
    applicantCount: 24,
  },
  {
    id: 'opp-2',
    title: 'Full Stack Developer Intern',
    type: 'internship',
    department: 'Engineering',
    location: 'New York, NY',
    status: 'published',
    postedDate: '2024-03-20',
    expiryDate: '2024-04-30',
    description: 'Join our team as an intern and work on high-impact projects...',
    requirements: ['Basic knowledge of Node.js', 'React fundamentals', 'Passion for web tech'],
    applicantCount: 156,
  },
  {
    id: 'opp-3',
    title: 'Product Designer',
    type: 'job',
    department: 'Design',
    location: 'Hybrid',
    status: 'draft',
    postedDate: '2024-03-25',
    expiryDate: '2024-06-01',
    description: 'Design the future of enterprise management systems...',
    requirements: ['Portfolio showing B2B SaaS', 'Figma expert', 'Prototyping skills'],
    applicantCount: 0,
  },
  {
    id: 'opp-4',
    title: 'Content Strategist',
    type: 'career',
    department: 'Marketing',
    location: 'Remote',
    status: 'published',
    postedDate: '2024-02-10',
    expiryDate: 'never',
    description: 'Help us define the voice of TechBiz...',
    requirements: ['Excellent writing skills', 'SEO knowledge', 'Editorial experience'],
    applicantCount: 42,
  },
];
