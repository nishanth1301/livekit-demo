import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import SendMessage from "./SendMessage";
import toast from "react-hot-toast";

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

interface ChatBotProps {
  roomName: string;
  participantName: string;
  handleDisconnect: () => void;
}

function ChatBot({
  roomName,
  participantName,
  handleDisconnect,
}: ChatBotProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isAudio, setAudio] = useState<boolean>(false);
  const [isVideo, setVideo] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.41:3002/livekit/tokenGenerate",
          { roomName, participantName }
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
          setAudio={setAudio}
          setVideo={setVideo}
          handleDisconnect={handleDisconnect}
        />
      </LiveKitRoomWrapper>
    </div>
  ) : null;
}

export default ChatBot;
