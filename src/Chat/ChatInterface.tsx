// ChatInterface.tsx
import React, { useState, useCallback } from "react";
import {
  useParticipants,
  useLocalParticipant,
} from "@livekit/components-react";
import { RemoteParticipant, DataPacket_Kind } from "livekit-client";

interface ChatInterfaceProps {
  roomName: string;
  participantName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  roomName,
  participantName,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const sendData = useCallback(
    (data: any) => {
      if (localParticipant) {
        const payload = JSON.stringify(data);
        localParticipant.publishData(new TextEncoder().encode(payload), {
          reliable: true,
        });
      }
    },
    [localParticipant]
  );

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim()) {
      const newMessage: any = {
        sender: participantName,
        content: messageInput,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      sendData(newMessage);
      setMessageInput("");
    }
  }, [messageInput, participantName, sendData]);

  const initiateCall = useCallback(
    (participant: RemoteParticipant) => {
      const callRequest: any = {
        type: "CALL_REQUEST",
        target: participant.identity,
      };
      sendData(callRequest);
    },
    [sendData]
  );

  return (
    <div>
      <div>
        <h2>Participants</h2>
        {participants.map((participant: any) => (
          <div key={participant.identity}>
            {participant.identity}
            {participant !== localParticipant && (
              <button onClick={() => initiateCall(participant)}>Call</button>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2>Chat</h2>
        <div style={{ height: "300px", overflowY: "scroll" }}>
          {messages.map((message, index) => (
            <div key={index}>
              <strong>{message.sender}:</strong> {message.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
