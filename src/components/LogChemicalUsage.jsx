// src/components/LogChemicalUsage.jsx
import React, { useState } from 'react';
import { ChevronLeft, FlaskConical, Microscope, User, MapPin, Calendar, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import Autocomplete from './Autocomplete';
import { addAuditLog } from '../utils/helpers';

const LogChemicalUsage = ({ 
  chemicals, 
  equipment, 
  setCurrentView, 
  updateChemicals, 
  updateEquipment, 
  addAuditLog, 
  userRole,
  currentUser 
}) => {
  const [selectedChemicals, setSelectedChemicals] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [user, setUser] = useState(currentUser?.name || '');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('log');
  const [editingLog, setEditingLog] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Get unique users and locations for autocomplete
  const allUsers = [...new Set([
    ...chemicals.flatMap(c => c.usageLog.map(u => u.user)),
    ...equipment.flatMap(e => e.maintenanceLog.map(m => m.user))
  ])].map(user => ({ user }));
  
  const allLocations = [...new Set([
    ...chemicals.flatMap(c => [c.location, ...c.usageLog.map(u => u.location)]),
    ...equipment.map(e => e.location)
  ])].filter(Boolean).map(location => ({ location }));

  // Get user's logs for editing
  const getUserLogs = () => {
    const chemicalLogs = chemicals.flatMap(chem => 
      chem.usageLog
        .filter(log => log.user === currentUser?.name)
        .map(log => ({
          ...log,
          id: `${chem.id}-${log.date}-${log.quantity}`,
          type: 'chemical',
          itemName: chem.name,
          itemId: chem.id
        }))
    );
    
    const equipmentLogs = equipment.flatMap(eq => 
      eq.maintenanceLog
        .filter(log => log.user === currentUser?.name)
        .map(log => ({
          ...log,
          id: `${eq.id}-${log.date}-${log.action}`,
          type: 'equipment',
          itemName: eq.name,
          itemId: eq.id
        }))
    );
    
    return [...chemicalLogs, ...equipmentLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const addChemicalUsage = () => {
    setSelectedChemicals([...selectedChemicals, { chemicalId: '', quantity: '' }]);
  };

  const addEquipmentUsage = () => {
    setSelectedEquipment([...selectedEquipment, { equipmentId: '', action: 'used', notes: '' }]);
  };

  const removeChemicalUsage = (index) => {
    setSelectedChemicals(selectedChemicals.filter((_, i) => i !== index));
  };

  const removeEquipmentUsage = (index) => {
    setSelectedEquipment(selectedEquipment.filter((_, i) => i !== index));
  };

  const updateChemicalUsage = (index, field, value) => {
    const updated = [...selectedChemicals];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedChemicals(updated);
  };

  const updateEquipmentUsage = (index, field, value) => {
    const updated = [...selectedEquipment];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedEquipment(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user || (selectedChemicals.length === 0 && selectedEquipment.length === 0)) return;

    // Update chemicals
    if (selectedChemicals.length > 0) {
      const updatedChemicals = chemicals.map(chem => {
        const chemUsage = selectedChemicals.find(sc => sc.chemicalId === chem.id.toString());
        if (chemUsage && chemUsage.quantity) {
          const newQuantity = Math.max(0, chem.currentQuantity - parseInt(chemUsage.quantity));
          
          const usageLog = [
            ...chem.usageLog,
            {
              date,
              user,
              location: location || chem.location,
              quantity: parseInt(chemUsage.quantity),
              notes,
              opened: false
            }
          ];

          addAuditLog('chemical', 'usage', chem.name, userRole, {
            quantity: parseInt(chemUsage.quantity),
            location: location || chem.location,
            user
          });

          return {
            ...chem,
            currentQuantity: newQuantity,
            usageLog
          };
        }
        return chem;
      });
      updateChemicals(updatedChemicals);
    }

    // Update equipment
    if (selectedEquipment.length > 0) {
      const updatedEquipment = equipment.map(eq => {
        const eqUsage = selectedEquipment.find(se => se.equipmentId === eq.id.toString());
        if (eqUsage) {
          const maintenanceLog = [
            ...eq.maintenanceLog,
            {
              date,
              action: eqUsage.action === 'used' ? 'Used' : eqUsage.action,
              user,
              notes: eqUsage.notes || notes
            }
          ];

          addAuditLog('equipment', eqUsage.action, eq.name, userRole, {
            user,
            notes: eqUsage.notes || notes
          });

          return {
            ...eq,
            maintenanceLog
          };
        }
        return eq;
      });
      updateEquipment(updatedEquipment);
    }

    // Reset form
    setSelectedChemicals([]);
    setSelectedEquipment([]);
    setUser(currentUser?.name || '');
    setLocation('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  const startEditing = (log) => {
    setEditingLog(log.id);
    setEditForm({
      quantity: log.quantity || '',
      notes: log.notes || '',
      location: log.location || '',
      action: log.action || ''
    });
  };

  const cancelEditing = () => {
    setEditingLog(null);
    setEditForm({});
  };

  const saveEdit = (log) => {
    if (log.type === 'chemical') {
      const updatedChemicals = chemicals.map(chem => {
        if (chem.id === log.itemId) {
          const updatedUsageLog = chem.usageLog.map(usage => {
            if (usage.user === log.user && usage.date === log.date && usage.quantity === log.quantity) {
              // Calculate quantity difference for inventory adjustment
              const quantityDiff = parseInt(editForm.quantity) - usage.quantity;
              chem.currentQuantity = Math.max(0, chem.currentQuantity - quantityDiff);
              
              return {
                ...usage,
                quantity: parseInt(editForm.quantity),
                notes: editForm.notes,
                location: editForm.location
              };
            }
            return usage;
          });
          return { ...chem, usageLog: updatedUsageLog };
        }
        return chem;
      });
      updateChemicals(updatedChemicals);
    } else {
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === log.itemId) {
          const updatedMaintenanceLog = eq.maintenanceLog.map(maintenance => {
            if (maintenance.user === log.user && maintenance.date === log.date && maintenance.action === log.action) {
              return {
                ...maintenance,
                notes: editForm.notes,
                action: editForm.action
              };
            }
            return maintenance;
          });
          return { ...eq, maintenanceLog: updatedMaintenanceLog };
        }
        return eq;
      });
      updateEquipment(updatedEquipment);
    }
    
    setEditingLog(null);
    setEditForm({});
  };

  const deleteLog = (log) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;

    if (log.type === 'chemical') {
      const updatedChemicals = chemicals.map(chem => {
        if (chem.id === log.itemId) {
          // Restore quantity when deleting usage log
          const newQuantity = chem.currentQuantity + log.quantity;
          const updatedUsageLog = chem.usageLog.filter(usage => 
            !(usage.user === log.user && usage.date === log.date && usage.quantity === log.quantity)
          );
          return { ...chem, currentQuantity: newQuantity, usageLog: updatedUsageLog };
        }
        return chem;
      });
      updateChemicals(updatedChemicals);
    } else {
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === log.itemId) {
          const updatedMaintenanceLog = eq.maintenanceLog.filter(maintenance => 
            !(maintenance.user === log.user && maintenance.date === log.date && maintenance.action === log.action)
          );
          return { ...eq, maintenanceLog: updatedMaintenanceLog };
        }
        return eq;
      });
      updateEquipment(updatedEquipment);
    }
  };

  return (
    <div>
      <div className="detail-header">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="back-button"
        >
          <ChevronLeft className="back-icon" />
        </button>
        <h1 className="detail-title">
          <FlaskConical className="inline mr-2" />
          Log Chemical & Equipment Usage
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'log' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('log')}
        >
          New Log Entry
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'edit' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('edit')}
        >
          My Logs
        </button>
      </div>

      {activeTab === 'log' && (
        <div className="usage-form">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User className="inline mr-1" size={16} />
                    User
                  </label>
                  <Autocomplete
                    value={user}
                    onChange={setUser}
                    suggestions={allUsers}
                    placeholder="Enter user name"
                    onSelect={(item) => setUser(item.user)}
                    field="user"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="inline mr-1" size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <MapPin className="inline mr-1" size={16} />
                  Location
                </label>
                <Autocomplete
                  value={location}
                  onChange={setLocation}
                  suggestions={allLocations}
                  placeholder="Enter location"
                  onSelect={(item) => setLocation(item.location)}
                  field="location"
                />
              </div>
            </div>

            {/* Chemical Usage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <FlaskConical className="mr-2" size={20} />
                  Chemical Usage
                </h3>
                <button
                  type="button"
                  onClick={addChemicalUsage}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add Chemical
                </button>
              </div>
              {selectedChemicals.map((chemUsage, index) => (
                <div key={index} className="flex items-end gap-4 mb-4 p-3 bg-white rounded border">
                  <div className="flex-1">
                    <label className="form-label">Chemical</label>
                    <select
                      className="form-select"
                      value={chemUsage.chemicalId}
                      onChange={(e) => updateChemicalUsage(index, 'chemicalId', e.target.value)}
                      required
                    >
                      <option value="">Select chemical</option>
                      {chemicals.filter(c => c.currentQuantity > 0).map(chem => (
                        <option key={chem.id} value={chem.id}>
                          {chem.name} - {chem.batchNumber} ({chem.currentQuantity} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={chemUsage.chemicalId ? chemicals.find(c => c.id.toString() === chemUsage.chemicalId)?.currentQuantity : undefined}
                      className="form-input"
                      value={chemUsage.quantity}
                      onChange={(e) => updateChemicalUsage(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChemicalUsage(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Equipment Usage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <Microscope className="mr-2" size={20} />
                  Equipment Usage
                </h3>
                <button
                  type="button"
                  onClick={addEquipmentUsage}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add Equipment
                </button>
              </div>
              {selectedEquipment.map((eqUsage, index) => (
                <div key={index} className="p-3 bg-white rounded border mb-4">
                  <div className="flex items-end gap-4 mb-3">
                    <div className="flex-1">
                      <label className="form-label">Equipment</label>
                      <select
                        className="form-select"
                        value={eqUsage.equipmentId}
                        onChange={(e) => updateEquipmentUsage(index, 'equipmentId', e.target.value)}
                        required
                      >
                        <option value="">Select equipment</option>
                        {equipment.map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} - {eq.serialId} ({eq.status})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-40">
                      <label className="form-label">Action</label>
                      <select
                        className="form-select"
                        value={eqUsage.action}
                        onChange={(e) => updateEquipmentUsage(index, 'action', e.target.value)}
                        required
                      >
                        <option value="used">Used</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="cleaned">Cleaned</option>
                        <option value="calibrated">Calibrated</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEquipmentUsage(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Equipment Notes</label>
                    <input
                      type="text"
                      className="form-input"
                      value={eqUsage.notes}
                      onChange={(e) => updateEquipmentUsage(index, 'notes', e.target.value)}
                      placeholder="Optional notes for this equipment..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* General Notes */}
            <div className="form-group">
              <label className="form-label">General Notes</label>
              <textarea
                className="form-input"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="General notes about this usage session..."
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="form-button"
                disabled={!user || (selectedChemicals.length === 0 && selectedEquipment.length === 0)}
              >
                Log Usage
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">My Usage Logs</h3>
          {getUserLogs().length === 0 ? (
            <p className="text-gray-500 text-center py-8">No usage logs found</p>
          ) : (
            getUserLogs().map((log) => (
              <div key={log.id} className="bg-white border rounded-lg p-4">
                {editingLog === log.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{log.itemName}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(log)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {log.type === 'chemical' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Quantity</label>
                          <input
                            type="number"
                            className="form-input"
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Action</label>
                        <select
                          className="form-select"
                          value={editForm.action}
                          onChange={(e) => setEditForm({...editForm, action: e.target.value})}
                        >
                          <option value="Used">Used</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Cleaned">Cleaned</option>
                          <option value="Calibrated">Calibrated</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-input"
                        rows="2"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        {log.type === 'chemical' ? 
                          <FlaskConical className="mr-2" size={16} /> : 
                          <Microscope className="mr-2" size={16} />
                        }
                        {log.itemName}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(log)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteLog(log)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Date:</strong> {log.date}</p>
                      {log.type === 'chemical' ? (
                        <>
                          <p><strong>Quantity:</strong> {log.quantity}</p>
                          <p><strong>Location:</strong> {log.location}</p>
                        </>
                      ) : (
                        <p><strong>Action:</strong> {log.action}</p>
                      )}
                      {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LogChemicalUsage;