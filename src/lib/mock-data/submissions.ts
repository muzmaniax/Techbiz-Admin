export type SubmissionType = 'internship' | 'consultation' | 'service' | 'job_application';
export type SubmissionStatus = 'new' | 'in_review' | 'responded' | 'closed';

export interface Submission {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  assignedTo: string | null;
  opportunityId?: string; // Linked to Careers & Opportunities
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export const submissions: Submission[] = [
  {
    id: 'SUB-001',
    type: 'consultation',
    status: 'new',
    name: 'David Thompson',
    email: 'david.t@acmecorp.com',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corp',
    subject: 'Digital Transformation Consultation',
    message: 'We are looking to modernize our legacy systems and would like to discuss a comprehensive digital transformation strategy. Our current infrastructure is primarily on-premise and we need guidance on cloud migration, microservices adoption, and DevOps implementation. Budget range is $500K-$1M.',
    assignedTo: null,
    notes: [],
    createdAt: '2026-04-28T09:30:00Z',
    updatedAt: '2026-04-28T09:30:00Z',
  },
  {
    id: 'SUB-002',
    type: 'internship',
    status: 'in_review',
    name: 'Aisha Patel',
    email: 'aisha.patel@university.edu',
    phone: '+1 (555) 345-6789',
    subject: 'Summer 2026 Engineering Internship',
    opportunityId: 'opp-2',
    message: 'I am a junior CS student at MIT with experience in React, Node.js, and Python. I have completed two previous internships at startups and contributed to open-source projects. I am particularly interested in your AI/ML team. GPA: 3.8/4.0.',
    assignedTo: 'Sarah Chen',
    notes: [
      {
        id: 'n1',
        author: 'Sarah Chen',
        content: 'Strong candidate. Schedule technical interview for next week.',
        createdAt: '2026-04-27T14:00:00Z',
      },
    ],
    createdAt: '2026-04-25T11:00:00Z',
    updatedAt: '2026-04-27T14:00:00Z',
  },
  {
    id: 'SUB-003',
    type: 'service',
    status: 'responded',
    name: 'Robert Martinez',
    email: 'r.martinez@globaltech.io',
    phone: '+1 (555) 456-7890',
    company: 'GlobalTech Industries',
    subject: 'Custom CRM Development',
    message: 'We need a custom CRM solution integrated with our existing ERP system. The CRM should handle 50K+ contacts, automated workflows, and advanced reporting. Looking for a 6-month development timeline.',
    assignedTo: 'Michael Park',
    notes: [
      {
        id: 'n2',
        author: 'Michael Park',
        content: 'Sent initial proposal with pricing tiers. Follow up in 3 days.',
        createdAt: '2026-04-26T10:00:00Z',
      },
      {
        id: 'n3',
        author: 'Michael Park',
        content: 'Client requested revised timeline — they want Phase 1 in 3 months.',
        createdAt: '2026-04-27T16:00:00Z',
      },
    ],
    createdAt: '2026-04-22T09:00:00Z',
    updatedAt: '2026-04-27T16:00:00Z',
  },
  {
    id: 'SUB-013',
    type: 'job_application',
    status: 'new',
    name: 'Kevin Smith',
    email: 'k.smith@tech.com',
    phone: '+1 (555) 111-2222',
    subject: 'Application: Senior Frontend Engineer',
    opportunityId: 'opp-1',
    message: 'Applying for the Senior Frontend Engineer position. I have 7 years of React experience and have worked on high-scale dashboards at Stripe and Vercel.',
    assignedTo: null,
    notes: [],
    createdAt: '2026-04-28T10:30:00Z',
    updatedAt: '2026-04-28T10:30:00Z',
  },
  {
    id: 'SUB-004',
    type: 'internship',
    status: 'new',
    name: 'Chen Wei',
    email: 'chen.wei@stanford.edu',
    phone: '+1 (555) 567-8901',
    subject: 'Fall 2026 Product Design Internship',
    opportunityId: 'opp-2',
    message: 'Product design student with strong portfolio in B2B SaaS. Proficient in Figma, user research, and design systems. Looking for a 3-month internship starting September.',
    assignedTo: null,
    notes: [],
    createdAt: '2026-04-27T15:00:00Z',
    updatedAt: '2026-04-27T15:00:00Z',
  },
  {
    id: 'SUB-005',
    type: 'consultation',
    status: 'in_review',
    name: 'Lisa Anderson',
    email: 'l.anderson@healthplus.com',
    phone: '+1 (555) 678-9012',
    company: 'HealthPlus Network',
    subject: 'HIPAA-Compliant Platform Architecture',
    message: 'We are building a telehealth platform and need expert guidance on HIPAA-compliant architecture. Need consulting on data encryption, access controls, and audit logging. This is urgent — we have a regulatory deadline in Q3.',
    assignedTo: 'James Miller',
    notes: [
      {
        id: 'n4',
        author: 'James Miller',
        content: 'Reviewed requirements. This is a high-priority engagement. Need to loop in security team.',
        createdAt: '2026-04-26T11:00:00Z',
      },
    ],
    createdAt: '2026-04-24T08:00:00Z',
    updatedAt: '2026-04-26T11:00:00Z',
  },
  {
    id: 'SUB-006',
    type: 'service',
    status: 'new',
    name: 'Marcus Johnson',
    email: 'm.johnson@retailco.com',
    phone: '+1 (555) 789-0123',
    company: 'RetailCo',
    subject: 'E-commerce Platform Migration',
    message: 'We want to migrate our e-commerce platform from Magento to a headless architecture. Current site handles $2M/month in transactions. Need minimal downtime during migration.',
    assignedTo: null,
    notes: [],
    createdAt: '2026-04-28T07:00:00Z',
    updatedAt: '2026-04-28T07:00:00Z',
  },
  {
    id: 'SUB-008',
    type: 'internship',
    status: 'responded',
    name: 'Jordan Kim',
    email: 'j.kim@berkeley.edu',
    phone: '+1 (555) 890-1234',
    subject: 'Summer 2026 Data Science Internship',
    opportunityId: 'opp-2',
    message: 'Data science major with focus on NLP and machine learning. Published research paper on sentiment analysis. Familiar with PyTorch, TensorFlow, and MLflow.',
    assignedTo: 'Sarah Chen',
    notes: [
      {
        id: 'n6',
        author: 'Sarah Chen',
        content: 'Excellent profile. Passed first round. Technical interview scheduled for May 2.',
        createdAt: '2026-04-26T09:00:00Z',
      },
    ],
    createdAt: '2026-04-23T10:00:00Z',
    updatedAt: '2026-04-26T09:00:00Z',
  },
];

export const typeLabels: Record<SubmissionType, string> = {
  internship: 'Internship',
  consultation: 'Consultation',
  service: 'Service Inquiry',
  job_application: 'Job Application',
};

export const statusLabels: Record<SubmissionStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  responded: 'Responded',
  closed: 'Closed',
};

export const statusColors: Record<SubmissionStatus, string> = {
  new: 'info',
  in_review: 'warning',
  responded: 'success',
  closed: 'neutral',
};
