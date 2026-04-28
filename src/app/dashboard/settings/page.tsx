'use client';

import React, { useState } from 'react';
import {
  Users, Shield, FileText, Plus, Edit2, Trash2, Search,
  Check, X, AlertCircle,
} from 'lucide-react';
import { systemUsers, auditLog, rolePermissions, type SystemUser, type AuditEntry } from '@/lib/mock-data/settings';
import { formatDate, formatDateTime, getInitials } from '@/lib/utils';
import { getRoleLabel, useAuth, type UserRole } from '@/lib/auth-context';

type Tab = 'users' | 'roles' | 'audit';

const actionLabels: Record<string, { label: string; color: string }> = {
  USER_CREATED: { label: 'User Created', color: 'var(--brand-cyan)' },
  USER_DEACTIVATED: { label: 'User Deactivated', color: 'var(--danger)' },
  ARTICLE_PUBLISHED: { label: 'Article Published', color: 'var(--info)' },
  ARTICLE_SCHEDULED: { label: 'Article Scheduled', color: 'var(--info)' },
  ROLE_CHANGED: { label: 'Role Changed', color: 'var(--warning)' },
  SUBMISSION_RESPONDED: { label: 'Submission Responded', color: 'var(--brand-cyan)' },
  SUBMISSION_CLOSED: { label: 'Submission Closed', color: 'var(--text-tertiary)' },
  REPORT_EXPORTED: { label: 'Report Exported', color: 'var(--info)' },
  SETTINGS_UPDATED: { label: 'Settings Updated', color: 'var(--warning)' },
  LOGIN: { label: 'Login', color: 'var(--text-secondary)' },
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  
  if (user?.role !== 'admin') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <Shield size={64} style={{ color: 'var(--text-tertiary)', marginBottom: 20, opacity: 0.2 }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Access Restricted</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, maxWidth: 400 }}>
          Only system administrators have permission to access settings, user management, and audit logs.
        </p>
      </div>
    );
  }
  const [users, setUsers] = useState(systemUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'users', label: 'User Management', icon: <Users size={18} /> },
    { id: 'roles', label: 'Role Permissions', icon: <Shield size={18} /> },
    { id: 'audit', label: 'Audit Log', icon: <FileText size={18} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage users, roles, and system activity</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--brand-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-cyan)' : '2px solid transparent',
              fontSize: 14, fontWeight: 600, transition: 'all var(--transition-fast)',
              fontFamily: 'inherit',
              marginBottom: -1,
            }}
            onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input className="input" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: 36, fontSize: 13, height: 38 }} />
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>
              <Plus size={18} /> Add User
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Created</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 34, height: 34, borderRadius: 'var(--radius-md)',
                              background: 'linear-gradient(135deg, var(--brand-cyan), var(--brand-cyan))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 700, color: '#000',
                            }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                          {getRoleLabel(user.role as UserRole)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDateTime(user.lastLogin)}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(user.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 6 }}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 6, color: 'var(--danger)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Permissions */}
      {activeTab === 'roles' && (
        <div className="animate-fade-in">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th style={{ textAlign: 'center' }}>Analytics</th>
                  <th style={{ textAlign: 'center' }}>CMS</th>
                  <th style={{ textAlign: 'center' }}>Submissions</th>
                  <th style={{ textAlign: 'center' }}>Settings</th>
                  <th style={{ textAlign: 'center' }}>User Mgmt</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(rolePermissions).map(([role, perms]) => (
                  <tr key={role}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={16} style={{ color: 'var(--brand-cyan)' }} />
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {getRoleLabel(role as UserRole)}
                        </span>
                      </div>
                    </td>
                    {Object.values(perms).map((allowed, i) => (
                      <td key={i} style={{ textAlign: 'center' }}>
                        {allowed ? (
                          <Check size={18} style={{ color: 'var(--brand-cyan)' }} />
                        ) : (
                          <X size={18} style={{ color: 'var(--text-tertiary)' }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log */}
      {activeTab === 'audit' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {auditLog.map((entry) => {
              const actionInfo = actionLabels[entry.action] || { label: entry.action, color: 'var(--text-secondary)' };
              return (
                <div
                  key={entry.id}
                  className="card"
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: actionInfo.color, flexShrink: 0,
                    }}
                  >
                    <AlertCircle size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{entry.user}</span>
                      <span
                        className="badge"
                        style={{
                          background: `${actionInfo.color}20`,
                          color: actionInfo.color,
                          fontSize: 11,
                        }}
                      >
                        {actionInfo.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {entry.details} — <span style={{ color: 'var(--text-tertiary)' }}>Target: {entry.target}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDateTime(entry.timestamp)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{entry.ip}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="overlay" onClick={() => setShowAddUser(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480,
              padding: 32, animation: 'fadeInScale 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add New User</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddUser(false)} style={{ padding: 6 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input className="input" placeholder="John Doe" style={{ height: 42 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
                <input className="input" type="email" placeholder="john@techbiz.com" style={{ height: 42 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Role</label>
                <select className="select" style={{ width: '100%', height: 42 }}>
                  <option value="analyst">Analyst</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="operations">Operations</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddUser(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowAddUser(false)}>
                  <Plus size={16} /> Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
