import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function Search() {
  const { diyProjects } = useOutletContext(); // Access DIY projects from context
  const [query, setQuery] = useState(''); // Search query state
  const [filteredProjects, setFilteredProjects] = useState([]); // Start with an empty list

  const handleSearch = (event) => {
    const input = event.target.value.toLowerCase();
    setQuery(input);

    if (input.trim() === '') {
      // If the input is empty, don't show anything
      setFilteredProjects([]);
    } else {
      // Filter DIY projects based on the input
      const filtered = diyProjects.filter((project) =>
        project.projectName.toLowerCase().includes(input)
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <div>
      <h1>Hi, What are you looking for?</h1>
      <input
        type="text"
        placeholder="Search DIY projects..."
        value={query}
        onChange={handleSearch}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <ul>
        {filteredProjects.map((project) => (
          <li key={project.id}>
            <h2>{project.projectName}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
