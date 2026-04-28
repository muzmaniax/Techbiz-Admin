'use client';

import React, { useState } from 'react';

import {
  Users,
  Activity,
  TrendingDown,
  TrendingUp,
  Target,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  Mail,
  Send,
  Server,
  Database,
  Cpu,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatNumber, formatPercent } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  metrics,
  trafficData,
  trafficSources,
  funnelData,
  deviceData,
  heatmapPoints,
  insights,
  subscriberGrowth,
  subscriberSourceData,
  subscriberTypeData,
} from '@/lib/mock-data/analytics';

// ... MetricCard and CustomTooltip remain similar ...

/* ── Metric Card ────────────────────────────── */
interface MetricCardProps {
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  delay: number;
}
function MetricCard({ label, value, trend, icon, delay }: MetricCardProps) {
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const isSubscriberMetric = label.includes('Subscriber');
  
  const trendColor = label === 'Bounce Rate'
    ? (trend < 0 ? 'var(--brand-cyan)' : 'var(--danger)')
    : (isPositive ? 'var(--brand-cyan)' : 'var(--danger)');

  return (
    <div className="card-metric" style={{ animation: `fadeIn 0.5s ease ${delay}ms both` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'var(--brand-cyan-muted)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--brand-cyan)',
          }}
        >
          {icon}
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600, color: trendColor,
          }}
        >
          <TrendIcon size={14} />
          {Math.abs(trend)}%
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

// ... CustomTooltip, HeatmapPreview, InsightsPanel remain largely same, just colors ...

/* ── Custom Tooltip ─────────────────────────── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {payload.map((entry, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '2px', background: entry.color }} />
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: 20 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
              <span style={{ fontWeight: 700 }}>{entry.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Heatmap Component ──────────────────────── */
