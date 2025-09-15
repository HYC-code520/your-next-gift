import { Link } from 'react-router-dom';
import '../styles/DiyCard.css'; // Link to the CSS file

function DiyCard({ diyProjectDetails }) {
  // Get the first image from the images array, or use placeholder
  const imageUrl = diyProjectDetails.images && diyProjectDetails.images.length > 0 
    ? diyProjectDetails.images[0] 
    : 'https://via.placeholder.com/250';

  return (
    <li className="diy-card">
      <div className="diy-card-image-container">
        <Link to={`/list/${diyProjectDetails.id}`} className="diy-card-link">
          <img
            src={imageUrl}
            alt={diyProjectDetails.projectName}
            className="diy-card-image"
          />
        </Link>
      </div>
      <h2 className="diy-card-title">{diyProjectDetails.projectName}</h2>
      <p className="diy-card-description">{diyProjectDetails.description || "No description available"}</p>
    </li>
  );
}

export default DiyCard;
