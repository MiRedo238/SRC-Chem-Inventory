// src/components/DetailView.jsx
import React, { useState } from 'react';
import { ChevronLeft, Edit, Trash2, User, MapPin, Clock, Microscope } from 'lucide-react';
import { safetyColors, statusColors, ghsSymbols } from '../utils/data';
import { formatDate } from '../utils/helpers';

const DetailView = ({ 
  selectedItem, 
  setCurrentView, 
  userRole, 
  chemicals, 
  equipment, 
  updateChemicals, 
  updateEquipment,
  addAuditLog 
}) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(selectedItem);
  
  const isAdmin = userRole === 'admin';
  
  if (!selectedItem) return null;

  const handleSave = () => {
    if (selectedItem.type === 'chemical') {
      const updatedChemicals = chemicals.map(chem => 
        chem.id === selectedItem.id ? editForm : chem
      );
      updateChemicals(updatedChemicals);
      addAuditLog('chemical', 'update', editForm.name, userRole);
    } else {
      const updatedEquipment = equipment.map(eq => 
        eq.id === selectedItem.id ? editForm : eq
      );
      updateEquipment(updatedEquipment);
      addAuditLog('equipment', 'update', editForm.name, userRole);
    }
    
    setEditing(false);
    setSelectedItem(editForm);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${selectedItem.type}?`)) {
      if (selectedItem.type === 'chemical') {
        const updatedChemicals = chemicals.filter(chem => chem.id !== selectedItem.id);
        updateChemicals(updatedChemicals);
        addAuditLog('chemical', 'delete', selectedItem.name, userRole);
      } else {
        const updatedEquipment = equipment.filter(eq => eq.id !== selectedItem.id);
        updateEquipment(updatedEquipment);
        addAuditLog('equipment', 'delete', selectedItem.name, userRole);
      }
      
      setCurrentView(selectedItem.type === 'chemical' ? 'chemicals' : 'equipment');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  if (selectedItem.type === 'chemical') {
    const chemical = editing ? editForm : selectedItem;
    
    return (
      <div>
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('chemicals')}
            className="back-button"
          >
            <ChevronLeft className="back-icon" />
          </button>
          <h1 className="detail-title">Chemical Details</h1>
          {isAdmin && (
            <div className="ml-auto flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="form-button bg-gray-500">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="form-button">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="view-button">
                    <Edit className="view-icon" />
                  </button>
                  <button onClick={handleDelete} className="view-button text-red-500">
                    <Trash2 className="view-icon" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="detail-container">
          <div className="detail-grid">
            <div>
              <h2 className="detail-section-title">{chemical.name}</h2>
              <div className="detail-properties">
                <div className="detail-property">
                  <span className="property-label">Batch Number:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="batchNumber"
                      value={chemical.batchNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.batchNumber}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Brand:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="brand"
                      value={chemical.brand}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.brand}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Volume:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="volume"
                      value={chemical.volume}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.volume}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Initial Quantity:</span>
                  {editing ? (
                    <input
                      type="number"
                      name="initialQuantity"
                      value={chemical.initialQuantity}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.initialQuantity}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Current Quantity:</span>
                  {editing ? (
                    <input
                      type="number"
                      name="currentQuantity"
                      value={chemical.currentQuantity}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.currentQuantity}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Expiration Date:</span>
                  {editing ? (
                    <input
                      type="date"
                      name="expirationDate"
                      value={chemical.expirationDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{formatDate(chemical.expirationDate)}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Date of Arrival:</span>
                  {editing ? (
                    <input
                      type="date"
                      name="dateOfArrival"
                      value={chemical.dateOfArrival}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{formatDate(chemical.dateOfArrival)}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Safety Class:</span>
                  {editing ? (
                    <select
                      name="safetyClass"
                      value={chemical.safetyClass}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="safe">Safe</option>
                      <option value="toxic">Toxic</option>
                      <option value="corrosive">Corrosive</option>
                      <option value="reactive">Reactive</option>
                      <option value="flammable">Flammable</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${safetyColors[chemical.safetyClass]}`}>
                      {chemical.safetyClass}
                    </span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Location:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={chemical.location}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{chemical.location}</span>
                  )}
                </div>
                
                {!editing && chemical.ghsSymbols && chemical.ghsSymbols.length > 0 && (
                  <div className="detail-property">
                    <span className="property-label">GHS Symbols:</span>
                    <div className="ghs-symbols">
                      {chemical.ghsSymbols && chemical.ghsSymbols.map(symbol => (
                        <img 
                          key={symbol} 
                          src={ghsSymbols[symbol]} 
                          alt={symbol}
                          title={symbol}
                          className="ghs-symbol-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="detail-section-title">Usage Log</h3>
              <div className="log-container">
                {chemical.usageLog.map((log, index) => (
                  <div key={index} className="log-item">
                    <div className="log-header">
                      <div>
                        <p className="log-user">{log.user}</p>
                        <p className="log-location">
                          <MapPin size={12} className="inline mr-1" />
                          {log.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="log-quantity">{log.quantity} units</p>
                        <p className="log-date">
                          <Clock size={12} className="inline mr-1" />
                          {formatDate(log.date)}
                        </p>
                      </div>
                    </div>
                    {log.opened && <span className="log-tag">Opened</span>}
                  </div>
                ))}
                {chemical.usageLog.length === 0 && (
                  <p className="no-data">No usage recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const equipmentItem = editing ? editForm : selectedItem;
    
    return (
      <div>
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('equipment')}
            className="back-button"
          >
            <ChevronLeft className="back-icon" />
          </button>
          <h1 className="detail-title">Equipment Details</h1>
          {isAdmin && (
            <div className="ml-auto flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="form-button bg-gray-500">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="form-button">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="view-button">
                    <Edit className="view-icon" />
                  </button>
                  <button onClick={handleDelete} className="view-button text-red-500">
                    <Trash2 className="view-icon" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="detail-container">
          <div className="detail-grid">
            <div>
              <h2 className="detail-section-title">{equipmentItem.name}</h2>
              <div className="detail-properties">
                <div className="detail-property">
                  <span className="property-label">Model Number:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="model"
                      value={equipmentItem.model}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{equipmentItem.model}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Serial ID:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="serialId"
                      value={equipmentItem.serialId}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{equipmentItem.serialId}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Status:</span>
                  {editing ? (
                    <select
                      name="status"
                      value={equipmentItem.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Broken">Broken</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${statusColors[equipmentItem.status]}`}>
                      {equipmentItem.status}
                    </span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Location:</span>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={equipmentItem.location}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{equipmentItem.location}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Purchase Date:</span>
                  {editing ? (
                    <input
                      type="date"
                      name="purchaseDate"
                      value={equipmentItem.purchaseDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{formatDate(equipmentItem.purchaseDate)}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Warranty Expiration:</span>
                  {editing ? (
                    <input
                      type="date"
                      name="warrantyExpiration"
                      value={equipmentItem.warrantyExpiration}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="property-value">{formatDate(equipmentItem.warrantyExpiration)}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Condition:</span>
                  {editing ? (
                    <select
                      name="condition"
                      value={equipmentItem.condition}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Good">Good</option>
                      <option value="Needs Repair">Needs Repair</option>
                      <option value="Broken">Broken</option>
                    </select>
                  ) : (
                    <span className="property-value">{equipmentItem.condition}</span>
                  )}
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Last Maintenance:</span>
                  <span className="property-value">{formatDate(equipmentItem.lastMaintenance)}</span>
                </div>
                
                <div className="detail-property">
                  <span className="property-label">Next Maintenance:</span>
                  <span className="property-value">{formatDate(equipmentItem.nextMaintenance)}</span>
                </div>
                
              </div>
            </div>

            <div>
              <h3 className="detail-section-title">Maintenance Log</h3>
              <div className="log-container">
                {equipmentItem.maintenanceLog.map((log, index) => (
                  <div key={index} className="log-item">
                    <div className="log-header">
                      <div>
                        <p className="log-user">{log.action}</p>
                        <p className="log-location">{log.user}</p>
                      </div>
                      <p className="log-date">{formatDate(log.date)}</p>
                    </div>
                    {log.notes && <p className="text-xs text-gray-500 mt-1">{log.notes}</p>}
                  </div>
                ))}
                {equipmentItem.maintenanceLog.length === 0 && (
                  <p className="no-data">No maintenance recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DetailView;