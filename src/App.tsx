import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import ChatBot from "./component/ChatBot";
import { Toaster } from "react-hot-toast";
import ChatRoom from "./Chat/ChatRoom";
import ChatBot from "./page/ChatBot";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chat from "./page/Chat";
import Join from "./Join";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Join />} />
        <Route path={"/chat"} element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
