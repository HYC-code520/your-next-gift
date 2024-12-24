import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

function DiyDetail() {
  const { id } = useParams(); // Get the project ID from the URL
  const { diyProjects } = useOutletContext(); // Access the full list of projects


  // Convert the URL id to a number and find the matching project
  const project = diyProjects.find((project) => project.id === Number(id));

  if (!project) {
    return <p>Project not found!</p>;
  }

  return (
    <div>
      <h1>{project.projectName}</h1>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Estimated Time:</strong> {project.estimatedTime}</p>
      <p><strong>Materials:</strong> {project.materials.join(', ')}</p>
    </div>
  );
}

export default DiyDetail;
