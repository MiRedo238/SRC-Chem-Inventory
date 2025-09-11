// src/components/AddChemical.jsx (updated for modal compatibility)
import React, { useState } from 'react';
import { ChevronLeft, FlaskConical } from 'lucide-react';
import Autocomplete from './Autocomplete';

const AddChemical = ({ setCurrentView, chemicals, updateChemicals, addAuditLog, userRole, isModal, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    brand: '',
    volume: '',
    quantity: '',
    expirationDate: '',
    dateOfArrival: '',
    safetyClass: 'safe',
    location: '',
    ghsSymbols: []
  });

  const ghsOptions = [
    { value: 'explosive', label: 'Explosive' },
    { value: 'flammable', label: 'Flammable' },
    { value: 'oxidizing', label: 'Oxidizing' },
    { value: 'corrosive', label: 'Corrosive' },
    { value: 'toxic', label: 'Toxic' },
    { value: 'harmful', label: 'Harmful' },
    { value: 'health-hazard', label: 'Health Hazard' },
    { value: 'environmental-hazard', label: 'Environmental Hazard' }
  ];

  // Get unique names, brands, and locations for autocomplete
  const chemicalNames = [...new Set(chemicals.map(c => c.name))].map(name => ({ name }));
  const chemicalBrands = [...new Set(chemicals.map(c => c.brand))].map(brand => ({ brand }));
  const chemicalLocations = [...new Set(chemicals.map(c => c.location))].map(location => ({ location }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newChemical = {
      id: Math.max(...chemicals.map(c => c.id), 0) + 1,
      name: formData.name,
      batchNumber: formData.batchNumber,
      brand: formData.brand,
      volume: formData.volume,
      initialQuantity: parseInt(formData.quantity),
      currentQuantity: parseInt(formData.quantity),
      expirationDate: formData.expirationDate,
      dateOfArrival: formData.dateOfArrival,
      safetyClass: formData.safetyClass,
      location: formData.location,
      ghsSymbols: formData.ghsSymbols,
      usageLog: []
    };

    updateChemicals(newChemical);
    addAuditLog('chemical', 'add', newChemical.name, userRole);
    
    if (isModal) {
      onClose();
    } else {
      setCurrentView('chemicals');
    }
  };

  const handleGhsChange = (symbol) => {
    setFormData(prev => ({
      ...prev,
      ghsSymbols: prev.ghsSymbols.includes(symbol)
        ? prev.ghsSymbols.filter(s => s !== symbol)
        : [...prev.ghsSymbols, symbol]
    }));
  };

  const handleAutocompleteSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {!isModal && (
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('chemicals')}
            className="back-button"
          >
            <ChevronLeft className="back-icon" />
          </button>
          <h1 className="detail-title">
            <FlaskConical className="inline mr-2" />
            Add Chemical
          </h1>
        </div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Name</label>
            <Autocomplete
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              suggestions={chemicalNames}
              placeholder="Enter chemical name"
              onSelect={(item) => handleAutocompleteSelect('name', item.name)}
              field="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Batch Number</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.batchNumber}
              onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <Autocomplete
              value={formData.brand}
              onChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
              suggestions={chemicalBrands}
              placeholder="Enter brand name"
              onSelect={(item) => handleAutocompleteSelect('brand', item.brand)}
              field="brand"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Volume</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.volume}
                onChange={(e) => setFormData({...formData, volume: e.target.value})}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date of Arrival</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.dateOfArrival}
                onChange={(e) => setFormData({...formData, dateOfArrival: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.expirationDate}
                onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Safety Class</label>
            <select
              className="form-select"
              value={formData.safetyClass}
              onChange={(e) => setFormData({...formData, safetyClass: e.target.value})}
            >
              <option value="safe">Safe</option>
              <option value="toxic">Toxic</option>
              <option value="corrosive">Corrosive</option>
              <option value="reactive">Reactive</option>
              <option value="flammable">Flammable</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">GHS Symbols</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {ghsOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ghsSymbols.includes(option.value)}
                    onChange={() => handleGhsChange(option.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <Autocomplete
              value={formData.location}
              onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              suggestions={chemicalLocations}
              placeholder="Enter location"
              onSelect={(item) => handleAutocompleteSelect('location', item.location)}
              field="location"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="form-button"
            >
              Add Chemical
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChemical;