function RightPanel() {
  const panelStyle = {
    width: "350px",
	paddingTop: "100px",
	paddingRight: "100px",
	paddingBottom: "100px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px", // key: fixed to viewport
	marginRight: "70px", 
    marginTop: "50px",
	marginBottom: "50px",
	height: "100vh",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
  };
  const cards = ["Experience Graph", "AI summary","Skills", "Preferred Locations", "Interested Jobs","Aspiring Companies"];

  return (
    <div style={panelStyle}>
      {cards.map((c) => (
        <div key={c} style={cardStyle}>
          <h4>{c}</h4>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
      ))}
    </div>
  );
}

export default RightPanel;