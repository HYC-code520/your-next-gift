import { useOutletContext } from 'react-router-dom';
import DiyCard from './DiyCard';

function DiyList() {
  const { diyProjects } = useOutletContext();

  if (diyProjects.length === 0) {
    return <p>Loading DIY Projects...</p>;
  }

  const diyProjectComponents = diyProjects.map((diyProject) => (
    <DiyCard key={diyProject.id} diyProjectDetails={diyProject} />
  ));

  return <ul>{diyProjectComponents}</ul>;
}

export default DiyList;
