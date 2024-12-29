import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

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
    <div>
      <h1>Hi, What are you looking for?</h1>
      <input
        type="text"
        placeholder="Search DIY projects..."
        value={searchTerm} // Bind input value to searchTerm
        onChange={handleSearchInput} // Call handleSearchInput on user input
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <ul>
        {filteredResults.map((project) => (
          <li key={project.id}>
            {/* Add a clickable link for each project */}
            <Link to={`/list/${project.id}`}>
              <h2>{project.projectName}</h2>
            </Link>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
