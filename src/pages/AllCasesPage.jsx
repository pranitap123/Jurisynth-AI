import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  FaFolderOpen, FaPlus, FaSearch, 
  FaCheckCircle 
} from 'react-icons/fa';
import { MdOutlineSummarize } from 'react-icons/md';

// A longer list of mock cases for this page
const mockCaseList = [
  {
    id: '2025-081',
    name: 'ABC v. XYZ Corp',
    status: 'Ready',
    modified: '2 hours ago',
  },
  {
    id: '2025-079',
    name: 'Johnson Property Dispute',
    status: 'Processing',
    modified: '1 day ago',
  },
  {
    id: '2025-078',
    name: 'State v. Michaels',
    status: 'Ready',
    modified: '3 days ago',
  },
  {
    id: '2025-075',
    name: 'Patel v. Global Imports',
    status: 'Ready',
    modified: '1 week ago',
  },
  {
    id: '2025-072',
    name: 'Acme Holdings Bankruptcy',
    status: 'Ready',
    modified: '2 weeks ago',
  },
];

function AllCasesPage() {
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', initials: 'G' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('loggedInUserName');
    if (savedName) {
      const initials = savedName.split(' ').map(n => n[0]).join('').toUpperCase();
      setCurrentUser({ name: savedName, initials: initials });
    }
  }, []);

  // Filter cases based on search term
  const filteredCases = mockCaseList.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userName={currentUser.name} userInitials={currentUser.initials}>
      <div className="all-cases-container">
        
        {/* --- Header & Actions --- */}
        <div className="all-cases-header">
          <h1>
            <FaFolderOpen /> All Cases
          </h1>
          <div className="all-cases-actions">
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary">
              <FaPlus /> <span>New Case</span>
            </button>
          </div>
        </div>

        {/* --- Cases Table --- */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Case Name</th>
                <th>Case ID</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>
                    <strong>{caseItem.name}</strong>
                  </td>
                  <td>{caseItem.id}</td>
                  <td>
                    <span 
                      className={`case-status ${caseItem.status.toLowerCase()}`}
                    >
                      {caseItem.status === 'Ready' ? 
                        <FaCheckCircle /> : 
                        <MdOutlineSummarize />
                      }
                      {caseItem.status}
                    </span>
                  </td>
                  <td>{caseItem.modified}</td>
                  <td>
                    <Link 
                      to={`/case/${caseItem.id}`} 
                      className="btn btn-secondary btn-small"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="no-results">
              <p>No cases found matching your search.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AllCasesPage;