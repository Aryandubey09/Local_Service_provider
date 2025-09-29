import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://local-service-provider-5.onrender.com"); // Your backend

const ChatPopup = ({ userId, providerId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const roomId = [userId, providerId].sort().join("_");

  useEffect(() => {
    // Emit join room when component mounts
    socket.emit("join", roomId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup the event listener when component unmounts
    return () => socket.off("receiveMessage");
  }, [roomId]);

  const sendMessage = () => {
    if (msg.trim()) {
      const data = {
        roomId,
        senderId: userId,
        receiverId: providerId,
        message: msg,
      };

      // Emit the message to the server
      socket.emit("sendMessage", data);

      // Clear the message input field
      setMsg("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600 p-6 rounded-lg shadow-lg w-[350px] h-[400px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-white text-lg font-semibold">Chat</span>
          <button onClick={onClose} className="text-white text-2xl">
            ✖
          </button>
        </div>

        {/* Message Display Area */}
        <div className="overflow-y-auto flex-grow mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-white ${
                  m.senderId === userId ? "bg-blue-500" : "bg-red-500"
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Area */}
        <div className="flex">
          <input
            placeholder="Type a message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-grow p-2 rounded-l-lg border-none outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
