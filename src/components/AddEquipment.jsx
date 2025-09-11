// src/components/AddEquipment.jsx (updated for modal compatibility)
import React, { useState } from 'react';
import { ChevronLeft, Microscope } from 'lucide-react';
import Autocomplete from './Autocomplete';

const AddEquipment = ({ setCurrentView, equipment, updateEquipment, addAuditLog, userRole, isModal, onClose }) => {
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

  // Get unique data for autocomplete
  const equipmentNames = [...new Set(equipment.map(e => e.name))].map(name => ({ name }));
  const equipmentModels = [...new Set(equipment.map(e => e.model))].map(model => ({ model }));
  const equipmentLocations = [...new Set(equipment.map(e => e.location))].map(location => ({ location }));
  const equipmentUsers = [...new Set(equipment.map(e => e.assignedUser).filter(Boolean))].map(user => ({ assignedUser: user }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const nextMaintenance = new Date();
    nextMaintenance.setMonth(nextMaintenance.getMonth() + 6);
    
    const newEquipment = {
      id: Math.max(...equipment.map(e => e.id), 0) + 1,
      name: formData.name,
      model: formData.model,
      serialId: formData.serialId,
      status: formData.status,
      location: formData.location,
      purchaseDate: formData.purchaseDate,
      warrantyExpiration: formData.warrantyExpiration,
      condition: formData.condition,
      lastMaintenance: today,
      nextMaintenance: nextMaintenance.toISOString().split('T')[0],
      assignedUser: formData.assignedUser || null,
      maintenanceLog: []
    };

    updateEquipment(newEquipment);
    addAuditLog('equipment', 'add', newEquipment.name, userRole);
    
    if (isModal) {
      onClose();
    } else {
      setCurrentView('equipment');
    }
  };

  const handleAutocompleteSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {!isModal && (
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('equipment')}
            className="back-button"
          >
            <ChevronLeft className="back-icon" />
          </button>
          <h1 className="detail-title">
            <Microscope className="inline mr-2" />
            Add Equipment
          </h1>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Equipment Name</label>
            <Autocomplete
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              suggestions={equipmentNames}
              placeholder="Enter equipment name"
              onSelect={(item) => handleAutocompleteSelect('name', item.name)}
              field="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model Number</label>
            <Autocomplete
              value={formData.model}
              onChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
              suggestions={equipmentModels}
              placeholder="Enter model number"
              onSelect={(item) => handleAutocompleteSelect('model', item.model)}
              field="model"
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

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Available">Available</option>
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
            <Autocomplete
              value={formData.location}
              onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              suggestions={equipmentLocations}
              placeholder="Enter location"
              onSelect={(item) => handleAutocompleteSelect('location', item.location)}
              field="location"
            />
          </div>

          <div className="form-grid">
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
            <Autocomplete
              value={formData.assignedUser}
              onChange={(value) => setFormData(prev => ({ ...prev, assignedUser: value }))}
              suggestions={equipmentUsers}
              placeholder="Enter user name"
              onSelect={(item) => handleAutocompleteSelect('assignedUser', item.assignedUser)}
              field="assignedUser"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="form-button"
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;