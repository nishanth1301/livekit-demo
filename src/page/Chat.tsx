import React from "react";
import { Col, Row } from "react-bootstrap";
import "./chat.css";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  return (
    <>
      <div className="container-fluid">
        <Row>
          <Col xs={3}>
            <div className="chatList"></div>
          </Col>
          <Col xs={8}>
            <ChatWindow />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Chat;
