import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard-style.css';
import api from './api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview-section');
  const [showModal, setShowModal] = useState(false);

  // Data state
  const [overview, setOverview]     = useState({});
  const [users, setUsers]           = useState([]);
  const [inventory, setInventory]   = useState([]);
  const [billing, setBilling]       = useState([]);
  const [beds, setBeds]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState('');

  // Form states
  const [newStaff, setNewStaff]       = useState({ full_name:'', email:'', password:'', role:'doctor', department:'' });
  const [newInv, setNewInv]           = useState({ item_name:'', category:'Consumables', current_stock:0, unit:'', threshold:100 });
  const [newBill, setNewBill]         = useState({ patient_name:'', amount:'', payment_method:'UPI' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchAll = async () => {
    try {
      const [ov, u, inv, b, bd] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
        api.get('/admin/inventory'),
        api.get('/admin/billing'),
        api.get('/admin/beds'),
      ]);
      setOverview(ov); setUsers(u); setInventory(inv); setBilling(b); setBeds(bd);
    } catch (err) {
      if (err.message.includes('authenticated')) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Staff ─────────────────────────────────────────────────────
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newStaff);
      showToast('✅ Staff account created!');
      setNewStaff({ full_name:'', email:'', password:'', role:'doctor', department:'' });
      const u = await api.get('/admin/users');
      setUsers(u);
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('✅ User deleted.');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { showToast('❌ ' + err.message); }
  };

  // ── Inventory ─────────────────────────────────────────────────
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/inventory', newInv);
      showToast('✅ Item added to inventory!');
      setShowModal(false);
      setNewInv({ item_name:'', category:'Consumables', current_stock:0, unit:'', threshold:100 });
      const inv = await api.get('/admin/inventory');
      setInventory(inv);
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const handleDeleteInventory = async (id) => {
    try {
      await api.delete(`/admin/inventory/${id}`);
      showToast('✅ Item removed.');
      setInventory(inventory.filter(i => i.id !== id));
    } catch (err) { showToast('❌ ' + err.message); }
  };

  // ── Billing ───────────────────────────────────────────────────
  const handleAddBilling = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/billing', newBill);
      showToast('✅ Transaction recorded!');
      setNewBill({ patient_name:'', amount:'', payment_method:'UPI' });
      const b = await api.get('/admin/billing');
      setBilling(b);
    } catch (err) { showToast('❌ ' + err.message); }
  };

  // ── Beds ──────────────────────────────────────────────────────
  const cycleBedStatus = async (bed) => {
    const cycle = { vacant:'occupied', occupied:'cleaning', cleaning:'vacant' };
    const newStatus = cycle[bed.status];
    try {
      await api.put(`/admin/beds/${bed.id}`, { status: newStatus, patient_id: bed.patient_id });
      setBeds(beds.map(b => b.id === bed.id ? { ...b, status: newStatus } : b));
    } catch (err) { showToast('❌ ' + err.message); }
  };

  const handleLogout = () => {
    ['token', 'userId', 'userName', 'userRole'].forEach(k => localStorage.removeItem(k));
    navigate('/');
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p>Loading admin panel…</p>
    </div>
  );

  const lowStock = inventory.filter(i => i.current_stock <= i.threshold);

  return (
    <div className="dashboard-wrapper">
      {toast && <div className="status-msg" style={{ display:'block' }}>{toast}</div>}

      <aside className="sidebar admin-theme">
        <div className="sidebar-logo">
          <i className="fas fa-user-shield"></i>
          <span>CityCare<span>+</span></span>
        </div>
        <nav className="sidebar-nav">
          {[
            ['overview-section',        'fa-chart-line',         'Overview'],
            ['user-management-section', 'fa-users-cog',          'User Management'],
            ['billing-section',         'fa-file-invoice-dollar','Billing & Finance'],
            ['inventory-section',       'fa-boxes',              'Inventory'],
            ['bed-management-section',  'fa-bed',                'Bed Management'],
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
            <h1>System Administration</h1>
            <p>Hospital Status: <span className="status-badge online">Operational</span></p>
          </div>
          <div className="user-pill">A</div>
        </header>

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {activeTab === 'overview-section' && (
          <div className="tab-content active">
            <section className="stats-grid">
              <div className="stat-card">
                <span className="label">TOTAL DOCTORS</span>
                <div className="value">{overview.total_doctors || 0}</div>
              </div>
              <div className="stat-card">
                <span className="label">REVENUE (MONTHLY)</span>
                <div className="value highlight">₹{Number(overview.revenue || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="stat-card">
                <span className="label">BED OCCUPANCY</span>
                <div className="value">
                  {overview.bed_total > 0
                    ? `${Math.round((overview.bed_occupied / overview.bed_total) * 100)}%`
                    : '—'}
                </div>
              </div>
            </section>

            <div className="admin-grid-row">
              <section className="inventory-card">
                <h2>Inventory Alerts</h2>
                <div className="inventory-list">
                  {lowStock.length === 0
                    ? <p style={{ color:'#888', marginTop:'1rem' }}>All stock levels are healthy.</p>
                    : lowStock.map(i => (
                        <div key={i.id} className="item">
                          <span>{i.item_name}</span>
                          <span className="stock low">{i.current_stock} (Low)</span>
                        </div>
                      ))
                  }
                </div>
              </section>

              <section className="user-card">
                <h2>Quick Add Staff</h2>
                <form className="quick-form" onSubmit={handleAddStaff}>
                  <input
                    type="text" placeholder="Full Name" required
                    value={newStaff.full_name}
                    onChange={e => setNewStaff({...newStaff, full_name: e.target.value})}
                  />
                  <input
                    type="email" placeholder="Email" required
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  />
                  <input
                    type="password" placeholder="Password" required
                    value={newStaff.password}
                    onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                  />
                  <select
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input
                    type="text" placeholder="Department (for doctors)"
                    value={newStaff.department}
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                  />
                  <button type="submit" className="btn-confirm">Create Account</button>
                </form>
              </section>
            </div>
          </div>
        )}

        {/* ── USER MANAGEMENT ──────────────────────────────── */}
        {activeTab === 'user-management-section' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <div className="section-header-flex">
                <h2>Staff &amp; Patient Directory</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>{u.full_name}</td>
                        <td>{u.email}</td>
                        <td><span className={`status-badge ${u.role === 'admin' ? 'online' : u.role === 'doctor' ? 'completed' : ''}`}>{u.role}</span></td>
                        <td>{u.department || '—'}</td>
                        <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                        <td>
                          <button className="btn-outline" onClick={() => handleDeleteUser(u.id)}
                            style={{ borderColor:'#ef4444', color:'#ef4444' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── BILLING ──────────────────────────────────────── */}
        {activeTab === 'billing-section' && (
          <div className="tab-content active">
            <section className="stats-grid">
              <div className="stat-card">
                <span className="label">PENDING INVOICES</span>
                <div className="value">
                  ₹{billing.filter(b => b.status === 'pending')
                      .reduce((s,b) => s + parseFloat(b.amount), 0)
                      .toLocaleString('en-IN')}
                </div>
              </div>
              <div className="stat-card">
                <span className="label">TOTAL TRANSACTIONS</span>
                <div className="value">{billing.length}</div>
              </div>
            </section>

            <section className="ehr-section entry-card">
              <h2>Manual Billing Entry</h2>
              <form className="billing-form" onSubmit={handleAddBilling}>
                <div className="form-row grid-3">
                  <div className="input-group">
                    <label>Patient Name</label>
                    <input type="text" placeholder="e.g. John Doe" required
                      value={newBill.patient_name}
                      onChange={e => setNewBill({...newBill, patient_name: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Amount (₹)</label>
                    <input type="number" placeholder="0.00" required
                      value={newBill.amount}
                      onChange={e => setNewBill({...newBill, amount: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Payment Method</label>
                    <select value={newBill.payment_method}
                      onChange={e => setNewBill({...newBill, payment_method: e.target.value})}>
                      <option>UPI</option><option>Cash</option>
                      <option>Card</option><option>Insurance</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-confirm">Add Transaction</button>
                  <button type="reset" className="btn-outline" onClick={() => setNewBill({ patient_name:'', amount:'', payment_method:'UPI' })}>Clear</button>
                </div>
              </form>
            </section>

            <section className="ehr-section">
              <h2>Financial Transactions</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Invoice ID</th><th>Patient</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {billing.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign:'center', color:'#888' }}>No transactions yet.</td></tr>
                    )}
                    {billing.map(b => (
                      <tr key={b.id}>
                        <td>#INV-{String(b.id).padStart(4,'0')}</td>
                        <td>{b.patient_full_name || b.patient_name}</td>
                        <td>{new Date(b.invoice_date).toLocaleDateString('en-IN')}</td>
                        <td>₹{Number(b.amount).toLocaleString('en-IN')}</td>
                        <td>{b.payment_method}</td>
                        <td><span className={`status-badge ${b.status === 'paid' ? 'online' : ''}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── INVENTORY ─────────────────────────────────────── */}
        {activeTab === 'inventory-section' && (
          <div className="tab-content active">
            <section className="ehr-section">
              <div className="section-header-flex">
                <h2>Central Inventory Stock</h2>
                <div className="header-actions">
                  <button className="btn-confirm" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Add Stock
                  </button>
                </div>
              </div>

              {/* Modal */}
              {showModal && (
                <div className="modal-overlay" style={{ display:'flex' }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>Manual Stock Entry</h3>
                      <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                    </div>
                    <form className="modal-form" onSubmit={handleAddInventory}>
                      <div className="input-group">
                        <label>Item Name</label>
                        <input type="text" placeholder="e.g. Surgical Gloves" required
                          value={newInv.item_name}
                          onChange={e => setNewInv({...newInv, item_name: e.target.value})} />
                      </div>
                      <div className="form-row grid-2">
                        <div className="input-group">
                          <label>Category</label>
                          <select value={newInv.category} onChange={e => setNewInv({...newInv, category: e.target.value})}>
                            <option>Consumables</option><option>Medical Gas</option>
                            <option>Medicine</option><option>Equipment</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Current Stock</label>
                          <input type="number" placeholder="0" required
                            value={newInv.current_stock}
                            onChange={e => setNewInv({...newInv, current_stock: parseInt(e.target.value)})} />
                        </div>
                      </div>
                      <div className="form-row grid-2">
                        <div className="input-group">
                          <label>Unit</label>
                          <input type="text" placeholder="e.g. Box (50pcs)"
                            value={newInv.unit}
                            onChange={e => setNewInv({...newInv, unit: e.target.value})} />
                        </div>
                        <div className="input-group">
                          <label>Low-Stock Threshold</label>
                          <input type="number" placeholder="Min level"
                            value={newInv.threshold}
                            onChange={e => setNewInv({...newInv, threshold: parseInt(e.target.value)})} />
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
                    <tr><th>Item</th><th>Category</th><th>Stock</th><th>Unit</th><th>Threshold</th><th>Alert</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {inventory.map(i => (
                      <tr key={i.id}>
                        <td>{i.item_name}</td>
                        <td>{i.category}</td>
                        <td className={i.current_stock <= i.threshold ? 'text-urgent' : ''}>{i.current_stock}</td>
                        <td>{i.unit}</td>
                        <td>{i.threshold}</td>
                        <td>{i.current_stock <= i.threshold ? <span className="stock low">Low</span> : '✓'}</td>
                        <td>
                          <button className="btn-outline"
                            style={{ borderColor:'#ef4444', color:'#ef4444', padding:'4px 10px' }}
                            onClick={() => handleDeleteInventory(i.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── BED MANAGEMENT ───────────────────────────────── */}
        {activeTab === 'bed-management-section' && (
          <div className="tab-content active">
            <section className="bed-section">
              <h2>Ward A — Bed Management <small style={{ fontSize:'0.8rem', color:'#888', marginLeft:'8px' }}>(click a bed to cycle its status)</small></h2>
              <div className="bed-grid">
                {beds.map(b => (
                  <div
                    key={b.id}
                    className={`bed ${b.status}`}
                    title={b.patient_name ? `Patient: ${b.patient_name}` : b.status}
                    onClick={() => cycleBedStatus(b)}
                    style={{ cursor:'pointer' }}
                  >
                    {b.bed_number}
                  </div>
                ))}
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
