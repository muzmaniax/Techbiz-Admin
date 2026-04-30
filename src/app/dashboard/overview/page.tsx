'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, FileText, Inbox, Settings, ArrowRight, TrendingUp, 
  Users, Eye, MousePointerClick, Clock, ChevronRight, Activity, 
  Zap, Globe, ShieldCheck, UserPlus, PlusCircle, FilePlus, 
  Edit3, Download, CheckSquare, Briefcase, Plus, Layout, 
  FileCheck, Calendar, PieChart, MousePointer, Share2, 
  ClipboardList, CheckCircle, AlertCircle, Gauge
} from 'lucide-react';
import { useAuth, getRoleLabel, UserRole } from '@/lib/auth-context';
import { submissions as allSubmissions, statusLabels as submissionStatusLabels, statusColors as submissionStatusColors } from '@/lib/mock-data/submissions';
import { articles as allArticles } from '@/lib/mock-data/articles';
import { auditLog } from '@/lib/mock-data/settings';
import { formatDate } from '@/lib/utils';
import { opportunities as allOpportunities } from '@/lib/mock-data/opportunities';

interface QuickStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
  delay: number;
}

function QuickStat({ label, value, icon, trend, color = 'var(--brand-cyan)', delay }: QuickStatProps) {
  return (
    <div 
      className="card-metric h-full" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        animation: `fadeIn 0.5s ease ${delay}ms both`
      }}
    >
      <div style={{ 
        color: color, 
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32 // Consistent width to keep alignment
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      </div>
      {trend && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: trend.startsWith('+') ? 'var(--brand-cyan)' : trend.startsWith('-') ? 'var(--danger)' : 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            alignSelf: 'flex-start',
            marginTop: 4
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
}

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  delay: number;
}

function QuickAction({ label, icon, href, delay }: QuickActionProps) {
  return (
    <Link 
      href={href} 
      style={{ textDecoration: 'none', animation: `fadeIn 0.5s ease ${delay}ms both` }}
    >
      <div 
        className="card card-interactive h-full" 
        style={{ 
          padding: '12px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          minWidth: 160
        }}
      >
        <div style={{ color: 'var(--brand-cyan)' }}>{icon}</div>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.04em' }}>{label}</span>
      </div>
    </Link>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stat: string;
  statLabel: string;
  delay: number;
}

function ModuleCard({ title, description, icon, href, stat, statLabel, delay }: ModuleCardProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        animation: `fadeIn 0.5s ease ${delay}ms both`,
      }}
    >
      <div
        className="card card-interactive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          gap: 12,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Row: Icon + Action Arrow (Auto Layout: Space-Between) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ color: 'var(--brand-cyan)', flexShrink: 0 }}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
          </div>
          <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
        </div>

        {/* Middle Section: Title + Supporting Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em' }}>{title}</h3>
          <p style={{ 
            fontSize: 11, 
            color: 'var(--text-tertiary)', 
            margin: 0, 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {description || `Manage ${title.toLowerCase()}`}
          </p>
        </div>

        {/* Bottom Section: Key Stat (Consistently Aligned) */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--brand-cyan)', letterSpacing: '-0.04em' }}>{stat}</span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase' }}>{statLabel}</span>
        </div>
      </div>
    </Link>
  );
}

