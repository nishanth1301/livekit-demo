import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  LiveKitRoom,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import {
  DataPacket_Kind,
  RemoteParticipant,
  RoomEvent,
  Track,
} from "livekit-client";
import ChatInterface from "./ChatInterface";
import CallInterface from "./CallInterface";
import IncomingCallNotification from "./IncomingCallNotification";
const serverUrl = "ws://167.27.231.155:7880";
interface ChatRoomProps {
  roomName: string;
  participantName: string;
  handleDisconnect: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomName,
  participantName,
  handleDisconnect,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<RemoteParticipant | null>(null);
  const [incomingCall, setIncomingCall] = useState<RemoteParticipant | null>(
    null
  );

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post<{ token: string }>(
          "http://192.168.0.41:3002/livekit/tokenGenerate",
          {
            roomName,
            participantName,
          }
        );
        if (response.data.token) {
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

  const handleIncomingCall = useCallback((caller: RemoteParticipant) => {
    setIncomingCall(caller);
  }, []);

  const acceptCall = useCallback((caller: RemoteParticipant) => {
    setActiveCall(caller);
    setIncomingCall(null);
  }, []);

  const rejectCall = useCallback(() => {
    // Implement rejection logic
    setIncomingCall(null);
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
  }, []);

  if (!token) return null;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      data-lk-theme="default"
    >
      <RoomComponent
        handleIncomingCall={handleIncomingCall}
        handleDisconnect={handleDisconnect}
      />
      {incomingCall && (
        <IncomingCallNotification
          caller={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
      {activeCall ? (
        <CallInterface caller={activeCall} onEndCall={endCall} />
      ) : (
        <ChatInterface roomName={roomName} participantName={participantName} />
      )}
    </LiveKitRoom>
  );
};
interface RoomComponentProps {
  handleIncomingCall: (caller: RemoteParticipant) => void;
  handleDisconnect: () => void;
}

const RoomComponent: React.FC<RoomComponentProps> = ({
  handleIncomingCall,
  handleDisconnect,
}) => {
  const room = useRoomContext();
  const participants = useParticipants();

  useEffect(() => {
    const handleDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      kind?: DataPacket_Kind
    ) => {
      const decoder = new TextDecoder();
      const data = JSON.parse(decoder.decode(payload)) as any;
      if (data.type === "CALL_REQUEST" && participant) {
        handleIncomingCall(participant);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, handleIncomingCall]);

  return null;
};

export default ChatRoom;
