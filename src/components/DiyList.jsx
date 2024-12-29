import { useOutletContext } from 'react-router-dom';
import DiyCard from './DiyCard';
import ListBanner from './ListBanner'; // Import the ListBanner component
import '../styles/DiyList.css';

function DiyList() {
  const { diyProjects } = useOutletContext();

  if (diyProjects.length === 0) {
    return <p>Loading DIY Projects...</p>;
  }

  return (
    <div>
      <ListBanner /> {/* Add the banner component here */}
      <ul className="diy-grid">
        {diyProjects.map((diyProject) => (
          <DiyCard key={diyProject.id} diyProjectDetails={diyProject} />
        ))}
      </ul>
    </div>
  );
}

export default DiyList;
