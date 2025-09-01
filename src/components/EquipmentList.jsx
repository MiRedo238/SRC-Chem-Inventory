import React, { useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';

// Import the constants directly
const statusColors = {
  'Available': 'status-available',
  'In Use': 'status-in-use',
  'Broken': 'status-broken',
  'Under Maintenance': 'status-under-maintenance'
};

const EquipmentList = ({ equipment, setCurrentView, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="list-container">
      <div className="list-header">
        <h1 className="list-title">Equipment</h1>
        <button 
          onClick={() => setCurrentView('add-equipment')}
          className="add-button green"
        >
          <Plus className="icon-sm" />
          Add Equipment
        </button>
      </div>

      <div className="list-content">
        <div className="list-filters">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search equipment..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Broken">Broken</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        <div className="items-list">
          {filteredEquipment.map(eq => (
            <div key={eq.id} className="list-item">
              <div className="item-details">
                <div className="item-header">
                  <div>
                    <h3 className="item-title">{eq.name}</h3>
                    <p className="item-subtitle">{eq.serialId}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status-tag ${statusColors[eq.status]}`}>
                      {eq.status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedItem({...eq, type: 'equipment'});
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

export default EquipmentList;