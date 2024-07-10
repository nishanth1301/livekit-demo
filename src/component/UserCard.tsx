import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import { SlCallEnd, SlCallIn } from "react-icons/sl";

interface UserCardProps {
  name: string;
  picUrl: string;
  handleAcceptOrReject: (isCheck: boolean) => void;
  toastId: string;
}
const UserCard = ({
  name,
  picUrl,
  handleAcceptOrReject,
  toastId,
}: UserCardProps) => {
  return (
    <Card style={{ width: "18rem", backgroundColor: "#E7D4B5" }}>
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <Card.Img
              variant="top"
              src={picUrl}
              className="rounded-circle"
              style={{ width: "50px", height: "50px" }}
            />
          </Col>
          <Col>
            <Card.Title>{name}</Card.Title>
          </Col>
        </Row>
        <Button
          variant="success"
          onClick={() => {
            handleAcceptOrReject(true);
            toast.dismiss(toastId);
          }}
          className="me-2"
        >
          <SlCallIn />
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleAcceptOrReject(false);
            toast.dismiss(toastId);
          }}
        >
          <SlCallEnd />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
