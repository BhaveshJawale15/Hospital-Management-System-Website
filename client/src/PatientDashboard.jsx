import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard-style.css';
import api from './api';

function PatientDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]         = useState('content-dashboard');
  const [profile, setProfile]             = useState({});
  const [appointments, setAppointments]   = useState([]);
  const [records, setRecords]             = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports]       = useState([]);
  const [billing, setBilling]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState('');

  // Booking form state
  const [dept, setDept] = useState('Cardiology');
  const [slot, setSlot] = useState('');

  const userName = localStorage.getItem('userName') || 'Patient';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Load all data on mount ──────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prof, appts, recs, pres, labs, bills] = await Promise.all([
          api.get('/patient/profile'),
          api.get('/patient/appointments'),
          api.get('/patient/records'),
          api.get('/patient/prescriptions'),
          api.get('/patient/lab-reports'),
          api.get('/patient/billing'),
        ]);
        setProfile(prof);
        setAppointments(appts);
        setRecords(recs);
        setPrescriptions(pres);
        setLabReports(labs);
        setBilling(bills);
      } catch (err) {
        if (err.message.includes('authenticated')) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Book appointment ────────────────────────────────────────
  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patient/appointments', { dept, slot });
      showToast('✅ Appointment booked successfully!');
      const updated = await api.get('/patient/appointments');
      setAppointments(updated);
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  // ── Save profile ────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    const f = e.target;
    try {
      await api.put('/patient/profile', {
        full_name : f.full_name.value,
        phone     : f.phone.value,
        gender    : f.gender.value,
        dob       : f.dob.value,
      });
      showToast('✅ Profile saved!');
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = () => {
    ['token', 'userId', 'userName', 'userRole'].forEach(k => localStorage.removeItem(k));
    navigate('/');
  };

  const pendingBill = billing.filter(b => b.status === 'pending')
    .reduce((s, b) => s + parseFloat(b.amount), 0);

  const nextAppt = appointments.find(a => a.status !== 'cancelled' && new Date(a.slot) > new Date());

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p>Loading your dashboard…</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Toast */}
      {toast && (
        <div className="status-msg" style={{ display: 'block' }}>{toast}</div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-hospital-user"></i>
          <span>CityCare<span>+</span></span>
        </div>
        <nav className="sidebar-nav">
          {[
            ['content-dashboard',        'fa-th-large',     'Dashboard'],
            ['content-medical-records',  'fa-file-medical', 'Medical Records'],
            ['content-prescriptions',    'fa-prescription', 'Prescriptions'],
            ['content-lab-reports',      'fa-flask',        'Lab Reports'],
            ['content-profile-settings', 'fa-user-cog',     'Profile Settings'],
          ].map(([tab, icon, label]) => (
            <a
              key={tab}
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas ${icon}`}></i> {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="welcome-text">
            <h1>Patient Dashboard</h1>
            <p>Welcome back, <strong>{userName}</strong></p>
          </div>
          <div className="user-pill">
            <span>{userName.charAt(0).toUpperCase()}</span>
          </div>
        </header>

        {/* ── TAB 1: Dashboard ─────────────────────────────── */}
        {activeTab === 'content-dashboard' && (
          <div className="tab-content active">
            <section className="stats-grid">
              <div className="stat-card">
                <span className="label">NEXT APPOINTMENT</span>
                <div className="value">
                  {nextAppt
                    ? new Date(nextAppt.slot).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'None scheduled'}
                </div>
              </div>
              <div className="stat-card">
                <span className="label">BLOOD GROUP</span>
                <div className="value">—</div>
              </div>
              <div className="stat-card">
                <span className="label">PENDING BILLS</span>
                <div className="value highlight">
                  {pendingBill > 0 ? `₹${pendingBill.toFixed(2)}` : 'All clear'}
                </div>
              </div>
            </section>

            {/* Book appointment */}
            <section className="booking-section">
              <h2>Schedule a New Consultation</h2>
              <form className="booking-form" onSubmit={handleBook}>
                <div className="input-group">
                  <label>Department / Specialist</label>
                  <select value={dept} onChange={e => setDept(e.target.value)}>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>General Physician</option>
                    <option>Orthopaedics</option>
                    <option>Dermatology</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Preferred Slot</label>
                  <input
                    type="datetime-local"
                    value={slot}
                    onChange={e => setSlot(e.target.value)}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-confirm">Confirm Booking</button>
                </div>
              </form>
            </section>

            {/* Recent appointments */}
            <section className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Doctor</th><th>Date</th><th>Department</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign:'center', color:'#888' }}>No appointments yet.</td></tr>
                    )}
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td>{a.doctor_name}</td>
                        <td>{new Date(a.slot).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</td>
                        <td>{a.dept}</td>
                        <td>
                          <span className={`status-badge ${a.status === 'completed' ? 'completed' : ''}`}>
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Medical Records ────────────────────────── */}
        {activeTab === 'content-medical-records' && (
          <div className="tab-content active">
            <h2>Medical Records</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Record Type</th><th>Date</th><th>Doctor</th><th>Diagnosis</th></tr>
                </thead>
                <tbody>
                  {records.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign:'center', color:'#888' }}>No records found.</td></tr>
                  )}
                  {records.map(r => (
                    <tr key={r.id}>
                      <td>{r.record_type}</td>
                      <td>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                      <td>{r.doctor_name}</td>
                      <td>{r.diagnosis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: Prescriptions ─────────────────────────── */}
        {activeTab === 'content-prescriptions' && (
          <div className="tab-content active">
            <h2>Prescriptions</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Medicine</th><th>Dosage</th><th>Doctor</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign:'center', color:'#888' }}>No prescriptions found.</td></tr>
                  )}
                  {prescriptions.map(p => (
                    <tr key={p.id}>
                      <td>{p.medicine}</td>
                      <td>{p.dosage}</td>
                      <td>{p.doctor_name}</td>
                      <td>{new Date(p.issued_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: Lab Reports ───────────────────────────── */}
        {activeTab === 'content-lab-reports' && (
          <div className="tab-content active">
            <h2>Lab Reports</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Test Name</th><th>Date</th><th>Result</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {labReports.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign:'center', color:'#888' }}>No lab reports found.</td></tr>
                  )}
                  {labReports.map(l => (
                    <tr key={l.id}>
                      <td>{l.test_name}</td>
                      <td>{l.report_date ? new Date(l.report_date).toLocaleDateString('en-IN') : '—'}</td>
                      <td>{l.result || '—'}</td>
                      <td><span className={`status-badge ${l.status === 'final' ? 'completed' : ''}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 5: Profile Settings ──────────────────────── */}
        {activeTab === 'content-profile-settings' && (
          <div className="tab-content active">
            <h2>Profile Settings</h2>
            <div className="settings-card">
              <form className="profile-form" onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input name="full_name" type="text" defaultValue={profile.full_name} />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" value={profile.email || ''} readOnly style={{ background: '#f1f5f9' }} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input name="phone" type="tel" defaultValue={profile.phone} />
                  </div>
                  <div className="input-group">
                    <label>Date of Birth</label>
                    <input name="dob" type="date" defaultValue={profile.dob ? profile.dob.split('T')[0] : ''} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Gender</label>
                    <select name="gender" className="custom-select" defaultValue={profile.gender || ''}>
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-confirm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientDashboard;
