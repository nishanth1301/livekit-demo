import React from "react";
import Avatar from "react-avatar";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
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
    <Card
      style={{
        width: "15rem",
        backgroundColor: "#F6F5F5",
        border: "none",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            {/* <Card.Img
              variant="top"
              src={picUrl}
              className="rounded-circle"
              style={{ width: "50px", height: "50px" }}
            /> */}
            <Avatar value="76%" size="50" name={name} round={true} />
          </Col>
          <Col className="d-flex ">
            <h5 style={{ fontSize: "1.8rem" }}>{name}</h5>

            {/* <Card.Title style={{ fontSize: "1.8rem" }}>{name}</Card.Title> */}
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
