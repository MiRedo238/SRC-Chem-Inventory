// src/components/ChemicalsList.jsx (corrected)
import React, { useState } from 'react';
import { Search, Plus, Eye, Download, Upload } from 'lucide-react';
import { safetyColors, ghsSymbols } from '../utils/data';
import { filterChemicals, sortItems, exportToCSV, importFromCSV } from '../utils/helpers';
import AddChemical from './AddChemical';
import Modal from './Modal';

const ChemicalsList = ({ chemicals, setSelectedItem, setCurrentView, userRole, updateChemicals, addAuditLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = userRole === 'admin';

  // Filter and sort chemicals
  const filteredChemicals = filterChemicals(chemicals, searchTerm, filterClass);
  const sortedChemicals = sortItems(filteredChemicals, sortField, sortDirection);

  // Handle search with autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      const suggestions = chemicals.filter(chem => 
        (chem.name || '').toLowerCase().includes(value.toLowerCase()) ||
        (chem.batchNumber || '').toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setAutocompleteSuggestions(suggestions);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  // Select from autocomplete
  const selectAutocomplete = (chemical) => {
    setSearchTerm(chemical.name);
    setAutocompleteSuggestions([]);
    setShowAutocomplete(false);
  };

  // Handle export
  const handleExport = () => {
    exportToCSV(chemicals, 'chemicals_inventory');
    addAuditLog('chemical', 'export', 'All Chemicals', userRole);
  };

  // Handle import
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importFromCSV(file, (importedData) => {
        // Map imported data to chemical format
        const newChemicals = importedData.map(item => ({
          id: chemicals.length + 1,
          name: item.name || '',
          batchNumber: item.batchNumber || '',
          brand: item.brand || '',
          volume: item.volume || '',
          initialQuantity: parseInt(item.initialQuantity) || 0,
          currentQuantity: parseInt(item.currentQuantity) || 0,
          expirationDate: item.expirationDate || '',
          dateOfArrival: item.dateOfArrival || '',
          safetyClass: item.safetyClass || 'safe',
          location: item.location || '',
          ghsSymbols: item.ghsSymbols ? item.ghsSymbols.split(',') : [],
          usageLog: []
        }));
        
        updateChemicals([...chemicals, ...newChemicals]);
        addAuditLog('chemical', 'import', `${newChemicals.length} items`, userRole);
      });
    }
  };

  // Handle adding a new chemical
  const handleAddChemical = (newChemical) => {
    updateChemicals([...chemicals, newChemical]);
    addAuditLog('chemical', 'add', newChemical.name, userRole);
    setShowAddModal(false);
  };

  return (
    <>
      <div className="list-header">
        <h1 className="list-title">Chemicals</h1>
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="add-button"
          >
            <Plus className="add-button-icon" />
            Add Chemical
          </button>
        )}
      </div>
      
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Chemical"
      >
        <AddChemical 
          setCurrentView={setCurrentView}
          chemicals={chemicals}
          updateChemicals={handleAddChemical}
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
                placeholder="Search chemicals..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.length > 2 && setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              />
            </div>
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {autocompleteSuggestions.map(chem => (
                  <div 
                    key={chem.id} 
                    className="autocomplete-item"
                    onClick={() => selectAutocomplete(chem)}
                  >
                    {chem.name} - {chem.batchNumber}
                  </div>
                ))}
              </div>
            )}
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
          
          <select 
            className="filter-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="expirationDate">Expiration Date</option>
            <option value="currentQuantity">Quantity</option>
            <option value="location">Location</option>
          </select>
          
          <button 
            className="filter-select"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          
          <div className="import-export">
            <label htmlFor="import-chemicals" className="import-button">
              <Upload className="import-export-icon" />
              <input
                id="import-chemicals"
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
          {sortedChemicals.map(chemical => (
            <div key={chemical.id} className="list-item">
              <div className={`safety-indicator ${safetyColors[chemical.safetyClass]}`}></div>
              <div className="item-details">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="item-name">{chemical.name}</h3>
                    <p className="item-meta">{chemical.batchNumber} • {chemical.brand}</p>
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
                  <div className="text-right">
                    <p className="item-meta">EXP: {chemical.expirationDate}</p>
                    <p className="item-meta">
                      Qty: {chemical.currentQuantity}/{chemical.initialQuantity}
                    </p>
                    <p className="item-meta">{chemical.location}</p>
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
                <Eye className="view-icon" />
              </button>
            </div>
          ))}
          
          {sortedChemicals.length === 0 && (
            <p className="no-data">No chemicals found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChemicalsList;