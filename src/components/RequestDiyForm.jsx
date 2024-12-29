import React, { useState, useEffect } from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner

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

  // Fetch DIY projects from the server
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

    fetch('http://localhost:8888/requestSubmissions')
      .then((response) => response.json())
      .then((existingSubmissions) => {
        const nextId =
          existingSubmissions.length > 0
            ? Math.max(...existingSubmissions.map((submission) => submission.id)) + 1
            : 1;

        const newSubmission = { id: nextId, ...formValues };

        return fetch('http://localhost:8888/requestSubmissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubmission),
        });
      })
      .then(() => {
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);

        // Reset the form to its initial empty state
        setFormValues({
          fullName: '',
          requestedDiy: '',
          birthday: '',
          colorPreference: '',
          additionalDetails: '',
        });
      })
      .catch((error) => console.error('Error saving request submission:', error));
  }

  if (formSubmitted) {
    return <p className="success-message">Form Submitted Successfully!</p>;
  }

  return (
    <div>
      {/* Add the banner component here */}
      <PageBanner
        title="Request a DIY Project"
        subtitle="Submit your custom DIY requests here!"
      />

      {/* Form Section */}
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