const QUICK_ACTIONS_MAP: Record<UserRole, { label: string; icon: any; href: string }[]> = {
  admin: [
    { label: 'Add User', icon: <UserPlus size={20} />, href: '/dashboard/settings' },
    { label: 'Create Insight', icon: <PlusCircle size={20} />, href: '/dashboard/cms' },
    { label: 'View Submissions', icon: <Inbox size={20} />, href: '/dashboard/submissions' },
  ],
  hr_manager: [
    { label: 'Post Job', icon: <Plus size={20} />, href: '/dashboard/careers' },
    { label: 'Review Applications', icon: <Users size={20} />, href: '/dashboard/submissions' },
  ],
  content_manager: [
    { label: 'New Article', icon: <FilePlus size={20} />, href: '/dashboard/cms' },
    { label: 'Manage Drafts', icon: <Edit3 size={20} />, href: '/dashboard/cms' },
  ],
  analyst: [
    { label: 'View Reports', icon: <BarChart3 size={20} />, href: '/dashboard/analytics' },
    { label: 'Export Data', icon: <Download size={20} />, href: '/dashboard/analytics' },
  ],
  operations: [
    { label: 'View Submissions', icon: <Inbox size={20} />, href: '/dashboard/submissions' },
    { label: 'Assign Tasks', icon: <CheckSquare size={20} />, href: '/dashboard/settings' },
  ],
};

const KPI_MAP: Record<UserRole, QuickStatProps[]> = {
  admin: [
    { label: 'Total Users', value: '84.2K', icon: <Users size={24} />, trend: '+12%', color: 'var(--brand-cyan)', delay: 0 },
    { label: 'Active Sessions', value: '1.2K', icon: <Globe size={24} />, trend: 'Stable', color: 'var(--brand-cyan)', delay: 100 },
    { label: 'System Health', value: 'Optimal', icon: <ShieldCheck size={24} />, color: 'var(--brand-cyan)', delay: 200 },
    { label: 'Pending Submissions', value: '12', icon: <Inbox size={24} />, trend: '+3 new', color: 'var(--brand-cyan)', delay: 300 },
  ],
  hr_manager: [
    { label: 'Open Positions', value: '8', icon: <Briefcase size={24} />, color: 'var(--brand-cyan)', delay: 0 },
    { label: 'Applications', value: '124', icon: <Users size={24} />, trend: '+18%', color: 'var(--brand-cyan)', delay: 100 },
    { label: 'In Review', value: '42', icon: <Clock size={24} />, trend: 'Active', color: 'var(--brand-cyan)', delay: 200 },
    { label: 'Avg Time to Hire', value: '14d', icon: <TrendingUp size={24} />, trend: '-2d', color: 'var(--brand-cyan)', delay: 300 },
  ],
  content_manager: [
    { label: 'Published Articles', value: '24', icon: <FileCheck size={24} />, trend: '+4 this wk', color: 'var(--brand-cyan)', delay: 0 },
    { label: 'Drafts Pending', value: '6', icon: <Edit3 size={24} />, color: 'var(--brand-cyan)', delay: 100 },
    { label: 'Scheduled Posts', value: '3', icon: <Calendar size={24} />, color: 'var(--brand-cyan)', delay: 200 },
    { label: 'Engagement Rate', value: '4.2%', icon: <Share2 size={24} />, trend: '+0.5%', color: 'var(--brand-cyan)', delay: 300 },
  ],
  analyst: [
    { label: 'Traffic Volume', value: '142K', icon: <PieChart size={24} />, trend: '+8.4%', color: 'var(--brand-cyan)', delay: 0 },
    { label: 'Conversion Rate', value: '3.8%', icon: <MousePointer size={24} />, trend: '+1.2%', color: 'var(--brand-cyan)', delay: 100 },
    { label: 'Bounce Rate', value: '24%', icon: <TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} />, trend: '-2.1%', color: 'var(--brand-cyan)', delay: 200 },
    { label: 'Top Channel', value: 'Direct', icon: <Globe size={24} />, color: 'var(--brand-cyan)', delay: 300 },
  ],
  operations: [
    { label: 'Active Requests', value: '18', icon: <Clock size={24} />, trend: 'Active', color: 'var(--brand-cyan)', delay: 0 },
    { label: 'Completed Tasks', value: '156', icon: <CheckCircle size={24} />, trend: '+24', color: 'var(--brand-cyan)', delay: 100 },
    { label: 'Pending Assignments', value: '7', icon: <Users size={24} />, color: 'var(--brand-cyan)', delay: 200 },
    { label: 'SLA Compliance', value: '98.4%', icon: <ShieldCheck size={24} />, trend: 'Stable', color: 'var(--brand-cyan)', delay: 300 },
  ],
};

