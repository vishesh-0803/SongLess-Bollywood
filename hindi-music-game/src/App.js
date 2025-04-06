import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure correct import
import Home from "./pages/Home";
import Game from "./pages/Game";

const App = () => {
  useEffect(() => {
    const updateSongOrder = async () => {
      try {
        const songsCollection = collection(db, "songs1");
        const querySnapshot = await getDocs(songsCollection);

        let songsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort songs alphabetically by document ID
        songsArray.sort((a, b) => a.id.localeCompare(b.id));

        // Assign sequential order numbers
        for (let i = 0; i < songsArray.length; i++) {
          const songRef = doc(db, "songs1", songsArray[i].id);
          await updateDoc(songRef, { order: i + 1 }); // Start from 1
          console.log(`✅ Updated ${songsArray[i].id} -> order: ${i + 1}`);
        }

        console.log("🎉 All song orders updated successfully!");
      } catch (error) {
        console.error("❌ Error updating song order:", error);
      }
    };

    updateSongOrder(); // Run this ONCE when app loads
  }, []);

  const styles = {
    appContainer: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#121212",
      color: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    header: {
      fontSize: "32px",
      marginBottom: "30px",
    },
    button: {
      padding: "15px 30px",
      fontSize: "18px",
      backgroundColor: "#1DB954",
      color: "#FFFFFF",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#17a74c",
    },
  };

  const StartButton = () => {
    const navigate = useNavigate();
    const handleHover = (e, hover) => {
      e.target.style.backgroundColor = hover
        ? styles.buttonHover.backgroundColor
        : styles.button.backgroundColor;
    };

    return (
      <button
        style={styles.button}
        onClick={() => navigate("/home")}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        Start
      </button>
    );
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.header}>Songless-Bollywood 🎶</h1>
      <Router>
        <Routes>
          <Route path="/" element={<StartButton />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
