'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  X, 
  Layout, 
  Settings, 
  FileText,
  Clock,
  MapPin,
  Users,
  Briefcase
} from 'lucide-react';
import { opportunities } from '@/lib/mock-data/opportunities';

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const opportunity = opportunities.find(o => o.id === id);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'draft',
    deadline: '2026-05-15',
    description: '',
    requirements: ''
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title,
        department: opportunity.department,
        location: opportunity.location,
        type: opportunity.type === 'job' ? 'Full-time' : opportunity.type === 'internship' ? 'Internship' : 'Contract',
        status: opportunity.status,
        deadline: '2026-05-15',
        description: `We are looking for a motivated and skilled ${opportunity.title}...`,
        requirements: '5+ years of experience in related fields...'
      });
    }
  }, [opportunity]);

  if (!opportunity) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href={`/dashboard/careers/${id}`} className="btn btn-secondary btn-sm" style={{ width: 36, height: 36, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Edit Opportunity</h1>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>ID: {id} • Update listing details and publication status</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ height: 40 }}>Cancel</button>
          <button onClick={() => router.push('/dashboard/careers')} className="btn btn-primary" style={{ height: 40 }}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Main Content - Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* General Information */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <FileText size={18} style={{ color: 'var(--brand-cyan)' }} />
              <h2 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>Role Information</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Opportunity Title</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Department</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Location</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Job Description</label>
                <textarea 
                  className="input" 
                  style={{ minHeight: 180, paddingTop: 12, resize: 'vertical' }}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Requirements</label>
                <textarea 
                  className="input" 
                  style={{ minHeight: 140, paddingTop: 12, resize: 'vertical' }}
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Publication Settings */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Settings size={16} style={{ color: 'var(--brand-cyan)' }} />
              <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Settings</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Employment Type</label>
                <select 
                  className="input" 
                  style={{ height: 36, fontSize: 13 }}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Publication Status</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: formData.status === 'published' ? 'var(--brand-cyan-muted)' : 'transparent', border: '1px solid ' + (formData.status === 'published' ? 'var(--brand-cyan)' : 'var(--border-color)') }}>
                    <input type="radio" name="status" checked={formData.status === 'published'} onChange={() => setFormData({...formData, status: 'published'})} />
                    <span style={{ fontSize: 13, color: formData.status === 'published' ? 'var(--brand-cyan)' : 'var(--text-secondary)' }}>Published</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: formData.status === 'draft' ? 'var(--bg-tertiary)' : 'transparent', border: '1px solid ' + (formData.status === 'draft' ? 'var(--text-primary)' : 'var(--border-color)') }}>
                    <input type="radio" name="status" checked={formData.status === 'draft'} onChange={() => setFormData({...formData, status: 'draft'})} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Draft</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: formData.status === 'archived' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', border: '1px solid ' + (formData.status === 'archived' ? 'var(--danger)' : 'var(--border-color)') }}>
                    <input type="radio" name="status" checked={formData.status === 'archived'} onChange={() => setFormData({...formData, status: 'archived'})} />
                    <span style={{ fontSize: 13, color: formData.status === 'archived' ? 'var(--danger)' : 'var(--text-secondary)' }}>Archived</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Application Deadline</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="date" 
                    className="input" 
                    style={{ height: 36, fontSize: 13, paddingLeft: 32 }} 
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
