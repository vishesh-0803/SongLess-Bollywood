import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Confetti from "react-confetti";
import "./Game.css"; // Add CSS styles here

const YOUTUBE_API_KEY = "AIzaSyBd_6x2dyAwpeVrGB1jAVZedmsVmGS8pnw"; // Replace this!

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [playStage, setPlayStage] = useState(0);
  const [videoId, setVideoId] = useState("");
  const [guessesLeft, setGuessesLeft] = useState(4);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  const playDurations = [
    { start: 30, end: 32 },
    { start: 32, end: 35 },
    { start: 35, end: 42 },
    { start: 30, end: 60 },
  ];

  useEffect(() => {
    const fetchSongs = async () => {
      const q = query(collection(db, "songs1"), orderBy("order"));
      const querySnapshot = await getDocs(q);
      const songsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songsList);

      if (!id && songsList.length) {
        navigate(`/game/${songsList[0].id}`, { replace: true });
      } else {
        const currentSong = songsList.find(s => s.id === id);
        if (currentSong) {
          setSong(currentSong);
        } else {
          setMessage("⚠️ Song not found! Redirecting...");
          setTimeout(() => navigate("/"), 3000);
        }
      }
    };

    fetchSongs();
  }, [id, navigate]);

  const searchYouTubeSnippet = async (title) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
          title
        )}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
      } else {
        setMessage("🚫 No YouTube video found for this song.");
      }
    } catch (err) {
      console.error("YouTube API error:", err);
      setMessage("❌ Error loading YouTube snippet.");
    }
  };

  const handlePlay = () => {
    if (playStage < playDurations.length) {
      if (song?.title) {
        searchYouTubeSnippet(song.title);
      }
      setPlayStage(playStage + 1);
    } else {
      setMessage("🔇 All snippet stages played!");
    }
  };

  const handleGuess = () => {
    if (guess.trim().toLowerCase() === song.title.toLowerCase()) {
      setMessage("🎉 Correct! Well done!");
      setShowConfetti(true);
    } else {
      const remaining = guessesLeft - 1;
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (remaining > 0) {
        setGuessesLeft(remaining);
        setMessage(`❌ Try Again! ${remaining} guesses left.`);
      } else {
        setMessage(`🚫 Out of guesses! The correct answer was "${song.title}".`);
      }
    }
  };

  const handleNext = () => {
    const index = songs.findIndex(s => s.id === song.id);
    const nextIndex = (index + 1) % songs.length;
    navigate(`/game/${songs[nextIndex].id}`);
    setGuess("");
    setMessage("");
    setPlayStage(0);
    setGuessesLeft(4);
    setVideoId("");
    setShowConfetti(false);
  };

  const currentSnippet = playDurations[playStage - 1];
  const snippetUrl =
    videoId && currentSnippet
      ? `https://www.youtube.com/embed/${videoId}?start=${currentSnippet.start}&end=${currentSnippet.end}&autoplay=1&controls=0&mute=0`
      : "";

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}

      <h1 className="title">🎧 Guess the Song</h1>

      <button
        onClick={handlePlay}
        className="game-button"
        disabled={playStage >= playDurations.length}
      >
        {playStage < playDurations.length ? "▶️ Play Snippet" : "🔇 All Played"}
      </button>

      <div className="progress-bar">
        {playDurations.map((_, i) => (
          <div
            key={i}
            className={`progress-step ${i < playStage ? "active" : ""}`}
          />
        ))}
      </div>

      {snippetUrl && (
        <iframe
          width="0"
          height="0"
          src={snippetUrl}
          title="YouTube snippet"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ display: "none" }}
        />
      )}

      <div className="input-container">
        <input
          type="text"
          placeholder="Your Guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className={`game-input ${shake ? "shake" : ""}`}
          disabled={guessesLeft === 0 || message.includes("Correct")}
        />
        <button
          onClick={handleGuess}
          className="game-button"
          disabled={guessesLeft === 0 || message.includes("Correct")}
        >
          Submit
        </button>
      </div>

      {message && <div className="game-message">{message}</div>}

      <button onClick={handleNext} className="game-button">
        Next Song ➡️
      </button>
    </div>
  );
};

export default Game;
