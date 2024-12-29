import { useOutletContext } from 'react-router-dom';
import DiyCard from './DiyCard';
import PageBanner from './PageBanner'; // Import the PageBanner component
import '../styles/DiyList.css';

function DiyList() {
  const { diyProjects } = useOutletContext();

  if (diyProjects.length === 0) {
    return <p>Loading DIY Projects...</p>;
  }

  return (
    <div>
      <PageBanner 
        title="DIY Wishlist Central" 
        className="list-page-banner"
      />
      <ul className="diy-grid">
        {diyProjects.map((diyProject) => (
          <DiyCard key={diyProject.id} diyProjectDetails={diyProject} />
        ))}
      </ul>
    </div>
  );
}

export default DiyList;
