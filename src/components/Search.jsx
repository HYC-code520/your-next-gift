import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import '../styles/Search.css'; // Add this CSS file for styling

function Search() {
  const { diyProjects } = useOutletContext(); // Access DIY projects from context
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search input
  const [filteredResults, setFilteredResults] = useState([]); // State to hold the filtered projects

  const handleSearchInput = (event) => {
    const userInput = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    setSearchTerm(userInput); // Update the search input state

    if (userInput.trim() === '') {
      // If input is empty, clear the results
      setFilteredResults([]);
    } else {
      // Filter projects based on the search term
      const matches = diyProjects.filter((project) =>
        project.projectName.toLowerCase().includes(userInput)
      );
      setFilteredResults(matches);
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">What are you looking for? 🧐</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search DIY projects..."
        value={searchTerm}
        onChange={handleSearchInput}
      />
      <ul className="search-results">
        {filteredResults.map((project) => (
          <li key={project.id} className="search-result-item">
            <Link to={`/list/${project.id}`} className="search-result-link">
              <h2>{project.projectName}</h2>
            </Link>
            <p className="search-result-description">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
