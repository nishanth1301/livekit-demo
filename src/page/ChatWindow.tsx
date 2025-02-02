import {
  CarouselLayout,
  Chat,
  ChatEntry,
  ControlBar,
  DisconnectButton,
  ParticipantTile,
  RoomAudioRenderer,
  useRemoteParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import axios from "axios";
import {
  RemoteParticipant,
  RoomEvent,
  Track,
  DataPacket_Kind,
} from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { FcVideoCall } from "react-icons/fc";
import { IoCall } from "react-icons/io5";
import "./chat.css";
import UserCard from "../component/UserCard";
import { useNavigate } from "react-router-dom";
import CallInterface from "./CallInterface";

const ChatWindow = ({ setVideo, setAudio, handleDisconnect }: any) => {
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
  const navigate = useNavigate();
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
      setMode("chat");
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
    <div>
      <Card body className="mt-2 ">
        <div className="d-flex justify-content-end">
          <span className="icons">
            <IoCall
              onClick={() => {
                handleIncomingCall("audio");
              }}
            />
          </span>
          <span className="icons">
            <FcVideoCall
              onClick={() => {
                handleIncomingCall("video");
              }}
            />
          </span>

          {/* {mode === "video" && (
          <CarouselLayout
            tracks={tracks}
            style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
          >
            <ParticipantTile />
          </CarouselLayout>
        )}
        {mode === "audio" && <RoomAudioRenderer />} */}
        </div>
      </Card>
      {(mode === "audio" || mode === "video") && (
        <CallInterface mode={mode} tracks={tracks} />
      )}
      <>
        <Chat />
      </>
    </div>
  );
};

export default ChatWindow;
