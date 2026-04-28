'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, FileText, Inbox, Settings, ArrowRight, TrendingUp, 
  Users, Eye, MousePointerClick, Clock, ChevronRight, Activity, 
  Zap, Globe, ShieldCheck
} from 'lucide-react';
import { useAuth, getRoleLabel } from '@/lib/auth-context';
import { submissions as allSubmissions, statusLabels as submissionStatusLabels, statusColors as submissionStatusColors } from '@/lib/mock-data/submissions';
import { articles as allArticles } from '@/lib/mock-data/articles';
import { auditLog } from '@/lib/mock-data/settings';
import { formatDate } from '@/lib/utils';
import { opportunities as allOpportunities } from '@/lib/mock-data/opportunities';
import { Briefcase } from 'lucide-react';

interface QuickStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

function QuickStat({ label, value, icon, trend, color = 'var(--brand-cyan)' }: QuickStatProps) {
  return (
    <div className="card-metric" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          background: color.includes('cyan') ? 'var(--brand-cyan-muted)' : 
                      color.includes('info') ? 'var(--info-muted)' :
                      color.includes('success') ? 'var(--success-muted)' :
                      color.includes('warning') ? 'var(--warning-muted)' :
                      'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      </div>
      {trend && (
        <div
          style={{
            marginLeft: 'auto',
            fontSize: 12,
            fontWeight: 600,
            color: trend.startsWith('+') ? 'var(--brand-cyan)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stat: string;
  statLabel: string;
  secondaryStats?: { value: string; label: string }[];
  delay: number;
}

function ModuleCard({ title, description, icon, href, stat, statLabel, secondaryStats, delay }: ModuleCardProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        animation: `fadeIn 0.5s ease ${delay}ms both`,
      }}
    >
      <div
        className="card h-full"
        style={{
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 220,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand-cyan)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3), 0 0 20px var(--brand-cyan-muted)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-cyan-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-cyan)',
            }}
          >
            {icon}
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
          {description}
        </p>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-cyan)' }}>{stat}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{statLabel}</span>
          </div>
          {secondaryStats && (
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {secondaryStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DashboardHome() {
  const { user, hasAccess } = useAuth();

  if (!user) return null;

  // Filter submissions by role
  const filteredSubmissions = allSubmissions.filter((s) => {
    if (user.role === 'hr_manager') {
      return s.type === 'job_application' || s.type === 'internship';
    }
    return true;
  });

  const recentSubmissions = filteredSubmissions.slice(0, 5);
  const recentArticles = allArticles.slice(0, 3);
  const recentLogs = auditLog.slice(0, 4);

  const openOpportunities = allOpportunities.filter(o => o.status === 'published');
  const totalApplicants = allOpportunities.reduce((acc, o) => acc + o.applicantCount, 0);

  return (
    <div className="animate-fade-in">
      {/* Compressed Hero Banner */}
      <div 
        style={{ 
          marginBottom: 20, 
          padding: '16px 24px', 
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            You have <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>12 pending submissions</span> and <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>3 scheduled articles</span> this week.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
          <div style={{ padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>v1.4.2</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            System Optimal
          </div>
        </div>
      </div>

      <div className="module-grid staggered-grid" style={{ marginBottom: 20 }}>
        <QuickStat label="Active Users" value="48.2K" icon={<Users size={22} />} trend="+12.5%" />
        <QuickStat label="Live Sessions" value="1.2K" icon={<Globe size={22} />} color="var(--info)" />
        <QuickStat label="Lead Generation" value="8,432" icon={<MousePointerClick size={22} />} trend="+15.2%" />
        <QuickStat label="Security Scans" value="Clean" icon={<ShieldCheck size={22} />} color="var(--success)" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Control Modules</h2>
          <Link href="/dashboard/settings" style={{ fontSize: 13, color: 'var(--brand-cyan)', textDecoration: 'none', fontWeight: 600 }}>Manage Access</Link>
        </div>
        <div className="module-grid">
          {hasAccess('analytics') && (
            <ModuleCard
              title="Analytics"
              description="Real-time traffic monitoring, conversion tracking, and behavior analysis."
              icon={<BarChart3 size={24} />}
              href="/dashboard/analytics"
              stat="3.8%"
              statLabel="conversion"
              delay={0}
            />
          )}
          {hasAccess('cms') && (
            <ModuleCard
              title="Insights CMS"
              description="Editorial workflow with rich text editing and SEO tools."
              icon={<FileText size={24} />}
              href="/dashboard/cms"
              stat="24"
              statLabel="articles"
              delay={100}
            />
          )}
          {hasAccess('submissions') && (
            <ModuleCard
              title="Submissions"
              description="Centralized intake for business inquiries and talent."
              icon={<Inbox size={24} />}
              href="/dashboard/submissions"
              stat="12"
              statLabel="new leads"
              delay={200}
            />
          )}
          {hasAccess('careers') && (
            <ModuleCard
              title="Careers"
              description="Manage job listings, internships, and applicant flow."
              icon={<Briefcase size={24} />}
              href="/dashboard/careers"
              stat={String(allOpportunities.length)}
              statLabel="listings"
              secondaryStats={[
                { value: String(openOpportunities.length), label: 'open' },
                { value: String(totalApplicants), label: 'applicants' }
              ]}
              delay={300}
            />
          )}
        </div>
      </div>

      <div className="split-layout">
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Recent Submissions Widget */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Incoming Submissions</h3>
              <Link href="/dashboard/submissions" className="btn btn-ghost btn-sm">View Inbox</Link>
            </div>
            <div style={{ padding: 8 }}>
              {recentSubmissions.map((sub) => (
                <Link 
                  key={sub.id} 
                  href="/dashboard/submissions" 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    textDecoration: 'none', transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sub.status === 'new' ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{sub.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`badge badge-${submissionStatusColors[sub.status]}`} style={{ fontSize: 10, padding: '1px 8px' }}>
                      {submissionStatusLabels[sub.status]}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{formatDate(sub.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* System Status */}
          <div className="card glass-accent" style={{ padding: 24, border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--brand-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Activity size={18} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Network Health</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Server Uptime</span>
                  <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>99.98%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                  <div style={{ width: '99%', height: '100%', background: 'var(--brand-cyan)', borderRadius: 2 }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cache Hit Rate</span>
                  <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>94.2%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                  <div style={{ width: '94%', height: '100%', background: 'var(--brand-cyan)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-cyan)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>All Edge Nodes Active</span>
            </div>
          </div>

          {/* Recent Logs Snippet */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />
              System Audit
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 2, background: 'var(--border-color)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: -2, width: 6, height: 6, borderRadius: '50%', background: 'var(--border-color)' }} />
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.user}</span> {log.action.toLowerCase().replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Just now</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/settings" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--brand-cyan)', textDecoration: 'none', marginTop: 12 }}>View Full Audit Log</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
