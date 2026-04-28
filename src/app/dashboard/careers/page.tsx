'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  GraduationCap, 
  BadgeInfo,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { 
  opportunities, 
  Opportunity, 
  OpportunityType, 
  OpportunityStatus 
} from '@/lib/mock-data/opportunities';
import { format } from 'date-fns';

import { 
  submissions as allSubmissions,
  statusLabels as submissionStatusLabels,
  statusColors as submissionStatusColors,
  type Submission
} from '@/lib/mock-data/submissions';

const typeIcons: Record<OpportunityType, React.ReactNode> = {
  job: <Briefcase size={16} />,
  internship: <GraduationCap size={16} />,
  career: <BadgeInfo size={16} />,
};

const statusColors: Record<OpportunityStatus, string> = {
  published: 'success',
  draft: 'info',
  archived: 'danger',
};

export default function OpportunitiesPage() {
  const [view, setView] = useState<'listings' | 'applicants'>('listings');
  const [filter, setFilter] = useState<OpportunityType | 'all'>('all');
  const [activeStat, setActiveStat] = useState<string>('all_active');
  const [searchQuery, setSearchQuery] = useState('');

  const applicants = allSubmissions.filter((s: Submission) => s.type === 'job_application' || s.type === 'internship');

  const filteredOpportunities = opportunities.filter((opp: Opportunity) => {
    const matchesType = filter === 'all' || opp.type === filter;
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Detailed stat filtering
    let matchesStat = true;
    if (activeStat === 'all_active') matchesStat = opp.status === 'published';
    if (activeStat === 'new') matchesStat = opp.applicantCount > 20; // Simulated "new/hot" filter
    if (activeStat === 'review') matchesStat = opp.applicantCount > 0 && opp.status === 'published';
    
    return matchesType && matchesSearch && matchesStat;
  });

  const filteredApplicants = applicants.filter((app: Submission) => {
    return app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           app.subject.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Careers & Opportunities</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage job vacancies, internships, and applicant tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 4 }}>
            <button 
              onClick={() => setView('listings')}
              style={{ padding: '6px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: view === 'listings' ? 'var(--brand-cyan)' : 'transparent', color: view === 'listings' ? '#000' : 'var(--text-secondary)' }}
            >
              Listings
            </button>
            <button 
              onClick={() => setView('applicants')}
              style={{ padding: '6px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: view === 'applicants' ? 'var(--brand-cyan)' : 'transparent', color: view === 'applicants' ? '#000' : 'var(--text-secondary)' }}
            >
              Applicants
              <span style={{ marginLeft: 6, fontSize: 11, padding: '1px 6px', borderRadius: 10, background: 'rgba(0,0,0,0.1)' }}>{applicants.length}</span>
            </button>
          </div>
          <Link href="/dashboard/careers/new" className="btn btn-primary" style={{ height: 42, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} />
            Create
          </Link>
        </div>
      </div>

      {view === 'listings' ? (
        <>
          {/* Interactive Stat Cards - Top Level Filtering */}
          <div className="module-grid" style={{ marginBottom: 32 }}>
            {[
              { id: 'all_active', label: 'Total Active', value: opportunities.filter((o: Opportunity) => o.status === 'published').length, color: 'var(--brand-cyan)' },
              { id: 'new', label: 'New Applications', value: 42, color: 'var(--text-primary)' },
              { id: 'review', label: 'In Review', value: 18, color: 'var(--text-primary)' },
              { id: 'performance', label: 'Days to Hire', value: 22, secondary: 'avg', color: 'var(--text-primary)' },
            ].map((stat: { id: string, label: string, value: number, color: string, secondary?: string }) => (
              <div 
                key={stat.id}
                className={`card ${activeStat === stat.id ? 'active-filter' : ''}`} 
                style={{ 
                  padding: 24, 
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: activeStat === stat.id ? 'var(--brand-cyan-muted)' : 'var(--bg-secondary)',
                  border: activeStat === stat.id ? '1px solid var(--brand-cyan)' : '1px solid var(--border-color)',
                  transform: activeStat === stat.id ? 'translateY(-4px)' : 'none',
                  boxShadow: activeStat === stat.id ? '0 12px 24px rgba(0, 215, 255, 0.1)' : 'none'
                }}
                onClick={() => setActiveStat(stat.id)}
              >
                <div style={{ fontSize: 12, color: activeStat === stat.id ? 'var(--brand-cyan)' : 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: activeStat === stat.id ? 'var(--brand-cyan)' : 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                  {stat.secondary && (
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{stat.secondary}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="card" style={{ marginBottom: 28, padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['all', 'job', 'internship', 'career'] as const).map(t => (
                  <button 
                    key={t}
                    className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}s
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: 300 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="text" 
                  placeholder="Search listings..." 
                  className="input" 
                  style={{ paddingLeft: 38, height: 40 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredOpportunities.map((opp: Opportunity, i: number) => (
              <div 
                key={opp.id} 
                className="card" 
                style={{ 
                  padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  animation: `slideInUp 0.4s ease ${i * 50}ms both`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-cyan)', border: '1px solid var(--border-color)' }}>
                    {typeIcons[opp.type]}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{opp.title}</h3>
                      <span className={`badge badge-${statusColors[opp.status]}`}>{opp.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Users size={14} /> {opp.department}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <MapPin size={14} /> {opp.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{opp.applicantCount}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Applicants</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/dashboard/careers/${opp.id}/edit`} className="btn btn-secondary btn-sm" style={{ width: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit size={16} />
                    </Link>
                    <Link href={`/dashboard/careers/${opp.id}`} className="btn btn-primary btn-sm" style={{ width: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Applicants View */}
          <div className="card" style={{ marginBottom: 28, padding: '16px 24px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                className="input" 
                style={{ paddingLeft: 38, height: 40 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app: Submission, i: number) => (
                <div 
                  key={app.id} 
                  style={{ 
                    padding: '16px 24px', borderBottom: i === filteredApplicants.length - 1 ? 'none' : '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    animation: `fadeIn 0.3s ease ${i * 30}ms both`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--brand-cyan)' }}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Applied for: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.subject}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className={`badge badge-${submissionStatusColors[app.status]}`} style={{ fontSize: 10, alignSelf: 'flex-start' }}>
                        {submissionStatusLabels[app.status]}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {app.createdAt.split('T')[0]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm">View Resume</button>
                      <button className="btn btn-primary btn-sm">Review</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <Users size={48} style={{ color: 'var(--text-tertiary)', opacity: 0.2, marginBottom: 16 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>No applicants found</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