function HeatmapPreview() {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Click Heatmap</h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Homepage interaction hotspots</p>
        </div>
        <div className="badge badge-info">Real-time</div>
      </div>
      <div style={{ position: 'relative', height: 355, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
        {/* Wireframe lines */}
        <div style={{ position: 'absolute', top: 20, left: 30, right: 30, height: 40, border: '1px dashed var(--border-color)', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Navigation Bar</span>
        </div>
        <div style={{ position: 'absolute', top: 80, left: 30, right: 30, height: 120, border: '1px dashed var(--border-color)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Hero Section</span>
        </div>
        <div style={{ position: 'absolute', top: 220, left: 30, width: '40%', height: 60, border: '1px dashed var(--border-color)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>CTA Button</span>
        </div>
        <div style={{ position: 'absolute', top: 220, right: 30, width: '40%', height: 60, border: '1px dashed var(--border-color)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Feature Card</span>
        </div>

        {/* Heatmap dots */}
        {heatmapPoints.map((point, i) => {
          const size = 30 + point.intensity * 60;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle, var(--brand-cyan-glow) ${point.intensity * 40}%, transparent 70%)`,
                opacity: 0.6,
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Insights Panel ─────────────────────────── */
function InsightsPanel() {
  const severityIcons = {
    warning: <AlertTriangle size={18} />,
    danger: <AlertCircle size={18} />,
    info: <Info size={18} />,
    success: <CheckCircle2 size={18} />,
  };
  const severityColors = {
    warning: { bg: 'var(--warning-muted)', color: 'var(--warning)', border: 'rgba(255,179,71,0.2)' },
    danger: { bg: 'var(--danger-muted)', color: 'var(--danger)', border: 'rgba(255,77,77,0.2)' },
    info: { bg: 'var(--info-muted)', color: 'var(--info)', border: 'var(--brand-cyan-muted)' },
    success: { bg: 'var(--success-muted)', color: 'var(--brand-cyan)', border: 'var(--brand-cyan-muted)' },
  };

  return (
    <div className="card" style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Target size={18} className="text-accent" />
        Actionable Insights
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {insights.map((insight) => {
          const s = severityColors[insight.severity];
          return (
            <div
              key={insight.id}
              style={{
                display: 'flex', gap: 14, padding: '16px',
                borderRadius: 'var(--radius-md)', background: s.bg,
                border: `1px solid ${s.border}`,
              }}
            >
              <div style={{ color: s.color, flexShrink: 0, marginTop: 2 }}>
                {severityIcons[insight.severity]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {insight.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {insight.description}
                </div>
              </div>
              <div className="badge" style={{ background: 'var(--bg-secondary)', color: s.color, flexShrink: 0, alignSelf: 'flex-start', border: `1px solid ${s.border}` }}>
                {insight.metric}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Network Health Panel ───────────────────── */
function NetworkHealthPanel() {
  const stats = [
    { label: 'Server Uptime', value: '99.98%', icon: <Server size={14} />, status: 'success' },
    { label: 'Cache Hit Rate', value: '87.4%', icon: <Database size={14} />, status: 'success' },
    { label: 'CPU Usage', value: '14.2%', icon: <Cpu size={14} />, status: 'info' },
  ];

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} className="text-accent" />
          Network Health
        </h3>
        <span className="badge badge-success" style={{ fontSize: 10 }}>System Healthy</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: 'var(--text-tertiary)' }}>{stat.icon}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
          </div>
        ))}
        
        <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Recent Incidents</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-cyan)' }} />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No incidents in last 24h</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────── */
export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  const canSeeSystemData = user?.role === 'admin' || user?.role === 'analyst';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Analytics Overview</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Data-driven insights for TechBiz platform</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm">
            <Send size={14} />
            Export Report
          </button>
          <div style={{ width: 1, height: 24, background: 'var(--border-color)', margin: '0 4px' }} />
          <select
            className="select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: 140, height: 38 }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
        <MetricCard label="Total Users" value={formatNumber(metrics.totalUsers)} trend={metrics.totalUsersTrend} icon={<Users size={20} />} delay={0} />
        <MetricCard label="Sessions" value={formatNumber(metrics.sessions)} trend={metrics.sessionsTrend} icon={<Activity size={20} />} delay={60} />
        <MetricCard label="Bounce Rate" value={formatPercent(metrics.bounceRate)} trend={metrics.bounceRateTrend} icon={<TrendingDown size={20} />} delay={120} />
        <MetricCard label="Conversion Rate" value={formatPercent(metrics.conversionRate)} trend={metrics.conversionRateTrend} icon={<Target size={20} />} delay={180} />
        <MetricCard label="Email Subscribers" value={formatNumber(metrics.totalSubscribers)} trend={metrics.subscribersTrend} icon={<Mail size={20} />} delay={240} />
      </div>

      {/* Traffic Analysis section */}
      <div style={{ display: 'grid', gridTemplateColumns: canSeeSystemData ? '2fr 1.2fr 1fr' : '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Traffic & Engagement</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-cyan)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Visitors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4da6ff' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Page Views</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '24px 16px 12px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-cyan)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--brand-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visitors" stroke="var(--brand-cyan)" strokeWidth={3} fill="url(#colorVisitors)" name="Visitors" />
                <Area type="monotone" dataKey="pageViews" stroke="#4da6ff" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Page Views" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {canSeeSystemData && <NetworkHealthPanel />}

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Device Distribution</h3>
          </div>
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={200}
                >
                  {deviceData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20, justifyContent: 'center' }}>
              {deviceData.map((d) => (
                <div key={d.device} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '2px', background: d.fill }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.device}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Acquisition Channels</h3>
          </div>
          <div style={{ padding: '20px 16px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trafficSources} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)' }} />
                <Bar dataKey="visitors" fill="var(--brand-cyan)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Conversion Funnel</h3>
          </div>
          <div style={{ padding: '24px' }}>
            {funnelData.map((stage, i) => {
              const widthPercent = (stage.value / funnelData[0].value) * 100;
              return (
                <div key={stage.stage} style={{ marginBottom: i < funnelData.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stage.stage}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 100, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${widthPercent}%`,
                        background: stage.fill,
                        borderRadius: 100,
                        transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <HeatmapPreview />
      </div>

      <InsightsPanel />

      {/* NEW: Email Marketing Subscribers Section */}
      <div style={{ marginTop: 40, borderTop: '2px solid var(--border-color)', paddingTop: 40, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-cyan-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-cyan)' }}>
            <Mail size={18} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Email Marketing Subscriber Analytics</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Subscriber Growth Chart */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Subscriber Growth</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Cumulative total subscribers over time</p>
              </div>
              <div className="badge badge-success">
                <TrendingUp size={12} style={{ marginRight: 4 }} />
                Steady Growth
              </div>
            </div>
            <div style={{ padding: '24px 16px 12px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={subscriberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                    tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="stepAfter" 
                    dataKey="subscribers" 
                    stroke="var(--brand-cyan)" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: 'var(--brand-cyan)', stroke: 'var(--bg-secondary)', strokeWidth: 2 }} 
                    name="Total Subscribers" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* New vs Returning Subscribers */}
            <div className="card" style={{ flex: 1, padding: 0 }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>New vs Returning</h3>
              </div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={subscriberTypeData}
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {subscriberTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {subscriberTypeData.map((t) => (
                    <div key={t.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{t.value}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: '60%', background: t.fill, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscriber Sources */}
            <div className="card" style={{ flex: 1.5, padding: 0 }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Subscriber Sources</h3>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {subscriberSourceData.map((s) => {
                    const total = subscriberSourceData.reduce((acc, curr) => acc + curr.value, 0);
                    const pct = Math.round((s.value / total) * 100);
                    return (
                      <div key={s.source}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.source}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: s.fill, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
