import { Link } from 'react-router-dom';

function DiyCard({ diyProjectDetails }) {
  return (
    <li className="card">
      <h2>
        <Link to={`/list/${diyProjectDetails.id}`}>
          {diyProjectDetails.projectName}
        </Link>
      </h2>
    </li>
  );
}

export default DiyCard;
