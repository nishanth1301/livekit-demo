import React, { useCallback } from "react";
import {
  useLocalParticipant,
  useRemoteParticipant,
  useTracks,
  VideoTrack,
  AudioTrack,
  ControlBar,
} from "@livekit/components-react";
import { Track, RemoteParticipant } from "livekit-client";

interface CallInterfaceProps {
  caller: RemoteParticipant;
  onEndCall: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ caller, onEndCall }) => {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipant = useRemoteParticipant(caller.identity);

  const tracks = useTracks();

  const localCameraTrack = tracks.find(
    (track) =>
      track.participant === localParticipant &&
      track.source === Track.Source.Camera
  );

  const remoteCameraTrack = tracks.find(
    (track) =>
      track.participant === remoteParticipant &&
      track.source === Track.Source.Camera
  );

  const remoteAudioTrack = tracks.find(
    (track) =>
      track.participant === remoteParticipant &&
      track.source === Track.Source.Microphone
  );

  const handleEndCall = useCallback(() => {
    // Implement any cleanup or state changes needed when ending the call
    onEndCall();
  }, [onEndCall]);

  return (
    <div className="call-interface">
      <h2>Call with {caller.identity}</h2>
      <div className="video-container">
        <div className="local-video">
          <h3>You</h3>
          {localCameraTrack && <VideoTrack trackRef={localCameraTrack} />}
        </div>
        <div className="remote-video">
          <h3>{caller.identity}</h3>
          {remoteCameraTrack && <VideoTrack trackRef={remoteCameraTrack} />}
        </div>
      </div>
      {remoteAudioTrack && <AudioTrack trackRef={remoteAudioTrack} />}
      <ControlBar />
      <button onClick={handleEndCall}>End Call</button>
    </div>
  );
};

export default CallInterface;
