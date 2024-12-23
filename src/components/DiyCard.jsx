function DiyCard({ diyProjectDetails }) {
    return (
      <li>
        <h1>DIY Project {diyProjectDetails.id}</h1>
        <h2>Name: {diyProjectDetails.projectName}</h2> {/* Use projectName */}
      </li>
    );
  }
  
  export default DiyCard;
  