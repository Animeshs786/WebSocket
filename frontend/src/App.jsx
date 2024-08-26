import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const socket = useMemo(() => io("http://localhost:3000/"), []);

  const textHandler = (e) => {
    setText(e.target.value);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { id: user,message:text });
    setText("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
      setClient(socket.id);
    });
    socket.on("recive-message", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const userHandler = (e) => {
    setUser(e.target.value);
  };

  return (
    <>
      <h4>{client}</h4>
      <form onSubmit={formSubmitHandler}>
        <input
          placeholder="Enter your use id"
          onChange={(e) => userHandler(e)}
          value={user}
          type="text"
        />
        <input
          placeholder="Enter your message"
          onChange={(e) => textHandler(e)}
          value={text}
          type="text"
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
