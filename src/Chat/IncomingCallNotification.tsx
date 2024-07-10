import React from "react";
import { RemoteParticipant } from "livekit-client";

interface IncomingCallNotificationProps {
  caller: RemoteParticipant;
  onAccept: (caller: RemoteParticipant) => void;
  onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  caller,
  onAccept,
  onReject,
}) => {
  return (
    <div>
      <h3>Incoming call from {caller.identity}</h3>
      <button onClick={() => onAccept(caller)}>Accept</button>
      <button onClick={onReject}>Reject</button>
    </div>
  );
};

export default IncomingCallNotification;
