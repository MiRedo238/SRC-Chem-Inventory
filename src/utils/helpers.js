// src/utils/helpers.js (updated)
// Format date for display
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days until expiration
export const daysUntilExpiration = (expirationDate) => {
  const expDate = new Date(expirationDate);
  const today = new Date();
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Add audit log
export const addAuditLog = (type, action, itemName, user, details = {}) => {
  const timestamp = new Date().toISOString();
  return {
    id: Date.now(),
    type,
    action,
    itemName,
    user,
    timestamp,
    details
  };
};

// Export data to CSV
export const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(','));
  const csv = [headers, ...rows].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import data from CSV
export const importFromCSV = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i] ? values[i].trim() : '';
      });
      return obj;
    });
    
    callback(data);
  };
  reader.readAsText(file);
};

// Filter chemicals by search term (FIXED)
export const filterChemicals = (chemicals, searchTerm, filterClass) => {
  return chemicals.filter(chem => {
    // Handle undefined or null values safely
    const name = chem.name || '';
    const batchNumber = chem.batchNumber || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClass === 'all' || chem.safetyClass === filterClass;
    return matchesSearch && matchesFilter;
  });
};

// Filter equipment by search term (FIXED)
export const filterEquipment = (equipment, searchTerm, statusFilter) => {
  return equipment.filter(eq => {
    // Handle undefined or null values safely
    const name = eq.name || '';
    const serialId = eq.serialId || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serialId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

// Sort items by field
export const sortItems = (items, field, direction = 'asc') => {
  return [...items].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // Handle undefined or null values
    if (valueA === null || valueA === undefined) valueA = '';
    if (valueB === null || valueB === undefined) valueB = '';
    
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};