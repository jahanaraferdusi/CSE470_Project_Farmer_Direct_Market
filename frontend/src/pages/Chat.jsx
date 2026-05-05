import { useEffect, useState } from "react";
import API from "../services/api";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchChats = async () => {
    try {
      const res = await API.get("/chats/my-chats");
      setChats(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load chats");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openChat = async (chatId) => {
    try {
      const res = await API.get(`/chats/${chatId}`);
      setSelectedChat(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to open chat");
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please write a message");
      return;
    }

    try {
      const res = await API.post(`/chats/${selectedChat._id}/reply`, {
        text: message,
      });

      setSelectedChat(res.data.chat);
      setMessage("");
      fetchChats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat with Seller</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ width: "35%", borderRight: "1px solid #ccc" }}>
          <h3>Chats</h3>

          {chats.length === 0 && <p>No chats found</p>}

          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => openChat(chat._id)}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              <p>
                <strong>Product:</strong> {chat.product?.name}
              </p>

              {user?.role === "seller" ? (
                <p>
                  <strong>Customer:</strong> {chat.customer?.name}
                </p>
              ) : (
                <p>
                  <strong>Seller:</strong> {chat.seller?.name}
                </p>
              )}

              <p>
                {chat.messages?.[chat.messages.length - 1]?.text || "No messages"}
              </p>
            </div>
          ))}
        </div>

        <div style={{ width: "65%" }}>
          {!selectedChat ? (
            <p>Select a chat to view messages</p>
          ) : (
            <>
              <h3>{selectedChat.product?.name}</h3>

              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  height: "350px",
                  overflowY: "auto",
                  marginBottom: "10px",
                }}
              >
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      marginBottom: "10px",
                      textAlign:
                        msg.sender?._id === user?._id ? "right" : "left",
                    }}
                  >
                    <p>
                      <strong>{msg.sender?.name}:</strong> {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply}>
                <input
                  type="text"
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: "80%", padding: "10px" }}
                />

                <button type="submit" style={{ padding: "10px", marginLeft: "5px" }}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;