import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../dashboard-style.css';

function AdminDashboard() {
  const location = useLocation();
  
  // 1. UNIQUE KEY PER PORTAL (Logic from your JS step 1)
  const pageKey = location.pathname.split("/").pop() + "_activeTab";

  // 2. LOAD SAVED STATE & LOGIC (Logic from your JS step 2)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(pageKey) || 'overview-section';
  });

  const [showModal, setShowModal] = useState(false);

  // 3. TAB CLICKING & PERSISTENCE (Logic from your JS step 3)
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

  // MODAL LOGIC (Logic from your toggleModal function)
  const toggleInventoryModal = (show) => {
    setShowModal(show);
  };

  return (
    <div className="dashboard-wrapper"> 
        <aside className="sidebar admin-theme"> 
            <div className="sidebar-logo"> 
                <i className="fas fa-user-shield"></i> 
                <span>CityCare<span>+</span></span> 
            </div> 
            <nav className="sidebar-nav"> 
                <a href="#" className={`nav-link ${activeTab === 'overview-section' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'overview-section')}><i className="fas fa-chart-line"></i> Overview</a> 
                <a href="#" className={`nav-link ${activeTab === 'user-management-section' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'user-management-section')}><i className="fas fa-users-cog"></i> User Management</a> 
                <a href="#" className={`nav-link ${activeTab === 'billing-section' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'billing-section')}><i className="fas fa-file-invoice-dollar"></i> Billing & Finance</a> 
                <a href="#" className={`nav-link ${activeTab === 'inventory-section' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'inventory-section')}><i className="fas fa-boxes"></i> Inventory</a> 
                <a href="#" className={`nav-link ${activeTab === 'bed-management-section' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, 'bed-management-section')}><i className="fas fa-bed"></i> Bed Management</a> 
            </nav> 
            <div className="sidebar-footer"> 
                <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link> 
            </div> 
        </aside> 

        <main className="main-content"> 
            <header className="dashboard-header"> 
                <div className="welcome-text"> 
                    <h1>System Administration</h1> 
                    <p>Hospital Status: <span className="status-badge online">Operational</span></p> 
                </div> 
                <div className="admin-profile"> 
                    <div className="user-pill">A</div> 
                </div> 
            </header>

            {/* OVERVIEW SECTION */}
            {activeTab === 'overview-section' && (
                <div id="overview-section" className="tab-content active">
                    <section className="stats-grid"> 
                        <div className="stat-card"> 
                            <span className="label">TOTAL DOCTORS</span> 
                            <div className="value">42</div> 
                        </div> 
                        <div className="stat-card"> 
                            <span className="label">REVENUE (MONTHLY)</span> 
                            <div className="value highlight">₹1,500,000</div> 
                        </div> 
                        <div className="stat-card"> 
                            <span className="label">BED OCCUPANCY</span> 
                            <div className="value">82%</div> 
                        </div> 
                    </section> 

                    <div className="admin-grid-row"> 
                        <section className="inventory-card"> 
                            <h2>Inventory Alerts</h2> 
                            <div className="inventory-list"> 
                                <div className="item"> 
                                    <span>Surgical Masks</span> 
                                    <span className="stock low">240 (Low)</span> 
                                </div> 
                                <div className="item"> 
                                    <span>Paracetamol</span> 
                                    <span className="stock">1,200</span> 
                                </div> 
                                <div className="item"> 
                                    <span>Oxygen Tanks</span> 
                                    <span className="stock">15</span> 
                                </div> 
                            </div> 
                        </section> 

                        <section className="user-card"> 
                            <h2>Add New Staff</h2> 
                            <form className="quick-form"> 
                                <input type="text" placeholder="Full Name" /> 
                                <select> 
                                    <option>Doctor</option> 
                                    <option>Nurse</option> 
                                    <option>Lab Tech</option> 
                                </select> 
                                <button type="button" className="btn-confirm">Create Account</button> 
                            </form> 
                        </section> 
                    </div>
                </div>
            )}

            {/* USER MANAGEMENT SECTION */}
            {activeTab === 'user-management-section' && (
                <div id="user-management-section" className="tab-content active">
                    <section className="ehr-section">
                        <div className="section-header-flex">
                            <h2>Staff Directory</h2>
                            <button className="btn-confirm"><i className="fas fa-plus"></i> Add Staff Member</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Staff ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#D-102</td>
                                        <td>Dr. Smith</td>
                                        <td>Cardiology</td>
                                        <td>Senior Doctor</td>
                                        <td><span className="status-badge online">Active</span></td>
                                        <td><button className="btn-outline">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {/* BILLING SECTION */}
            {/* BILLING & FINANCE SECTION */}
            {activeTab === 'billing-section' && (
                <div id="billing-section" className="tab-content active">
                    <section className="stats-grid">
                        <div className="stat-card">
                            <span className="label">PENDING INVOICES</span>
                            <div className="value">₹45,000</div>
                        </div>
                        <div className="stat-card">
                            <span className="label">INSURANCE CLAIMS</span>
                            <div className="value">12 Active</div>
                        </div>
                    </section>

                    <section className="ehr-section entry-card">
                        <div className="section-header-flex">
                            <h2>Manual Billing Entry</h2>
                        </div>
                        <form className="billing-form">
                            <div className="form-row grid-3">
                                <div className="input-group">
                                    <label>Patient Name</label>
                                    <input type="text" placeholder="e.g. John Doe" />
                                </div>
                                <div className="input-group">
                                    <label>Amount (₹)</label>
                                    <input type="number" placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Payment Method</label>
                                    <select defaultValue="UPI">
                                        <option>UPI</option>
                                        <option>Cash</option>
                                        <option>Card</option>
                                        <option>Insurance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-confirm">Add Transaction</button>
                                <button type="reset" className="btn-outline">Clear</button>
                            </div>
                        </form>
                    </section>

                    <section className="ehr-section">
                        <h2>Financial Transactions</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Patient Name</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#INV-9901</td>
                                        <td>Rahul Verma</td>
                                        <td>Oct 26, 2023</td>
                                        <td>₹12,400</td>
                                        <td>UPI</td>
                                        <td><span className="status-badge online">Paid</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {/* INVENTORY SECTION */}
            {activeTab === 'inventory-section' && (
                <div id="inventory-section" className="tab-content active">
                    <section className="ehr-section">
                        <div className="section-header-flex">
                            <h2>Central Inventory Stock</h2>
                            <div className="header-actions">
                                {/* Replaced onclick with React state setter */}
                                <button className="btn-confirm" onClick={() => setShowModal(true)}>
                                    <i className="fas fa-plus"></i> Add Stock
                                </button>
                                <button className="btn-outline">Order Supplies</button>
                            </div>
                        </div>

                        {/* Inventory Modal - Only renders when showModal is true */}
                        {showModal && (
                            <div id="inventory-modal" className="modal-overlay" style={{ display: 'flex' }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3>Manual Stock Entry</h3>
                                        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                                    </div>
                                    <form className="modal-form">
                                        <div className="input-group">
                                            <label>Item Name</label>
                                            <input type="text" placeholder="e.g. Surgical Gloves" />
                                        </div>
                                        <div className="form-row grid-2">
                                            <div className="input-group">
                                                <label>Category</label>
                                                <select defaultValue="Consumables">
                                                    <option>Consumables</option>
                                                    <option>Medical Gas</option>
                                                    <option>Medicine</option>
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label>Current Stock</label>
                                                <input type="number" placeholder="0" />
                                            </div>
                                        </div>
                                        <div className="form-row grid-2">
                                            <div className="input-group">
                                                <label>Unit</label>
                                                <input type="text" placeholder="e.g. Box (50pcs)" />
                                            </div>
                                            <div className="input-group">
                                                <label>Threshold</label>
                                                <input type="number" placeholder="Min level" />
                                            </div>
                                        </div>
                                        <div className="modal-actions">
                                            <button type="submit" className="btn-confirm">Save Record</button>
                                            <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Category</th>
                                        <th>Current Stock</th>
                                        <th>Unit</th>
                                        <th>Threshold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Surgical Masks</td>
                                        <td>Consumables</td>
                                        <td className="text-urgent">240</td>
                                        <td>Box (50pcs)</td>
                                        <td>500</td>
                                    </tr>
                                    <tr>
                                        <td>Oxygen Cylinders</td>
                                        <td>Medical Gas</td>
                                        <td>15</td>
                                        <td>Cylinder</td>
                                        <td>10</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {/* BED MANAGEMENT SECTION */}
            {activeTab === 'bed-management-section' && (
                <div id="bed-management-section" className="tab-content active">
                    <section className="bed-section"> 
                        <h2>Ward A: Bed Management</h2> 
                        <div className="bed-grid"> 
                            <div className="bed occupied" title="Patient: Mark S.">101</div> 
                            <div className="bed occupied">102</div> 
                            <div className="bed vacant">103</div> 
                            <div className="bed occupied">104</div> 
                            <div className="bed vacant">105</div> 
                            <div className="bed vacant">106</div> 
                            <div className="bed occupied">107</div> 
                            <div className="bed cleaning">108</div> 
                        </div> 
                        <div className="bed-legend"> 
                            <span className="legend-item"><span className="box occupied"></span> Occupied</span> 
                            <span className="legend-item"><span className="box vacant"></span> Vacant</span> 
                            <span className="legend-item"><span className="box cleaning"></span> Cleaning</span> 
                        </div> 
                    </section> 
                </div>
            )}
        </main> 
    </div>
  );
}

export default AdminDashboard;