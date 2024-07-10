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
import axios from "axios";
import {
  DataPacket_Kind,
  RemoteParticipant,
  RoomEvent,
  Track,
} from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import UserComponent from "./UserComponent";
import toast from "react-hot-toast";
import UserCard from "./UserCard";

function SendMessage({
  mode,
  handleDisconnect,
  getRemoteParticipantName,
  handleAcceptOrReject,
}: {
  mode: string;
  handleDisconnect: any;
  getRemoteParticipantName: any;
  handleAcceptOrReject: any;
}) {
  const room = useRoomContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const [requestParticipantInfo, setRequestParticipantInfo] = useState<any>();
  const [actionType, setActionType] = useState<any>();
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
  getRemoteParticipantName(remoteIdentity);
  const checkFunc = () => {
    toast.custom(
      (t) => {
        return (
          <>
            <UserCard
              name={requestParticipantInfo}
              picUrl="https://via.placeholder.com/150"
              handleAcceptOrReject={handleAcceptOrReject}
            />
          </>
        );
      },
      {
        duration: 10000, //TODO modify as per need
        position: "top-right",
      }
    );
  };
  // const sendMessage = useCallback(
  //   async (
  //     topic: "AUDIO" | "VIDEO" | "DISCONNECT" | "ACCEPT",
  //     requestedBy: string
  //   ) => {
  //     const currentName = requestedBy;
  //     if (currentName) {
  //       await axios.post("http://192.168.0.41:3002/livekit/sendMessage", {
  //         roomName: room?.name,
  //         message: `${room?.name}-${room.localParticipant.identity}`,
  //         dId: [remoteIdentity],
  //         topic: topic,
  //       });
  //     }
  //   },
  //   [room.localParticipant.identity, room?.name, senderName]
  // );

  const acceptModal = () => {
    checkFunc();
  };

  useEffect(() => {
    if (requestParticipantInfo) {
      if (actionType === "video") {
        acceptModal();
      }
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

  return (
    room && (
      <div>
        <div className="lk-control-bar">
          <ControlBar
            variation="verbose"
            controls={{ screenShare: false, leave: false }}
          />
          <DisconnectButton
            stopTracks={true}
            onClick={() => handleDisconnect()}
          >
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
            </svg>{" "}
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
      </div>
    )
  );
}
export default SendMessage;
