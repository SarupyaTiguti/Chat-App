import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔄 Polling for real-time updates
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get("http://localhost:5000/messages");
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await axios.post("http://localhost:5000/send", {
      content: input,
    });

    setInput("");
    fetchMessages();
  };

  const deleteMe = async (id) => {
    await axios.put(`http://localhost:5000/delete/me/${id}`);
    fetchMessages();
  };

  const deleteAll = async (id) => {
    await axios.put(`http://localhost:5000/delete/all/${id}`);
    fetchMessages();
  };

  const pinMessage = async (id) => {
    await axios.put(`http://localhost:5000/pin/${id}`);
    fetchMessages();
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h1>Chat App</h1>

        {/* 🔥 PINNED SECTION */}
        

        {/* 💬 CHAT */}
        <div className="messages">
          {messages.map((msg) => {
            if (msg.deletedForEveryone)
              return (
                <div key={msg._id} className="message deleted">
                  Message deleted
                </div>
              );

            if (msg.deleted)
              return (
                <div key={msg._id} className="message deleted">
                  Deleted for you
                </div>
              );

            return (
              <div key={msg._id} className="message">
  <div className="msg-text">{msg.content}</div>

  <div className="msg-bottom">
    <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>

    <div className="actions">
      <button onClick={() => deleteMe(msg._id)}>Delete Me</button>
      <button onClick={() => deleteAll(msg._id)}>Delete All</button>
      <button onClick={() => pinMessage(msg._id)}>Pin</button>
    </div>
  </div>
</div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;