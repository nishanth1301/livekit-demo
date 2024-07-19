import React from "react";
import { Toaster } from "react-hot-toast";
import ChatRoom from "./Chat/ChatRoom";
import ChatBot from "./page/ChatBot";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Chat from "./page/Chat";
import { useState } from "react";

const Join = () => {
  const [roomName, setRoomName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsJoined(true);
  };
  const navigate = useNavigate();
  const handleDisconnect = () => {
    setIsJoined(false);
    navigate("/");
  };
  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster */}
      {isJoined ? (
        <ChatBot
          roomName={roomName}
          participantName={participantName}
          handleDisconnect={handleDisconnect}
        />
      ) : (
        <>
          <h1>LiveKit Video Chat</h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Participant Name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              required
            />
            <button type="submit">Join Room</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Join;
