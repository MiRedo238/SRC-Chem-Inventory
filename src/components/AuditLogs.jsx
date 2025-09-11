// src/components/AuditLogs.jsx
import React from 'react';
import { ChevronLeft, FileText, User, Clock, FlaskConical, Microscope } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const AuditLogs = ({ auditLogs, setCurrentView, userRole }) => {
  const getActionIcon = (type) => {
    switch (type) {
      case 'chemical': return <FlaskConical size={16} className="mr-1" />;
      case 'equipment': return <Microscope size={16} className="mr-1" />;
      default: return <FileText size={16} className="mr-1" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'add': return 'text-green-600';
      case 'update': return 'text-blue-600';
      case 'delete': return 'text-red-600';
      case 'usage': return 'text-purple-600';
      case 'checkout': return 'text-orange-600';
      case 'checkin': return 'text-green-600';
      case 'import': return 'text-indigo-600';
      case 'export': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="detail-header">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="back-button"
        >
          <ChevronLeft className="back-icon" />
        </button>
        <h1 className="detail-title">
          <FileText className="inline mr-2" />
          Audit Logs
        </h1>
      </div>

      <div className="audit-log-container">
        {auditLogs.length > 0 ? (
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="audit-log-item">
                <div className="audit-log-header">
                  <div className="flex items-center">
                    {getActionIcon(log.type)}
                    <span className={`audit-log-action ${getActionColor(log.action)}`}>
                      {log.action} {log.type}
                    </span>
                    <span className="ml-2 font-medium">{log.itemName}</span>
                  </div>
                  <div className="audit-log-timestamp">
                    <Clock size={14} className="inline mr-1" />
                    {formatDate(log.timestamp)}
                  </div>
                </div>
                <div className="audit-log-details">
                  <User size={14} className="inline mr-1" />
                  {log.user} • {log.details.location && `Location: ${log.details.location}`}
                  {log.details.quantity && ` • Quantity: ${log.details.quantity}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No audit logs available</p>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;