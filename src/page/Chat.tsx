import React from "react";
import { Col, Row } from "react-bootstrap";
import "./chat.css";
import ChatWindow from "./ChatWindow";

const Chat = ({ setVideo, setAudio, handleDisconnect }: any) => {
  return (
    <>
      <div className="container-fluid">
        <Row>
          <Col xs={3}>
            <div className="chatList"></div>
          </Col>
          <Col xs={9}>
            <ChatWindow
              setAudio={setAudio}
              setVideo={setVideo}
              handleDisconnect={handleDisconnect}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Chat;
