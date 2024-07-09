import { useState } from "react";
import "./App.css";
import ChatBot from "./component/ChatBot";

function App() {
  const [roomName, setRoomName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsJoined(true);
  };

  return isJoined ? (
    <ChatBot roomName={roomName} participantName={participantName} />
  ) : (
    <div className="App">
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
    </div>
  );
}

export default App;
