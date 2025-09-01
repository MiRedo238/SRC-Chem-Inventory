import React from 'react';
import { Activity, Package, Settings } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => (
  <div className="sidebar">
    <nav className="sidebar-nav">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`nav-item ${currentView === 'dashboard' ? 'nav-item-active' : ''}`}
      >
        <div className="nav-item-content">
          <Activity className="icon-sm" />
          Dashboard
        </div>
      </button>
      
      <button
        onClick={() => setCurrentView('chemicals')}
        className={`nav-item ${currentView === 'chemicals' || currentView === 'add-chemical' ? 'nav-item-active' : ''}`}
      >
        <div className="nav-item-content">
          <Package className="icon-sm" />
          Chemicals
        </div>
      </button>
      
      <button
        onClick={() => setCurrentView('equipment')}
        className={`nav-item ${currentView === 'equipment' || currentView === 'add-equipment' ? 'nav-item-active' : ''}`}
      >
        <div className="nav-item-content">
          <Settings className="icon-sm" />
          Equipment
        </div>
      </button>
    </nav>
  </div>
);

export default Sidebar;