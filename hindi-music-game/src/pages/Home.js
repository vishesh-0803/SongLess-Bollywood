import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const styles = {
    container: {
      textAlign: "center",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
      color: "#FFFFFF",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    titleSpan: {
      color: "#AAAAAA",
    },
    instruction: {
      fontSize: "22px",
      fontWeight: "400",
      marginBottom: "40px",
    },
    boldGreen: {
      color: "#1DB954",
      fontWeight: "bold",
    },
    readyButton: {
      backgroundColor: "#1DB954",
      border: "none",
      borderRadius: "8px",
      padding: "15px 30px",
      color: "white",
      fontSize: "18px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    readyButtonHover: {
      backgroundColor: "#17a74c",
    },
  };

  const handleHover = (e, hover) => {
    e.target.style.backgroundColor = hover
      ? styles.readyButtonHover.backgroundColor
      : styles.readyButton.backgroundColor;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        song<span style={styles.titleSpan}>less</span>-Bollywood
      </h1>
      <p style={styles.instruction}>
        Try to <span style={styles.boldGreen}>guess the song</span> from listening to small parts of it
      </p>
      <Link to="/game/1">
        <button
          style={styles.readyButton}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          Ready!
        </button>
      </Link>
    </div>
  );
};

export default Home;