export default function DashboardHome() {
  const { user, hasAccess } = useAuth();

  if (!user) return null;

  // Filter logic
  const filteredSubmissions = allSubmissions.filter((s) => {
    if (user.role === 'hr_manager') return s.type === 'job_application' || s.type === 'internship';
    return true;
  });

  const recentSubmissions = filteredSubmissions.slice(0, 6);
  const roleActions = QUICK_ACTIONS_MAP[user.role] || [];
  const roleKPIs = KPI_MAP[user.role] || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Row 1: Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 4 }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Overview of the system performance and your active workspace modules.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="badge badge-neutral" style={{ fontSize: 11 }}>v1.4.2</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} />
            {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* Row 2: Quick Actions (Horizontal) */}
      <div style={{ marginTop: 8 }}>
        <h2 style={{ 
          fontSize: 12, 
          fontWeight: 500, 
          color: 'var(--text-tertiary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          marginBottom: 12 
        }}>
          Quick Actions
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          overflowX: 'auto', 
          padding: '12px 4px', // Increased padding to prevent any clipping on hover
          margin: '-12px -4px'
        }}>
          {roleActions.map((action, i) => (
            <QuickAction key={action.label} {...action} delay={i * 100} />
          ))}
        </div>
      </div>

      {/* Row 3: Role-Specific KPI Cards (4 max) */}
      <div className="compact-grid">
        {roleKPIs.map((kpi, i) => (
          <QuickStat key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Row 4: Main Content Split (8/4) */}
      <div className="bento-grid">
        {/* Left: Incoming Submissions (8 columns) */}
        <div className="bento-span-8">
          <div className="card h-full" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>Incoming Submissions</h3>
              <Link href="/dashboard/submissions" className="btn btn-ghost btn-sm">Full Inbox</Link>
            </div>
            <div style={{ padding: 8, flex: 1 }}>
              {recentSubmissions.map((sub) => (
                <Link 
                  key={sub.id} 
                  href="/dashboard/submissions" 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 'var(--radius-md)',
                    textDecoration: 'none', transition: 'background 0.2s', minHeight: '56px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sub.status === 'new' ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.subject}</div>
                  </div>
                  <div className={`badge badge-${submissionStatusColors[sub.status]}`} style={{ fontSize: 10 }}>
                    {submissionStatusLabels[sub.status]}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Control Modules + Secondary (4 columns) */}
        <div className="bento-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Control Modules (Structured 2x2 Grid) */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Control Modules</h3>
             <div className="compact-grid" style={{ width: '100%' }}>
               {hasAccess('analytics') && (
                <ModuleCard title="Analytics" description="Real-time data" icon={<BarChart3 />} href="/dashboard/analytics" stat="3.8%" statLabel="conv" delay={0} />
              )}
              {hasAccess('cms') && (
                <ModuleCard title="Insights" description="Content engine" icon={<FileText />} href="/dashboard/cms" stat="24" statLabel="arts" delay={100} />
              )}
               {hasAccess('submissions') && (
                <ModuleCard title="Leads" description="Inbound flow" icon={<Inbox />} href="/dashboard/submissions" stat="12" statLabel="new" delay={200} />
              )}
              {hasAccess('careers') && (
                <ModuleCard title="Careers" description="Talent pipeline" icon={<Briefcase />} href="/dashboard/careers" stat={String(allOpportunities.length)} statLabel="jobs" delay={300} />
              )}
             </div>
          </div>

          {/* Secondary Widget: System Performance/Audit */}
          <div className="card glass-accent" style={{ padding: 20, border: 'none' }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} />
              System Audit
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {auditLog.slice(0, 3).map((log, i) => (
                <div key={log.id} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  <div style={{ color: 'var(--text-tertiary)', marginTop: 2 }}><Clock size={12} /></div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.user}</span> {log.action.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
