// Generate realistic traffic data for last 30 days
function generateTrafficData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 1200 + Math.sin(i * 0.3) * 400;
    data.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.round(base + Math.random() * 300),
      pageViews: Math.round((base + Math.random() * 300) * 2.4),
      sessions: Math.round((base + Math.random() * 300) * 1.3),
    });
  }
  return data;
}

export const trafficData = generateTrafficData();

export const metrics = {
  totalUsers: 48293,
  totalUsersTrend: 12.5,
  sessions: 124850,
  sessionsTrend: 8.3,
  bounceRate: 34.2,
  bounceRateTrend: -2.1,
  conversionRate: 3.8,
  conversionRateTrend: 0.6,
  ctaClicks: 8432,
  ctaClicksTrend: 15.2,
  totalSubscribers: 12480,
  subscribersTrend: 5.4,
};

export const trafficSources = [
  { source: 'Organic Search', visitors: 18720, percentage: 38.8 },
  { source: 'Direct', visitors: 12150, percentage: 25.2 },
  { source: 'Social Media', visitors: 8340, percentage: 17.3 },
  { source: 'Referral', visitors: 5680, percentage: 11.8 },
  { source: 'Paid Ads', visitors: 3403, percentage: 7.1 },
];

export const funnelData = [
  { stage: 'Visitors', value: 48293, fill: 'var(--brand-cyan)' },
  { stage: 'Engaged', value: 29800, fill: '#00e5e5' },
  { stage: 'Leads', value: 8450, fill: '#00cccc' },
  { stage: 'Trials', value: 3200, fill: '#00b2b2' },
  { stage: 'Conversions', value: 1835, fill: '#009999' },
];

export const deviceData = [
  { device: 'Desktop', value: 58.4, fill: 'var(--brand-cyan)' },
  { device: 'Mobile', value: 33.2, fill: '#4da6ff' },
  { device: 'Tablet', value: 8.4, fill: '#ffb347' },
];

// New Subscriber Data
export const subscriberSourceData = [
  { source: 'Website Forms', value: 5200, fill: 'var(--brand-cyan)' },
  { source: 'Campaigns', value: 3800, fill: '#00e5e5' },
  { source: 'Referrals', value: 2100, fill: '#00cccc' },
  { source: 'Newsletter Archive', value: 1380, fill: '#009999' },
];

export const subscriberTypeData = [
  { name: 'New', value: 890, fill: 'var(--brand-cyan)' },
  { name: 'Returning', value: 1240, fill: '#4da6ff' },
];

function generateSubscriberGrowth() {
  const data = [];
  const now = new Date();
  let base = 10000;
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    base += Math.round(50 + Math.random() * 100);
    data.push({
      date: date.toISOString().split('T')[0],
      subscribers: base,
    });
  }
  return data;
}

export const subscriberGrowth = generateSubscriberGrowth();

export const heatmapPoints = [
  { x: 150, y: 80, intensity: 0.95 },
  { x: 200, y: 85, intensity: 0.9 },
  { x: 180, y: 120, intensity: 0.7 },
  { x: 300, y: 60, intensity: 0.85 },
  { x: 120, y: 200, intensity: 0.6 },
  { x: 350, y: 150, intensity: 0.75 },
  { x: 250, y: 250, intensity: 0.5 },
  { x: 100, y: 300, intensity: 0.4 },
  { x: 400, y: 100, intensity: 0.65 },
  { x: 320, y: 200, intensity: 0.55 },
  { x: 220, y: 180, intensity: 0.8 },
  { x: 160, y: 160, intensity: 0.72 },
  { x: 280, y: 280, intensity: 0.35 },
  { x: 380, y: 220, intensity: 0.45 },
  { x: 140, y: 260, intensity: 0.38 },
];

export const insights = [
  {
    id: '1',
    severity: 'warning' as const,
    title: 'High traffic but low conversions on homepage',
    description:
      'Homepage receives 38% of all traffic but converts at only 1.2%. Consider A/B testing the hero CTA placement and copy.',
    metric: '1.2% conversion',
  },
  {
    id: '2',
    severity: 'danger' as const,
    title: 'Mobile bounce rate is critically high',
    description:
      'Mobile bounce rate is 52.3%, significantly higher than desktop (24.1%). Check mobile page load times and responsive layout issues.',
    metric: '52.3% bounce',
  },
  {
    id: '3',
    severity: 'info' as const,
    title: 'Subscriber newsletter sources shifting',
    description:
      'Campaign-based signups are up 20% while website form signups decreased slightly. Review landing page performance.',
    metric: '+20% campaigns',
  },
  {
    id: '4',
    severity: 'success' as const,
    title: 'Email Open Rate Optimized',
    description:
      'Recent A/B testing on subject lines resulted in a 4.5% lift in open rates across all segments.',
    metric: '28.4% open rate',
  },
];
