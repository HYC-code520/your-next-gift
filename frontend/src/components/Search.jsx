import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import PageBanner from './PageBanner';
import '../styles/Search.css';

function Search() {
  const { diyProjects } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearchInput = (event) => {
    const userInput = event.target.value.toLowerCase();
    setSearchTerm(userInput);

    if (userInput.trim() === '') {
      setFilteredResults([]);
    } else {
      const matches = diyProjects.filter((project) =>
        project.projectName.toLowerCase().includes(userInput) ||
        project.description.toLowerCase().includes(userInput)
      );
      setFilteredResults(matches);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.toLowerCase());
    const matches = diyProjects.filter((project) =>
      project.projectName.toLowerCase().includes(suggestion.toLowerCase()) ||
      project.description.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredResults(matches);
  };

  return (
    <div>
      <PageBanner title="Search Projects" className="search-page-banner" />
      <div className="search-container">
        {/* Search Input Section */}
        <div className="search-input-section">
          <h2 className="search-subtitle">Find Your Perfect DIY Project</h2>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by project name or description..."
              value={searchTerm}
              onChange={handleSearchInput}
            />
          </div>
        </div>

        {/* Search Suggestions */}
        {!searchTerm && (
          <div className="search-suggestions">
            <h3>Popular Searches:</h3>
            <div className="suggestion-tags">
              {['Mirror', 'Pet', 'Balloon', 'Cushion', 'Bag', 'Frame'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="suggestion-tag"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="search-results-section">
            {filteredResults.length > 0 ? (
              <>
                <div className="results-header">
                  <h3>Search Results</h3>
                  <span className="results-count">
                    {filteredResults.length} project{filteredResults.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                <div className="search-results">
                  {filteredResults.map((project) => (
                    <div key={project.id} className="search-result-item">
                      <Link to={`/list/${project.id}`} className="search-result-link">
                        <h4 className="project-name">{project.projectName}</h4>
                      </Link>
                      <p className="project-description">{project.description}</p>
                      <div className="project-meta">
                        <span className="estimated-time">⏱️ {project.estimatedTime}</span>
                        {project.materials && (
                          <span className="materials">
                            🛠️ {project.materials.slice(0, 2).join(', ')}
                            {project.materials.length > 2 && '...'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No projects found</h3>
                <p>We couldn't find any projects matching "<strong>{searchTerm}</strong>"</p>
                <div className="no-results-actions">
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                  <Link to="/list" className="browse-all-btn">
                    Browse All Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
