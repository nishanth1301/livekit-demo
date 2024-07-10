import React, { useState } from "react";

interface toastProps {
  user: string;
  type: "ACCEPT" | "REJECT";
  handleRejectRequest?: () => void;
  handleSessionCreation?: () => void;
  toastId?: string;
}

const Toast = ({
  user,
  type,
  handleRejectRequest,
  handleSessionCreation,
  toastId,
}: toastProps) => {
  const [show, setShow] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return <></>;
};

export default Toast;
