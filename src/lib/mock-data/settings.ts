export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  ip: string;
}

export const systemUsers: SystemUser[] = [
  { id: '1', name: 'Sarah Chen', email: 'admin@techbiz.com', role: 'admin', status: 'active', lastLogin: '2026-04-28T09:00:00Z', createdAt: '2025-01-15T10:00:00Z' },
  { id: '2', name: 'James Miller', email: 'analyst@techbiz.com', role: 'analyst', status: 'active', lastLogin: '2026-04-28T08:30:00Z', createdAt: '2025-03-20T10:00:00Z' },
  { id: '3', name: 'Emily Rodriguez', email: 'content@techbiz.com', role: 'content_manager', status: 'active', lastLogin: '2026-04-27T17:00:00Z', createdAt: '2025-06-10T10:00:00Z' },
  { id: '4', name: 'Michael Park', email: 'ops@techbiz.com', role: 'operations', status: 'active', lastLogin: '2026-04-28T07:45:00Z', createdAt: '2025-02-28T10:00:00Z' },
  { id: '5', name: 'Anna Williams', email: 'anna.w@techbiz.com', role: 'analyst', status: 'inactive', lastLogin: '2026-03-15T10:00:00Z', createdAt: '2025-09-01T10:00:00Z' },
  { id: '6', name: 'Carlos Mendez', email: 'carlos.m@techbiz.com', role: 'content_manager', status: 'active', lastLogin: '2026-04-26T14:00:00Z', createdAt: '2025-11-12T10:00:00Z' },
];

export const auditLog: AuditEntry[] = [
  { id: 'a1', user: 'Sarah Chen', action: 'USER_CREATED', target: 'Carlos Mendez', details: 'Created new user with Content Manager role', timestamp: '2025-11-12T10:00:00Z', ip: '192.168.1.10' },
  { id: 'a2', user: 'Emily Rodriguez', action: 'ARTICLE_PUBLISHED', target: 'The Future of AI in Enterprise Software', details: 'Published article from draft', timestamp: '2026-04-10T09:00:00Z', ip: '192.168.1.22' },
  { id: 'a3', user: 'Sarah Chen', action: 'ROLE_CHANGED', target: 'Anna Williams', details: 'Changed role from Content Manager to Analyst', timestamp: '2026-02-15T14:00:00Z', ip: '192.168.1.10' },
  { id: 'a4', user: 'Michael Park', action: 'SUBMISSION_RESPONDED', target: 'SUB-003', details: 'Sent proposal to GlobalTech Industries', timestamp: '2026-04-26T10:00:00Z', ip: '192.168.1.35' },
  { id: 'a5', user: 'Sarah Chen', action: 'USER_DEACTIVATED', target: 'Anna Williams', details: 'Deactivated user account', timestamp: '2026-03-20T11:00:00Z', ip: '192.168.1.10' },
  { id: 'a6', user: 'James Miller', action: 'REPORT_EXPORTED', target: 'Analytics Q1 2026', details: 'Exported analytics report as PDF', timestamp: '2026-04-01T16:00:00Z', ip: '192.168.1.18' },
  { id: 'a7', user: 'Emily Rodriguez', action: 'ARTICLE_SCHEDULED', target: 'Cybersecurity Best Practices for Startups', details: 'Scheduled for May 5, 2026', timestamp: '2026-04-25T13:00:00Z', ip: '192.168.1.22' },
  { id: 'a8', user: 'Sarah Chen', action: 'SETTINGS_UPDATED', target: 'System Settings', details: 'Updated notification preferences', timestamp: '2026-04-27T10:00:00Z', ip: '192.168.1.10' },
  { id: 'a9', user: 'Michael Park', action: 'SUBMISSION_CLOSED', target: 'SUB-010', details: 'Closed submission — project delivered', timestamp: '2026-04-15T17:00:00Z', ip: '192.168.1.35' },
  { id: 'a10', user: 'Sarah Chen', action: 'LOGIN', target: 'System', details: 'Successful login', timestamp: '2026-04-28T09:00:00Z', ip: '192.168.1.10' },
];

export const rolePermissions = {
  admin: { analytics: true, cms: true, submissions: true, settings: true, users: true },
  analyst: { analytics: true, cms: false, submissions: false, settings: false, users: false },
  content_manager: { analytics: false, cms: true, submissions: false, settings: false, users: false },
  operations: { analytics: false, cms: false, submissions: true, settings: false, users: false },
};
