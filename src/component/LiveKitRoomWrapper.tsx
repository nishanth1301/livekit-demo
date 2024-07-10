import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";

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

export default LiveKitRoomWrapper;
