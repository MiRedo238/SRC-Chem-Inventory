// src/components/EquipmentList.jsx
import React, { useState } from 'react';
import { Search, Plus, Eye, Download, Upload } from 'lucide-react';
import { statusColors } from '../utils/data';
import { filterEquipment, sortItems, exportToCSV, importFromCSV } from '../utils/helpers';
import AddEquipment from './AddEquipment';
import Modal from './Modal';


const EquipmentList = ({ equipment, setSelectedItem, setCurrentView, userRole, updateEquipment, addAuditLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = userRole === 'admin';

  // Filter and sort equipment
  const filteredEquipment = filterEquipment(equipment, searchTerm, statusFilter);
  const sortedEquipment = sortItems(filteredEquipment, sortField, sortDirection);

  // Handle search with autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      const suggestions = equipment.filter(eq => 
        eq.name.toLowerCase().includes(value.toLowerCase()) ||
        eq.serialId.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setAutocompleteSuggestions(suggestions);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  // Select from autocomplete
  const selectAutocomplete = (item) => {
    setSearchTerm(item.name);
    setAutocompleteSuggestions([]);
    setShowAutocomplete(false);
  };

  // Handle export
  const handleExport = () => {
    exportToCSV(equipment, 'equipment_inventory');
    addAuditLog('equipment', 'export', 'All Equipment', userRole);
  };

  // Handle import
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importFromCSV(file, (importedData) => {
        // Map imported data to equipment format
        const today = new Date().toISOString().split('T')[0];
        const newEquipment = importedData.map(item => {
          const nextMaintenance = new Date();
          nextMaintenance.setMonth(nextMaintenance.getMonth() + 6);
          
          return {
            id: equipment.length + 1,
            name: item.name || '',
            model: item.model || '',
            serialId: item.serialId || '',
            status: item.status || 'Available',
            location: item.location || '',
            purchaseDate: item.purchaseDate || today,
            warrantyExpiration: item.warrantyExpiration || '',
            condition: item.condition || 'Good',
            lastMaintenance: today,
            nextMaintenance: nextMaintenance.toISOString().split('T')[0],
            maintenanceLog: []
          };
        });
        
        updateEquipment([...equipment, ...newEquipment]);
        addAuditLog('equipment', 'import', `${newEquipment.length} items`, userRole);
      });
    }
  };

    // Handle adding new equipment
    const handleAddEquipment = (newEquipment) => {
      updateEquipment([...equipment, newEquipment]);
      addAuditLog('equipment', 'add', newEquipment.name, userRole);
      setShowAddModal(false);
    };

  return (
    <div>
      <div className="list-header">
        <h1 className="list-title">Equipment</h1>
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="add-button"
          >
            <Plus className="add-button-icon" />
            Add Equipment
          </button>
        )}
      </div>
      {/* Add Equipment Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Equipment"
      >
        <AddEquipment 
          setCurrentView={setCurrentView}
          equipment={equipment}
          updateEquipment={handleAddEquipment}
          addAuditLog={addAuditLog}
          userRole={userRole}
          isModal={true}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>

      <div className="list-container">
        <div className="search-filter">
          <div className="autocomplete-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search equipment..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.length > 2 && setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              />
            </div>
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {autocompleteSuggestions.map(eq => (
                  <div 
                    key={eq.id} 
                    className="autocomplete-item"
                    onClick={() => selectAutocomplete(eq)}
                  >
                    {eq.name} - {eq.serialId}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Broken">Broken</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          
          <select 
            className="filter-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="nextMaintenance">Maintenance Due</option>
            <option value="location">Location</option>
            <option value="status">Status</option>
          </select>
          
          <button 
            className="filter-select"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          
          <div className="import-export">
            <label htmlFor="import-equipment" className="import-button">
              <Upload className="import-export-icon" />
              <input
                id="import-equipment"
                type="file"
                accept=".csv"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <button className="export-button" onClick={handleExport}>
              <Download className="import-export-icon" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sortedEquipment.map(eq => (
            <div key={eq.id} className="list-item">
              <div className="item-details">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="item-name">{eq.name}</h3>
                    <p className="item-meta">{eq.serialId} • {eq.model}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status-badge ${statusColors[eq.status]}`}>
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
                <Eye className="view-icon" />
              </button>
            </div>
          ))}
          
          {sortedEquipment.length === 0 && (
            <p className="no-data">No equipment found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;