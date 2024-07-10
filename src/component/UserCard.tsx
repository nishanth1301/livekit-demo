import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { SlCallEnd, SlCallIn } from "react-icons/sl";

const UserCard = ({ name, picUrl, onConnect, onReject }: any) => {
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
            {/* <Card.Text>is {type}calling</Card.Text> */}
          </Col>
        </Row>
        <Button variant="success" onClick={onConnect} className="me-2 ">
          <SlCallIn />
        </Button>
        <Button variant="danger" onClick={onReject}>
          <SlCallEnd />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
