import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../dashboard-style.css'; 

function DoctorDashboard() {
  const location = useLocation();

  // 1. UNIQUE KEY PER PORTAL (Logic from your JS step 1)
  // This creates a key like "doctor_activeTab"
  const pageKey = location.pathname.split("/").pop() + "_activeTab";

  // 2. LOAD SAVED STATE (Logic from your JS step 2)
  // We initialize the state by checking localStorage first
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(pageKey) || 'patient-queue';
  });

  // 3. SAVE STATE ON CHANGE (Logic from your JS step 3)
  // Every time activeTab changes, update localStorage
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
        <aside className="sidebar"> 
            <div className="sidebar-logo"> 
                <i className="fas fa-user-md"></i> 
                <span>CityCare<span>+</span></span> 
            </div> 
            <nav className="sidebar-nav"> 
                {/* Fixed the <a> tags to match your CSS exactly */}
                <a href="#" className={`nav-link ${activeTab === 'patient-queue' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'patient-queue')}><i className="fas fa-users"></i> Patient Queue</a> 
                <a href="#" className={`nav-link ${activeTab === 'health-records' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'health-records')}><i className="fas fa-file-medical-alt"></i> Health Records</a> 
                <a href="#" className={`nav-link ${activeTab === 'prescription-gen' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'prescription-gen')}><i className="fas fa-pills"></i> Prescription Gen</a> 
                <a href="#" className={`nav-link ${activeTab === 'my-schedule' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'my-schedule')}><i className="fas fa-calendar-check"></i> My Schedule</a> 
                <a href="#" className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'settings')}><i className="fas fa-cog"></i> Settings</a> 
            </nav> 
            <div className="sidebar-footer"> 
                <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link> 
            </div> 
        </aside> 

        <main className="main-content"> 
            <header className="dashboard-header"> 
                <div className="welcome-text"> 
                    <h1>Doctor's Portal</h1> 
                    <p>Welcome back, <span id="docName">Dr. Smith</span></p> 
                </div> 
                <div className="status-toggle"> 
                    <span className="status-dot online"></span> Active for Consultation 
                </div> 
            </header>

            {/* TAB: Patient Queue - ONLY shows if activeTab is 'patient-queue' */}
            {activeTab === 'patient-queue' && (
                <div id="patient-queue" className="tab-content active">
                    <section className="stats-grid"> 
                        <div className="stat-card highlight-border"> 
                            <span className="label">CURRENT PATIENT</span> 
                            <div className="value">Bhavesh Jawale</div> 
                            <p className="sub-value">Room 402 • General Checkup</p> 
                        </div> 
                        <div className="stat-card"> 
                            <span className="label">WAITING IN QUEUE</span> 
                            <div className="value">12 Patients</div> 
                        </div> 
                        <div className="stat-card"> 
                            <span className="label">TODAY'S TOTAL</span> 
                            <div className="value">28 Appointments</div> 
                        </div> 
                    </section> 

                    <section className="ehr-section"> 
                        <div className="section-header-flex"> 
                            <h2>Consultation & EHR</h2> 
                            <span className="patient-id">ID: #PT-90288</span> 
                        </div> 
                        <form className="ehr-form"> 
                            <div className="form-row"> 
                                <div className="input-group"> 
                                    <label>Symptoms / Chief Complaint</label> 
                                    <textarea placeholder="Enter symptoms here..."></textarea> 
                                </div> 
                            </div> 
                            <div className="form-row grid-2"> 
                                <div className="input-group"> 
                                    <label>Diagnosis</label> 
                                    <input id="Diagnosis" type="text" placeholder="e.g. Seasonal Flu" /> 
                                </div> 
                                <div className="input-group"> 
                                    <label>Prescribe Medication</label> 
                                    <select> 
                                        <option>Select from Pharmacy Database</option> 
                                        <option>Amoxicillin 500mg</option> 
                                        <option>Paracetamol 650mg</option> 
                                        <option>Cetirizine 10mg</option> 
                                    </select> 
                                </div> 
                            </div> 
                            <div className="form-actions"> 
                                <button type="button" className="btn-outline">Add Lab Test</button> 
                                <button type="submit" className="btn-confirm">Generate Prescription & Finish</button> 
                            </div> 
                        </form> 
                    </section> 

                    <section className="recent-activity"> 
                        <h2>Upcoming Appointments</h2> 
                        <div className="table-container"> 
                            <table> 
                                <thead> 
                                    <tr> 
                                        <th>Queue #</th> 
                                        <th>Patient Name</th> 
                                        <th>Time Slot</th> 
                                        <th>Priority</th> 
                                        <th>Action</th> 
                                    </tr> 
                                </thead> 
                                <tbody> 
                                    <tr>
                                        <td>05</td>
                                        <td>Rahul Verma</td>
                                        <td>11:30 AM</td>
                                        <td className="text-urgent">High</td>
                                        <td>
                                            <button className="btn-call">Call Next</button>
                                            <button className="btn-wait">Wait</button>
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'health-records' && (
                <div id="health-records" className="tab-content active">
                    <section className="ehr-section">
                        <h2>Patient Medical Archives</h2>
                        <div className="search-bar">
                            <input type="text" placeholder="Search by Patient Name or ID..." />
                            <button className="btn-confirm">Search</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>Diagnosis</th>
                                        <th>Files</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Oct 24, 2023</td>
                                        <td>Alice Cooper</td>
                                        <td>Hypertension</td>
                                        <td><i className="fas fa-file-pdf"></i> Report.pdf</td>
                                        <td><button className="btn-outline">View Details</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'prescription-gen' && (
                <div id="prescription-gen" className="tab-content active">
                    <section className="ehr-section">
                        <h2>Digital Prescription Pad</h2>
                        <div className="prescription-pad">
                            <div className="pad-header">
                                <p><strong>CityCare Hospital</strong> | Dr. Smith</p>
                            </div>
                            <div className="form-row grid-2">
                                <div className="input-group">
                                    <label>Patient Name</label>
                                    <input type="text" />
                                </div>
                                <div className="input-group">
                                    <label>Age/Gender</label>
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Rx Instructions</label>
                                <textarea rows="6" placeholder="Tab. Paracetamol 650mg - TDS - 3 Days"></textarea>
                            </div>
                            <button className="btn-print"><i className="fas fa-print"></i> Print & Save</button>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'my-schedule' && (
                <div id="my-schedule" className="tab-content active">
                    <section className="ehr-section">
                        <h2>Doctor's Weekly Rota</h2>
                        <div className="schedule-grid">
                            <div className="day-card active">
                                <h3>Mon</h3>
                                <p>09:00 - 17:00</p>
                            </div>
                            <div className="day-card">
                                <h3>Tue</h3>
                                <p>09:00 - 17:00</p>
                            </div>
                            <div className="day-card">
                                <h3>Wed</h3>
                                <p>Off Day</p>
                            </div>
                            <div className="day-card">
                                <h3>Thu</h3>
                                <p>11:00 - 19:00</p>
                            </div>
                            <div className="day-card">
                                <h3>Fri</h3>
                                <p>09:00 - 17:00</p>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'settings' && (
                <div id="settings" className="tab-content active">
                    <section className="ehr-section">
                        <h2>Account Settings</h2>
                        <div className="form-row grid-2">
                            <div className="input-group">
                                <label>Email Notification</label>
                                <select>
                                    <option>Enabled</option>
                                    <option>Disabled</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Digital Signature</label>
                                <button className="btn-outline">Update Sign</button>
                            </div>
                        </div>
                        <button className="btn-print">Save Settings</button>
                    </section>
                </div>
            )}

            {/* Repeat the {activeTab === '...' && ( ... )} pattern for the rest */}
        </main> 
    </div>
  );
}

export default DoctorDashboard;