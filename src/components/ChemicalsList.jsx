import React, { useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';

const ChemicalsList = ({ chemicals, setCurrentView, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const filteredChemicals = chemicals.filter(chem => {
    const matchesSearch = chem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chem.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClass === 'all' || chem.safetyClass === filterClass;
    return matchesSearch && matchesFilter;
  });

  const getSafetyIndicator = (safetyClass) => {
    const colors = {
      safe: 'safety-indicator-safe',
      toxic: 'safety-indicator-toxic', 
      corrosive: 'safety-indicator-corrosive',
      reactive: 'safety-indicator-reactive',
      flammable: 'safety-indicator-flammable'
    };
    return colors[safetyClass] || 'safety-indicator-default';
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h1 className="list-title">Chemicals</h1>
        <button 
          onClick={() => setCurrentView('add-chemical')}
          className="add-button blue"
        >
          <Plus className="icon-sm" />
          Add Chemical
        </button>
      </div>

      <div className="list-content">
        <div className="list-filters">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search chemicals..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            <option value="safe">Safe</option>
            <option value="toxic">Toxic</option>
            <option value="corrosive">Corrosive</option>
            <option value="reactive">Reactive</option>
            <option value="flammable">Flammable</option>
          </select>
        </div>

        <div className="items-list">
          {filteredChemicals.map(chemical => (
            <div key={chemical.id} className="list-item">
              <div className={`safety-indicator ${getSafetyIndicator(chemical.safetyClass)}`}></div>
              <div className="item-details">
                <div className="item-header">
                  <div>
                    <h3 className="item-title">{chemical.name}</h3>
                    <p className="item-subtitle">{chemical.batchNumber}</p>
                  </div>
                  <div className="item-meta">
                    <p className="meta-label">EXP Date</p>
                    <p className="meta-value">{chemical.expirationDate}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedItem({...chemical, type: 'chemical'});
                  setCurrentView('detail');
                }}
                className="view-button"
              >
                <Eye className="icon-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChemicalsList;