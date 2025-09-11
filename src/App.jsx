// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChemicalsList from './components/ChemicalsList';
import EquipmentList from './components/EquipmentList';
import AddChemical from './components/AddChemical';
import AddEquipment from './components/AddEquipment';
import DetailView from './components/DetailView';
import Login from './components/Login';
import AuditLogs from './components/AuditLogs';
import LogChemicalUsage from './components/LogChemicalUsage';
import ChemicalOuts from './components/ChemicalOuts';
import { initialChemicals, initialEquipment, users } from './utils/data';
import { addAuditLog } from './utils/helpers';
import './styles/global.css';
import './styles/components.css';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [chemicals, setChemicals] = useState(initialChemicals);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setCurrentView('login');
  };

  const updateChemicals = (updatedChemicals) => {
    setChemicals(updatedChemicals);
  };

  const updateEquipment = (updatedEquipment) => {
    setEquipment(updatedEquipment);
  };

  const addNewAuditLog = (log) => {
    setAuditLogs([log, ...auditLogs]);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} users={users} />;
      case 'dashboard':
        return <Dashboard 
          chemicals={chemicals} 
          equipment={equipment} 
          setCurrentView={setCurrentView}
          userRole={userRole}
          updateChemicals={updateChemicals}
          updateEquipment={updateEquipment}
          addAuditLog={addNewAuditLog}
        />;
      case 'chemicals':
        return <ChemicalsList 
          chemicals={chemicals} 
          setSelectedItem={setSelectedItem}
          setCurrentView={setCurrentView}
          userRole={userRole}
          updateChemicals={updateChemicals}
          addAuditLog={addNewAuditLog}
        />;
      case 'equipment':
        return <EquipmentList 
          equipment={equipment} 
          setSelectedItem={setSelectedItem}
          setCurrentView={setCurrentView}
          userRole={userRole}
          updateEquipment={updateEquipment}
          addAuditLog={addNewAuditLog}
        />;
      case 'detail':
        return <DetailView 
          selectedItem={selectedItem}
          setCurrentView={setCurrentView}
          userRole={userRole}
          chemicals={chemicals}
          equipment={equipment}
          updateChemicals={updateChemicals}
          updateEquipment={updateEquipment}
          addAuditLog={addNewAuditLog}
        />;
      case 'audit-logs':
        return <AuditLogs 
          auditLogs={auditLogs}
          setCurrentView={setCurrentView}
          userRole={userRole}
        />;
      case 'log-usage':
        return <LogChemicalUsage 
          chemicals={chemicals}
          equipment={equipment}
          setCurrentView={setCurrentView}
          updateChemicals={updateChemicals}
          updateEquipment={updateEquipment}
          addAuditLog={addNewAuditLog}
          userRole={userRole}
          currentUser={currentUser}
        />;
      /* \/ -removed for now as it is not functional yet-
      case 'chemical-outs':
        return <ChemicalOuts 
          chemicals={chemicals}
          setCurrentView={setCurrentView}
          userRole={userRole}
        />;*/
      default:
        return <Dashboard 
          chemicals={chemicals} 
          equipment={equipment} 
          setCurrentView={setCurrentView}
          userRole={userRole}
          updateChemicals={updateChemicals}
          updateEquipment={updateEquipment}
          addAuditLog={addNewAuditLog}
        />;
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="app">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        setCurrentView={setCurrentView} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div className="main-container">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={(view) => {
            setCurrentView(view);
            setSidebarOpen(false); // auto-close on selection
          }} 
          userRole={userRole} 
          className={sidebarOpen ? "sidebar open" : "sidebar"} 
        />
        <div className="content">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default App;