import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { FaSearch, FaFilePdf, FaMicrophoneAlt } from 'react-icons/fa';

const mockSearchResults = [
  {
    id: 1,
    type: 'document',
    caseName: 'ABC v. XYZ Corp',
    caseId: '2025-081',
    source: 'Doc-001.pdf (Original Contract)',
    snippet: '...agreed-upon date (Oct 15, 2024). Plaintiff (ABC) alleges **breach of contract** and seeks damages...'
  },
  {
    id: 2,
    type: 'transcript',
    caseName: 'State v. Michaels',
    caseId: '2025-078',
    source: 'Witness Testimony (A. Bell)',
    snippet: '...counselor, the defendant did not sign the **breach of contract** paperwork until the following week...'
  },
  {
    id: 3,
    type: 'document',
    caseName: 'Patel v. Global Imports',
    caseId: '2025-075',
    source: 'Doc-002.pdf (Email Correspondence)',
    snippet: '...we must consider this a material **breach of contract** if the goods do not arrive by Friday...'
  },
];

function GlobalSearchPage() {
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', initials: 'G' });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('loggedInUserName');
    if (savedName) {
      const initials = savedName.split(' ').map(n => n[0]).join('').toUpperCase();
      setCurrentUser({ name: savedName, initials: initials });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    console.log('Searching for:', query);
    setIsSearching(true);

    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(r => 
        query.toLowerCase().includes('breach of contract')
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <DashboardLayout userName={currentUser.name} userInitials={currentUser.initials}>
      <div className="search-page-container">
        
        <form className="global-search-bar" onSubmit={handleSearch}>
          <FaSearch className="search-icon-large" />
          <input 
            type="text" 
            placeholder="Search across all cases, documents, and transcripts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="search-suggestions">
          <span>Try:</span>
          <button onClick={() => handleSuggestionClick('"breach of contract"')}>
            "breach of contract"
          </button>
          <button onClick={() => handleSuggestionClick('witness "J. Doe"')}>
            witness "J. Doe"
          </button>
          <button onClick={() => handleSuggestionClick('Force Majeure')}>
            Force Majeure
          </button>
        </div>

        <div className="search-results-container">
          {results.length > 0 && <h3>Found {results.length} results for "{query}"</h3>}

          <div className="search-results-list">
            {results.map((result) => (
              <div key={result.id} className="result-snippet-card">
                <div className="result-icon">
                  {result.type === 'document' ? <FaFilePdf /> : <FaMicrophoneAlt />}
                </div>
                <div className="result-content">
                  <Link to={`/case/${result.caseId}`} className="result-title">
                    Found in: <strong>{result.caseName}</strong>
                  </Link>
                  <span className="result-source">{result.source}</span>
                  <p 
                    className="result-snippet"
                    dangerouslySetInnerHTML={{ __html: result.snippet }} 
                  />
                </div>
              </div>
            ))}
            
            {isSearching && <p className="loading-text">Searching...</p>}
            
            {!isSearching && results.length === 0 && query !== '' && (
              <p className="loading-text">No results found for "{query}".</p>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default GlobalSearchPage;