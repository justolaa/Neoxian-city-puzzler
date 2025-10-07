// src/components/SidebarToggle.jsx
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import './SidebarToggle.css';

function SidebarToggle({ isExpanded, onClick }) {
  return (
    <div 
      className={`sidebar-toggle ${isExpanded ? 'expanded' : ''}`}
      onClick={onClick}
      title="Toggle Menu"
    >
      <FaChevronRight className="toggle-icon" />
    </div>
  );
}

export default SidebarToggle;