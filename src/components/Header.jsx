import React from 'react';
import { User } from 'lucide-react';

const Header = ({ setCurrentView }) => (
  <div className="header">
    <div className="header-left">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="header-title"
      >
        UIC Chemsphere
      </button>
    </div>
    <div className="header-user">
      <User className="icon-sm" />
      <span className="user-name">Admin User</span>
    </div>
  </div>
);

export default Header;