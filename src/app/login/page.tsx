'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth, getRoleDefaultRoute } from '@/lib/auth-context';
import { useUI } from '@/lib/ui-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const { theme } = useUI();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(email, password);

    if (success) {
      // The login function sets the user, we need to get it from the stored data
      const stored = localStorage.getItem('techbiz_user');
      if (stored) {
        const user = JSON.parse(stored);
        router.push(getRoleDefaultRoute(user.role));
      }
    } else {
      setError('Invalid email or password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--brand-cyan-muted), transparent 70%)',
          top: '-200px',
          right: '-200px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--brand-cyan-muted), transparent 70%)',
          bottom: '-150px',
          left: '-100px',
          pointerEvents: 'none',
        }}
      />

      <div
        className={shake ? 'animate-shake' : ''}
        style={{
          width: '100%',
          maxWidth: 420,
          animation: 'fadeIn 0.5s ease',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <img 
            src={theme === 'light' ? "/logo-light.png" : "/logo-dark.png"} 
            alt="TechBiz Logo" 
            style={{ height: 60, width: 'auto', objectFit: 'contain' }} 
          />
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 28,
            }}
          >
            Sign in to your dashboard
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@techbiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ height: 44 }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ height: 44, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-muted)',
                  color: 'var(--danger)',
                  fontSize: 13,
                  marginBottom: 18,
                  border: '1px solid rgba(255,77,77,0.2)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: 46,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12,
            }}
          >
            Demo Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { email: 'admin@techbiz.com', role: 'Admin' },
              { email: 'hr@techbiz.com', role: 'HR Manager' },
              { email: 'analyst@techbiz.com', role: 'Analyst' },
              { email: 'content@techbiz.com', role: 'Content Mgr' },
              { email: 'ops@techbiz.com', role: 'Operations' },
            ].map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword('password123');
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{cred.email}</span>
                <span className="badge badge-neutral">{cred.role}</span>
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
            }}
          >
            Password for all: <code style={{ color: 'var(--brand-cyan)', fontSize: 11 }}>password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
