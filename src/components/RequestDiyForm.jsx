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
    // Fetch DIY projects to populate the dropdown menu
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

    // Fetch existing submissions to determine the next ID
    fetch('http://localhost:8888/requestSubmissions')
      .then((response) => response.json())
      .then((submissions) => {
        const nextId = submissions.length > 0 
          ? (Math.max(...submissions.map((s) => parseInt(s.id, 10))) + 1).toString() 
          : '1';

        const newSubmission = {
          id: nextId,
          ...formValues,
        };

        // Send the data to the "requestSubmissions" section in db.json
        fetch('http://localhost:8888/requestSubmissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubmission), // Send form data as JSON
        })
          .then((response) => {
            if (response.ok) {
              console.log('Form data submitted successfully!');
              setFormSubmitted(true);
              setTimeout(() => setFormSubmitted(false), 3000);

              // Reset the form fields after successful submission
              setFormValues({
                fullName: '',
                requestedDiy: '',
                birthday: '',
                colorPreference: '',
                additionalDetails: '',
              });
            } else {
              console.error('Failed to submit form data.');
            }
          })
          .catch((error) => console.error('Error submitting form data:', error));
      })
      .catch((error) => console.error('Error fetching submissions:', error));
  }

  if (formSubmitted) {
    return <p className="success-message">Your request has been submitted!</p>;
  }

  return (
    <div>
      <PageBanner title="Birthday DIY Fairy at Your Service!" />
      <div className="form-container">
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
    </div>
  );
}

export default RequestDiyForm;
