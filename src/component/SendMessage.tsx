import {
  CarouselLayout,
  ControlBar,
  DisconnectButton,
  ParticipantTile,
  RoomAudioRenderer,
  useRemoteParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import {
  DataPacket_Kind,
  RemoteParticipant,
  RoomEvent,
  Track,
} from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserCard from "./UserCard";
import axios from "axios";

interface SendMessageProps {
  handleDisconnect: () => void;
  setAudio: any;
  setVideo: any;
}

function SendMessage({
  handleDisconnect,
  setVideo,
  setAudio,
}: SendMessageProps) {
  const room: any = useRoomContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const [requestParticipantInfo, setRequestParticipantInfo] = useState<
    string | null
  >(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [mode, setMode] = useState<"video" | "audio" | "chat">("chat");
  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const remoteParticipants: RemoteParticipant[] = useRemoteParticipants({
    updateOnlyOn: [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.Disconnected,
      RoomEvent.Reconnected,
      RoomEvent.ParticipantMetadataChanged,
      RoomEvent.ParticipantNameChanged,
    ],
  });
  const remoteParticipant =
    remoteParticipants.length === 1 ? remoteParticipants[0] : null;
  const remoteIdentity = remoteParticipant
    ? remoteParticipant.identity
    : "No remote participant connected";
  const handleIncomingCall = async (topic: string) => {
    setMode(topic as "video" | "audio" | "chat");
    if (remoteIdentity === "No remote participant connected") {
      toast.error("User is offline", {
        style: { border: "1px solid #4CAF50", padding: "16px" },
        iconTheme: { primary: "#4CAF50", secondary: "#FFFAEE" },
        duration: 10000,
      });
    } else {
      try {
        console.log(room);
        await axios.post("http://192.168.0.41:3002/livekit/sendMessage", {
          roomName: room.roomInfo.name,
          localParticipant: room.localParticipant.identity,
          message: `${room.roomInfo.name}-${room.localParticipant.identity}`,
          dId: [remoteIdentity],
          topic,
        });
      } catch (error) {
        console.error("Error sending incoming call message:", error);
      }
    }
  };
  const handleAcceptOrReject = (isCheck: boolean) => {
    if (isCheck) {
      setAudio(true);
      setVideo(true);
      setMode("video");
    } else {
      // Handle call rejection if needed
    }
  };
  const checkFunc = () => {
    toast.custom(
      (t) => (
        <UserCard
          name={requestParticipantInfo!}
          picUrl="https://via.placeholder.com/150"
          handleAcceptOrReject={handleAcceptOrReject}
          toastId={t.id}
        />
      ),
      { duration: 10000, position: "top-right" }
    );
  };

  const acceptModal = () => {
    checkFunc();
  };

  useEffect(() => {
    if (requestParticipantInfo && actionType === "video") {
      acceptModal();
    }
  }, [requestParticipantInfo, actionType]);

  const handleDataReceived = useCallback(
    (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      kind?: DataPacket_Kind,
      topic?: string
    ) => {
      const decoder = new TextDecoder();
      const data = decoder.decode(payload);
      const [localParticipant, participantIdentity, action] = data.split("-");
      console.log(data.split("-"));
      setActionType(action);
      setRequestParticipantInfo(localParticipant);
    },
    [room]
  );

  useEffect(() => {
    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [handleDataReceived, room]);

  const handleSendMessage = async () => {
    try {
      console.log("Message sent:", messageInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: room.localParticipant.identity, content: messageInput },
      ]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    room && (
      <div>
        <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
          <div>
            <button onClick={() => handleIncomingCall("video")}>Video</button>
            <button onClick={() => setMode("audio")}>Audio</button>
            <button onClick={() => setMode("chat")}>Chat</button>
          </div>
          <div className="lk-control-bar">
            <ControlBar
              variation="verbose"
              controls={{ screenShare: false, leave: false }}
            />
            <DisconnectButton stopTracks={true} onClick={handleDisconnect}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2 2.75A2.75 2.75 0 0 1 4.75 0h6.5A2.75 2.75 0 0 1 14 2.75v10.5A2.75 2.75 0 0 1 11.25 16h-6.5A2.75 2.75 0 0 1 2 13.25v-.5a.75.75 0 0 1 1.5 0v.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V2.75c0-.69-.56-1.25-1.25-1.25h-6.5c-.69 0-1.25.56-1.25 1.25v.5a.75.75 0 0 1-1.5 0v-.5Z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8.78 7.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H1.75a.75.75 0 0 1 0-1.5h4.69l-.97-.97a.75.75 0 0 1 1.06-1.06l2.25 2.25Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Leave
            </DisconnectButton>
          </div>
          {mode === "video" && (
            <CarouselLayout
              tracks={tracks}
              style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
            >
              <ParticipantTile />
            </CarouselLayout>
          )}
          {mode === "audio" && <RoomAudioRenderer />}

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
    )
  );
}

export default SendMessage;
