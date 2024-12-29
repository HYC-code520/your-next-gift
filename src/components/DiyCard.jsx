import { Link } from 'react-router-dom';
import '../styles/DiyCard.css'; // Link to the CSS file

function DiyCard({ diyProjectDetails }) {
  return (
    <li className="diy-card">
      <div className="diy-card-image-container">
        <Link to={`/list/${diyProjectDetails.id}`} className="diy-card-link">
          <img
            src={diyProjectDetails.image || 'https://via.placeholder.com/250'}
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
