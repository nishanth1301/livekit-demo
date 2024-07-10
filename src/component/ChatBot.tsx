import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import toast from "react-hot-toast";
import UserCard from "./UserCard";

interface LiveKitRoomWrapperProps {
  video: boolean;
  audio: boolean;
  token: string;
  connect: boolean;
  serverUrl: string;
  children?: React.ReactNode;
  "data-lk-theme"?: string;
  style?: React.CSSProperties;
}

function LiveKitRoomWrapper(props: LiveKitRoomWrapperProps) {
  return <LiveKitRoom {...props} />;
}
const serverUrl = "ws://167.71.231.155:7880";

function ChatBot({ roomName, participantName, handleDisconnect }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [mode, setMode] = useState<"video" | "audio" | "chat">("chat");
  const [messages, setMessages] = useState<any[]>([]);
  const [remoteUser, setRemoteUser] = useState<string>("");

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

  const handleIncomingCall = async (topic: any) => {
    setMode(topic);
    if (remoteUser === "No remote participant connected") {
      console.log("user is offline");
    } else {
      await axios.post("http://192.168.0.41:3002/livekit/sendMessage", {
        roomName: roomName,
        localParticipant: participantName,
        message: `${roomName}-${participantName}`,
        dId: [remoteUser],
        topic: topic,
      });
    }
  };
  const [isAudio, setAudio] = useState<boolean>(false);
  const [isVideo, setVideo] = useState<boolean>(false);

  const handleAcceptOrReject = (isCheck: boolean) => {
    if (isCheck) {
      setAudio(true);
      setVideo(true);
    }
  };
  const getRemoteParticipantName = (participantName: any) => {
    setRemoteUser(participantName);
  };
  return token ? (
    <div>
      <LiveKitRoomWrapper
        video={isVideo}
        audio={isAudio}
        token={token}
        connect={true}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ flex: 1 }}
      >
        <SendMessage
          mode={mode}
          handleDisconnect={handleDisconnect}
          getRemoteParticipantName={getRemoteParticipantName}
          handleAcceptOrReject={handleAcceptOrReject}
        />
      </LiveKitRoomWrapper>
      <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
        <div>
          <button onClick={() => handleIncomingCall("video")}>Video</button>
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
