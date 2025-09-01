import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const AddEquipment = ({ equipment, setEquipment, setCurrentView }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialId: '',
    status: 'Available',
    location: '',
    purchaseDate: '',
    warrantyExpiration: '',
    condition: 'Good',
    assignedUser: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const nextMaintenance = new Date();
    nextMaintenance.setMonth(nextMaintenance.getMonth() + 6);
    
    const newEquipment = {
      id: equipment.length + 1,
      ...formData,
      lastMaintenance: today,
      nextMaintenance: nextMaintenance.toISOString().split('T')[0],
      assignedUser: formData.assignedUser || null,
      maintenanceLog: []
    };
    setEquipment([...equipment, newEquipment]);
    setCurrentView('equipment');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          onClick={() => setCurrentView('equipment')}
          className="back-button"
        >
          <ChevronLeft className="icon-sm" />
        </button>
        <h1 className="form-title">Add Equipment</h1>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-group">
            <label className="form-label">Equipment Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model Number</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Serial ID</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.serialId}
              onChange={(e) => setFormData({...formData, serialId: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Broken">Broken</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
              >
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Broken">Broken</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Warranty Expiration</label>
              <input
                type="date"
                className="form-input"
                value={formData.warrantyExpiration}
                onChange={(e) => setFormData({...formData, warrantyExpiration: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned User (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={formData.assignedUser}
              onChange={(e) => setFormData({...formData, assignedUser: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button green"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;