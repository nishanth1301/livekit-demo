import React from "react";
import { Card } from "react-bootstrap";
import { FcVideoCall } from "react-icons/fc";
import { IoCall } from "react-icons/io5";
import "./chat.css";

const ChatWindow = () => {
  return (
    <Card body className="mt-2 ">
      <div className="d-flex justify-content-end">
        <span className="icons">
          <IoCall />
        </span>
        <span className="icons">
          <FcVideoCall />
        </span>
      </div>
    </Card>
  );
};

export default ChatWindow;
