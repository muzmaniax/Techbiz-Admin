'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  Clock, 
  Briefcase, 
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { opportunities } from '@/lib/mock-data/opportunities';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const opportunity = opportunities.find(o => o.id === id);

  if (!opportunity) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, color: 'var(--text-secondary)' }}>Opportunity not found</h2>
        <Link href="/dashboard/careers" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header / Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard/careers" className="btn btn-secondary btn-sm" style={{ width: 36, height: 36, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{opportunity.title}</h1>
              <span className={`badge badge-${opportunity.status === 'published' ? 'success' : 'info'}`} style={{ fontSize: 11 }}>
                {opportunity.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={14} />
                {opportunity.department}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} />
                {opportunity.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} />
                Posted {opportunity.postedDate}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href={`/dashboard/careers/${id}/edit`} className="btn btn-secondary" style={{ height: 40 }}>
            <Edit size={16} />
            Edit
          </Link>
          <button className="btn btn-secondary" style={{ height: 40, color: 'var(--danger)' }}>
            <XCircle size={16} />
            Close Job
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ height: 40, border: '1px solid var(--danger-muted)', color: 'var(--danger)' }}
            onClick={() => {
              if(confirm('Are you sure you want to permanently delete this opportunity? This will also remove any associated application history.')) {
                router.push('/dashboard/careers');
              }
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="card" style={{ padding: 32 }}>
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Description</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                We are looking for a motivated and skilled {opportunity.title} to join our {opportunity.department} team. 
                At TechBiz, we value innovation, collaboration, and high-quality engineering. 
                In this role, you will be responsible for building scalable features and ensuring a premium user experience.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Requirements</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 20 }}>
                <li style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>5+ years of experience in {opportunity.department}-related fields.</li>
                <li style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Strong proficiency in modern technologies and best practices.</li>
                <li style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Ability to work in a fast-paced, collaborative environment.</li>
                <li style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Excellent communication and problem-solving skills.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Stats */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Opportunity Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={16} style={{ color: 'var(--brand-cyan)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Applicants</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{opportunity.applicantCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Eye size={16} style={{ color: 'var(--brand-cyan)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Views</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>1,248</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--brand-cyan)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Conv. Rate</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>4.2%</span>
              </div>
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
              <Link href="/dashboard/submissions" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                View All Applications
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: 20, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Timeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Created</span>
                <span style={{ color: 'var(--text-secondary)' }}>{opportunity.postedDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Deadline</span>
                <span style={{ color: 'var(--text-secondary)' }}>May 15, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
