import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChemicalsList from './components/ChemicalsList';
import EquipmentList from './components/EquipmentList';
import DetailView from './components/DetailView';
import AddChemical from './components/AddChemical';
import AddEquipment from './components/AddEquipment';

// Mock data for chemicals
const initialChemicals = [
  {
    id: 1,
    name: 'Hydrochloric Acid',
    batchNumber: 'A424112301',
    brand: 'LabChemie',
    volume: '500g',
    initialQuantity: 50,
    currentQuantity: 35,
    expirationDate: '2024-12-31',
    dateOfArrival: '2024-01-15',
    safetyClass: 'corrosive',
    location: 'Lab A1',
    usageLog: [
      { date: '2024-08-15', user: 'Dr. Smith', location: 'Lab A1', quantity: 5, opened: true },
      { date: '2024-08-20', user: 'Dr. Johnson', location: 'Lab A1', quantity: 10, opened: false }
    ]
  },
  {
    id: 2,
    name: 'Ethanol',
    batchNumber: 'A424112302',
    brand: 'ChemPure',
    volume: '1L',
    initialQuantity: 100,
    currentQuantity: 80,
    expirationDate: '2025-06-30',
    dateOfArrival: '2024-02-01',
    safetyClass: 'flammable',
    location: 'Lab B2',
    usageLog: []
  },
  {
    id: 3,
    name: 'Sodium Hydroxide',
    batchNumber: 'A424112303',
    brand: 'LabChemie',
    volume: '250g',
    initialQuantity: 25,
    currentQuantity: 5,
    expirationDate: '2024-10-15',
    dateOfArrival: '2024-03-10',
    safetyClass: 'toxic',
    location: 'Lab C3',
    usageLog: []
  }
];

// Mock data for equipment
const initialEquipment = [
  {
    id: 1,
    name: 'Centrifuge',
    model: 'CF-2000',
    serialId: 'CF2000-001',
    status: 'Available',
    location: 'Lab A1',
    purchaseDate: '2023-01-15',
    warrantyExpiration: '2026-01-15',
    condition: 'Good',
    lastMaintenance: '2024-07-15',
    nextMaintenance: '2024-10-15',
    assignedUser: null,
    maintenanceLog: []
  },
  {
    id: 2,
    name: 'Microscope',
    model: 'MX-500',
    serialId: 'MX500-002',
    status: 'In Use',
    location: 'Lab B2',
    purchaseDate: '2023-03-20',
    warrantyExpiration: '2025-03-20',
    condition: 'Good',
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-12-10',
    assignedUser: 'Dr. Smith',
    maintenanceLog: []
  }
];

// Safety class color mapping
export const safetyColors = {
  safe: 'safety-safe',
  toxic: 'safety-toxic',
  corrosive: 'safety-corrosive',
  reactive: 'safety-reactive',
  flammable: 'safety-flammable'
};

// Status color mapping for equipment
export const statusColors = {
  'Available': 'status-available',
  'In Use': 'status-in-use',
  'Broken': 'status-broken',
  'Under Maintenance': 'status-under-maintenance'
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [chemicals, setChemicals] = useState(initialChemicals);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userRole] = useState('admin'); // admin or user

  // Main render function
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          chemicals={chemicals} 
          equipment={equipment} 
          setCurrentView={setCurrentView} 
        />;
      case 'chemicals':
        return <ChemicalsList 
          chemicals={chemicals} 
          setCurrentView={setCurrentView} 
          setSelectedItem={setSelectedItem} 
        />;
      case 'equipment':
        return <EquipmentList 
          equipment={equipment} 
          setCurrentView={setCurrentView} 
          setSelectedItem={setSelectedItem} 
        />;
      case 'add-chemical':
        return <AddChemical 
          chemicals={chemicals} 
          setChemicals={setChemicals} 
          setCurrentView={setCurrentView} 
        />;
      case 'add-equipment':
        return <AddEquipment 
          equipment={equipment} 
          setEquipment={setEquipment} 
          setCurrentView={setCurrentView} 
        />;
      case 'detail':
        return <DetailView 
          selectedItem={selectedItem} 
          setCurrentView={setCurrentView} 
        />;
      default:
        return <Dashboard 
          chemicals={chemicals} 
          equipment={equipment} 
          setCurrentView={setCurrentView} 
        />;
    }
  };

  return (
    <div className="app-container">
      <Header setCurrentView={setCurrentView} />
      <div className="main-content">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="content-area">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default App;