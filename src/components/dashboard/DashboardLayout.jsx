import React from 'react';
import Sidebar from './Sidebar'; 

function DashboardLayout({ children, userName, userInitials }) {
  return (
    <div className="dashboard-layout">
      <Sidebar userName={userName} userInitials={userInitials} />
      
      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

