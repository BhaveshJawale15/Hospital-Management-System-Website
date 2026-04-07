import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard-style.css';
import api from './api';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState('patient-queue');
  const [queue, setQueue]               = useState([]);
  const [allAppts, setAllAppts]         = useState([]);
  const [records, setRecords]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState('');

  // EHR form state
  const [ehrPatientId, setEhrPatientId]   = useState('');
  const [ehrSymptoms, setEhrSymptoms]     = useState('');
  const [ehrDiagnosis, setEhrDiagnosis]   = useState('');
  const [ehrMedicine, setEhrMedicine]     = useState('Select from Pharmacy Database');

  // Prescription pad state
  const [rxPatientName, setRxPatientName] = useState('');
  const [rxAge, setRxAge]                 = useState('');
  const [rxInstructions, setRxInstructions] = useState('');

  const doctorName = localStorage.getItem('userName') || 'Doctor';

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [q, appts, recs] = await Promise.all([
          api.get('/doctor/queue'),
          api.get('/doctor/appointments'),
          api.get('/doctor/records'),
        ]);
        setQueue(q);
        setAllAppts(appts);
        setRecords(recs);
      } catch (err) {
        if (err.message.includes('authenticated')) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Update appointment status ────────────────────────────────
  const updateAppt = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
      showToast(`✅ Marked as ${status}`);
      const updated = await api.get('/doctor/queue');
      setQueue(updated);
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  // ── Submit EHR + Prescription ────────────────────────────────
  const handleEHRSubmit = async (e) => {
    e.preventDefault();
    if (!ehrPatientId) return showToast('❌ Select a patient from queue first.');
    try {
      await api.post('/doctor/records', {
        patient_id  : ehrPatientId,
        record_type : 'Consultation',
        diagnosis   : ehrDiagnosis,
        description : ehrSymptoms,
      });
      if (ehrMedicine && ehrMedicine !== 'Select from Pharmacy Database') {
        await api.post('/doctor/prescriptions', {
          patient_id : ehrPatientId,
          medicine   : ehrMedicine,
          dosage     : '',
          instructions: ehrSymptoms,
        });
      }
      showToast('✅ EHR saved and prescription created!');
      setEhrSymptoms(''); setEhrDiagnosis(''); setEhrMedicine('Select from Pharmacy Database');
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  // ── Print prescription ───────────────────────────────────────
  const handlePrescriptionSave = async (e) => {
    e.preventDefault();
    const patientEntry = queue.find(q => q.patient_name.toLowerCase().includes(rxPatientName.toLowerCase()));
    if (!patientEntry) return showToast('❌ Patient not found in today\'s queue.');
    try {
      await api.post('/doctor/prescriptions', {
        patient_id   : patientEntry.patient_id,
        medicine     : rxInstructions,
        dosage       : rxAge,
        instructions : rxInstructions,
      });
      showToast('✅ Prescription saved!');
      setRxPatientName(''); setRxAge(''); setRxInstructions('');
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  const handleLogout = () => {
    ['token', 'userId', 'userName', 'userRole'].forEach(k => localStorage.removeItem(k));
    navigate('/');
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p>Loading doctor portal…</p>
    </div>
  );

  const currentPatient = queue.find(q => q.status === 'pending');

  return (
    <div className="dashboard-wrapper">
      {toast && <div className="status-msg" style={{ display:'block' }}>{toast}</div>}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-user-md"></i>
          <span>CityCare<span>+</span></span>
        </div>
        <nav className="sidebar-nav">
          {[
            ['patient-queue',    'fa-users',            'Patient Queue'],
            ['health-records',   'fa-file-medical-alt', 'Health Records'],
            ['prescription-gen', 'fa-pills',            'Prescription Gen'],
            ['my-schedule',      'fa-calendar-check',   'My Schedule'],
            ['settings',         'fa-cog',              'Settings'],
          ].map(([tab, icon, label]) => (
            <a
              key={tab}
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ cursor:'pointer' }}
            >
              <i className={`fas ${icon}`}></i> {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a onClick={handleLogout} style={{ cursor:'pointer' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="welcome-text">
            <h1>Doctor's Portal</h1>
            <p>Welcome back, <strong>{doctorName}</strong></p>
          </div>
          <div className="status-toggle">
            <span className="status-dot online"></span> Active for Consultation
          </div>
        </header>

        {/* ── TAB 1: Patient Queue ─────────────────────────── */}
        {activeTab === 'patient-queue' && (
          <div className="tab-content active">
            <section className="stats-grid">
              <div className="stat-card highlight-border">
                <span className="label">CURRENT PATIENT</span>
                <div className="value">{currentPatient ? currentPatient.patient_name : 'Queue empty'}</div>
                {currentPatient && <p className="sub-value">{currentPatient.dept} • {new Date(currentPatient.slot).toLocaleTimeString('en-IN', { timeStyle:'short' })}</p>}
              </div>
              <div className="stat-card">
                <span className="label">WAITING IN QUEUE</span>
                <div className="value">{queue.filter(q => q.status === 'pending').length} Patients</div>
              </div>
              <div className="stat-card">
                <span className="label">TODAY'S TOTAL</span>
                <div className="value">{queue.length} Appointments</div>
              </div>
            </section>

            {/* EHR Form */}
            <section className="ehr-section">
              <div className="section-header-flex">
                <h2>Consultation &amp; EHR</h2>
                {currentPatient && (
                  <span className="patient-id">
                    ID: #PT-{String(currentPatient.patient_id).padStart(5, '0')}
                  </span>
                )}
              </div>
              <form className="ehr-form" onSubmit={handleEHRSubmit}>
                {/* Patient selector */}
                <div className="form-row">
                  <div className="input-group">
                    <label>Select Patient from Queue</label>
                    <select value={ehrPatientId} onChange={e => setEhrPatientId(e.target.value)} required>
                      <option value="">— select patient —</option>
                      {queue.map(q => (
                        <option key={q.id} value={q.patient_id}>{q.patient_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Symptoms / Chief Complaint</label>
                    <textarea
                      placeholder="Enter symptoms here…"
                      value={ehrSymptoms}
                      onChange={e => setEhrSymptoms(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row grid-2">
                  <div className="input-group">
                    <label>Diagnosis</label>
                    <input
                      id="Diagnosis" type="text" placeholder="e.g. Seasonal Flu"
                      value={ehrDiagnosis}
                      onChange={e => setEhrDiagnosis(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Prescribe Medication</label>
                    <select value={ehrMedicine} onChange={e => setEhrMedicine(e.target.value)}>
                      <option>Select from Pharmacy Database</option>
                      <option>Amoxicillin 500mg</option>
                      <option>Paracetamol 650mg</option>
                      <option>Cetirizine 10mg</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-confirm">Generate Prescription &amp; Save</button>
                </div>
              </form>
            </section>

            {/* Queue Table */}
            <section className="recent-activity">
              <h2>Today's Queue</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>#</th><th>Patient Name</th><th>Time Slot</th><th>Dept</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {queue.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign:'center', color:'#888' }}>No patients in queue today.</td></tr>
                    )}
                    {queue.map((q, i) => (
                      <tr key={q.id}>
                        <td>{String(i + 1).padStart(2, '0')}</td>
                        <td>{q.patient_name}</td>
                        <td>{new Date(q.slot).toLocaleTimeString('en-IN', { timeStyle:'short' })}</td>
                        <td>{q.dept}</td>
                        <td>{q.status}</td>
                        <td>
                          <button className="btn-call" onClick={() => updateAppt(q.id, 'completed')}>Complete</button>
                          <button className="btn-wait" onClick={() => updateAppt(q.id, 'cancelled')}>Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Health Records ────────────────────────── */}
        {activeTab === 'health-records' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <h2>Patient Medical Archives</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Date</th><th>Patient</th><th>Diagnosis</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {records.length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign:'center', color:'#888' }}>No records found.</td></tr>
                    )}
                    {records.map(r => (
                      <tr key={r.id}>
                        <td>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                        <td>{r.patient_name}</td>
                        <td>{r.diagnosis}</td>
                        <td>{r.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 3: Prescription Gen ──────────────────────── */}
        {activeTab === 'prescription-gen' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <h2>Digital Prescription Pad</h2>
              <div className="prescription-pad">
                <div className="pad-header">
                  <p><strong>CityCare Hospital</strong> | {doctorName}</p>
                </div>
                <form onSubmit={handlePrescriptionSave}>
                  <div className="form-row grid-2">
                    <div className="input-group">
                      <label>Patient Name (from today's queue)</label>
                      <input type="text" value={rxPatientName} onChange={e => setRxPatientName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>Age / Gender</label>
                      <input type="text" value={rxAge} onChange={e => setRxAge(e.target.value)} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Rx Instructions</label>
                    <textarea
                      rows="6"
                      placeholder="Tab. Paracetamol 650mg - TDS - 3 Days"
                      value={rxInstructions}
                      onChange={e => setRxInstructions(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-print">
                    <i className="fas fa-save"></i> Save Prescription
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 4: Schedule ──────────────────────────────── */}
        {activeTab === 'my-schedule' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <h2>Doctor's Weekly Rota</h2>
              <div className="schedule-grid">
                {[
                  { day:'Mon', hours:'09:00 - 17:00', active: true },
                  { day:'Tue', hours:'09:00 - 17:00' },
                  { day:'Wed', hours:'Off Day' },
                  { day:'Thu', hours:'11:00 - 19:00' },
                  { day:'Fri', hours:'09:00 - 17:00' },
                ].map(d => (
                  <div key={d.day} className={`day-card ${d.active ? 'active' : ''}`}>
                    <h3>{d.day}</h3>
                    <p>{d.hours}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 5: Settings ──────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <h2>Account Settings</h2>
              <div className="form-row grid-2">
                <div className="input-group">
                  <label>Email Notification</label>
                  <select><option>Enabled</option><option>Disabled</option></select>
                </div>
                <div className="input-group">
                  <label>Digital Signature</label>
                  <button className="btn-outline">Update Sign</button>
                </div>
              </div>
              <button className="btn-print" onClick={() => showToast('✅ Settings saved!')}>Save Settings</button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
