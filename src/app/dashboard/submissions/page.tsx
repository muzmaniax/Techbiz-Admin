'use client';

import React, { useState } from 'react';
import {
  Search, Filter, GraduationCap, MessageSquare, Briefcase,
  Clock, CheckCircle2, Mail, Phone, Building2, User, MessageCircle,
  ChevronRight, X, Download, Archive, Send, Plus, ExternalLink
} from 'lucide-react';
import {
  submissions as initialSubmissions,
  typeLabels,
  statusLabels,
  statusColors,
  type Submission,
  type SubmissionType,
  type SubmissionStatus,
} from '@/lib/mock-data/submissions';
import { opportunities } from '@/lib/mock-data/opportunities';
import { formatDate, formatDateTime, truncate } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const typeIcons: Record<SubmissionType, React.ReactNode> = {
  consultation: <MessageSquare size={16} />,
  service: <Briefcase size={16} />,
  job_application: <User size={16} />,
  internship: <GraduationCap size={16} />,
};

const typeColors: Record<SubmissionType, { bg: string, text: string }> = {
  consultation: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  service: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316' },
  job_application: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1' },
  internship: { bg: 'rgba(0, 215, 255, 0.1)', text: 'var(--brand-cyan)' },
};

const statusFlow: SubmissionStatus[] = ['new', 'in_review', 'responded', 'closed'];

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<SubmissionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all');
  const [filterOpportunity, setFilterOpportunity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!user) return null;

  // Filter ONLY non-job related submissions for this module
  const businessSubmissions = submissions.filter(s => 
    s.type !== 'job_application' && s.type !== 'internship'
  );

  const selected = businessSubmissions.find((s) => s.id === selectedId);
  const relatedOpp = selected?.opportunityId ? opportunities.find(o => o.id === selected.opportunityId) : null;

  const filtered = businessSubmissions.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (filterOpportunity !== 'all' && s.opportunityId !== filterOpportunity) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s)
    );
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedId) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedId
          ? {
              ...s,
              notes: [
                ...s.notes,
                { id: `n${Date.now()}`, author: 'Sarah Chen', content: newNote, createdAt: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    setNewNote('');
  };

  const counts = {
    all: businessSubmissions.length,
    new: businessSubmissions.filter((s) => s.status === 'new').length,
    in_review: businessSubmissions.filter((s) => s.status === 'in_review').length,
    responded: businessSubmissions.filter((s) => s.status === 'responded').length,
    closed: businessSubmissions.filter((s) => s.status === 'closed').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Submissions</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage applications, consultations, and service inquiries</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'new', 'in_review', 'responded', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {status === 'all' ? 'All' : statusLabels[status]}
            <span
              style={{
                background: filterStatus === status ? 'rgba(0,0,0,0.15)' : 'var(--bg-elevated)',
                padding: '1px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 420px' : '1fr', gap: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 240px)' }}>
        {/* Left: Submission List */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: selectedId ? '1px solid var(--border-color)' : 'none' }}>
          {/* Filters */}
          <div style={{ padding: 12, borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input className="input" placeholder="Search submissions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: 32, fontSize: 13, height: 36 }} />
            </div>
            <select className="select" value={filterType} onChange={(e) => setFilterType(e.target.value as SubmissionType | 'all')} style={{ fontSize: 13, height: 36, width: 140 }}>
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="service">Service</option>
            </select>
            <select className="select" value={filterOpportunity} onChange={(e) => setFilterOpportunity(e.target.value)} style={{ fontSize: 13, height: 36, width: 180 }}>
              <option value="all">Related Opportunity</option>
              {opportunities.map(opp => (
                <option key={opp.id} value={opp.id}>{opp.title}</option>
              ))}
            </select>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                <Filter size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 12, opacity: 0.3 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>No submissions found</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Adjust your filters to see more results</div>
              </div>
            ) : (
              filtered.map((sub) => (
                <div
                  key={sub.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(sub.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedId(sub.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                    padding: '16px', textAlign: 'left',
                    background: sub.id === selectedId ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none', borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                    outline: 'none'
                  }}
                >
                  {/* Type Icon */}
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-md)',
                      background: sub.id === selectedId ? 'var(--brand-cyan)' : 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: sub.id === selectedId ? '#000' : 'var(--text-secondary)', flexShrink: 0,
                    }}
                  >
                    {typeIcons[sub.type]}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</span>
                      {sub.status === 'new' && (
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-cyan)', flexShrink: 0 }} />
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sub.subject}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <span className={`badge badge-${statusColors[sub.status]}`} style={{ fontSize: 11 }}>
                        {statusLabels[sub.status]}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {formatDate(sub.createdAt)}
                      </span>
                      {sub.opportunityId && (
                        <span style={{ fontSize: 11, color: 'var(--brand-cyan)', fontWeight: 600 }}>
                          Linked to Opp
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterType(sub.type);
                    }}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '9px',
                      fontWeight: 600,
                      background: typeColors[sub.type].bg,
                      color: typeColors[sub.type].text,
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      transition: 'all 0.2s',
                      opacity: 0.8,
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.2)';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'none';
                      e.currentTarget.style.opacity = '0.8';
                    }}
                  >
                    {typeLabels[sub.type]}
                  </button>
                  <ChevronRight size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detail Drawer */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 5 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submission ID: {selected.id}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{selected.name}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedId(null)} style={{ width: 32, height: 32, padding: 0 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              {/* Opportunity Link Card */}
              {relatedOpp && (
                <div style={{ padding: '16px 24px', background: 'var(--brand-cyan-muted)', borderBottom: '1px solid var(--brand-cyan-muted)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-cyan)', marginBottom: 8, textTransform: 'uppercase' }}>Linked Opportunity</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-cyan)' }}>
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{relatedOpp.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{relatedOpp.department} • {relatedOpp.location}</div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {statusFlow.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selected.id, status)}
                      className={`btn btn-sm ${selected.status === status ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: 12, flex: 1, minWidth: 'calc(50% - 4px)' }}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  <div className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '8px 12px', height: 'auto' }}>
                    <Mail size={14} className="text-accent" />
                    <span style={{ fontSize: 13, userSelect: 'all' }}>{selected.email}</span>
                  </div>
                  <div className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '8px 12px', height: 'auto' }}>
                    <Phone size={14} className="text-accent" />
                    <span style={{ fontSize: 13 }}>{selected.phone}</span>
                  </div>
                  {selected.company && (
                    <div className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '8px 12px', height: 'auto' }}>
                      <Building2 size={14} className="text-accent" />
                      <span style={{ fontSize: 13 }}>{selected.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Content</div>
                <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{selected.subject}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.message}</div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Internal Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {selected.notes.map((note) => (
                    <div key={note.id} style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--brand-cyan)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{note.author}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{formatDateTime(note.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{note.content}</div>
                    </div>
                  ))}
                  {selected.notes.length === 0 && (
                    <div style={{ padding: 20, textAlign: 'center', opacity: 0.5, border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                      <MessageCircle size={24} style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 13 }}>No internal notes yet</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="input"
                    placeholder="Add a comment..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                    style={{ height: 40 }}
                  />
                  <button className="btn btn-primary" onClick={handleAddNote} style={{ width: 40, height: 40, padding: 0 }}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 12, background: 'var(--bg-tertiary)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                <Archive size={16} /> Mark Archive
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                <Plus size={16} /> Action
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
