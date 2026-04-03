import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../dashboard-style.css'; 

function PatientDashboard() {
  const location = useLocation();

  // 1. UNIQUE KEY PER PORTAL (Logic from your JS step 1)
  // Creates a key like "patient_activeTab"
  const pageKey = location.pathname.split("/").pop() + "_activeTab";

  // 2. LOAD SAVED STATE (Logic from your JS step 2)
  // Checks localStorage on load, defaults to 'content-dashboard'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(pageKey) || 'content-dashboard';
  });

  // 3. SAVE STATE ON CHANGE (Logic from your JS step 3)
  useEffect(() => {
    localStorage.setItem(pageKey, activeTab);
  }, [activeTab, pageKey]);

  const handleTabClick = (e, targetId) => {
    e.preventDefault();
    setActiveTab(targetId);
  };

  // 4. LOGOUT LOGIC (Logic from your JS step 4)
  const handleLogout = () => {
    localStorage.removeItem(pageKey);
  };

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-hospital-user"></i>
          <span>CityCare<span>+</span></span>
        </div>
        <nav className="sidebar-nav">
          <a 
            className={`nav-link ${activeTab === 'content-dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('content-dashboard')}
          >
            <i className="fas fa-th-large"></i> Dashboard
          </a>
          <a 
            className={`nav-link ${activeTab === 'content-medical-records' ? 'active' : ''}`} 
            onClick={() => setActiveTab('content-medical-records')}
          >
            <i className="fas fa-file-medical"></i> Medical Records
          </a>
          <a 
            className={`nav-link ${activeTab === 'content-prescriptions' ? 'active' : ''}`} 
            onClick={() => setActiveTab('content-prescriptions')}
          >
            <i className="fas fa-prescription"></i> Prescriptions
          </a>
          <a 
            className={`nav-link ${activeTab === 'content-lab-reports' ? 'active' : ''}`} 
            onClick={() => setActiveTab('content-lab-reports')}
          >
            <i className="fas fa-flask"></i> Lab Reports
          </a>
          <a 
            className={`nav-link ${activeTab === 'content-profile-settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('content-profile-settings')}
          >
            <i className="fas fa-user-cog"></i> Profile Settings
          </a>
        </nav>
        <div className="sidebar-footer">
          <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="welcome-text">
            <h1 id="page-title">Patient Dashboard</h1>
            <p>Welcome back, <span id="dashUserName">John Doe</span></p>
          </div>
          <div className="user-pill">
            <span id="userInitial">J</span>
          </div>
        </header>

        {/* Tab 1: Main Dashboard */}
        {activeTab === 'content-dashboard' && (
          <div id="content-dashboard" className="tab-content active">
            <section className="stats-grid">
              <div className="stat-card">
                <span className="label">NEXT APPOINTMENT</span>
                <div className="value">Oct 28, 10:00 AM</div>
              </div>
              <div className="stat-card">
                <span className="label">BLOOD GROUP</span>
                <div className="value" id="bloodGroupDisplay">O Positive</div>
              </div>
              <div className="stat-card">
                <span className="label">PENDING BILLS</span>
                <div className="value highlight">₹2000.00</div>
              </div>
            </section>

            <section class="booking-section">
              <h2>Schedule a New Consultation</h2>
              <form class="booking-form">
                  <div class="input-group">
                      <label for="dept">Department/Specialist</label>
                      <select id="dept">
                          <option>Cardiology</option>
                          <option>Neurology</option>
                          <option>General Physician</option>
                      </select>
                  </div>
                  
                  <div class="input-group">
                      <label for="slot">Preferred Slot</label>
                      <input type="datetime-local" id="slot"/>
                  </div>

                  <div class="form-actions">
                      <button type="submit" class="btn-confirm">Confirm Booking</button>
                  </div>
              </form>
            </section>

            <section className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Doctor</th><th>Date</th><th>Type</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dr. Sarah Smith</td>
                      <td>Oct 12, 2025</td>
                      <td>Check-up</td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td><button className="view-btn">View Report</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Medical Records */}
        {activeTab === 'content-medical-records' && (
          <div className="tab-content active">
            <h2>Medical Records</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Record Type</th><th>Date</th><th>Doctor</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Medical History</td>
                    <td>Jan 10, 2026</td>
                    <td>Dr. Smith</td>
                    <td>General health assessment and allergies.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Prescriptions */}
        {activeTab === 'content-prescriptions' && (
          <div className="tab-content active">
            <h2>Prescriptions</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Medicine</th><th>Dosage</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amoxicillin</td>
                    <td>500mg - Twice a day</td>
                    <td>Mar 20, 2026</td>
                    <td><button className="view-btn">Download PDF</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content-lab-reports' && (
            <div id="content-lab-reports" className={`tab-content ${activeTab === 'content-lab-reports' ? 'active' : ''}`}>
                <h2>Lab Reports</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Test Name</th>
                                <th>Date</th>
                                <th>Result</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Blood Test (CBC)</td>
                                <td>Feb 15, 2026</td>
                                <td>Normal</td>
                                <td><span className="status-badge completed">Final</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Tab 5: Profile Settings */}
        {activeTab === 'content-profile-settings' && (
          <div id="content-profile-settings" className={`tab-content ${activeTab === 'content-profile-settings' ? 'active' : ''}`}>
    <h2>Profile Settings</h2>
    <div className="settings-card">
        <form className="profile-form">
            <div className="form-row">
                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" />
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="email@example.com" />
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 00000 00000" />
                </div>
                <div className="input-group">
                    <label>Date of Birth</label>
                    <input type="date" />
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label>Gender</label>
                    {/* In React, use defaultValue on the select tag instead of 'selected' on the option */}
                    <select className="custom-select" defaultValue="">
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="input-group empty">
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