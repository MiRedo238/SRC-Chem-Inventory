import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const AddChemical = ({ chemicals, setChemicals, setCurrentView }) => {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    brand: '',
    volume: '',
    quantity: '',
    expirationDate: '',
    dateOfArrival: '',
    safetyClass: 'safe',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newChemical = {
      id: chemicals.length + 1,
      ...formData,
      initialQuantity: parseInt(formData.quantity),
      currentQuantity: parseInt(formData.quantity),
      usageLog: []
    };
    setChemicals([...chemicals, newChemical]);
    setCurrentView('chemicals');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          onClick={() => setCurrentView('chemicals')}
          className="back-button"
        >
          <ChevronLeft className="icon-sm" />
        </button>
        <h1 className="form-title">Add Chemical</h1>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="chemical-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
            <input
              type="text"
              required
              className="form-input"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                required
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

          <div className="form-row">
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
            <label className="form-label">Location</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button blue"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChemical;