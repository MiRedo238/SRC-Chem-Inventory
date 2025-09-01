import React from 'react';
import { Package, Settings, AlertTriangle, Calendar, Plus, Wrench } from 'lucide-react';

const Dashboard = ({ chemicals, equipment, setCurrentView }) => {
  const expiringChemicals = chemicals.filter(chem => {
    const expDate = new Date(chem.expirationDate);
    const today = new Date();
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });

  const lowStockChemicals = chemicals.filter(chem => 
    (chem.currentQuantity / chem.initialQuantity) < 0.2
  );

  const maintenanceDueEquipment = equipment.filter(eq => {
    const nextMaintDate = new Date(eq.nextMaintenance);
    const today = new Date();
    return nextMaintDate <= today;
  });

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Chemicals</p>
              <p className="stat-value blue">{chemicals.length}</p>
            </div>
            <Package className="stat-icon blue" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Equipment</p>
              <p className="stat-value green">{equipment.length}</p>
            </div>
            <Settings className="stat-icon green" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Expiring Soon</p>
              <p className="stat-value orange">{expiringChemicals.length}</p>
            </div>
            <AlertTriangle className="stat-icon orange" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Low Stock</p>
              <p className="stat-value red">{lowStockChemicals.length}</p>
            </div>
            <Package className="stat-icon red" />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Stock Alert Section */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">
            <AlertTriangle className="icon-sm orange" />
            Stock Alert
          </h2>
          <div className="alert-list">
            {expiringChemicals.slice(0, 3).map(chem => (
              <div key={chem.id} className="alert-item orange-bg">
                <div>
                  <p className="alert-item-title">{chem.name}</p>
                  <p className="alert-item-desc">Expires: {chem.expirationDate}</p>
                </div>
                <span className="alert-tag orange">Expiring Soon</span>
              </div>
            ))}
            {lowStockChemicals.slice(0, 2).map(chem => (
              <div key={`low-${chem.id}`} className="alert-item red-bg">
                <div>
                  <p className="alert-item-title">{chem.name}</p>
                  <p className="alert-item-desc">Stock: {chem.currentQuantity}/{chem.initialQuantity}</p>
                </div>
                <span className="alert-tag red">Low Stock</span>
              </div>
            ))}
          </div>
        </div>

        {/* Update Section */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">
            <Calendar className="icon-sm blue" />
            Update
          </h2>
          <div className="alert-list">
            {maintenanceDueEquipment.map(eq => (
              <div key={eq.id} className="alert-item yellow-bg">
                <div>
                  <p className="alert-item-title">{eq.name}</p>
                  <p className="alert-item-desc">Due: {eq.nextMaintenance}</p>
                </div>
                <span className="alert-tag yellow">Maintenance Due</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="action-grid">
        <button 
          onClick={() => setCurrentView('chemicals')}
          className="action-button blue"
        >
          <Package className="action-icon" />
          <p className="action-text">Chemical</p>
        </button>
        
        <button 
          onClick={() => setCurrentView('equipment')}
          className="action-button green"
        >
          <Settings className="action-icon" />
          <p className="action-text">Equipment</p>
        </button>
        
        <button 
          onClick={() => setCurrentView('add-chemical')}
          className="action-button purple"
        >
          <Plus className="action-icon" />
          <p className="action-text">Add Chemical</p>
        </button>
        
        <button 
          onClick={() => setCurrentView('add-equipment')}
          className="action-button orange"
        >
          <Wrench className="action-icon" />
          <p className="action-text">Equipment Update</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;