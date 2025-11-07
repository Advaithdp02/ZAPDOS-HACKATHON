import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
 
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
  };
  
function StudentHome() {
  return (

    <div style={containerStyle}>
      <Sidebar />
		<div
			style={{
				flex: 1, // takes all remaining space between sidebar and right panel
				padding: "20px",
			}}
		>
			<h1>Main Content</h1>
			{[...Array(50)].map((_, i) => (
			<p key={i}>This is line {i + 1}</p>
			))}
		</div>
      <RightPanel />
    </div>
  );
}

export default StudentHome;