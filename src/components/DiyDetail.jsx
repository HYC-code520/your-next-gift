import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import '../styles/DiyDetail.css'; // Add a new CSS file for styling
import { useState } from 'react';

function DiyDetail() {
  const { id } = useParams();
  const { diyProjects } = useOutletContext();
  const [selectedImage, setSelectedImage] = useState(null);

  const project = diyProjects.find((project) => project.id === id);

  if (!project) {
    return <p>Project not found!</p>;
  }

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="diy-detail-container">
      <div className="diy-detail-image-section">
        <img
          src={selectedImage || project.images[0]} // Display selected or default to the first image
          alt={project.projectName}
          className="diy-detail-main-image"
        />
        <div className="diy-detail-thumbnails">
          {project.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="diy-detail-thumbnail"
              onClick={() => handleThumbnailClick(image)} // Update the main image on click
            />
          ))}
        </div>
      </div>
      <div className="diy-detail-description">
        <h1>{project.projectName}</h1>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Estimated Time:</strong> {project.estimatedTime}</p>
        <p><strong>Materials:</strong> {project.materials.join(', ')}</p>
      </div>
    </div>
  );
}

export default DiyDetail;
