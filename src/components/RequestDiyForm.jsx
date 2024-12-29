import React, { useState, useEffect } from "react";

function RequestDiyForm() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    requestedDiy: "",
    birthday: "",
    colorPreference: "",
    additionalDetails: "",
  });

  const [diyProjects, setDiyProjects] = useState([]); // Matches db.json key
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch DIY projects from the server
  useEffect(() => {
    fetch("http://localhost:8888/diyProjects") // Refers to the diyProjects key in db.json
      .then((response) => response.json())
      .then((data) => {
        setDiyProjects(data); // Store the entire array of DIY projects
      })
      .catch((error) => console.error("Error fetching DIY projects:", error));
  }, []); // Fetch once on component mount

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    fetch("http://localhost:8888/requestSubmissions")
      .then((response) => response.json())
      .then((existingSubmissions) => {
        const nextId =
          existingSubmissions.length > 0
            ? Math.max(...existingSubmissions.map((submission) => submission.id)) + 1
            : 1;

        const newSubmission = { id: nextId, ...formValues };

        return fetch("http://localhost:8888/requestSubmissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubmission), // Send the new submission
        });
      })
      .then((response) => response.json())
      .then(() => {
        setFormSubmitted(true); // Show success message
        setTimeout(() => setFormSubmitted(false), 3000); // Message will dissapear again after 3 seconds

        // Reset the form to its initial empty state
        setFormValues({
          fullName: "",
          requestedDiy: "",
          birthday: "",
          colorPreference: "",
          additionalDetails: "",
        });
      })
      .catch((error) => console.error("Error saving request submission:", error));
  }

  // Render the success message if formSubmitted is true
  if (formSubmitted) {
    return <p className="success-message">Form Submitted Successfully!</p>;
  }

  return (
    <form onSubmit={handleFormSubmit} className="form-section">
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
  );
}

export default RequestDiyForm;
