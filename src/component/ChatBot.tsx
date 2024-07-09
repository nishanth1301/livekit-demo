import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { useEffect, useState } from "react";
import SendMessage from "./SendMessage";

const serverUrl = "ws://167.71.231.155:7880";

function LiveKitRoomWrapper(props: any) {
  return <LiveKitRoom {...props} />;
}

function ChatBot({ roomName, participantName }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [mode, setMode] = useState<"video" | "audio" | "chat">("chat");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.41:3002/livekit/tokenGenerate",
          {
            roomName,
            participantName,
          }
        );
        if (response.data.token) {
          console.log("Token received:", response.data.token);
          setToken(response.data.token);
        } else {
          console.error(
            "Token response did not contain a token:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [roomName, participantName]);

  const handleSendMessage = async () => {
    // Implement the logic to send a message using LiveKit's data transmission

    // const data = await axios.post(
    //   "http://192.168.0.41:3002/livekit/sendMessage",
    //   {
    //     roomName,
    //     message: messageInput,
    //   }
    // );
    // console.log(data);
    console.log("Message sent:", messageInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: participantName, content: messageInput },
    ]);
    setMessageInput("");
  };

  return token ? (
    // <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
    <div>
      <LiveKitRoomWrapper
        video={false}
        audio={false}
        token={token}
        connect={true}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ flex: 1 }}
      >
        <SendMessage mode={mode} />
      </LiveKitRoomWrapper>
      <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
        <div>
          <button onClick={() => setMode("video")}>Video</button>
          <button onClick={() => setMode("audio")}>Audio</button>
          <button onClick={() => setMode("chat")}>Chat</button>
        </div>
        {mode === "chat" && (
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                height: "200px",
                overflowY: "scroll",
                marginBottom: "10px",
              }}
            >
              {messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.sender}:</strong> {message.content}
                </div>
              ))}
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default ChatBot;
