import React, { useState, useEffect } from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner
import '../styles/RequestDiyForm.css'; // Add the CSS styles

function RequestDiyForm() {
  const [formValues, setFormValues] = useState({
    fullName: '',
    requestedDiy: '',
    birthday: '',
    colorPreference: '',
    additionalDetails: '',
  });

  const [diyProjects, setDiyProjects] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8888/diyProjects')
      .then((response) => response.json())
      .then((data) => setDiyProjects(data))
      .catch((error) => console.error('Error fetching DIY projects:', error));
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  }

  if (formSubmitted) {
    return <p className="success-message">Your request has been submitted!</p>;
  }

  return (
    <div>
      <PageBanner title="Birthday DIY Fairy at Your Service!" />
      <form onSubmit={handleFormSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formValues.fullName}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Requested DIY:
          <select
            name="requestedDiy"
            value={formValues.requestedDiy}
            onChange={handleInputChange}
          >
            <option value="">Select a DIY Project</option>
            {diyProjects.map((project) => (
              <option key={project.id} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Birthday:
          <input
            type="text"
            name="birthday"
            placeholder="MM/DD"
            value={formValues.birthday}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Colors Preference:
          <input
            type="text"
            name="colorPreference"
            placeholder="Enter preferred colors"
            value={formValues.colorPreference}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Additional Details:
          <textarea
            name="additionalDetails"
            placeholder="Any custom details you'd like to add"
            value={formValues.additionalDetails}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default RequestDiyForm;
