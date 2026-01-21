import React, { useState, useEffect } from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner
import '../styles/RequestDiyForm.css'; // Add the CSS styles
import { supabase } from '../lib/supabaseClient';

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
    // Fetch DIY projects from Supabase to populate the dropdown menu
    async function fetchDiyProjects() {
      const { data, error } = await supabase
        .from('diy_projects')
        .select('id, project_name')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching DIY projects:', error);
      } else {
        // Transform to match existing structure
        const transformedData = data.map(project => ({
          id: project.id.toString(),
          projectName: project.project_name,
        }));
        setDiyProjects(transformedData);
      }
    }
    
    fetchDiyProjects();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    // Transform camelCase to snake_case for Supabase
    const submissionData = {
      full_name: formValues.fullName,
      requested_diy: formValues.requestedDiy,
      birthday: formValues.birthday,
      color_preference: formValues.colorPreference,
      additional_details: formValues.additionalDetails,
    };

    // Insert the data into Supabase
    const { data, error } = await supabase
      .from('request_submissions')
      .insert([submissionData])
      .select();

    if (error) {
      console.error('Error submitting form data:', error);
      alert('Failed to submit your request. Please try again.');
    } else {
      console.log('Form data submitted successfully!', data);
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
    }
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
