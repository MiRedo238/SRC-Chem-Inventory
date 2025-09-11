import React, { useState } from 'react';
import {
  FlaskConical,
  Microscope,
  AlertTriangle,
  Calendar,
  Plus
} from 'lucide-react';
import { daysUntilExpiration } from '../utils/helpers';
import Modal from './Modal';
import AddChemical from './AddChemical';
import AddEquipment from './AddEquipment';

const Dashboard = ({ chemicals, equipment, setCurrentView, userRole, updateChemicals, updateEquipment, addAuditLog }) => {
  const isAdmin = userRole === 'admin';
  const [showChemicalModal, setShowChemicalModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  
  // Calculate statistics
  const totalChemicals = chemicals.length;
  const totalEquipment = equipment.length;
  
  const lowStockChemicals = chemicals.filter(chem => 
    chem.currentQuantity / chem.initialQuantity < 0.2
  ).length;
  
  const expiringChemicals = chemicals.filter(chem => 
    daysUntilExpiration(chem.expirationDate) < 30
  ).length;
  
  const equipmentNeedingMaintenance = equipment.filter(eq => {
    const nextMaintenance = new Date(eq.nextMaintenance);
    const today = new Date();
    return nextMaintenance - today < 30 * 24 * 60 * 60 * 1000; // Less than 30 days
  }).length;
  
  const stats = [
    { label: 'Total Chemicals', value: totalChemicals, icon: FlaskConical, color: 'blue' },
    { label: 'Total Equipment', value: totalEquipment, icon: Microscope, color: 'green' },
    { label: 'Low Stock Items', value: lowStockChemicals, icon: AlertTriangle, color: 'red' },
    { label: 'Expiring Soon', value: expiringChemicals, icon: Calendar, color: 'yellow' },
  ];
  
  // Quick actions only for admins 
  const quickActions = [
    { id: 'add-chemical', label: 'Add Chemical', icon: Plus, action: () => setShowChemicalModal(true) },
    { id: 'add-equipment', label: 'Add Equipment', icon: Plus, icon: Plus, action: () => setShowEquipmentModal(true) }
  ];

  // Handle adding a new chemical
  const handleAddChemicalSubmit = (newChemical) => {
    updateChemicals([...chemicals, newChemical]);
    addAuditLog('chemical', 'add', newChemical.name, userRole);
    setShowChemicalModal(false);
  };

  // Handle adding new equipment
    const handleAddEquipment = (newEquipment) => {
      updateEquipment([...equipment, newEquipment]);
      addAuditLog('equipment', 'add', newEquipment.name, userRole);
      setShowEquipmentModal(false);
    };


  return (
    <div>
      
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="dashboard-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-content">
                <div>
                  <p className="stat-card-label">{stat.label}</p>
                  <p className="stat-card-value">{stat.value}</p>
                </div>
                <Icon className={`stat-card-icon text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-2' : ''} gap-6 mt-6`}>
        {/* Alerts Section */}
        <div className="alert-section">
          <h2 className="section-title">
            <AlertTriangle className="section-icon" />
            Alerts & Notifications
          </h2>
          <div className="space-y-3">
            {chemicals.filter(chem => daysUntilExpiration(chem.expirationDate) < 30)
              .map(chem => (
                <div key={chem.id} className="alert-item alert-expiring">
                  <span className="alert-text">{chem.name} expiring soon</span>
                  <span className="alert-status">
                    {daysUntilExpiration(chem.expirationDate)} days left
                  </span>
                </div>
              ))
            }
            {chemicals.filter(chem => chem.currentQuantity / chem.initialQuantity < 0.2)
              .map(chem => (
                <div key={chem.id} className="alert-item alert-low-stock">
                  <span className="alert-text">{chem.name} low stock</span>
                  <span className="alert-status">
                    {chem.currentQuantity} / {chem.initialQuantity} remaining
                  </span>
                </div>
              ))
            }
            {equipment.filter(eq => {
              const nextMaintenance = new Date(eq.nextMaintenance);
              const today = new Date();
              return nextMaintenance - today < 30 * 24 * 60 * 60 * 1000;
            }).map(eq => (
              <div key={eq.id} className="alert-item alert-maintenance">
                <span className="alert-text">{eq.name} needs maintenance</span>
                <span className="alert-status">
                  Due: {new Date(eq.nextMaintenance).toLocaleDateString()}
                </span>
              </div>
            ))
            }
            {chemicals.filter(chem => daysUntilExpiration(chem.expirationDate) < 30).length === 0 &&
             chemicals.filter(chem => chem.currentQuantity / chem.initialQuantity < 0.2).length === 0 &&
             equipment.filter(eq => {
               const nextMaintenance = new Date(eq.nextMaintenance);
               const today = new Date();
               return nextMaintenance - today < 30 * 24 * 60 * 60 * 1000;
             }).length === 0 && (
              <p className="text-gray-500 text-center py-4">No alerts at this time</p>
            )}
          </div>
        </div>
        
        {/* Quick Actions - Only show for admins */}
        {isAdmin && (
        <div className="update-section">
          <h2 className="section-title">
            <Calendar className="section-icon" />
            Quick Actions
          </h2>
          <div className="quick-actions">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="quick-action-button"
                  onClick={action.action}
                >
                  <Icon className="quick-action-icon" />
                  <span className="quick-action-text">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === Modals === */}
      <Modal 
        isOpen={showChemicalModal} 
        onClose={() => setShowChemicalModal(false)} 
        title="Add New Chemical"
      >
        <AddChemical
          setCurrentView={setCurrentView}
          chemicals={chemicals}
          updateChemicals={handleAddChemicalSubmit}
          addAuditLog={addAuditLog}
          userRole={userRole}
          isModal={true}
          onClose={() => setShowChemicalModal(false)}
        />
      </Modal>

      <Modal 
        isOpen={showEquipmentModal} 
        onClose={() => setShowEquipmentModal(false)} 
        title="Add New Equipment"
      >
        <AddEquipment
          setCurrentView={setCurrentView}
          equipment={equipment}
          updateEquipment={handleAddEquipment}
          addAuditLog={addAuditLog}
          userRole={userRole}
          isModal={true}
          onClose={() => setShowEquipmentModal(false)}
        />
      </Modal>
    </div>
    </div>
  );
};

export default Dashboard;