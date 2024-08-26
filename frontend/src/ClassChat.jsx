import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const ClassChat = () => {
  const classId = "668cdb92433d0ebad62fb2dc"; // Replace with the actual class ID
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const userToken = localStorage.getItem("userToken1");
  const socket = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://206.189.136.222:4008/api/user/getProfile",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(response.data.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userToken]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://206.189.136.222:4008/api/user/class/${classId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setMessages(response.data.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [classId, userToken]);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://206.189.136.222:4008");
    }

    if (user._id) {
      socket.current.emit("joinClass", { userId: user._id, classId });
      console.log("joined class", user._id, classId);
    }

    const handleNewMessage = (newMessage) => {
      console.log("new message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.current.on("newMessage", handleNewMessage);

    // Clean up the effect to avoid duplicate listeners
    return () => {
      socket.current.off("newMessage", handleNewMessage);
    };
  }, [user, classId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.current.emit("sendMessage", {
        userId:user._id,
        classId,
        message,
      });
      setMessage("");
    }
  };

  if (loading) return <div>Loading....</div>;

  return (
    <div className="class-chat">
      <h2>Class Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {/* {console.log(msg)} */}
            <strong>{msg.userId.name}: </strong> {msg.message}
            {/* {msg.message} */}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ClassChat;


// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const ClassChat = () => {
//   const classId = "668cdb92433d0ebad62fb2dc"; // Replace with the actual class ID
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [user, setUser] = useState({});
//   const [loading, setLoading] = useState(false);
//   const userToken = localStorage.getItem("userToken1");
//   const socket = useRef(null);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "http://localhost:4008/api/user/getProfile",
//           {
//             headers: {
//               Authorization: `Bearer ${userToken}`,
//             },
//           }
//         );
//         setUser(response.data.data.user);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [userToken]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4008/api/user/class/${classId}/messages`,
//           {
//             headers: {
//               Authorization: `Bearer ${userToken}`,
//             },
//           }
//         );
//         setMessages(response.data.data.messages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [classId, userToken]);

//   useEffect(() => {
//     if (!socket.current) {
//       socket.current = io("http://localhost:4008");
//     }

//     if (user._id) {
//       socket.current.emit("joinClass", { userId: user._id, classId });
//       console.log("joined class", user._id, classId);
//     }

//     const handleNewMessage = (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     };

//     socket.current.on("newMessage", handleNewMessage);

//     // Clean up the effect to avoid duplicate listeners
//     return () => {
//       socket.current.off("newMessage", handleNewMessage);
//     };
//   }, [user, classId]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.current.emit("sendMessage", {
//         userId: user._id,
//         classId,
//         message,
//       });
//       setMessage("");
//     }
//   };

//   if (loading) return <div>Loading....</div>;

//   return (
//     <div className="class-chat">
//       <h2>Class Chat</h2>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className="message">
//             <strong>{msg.userId.name}: </strong> {msg.message}
//             <img src={msg.userId.profileImage} alt={msg.userId.name} />
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ClassChat;

