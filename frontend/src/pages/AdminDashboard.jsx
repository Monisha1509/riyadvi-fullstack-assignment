import React, { useCallback, useState } from 'react';
import { ArrowDownToLine, LockKeyhole, RefreshCw, ShieldCheck, Users, BriefcaseBusiness, MessageSquareText, Activity } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const labels = {
  contact: 'Contact enquiries',
  consultation: 'Consultations',
  'health-checkup': 'Health checkups',
  'lead-magnet': 'Guide requests',
  applications: 'Job applications',
};
const dateLabel = (value) => value ? new Date(value).toLocaleString() : '—';

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = useCallback(async (eventToken = token) => {
    if (!eventToken.trim()) {
      setError('Enter the admin token configured on the backend.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/summary`, {
        headers: { Authorization: `Bearer ${eventToken.trim()}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`);
      setSummary(payload);
      setToken(eventToken.trim());
    } catch (err) {
      setSummary(null);
      setError(err.message || 'Unable to load the dashboard. Check the API URL and backend status.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const exportCsv = () => {
    if (!summary?.recent?.length) return;
    const columns = ['name', 'email', 'phone', 'company', 'requirement', 'type', 'status', 'createdAt'];
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [columns.join(','), ...summary.recent.map((lead) => columns.map((key) => quote(lead[key])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'riyadvi-enquiries.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const counts = summary?.byType || {};
  const metrics = [
    { label: 'Total enquiries', value: summary?.total ?? '—', icon: Users },
    { label: 'Consultations', value: counts.consultation ?? 0, icon: MessageSquareText },
    { label: 'Health checkups', value: counts['health-checkup'] ?? 0, icon: Activity },
    { label: 'Guide requests', value: counts['lead-magnet'] ?? 0, icon: ArrowDownToLine },
    { label: 'Applications', value: counts.applications ?? 0, icon: BriefcaseBusiness },
  ];

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a href="/" className="admin-brand"><span className="brand-mark">R</span><span>RIYADVI<small>ADMIN CONSOLE</small></span></a>
        <span className="admin-secure"><ShieldCheck size={16} /> Protected API</span>
      </header>
      <section className="admin-content">
        <div className="admin-heading">
          <div><p className="eyebrow"><span /> LEAD MANAGEMENT</p><h1>Admin <em>dashboard.</em></h1><p>Review incoming enquiries and application submissions.</p></div>
          {summary && <button className="button button-outline" onClick={() => loadSummary()} disabled={loading}><RefreshCw size={15} /> {loading ? 'Refreshing…' : 'Refresh data'}</button>}
        </div>

        {!summary && <form className="admin-login" onSubmit={(event) => { event.preventDefault(); loadSummary(); }}>
          <div className="admin-login-icon"><LockKeyhole size={22} /></div>
          <h2>Admin sign in</h2>
          <p>Enter the <code>ADMIN_TOKEN</code> configured in the backend environment. The token is kept only in this page's memory.</p>
          <label className="field"><span>Admin token *</span><input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="current-password" placeholder="Enter admin token" required /></label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="button button-gold" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Open dashboard'} <LockKeyhole size={15} /></button>
        </form>}

        {summary && <>
          <div className="admin-metrics">{metrics.map(({ label, value, icon: Icon }) => <article className="admin-metric" key={label}><span className="admin-metric-icon"><Icon size={18} /></span><span className="admin-metric-label">{label}</span><strong>{value}</strong></article>)}</div>
          <section className="admin-leads">
            <div className="admin-table-heading"><div><h2>Recent submissions</h2><p>Latest records returned by the protected API.</p></div><button className="button button-outline" onClick={exportCsv}><ArrowDownToLine size={15} /> Export CSV</button></div>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Contact</th><th>Type</th><th>Company / requirement</th><th>Status</th><th>Received</th></tr></thead><tbody>
              {(summary.recent || []).map((lead) => <tr key={lead._id}><td><strong>{lead.name}</strong><span>{lead.email}</span><span>{lead.phone || 'No phone'}</span></td><td>{labels[lead.type] || lead.type}</td><td><strong>{lead.company || '—'}</strong><span>{lead.requirement || '—'}</span></td><td><span className={`admin-status status-${lead.status || 'new'}`}>{lead.status || 'new'}</span></td><td>{dateLabel(lead.createdAt)}</td></tr>)}
              {!summary.recent?.length && <tr><td colSpan="5" className="admin-empty">No submissions found yet.</td></tr>}
            </tbody></table></div>
            <p className="admin-footnote">For security, sign out by leaving this page or refreshing it. This view does not modify lead status.</p>
          </section>
        </>}
        {error && !summary && null}
        <p className="admin-back"><a href="/">← Back to website</a></p>
      </section>
    </main>
  );
}
