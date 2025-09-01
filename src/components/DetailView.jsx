import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { safetyColors, statusColors } from '../App';

const DetailView = ({ selectedItem, setCurrentView }) => {
  if (!selectedItem) return null;

  if (selectedItem.type === 'chemical') {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('chemicals')}
            className="back-button"
          >
            <ChevronLeft className="icon-sm" />
          </button>
          <h1 className="detail-title">Chemical Details</h1>
        </div>

        <div className="detail-content">
          <div className="detail-grid">
            <div>
              <h2 className="detail-item-title">{selectedItem.name}</h2>
              <div className="detail-properties">
                <div className="property">
                  <span className="property-label">Batch Number:</span>
                  <span className="property-value">{selectedItem.batchNumber}</span>
                </div>
                <div className="property">
                  <span className="property-label">Brand:</span>
                  <span className="property-value">{selectedItem.brand}</span>
                </div>
                <div className="property">
                  <span className="property-label">Volume:</span>
                  <span className="property-value">{selectedItem.volume}</span>
                </div>
                <div className="property">
                  <span className="property-label">Initial Quantity:</span>
                  <span className="property-value">{selectedItem.initialQuantity}</span>
                </div>
                <div className="property">
                  <span className="property-label">Current Quantity:</span>
                  <span className="property-value">{selectedItem.currentQuantity}</span>
                </div>
                <div className="property">
                  <span className="property-label">Expiration Date:</span>
                  <span className="property-value">{selectedItem.expirationDate}</span>
                </div>
                <div className="property">
                  <span className="property-label">Date of Arrival:</span>
                  <span className="property-value">{selectedItem.dateOfArrival}</span>
                </div>
                <div className="property">
                  <span className="property-label">Safety Class:</span>
                  <span className={`safety-tag ${safetyColors[selectedItem.safetyClass]}`}>
                    {selectedItem.safetyClass}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="detail-section-title">Usage Log</h3>
              <div className="log-container">
                {selectedItem.usageLog.map((log, index) => (
                  <div key={index} className="log-item">
                    <div className="log-header">
                      <div>
                        <p className="log-user">{log.user}</p>
                        <p className="log-location">{log.location}</p>
                      </div>
                      <div className="log-meta">
                        <p className="log-quantity">{log.quantity} units</p>
                        <p className="log-date">{log.date}</p>
                      </div>
                    </div>
                    {log.opened && <span className="log-tag">Opened</span>}
                  </div>
                ))}
                {selectedItem.usageLog.length === 0 && (
                  <p className="empty-log">No usage recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <button 
            onClick={() => setCurrentView('equipment')}
            className="back-button"
          >
            <ChevronLeft className="icon-sm" />
          </button>
          <h1 className="detail-title">Equipment Details</h1>
        </div>

        <div className="detail-content">
          <div className="detail-grid">
            <div>
              <h2 className="detail-item-title">{selectedItem.name}</h2>
              <div className="detail-properties">
                <div className="property">
                  <span className="property-label">Model Number:</span>
                  <span className="property-value">{selectedItem.model}</span>
                </div>
                <div className="property">
                  <span className="property-label">Serial ID:</span>
                  <span className="property-value">{selectedItem.serialId}</span>
                </div>
                <div className="property">
                  <span className="property-label">Status:</span>
                  <span className={`status-tag ${statusColors[selectedItem.status]}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="property">
                  <span className="property-label">Location:</span>
                  <span className="property-value">{selectedItem.location}</span>
                </div>
                <div className="property">
                  <span className="property-label">Purchase Date:</span>
                  <span className="property-value">{selectedItem.purchaseDate}</span>
                </div>
                <div className="property">
                  <span className="property-label">Warranty Expiration:</span>
                  <span className="property-value">{selectedItem.warrantyExpiration}</span>
                </div>
                <div className="property">
                  <span className="property-label">Condition:</span>
                  <span className="property-value">{selectedItem.condition}</span>
                </div>
                {selectedItem.assignedUser && (
                  <div className="property">
                    <span className="property-label">Assigned User:</span>
                    <span className="property-value">{selectedItem.assignedUser}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="detail-section-title">Maintenance Log</h3>
              <div className="log-container">
                {selectedItem.maintenanceLog.map((log, index) => (
                  <div key={index} className="log-item">
                    <div className="log-header">
                      <div>
                        <p className="log-user">{log.action}</p>
                        <p className="log-location">{log.user}</p>
                      </div>
                      <p className="log-date">{log.date}</p>
                    </div>
                    {log.notes && <p className="log-notes">{log.notes}</p>}
                  </div>
                ))}
                {selectedItem.maintenanceLog.length === 0 && (
                  <p className="empty-log">No maintenance recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DetailView;