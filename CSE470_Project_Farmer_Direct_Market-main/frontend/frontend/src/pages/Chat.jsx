import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      setNotice("");

      const res = await API.get("/chats/my-chats");
      setChats(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to load chats.");
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const openChat = async (chatId) => {
    try {
      setLoadingMessages(true);
      setNotice("");

      const res = await API.get(`/chats/${chatId}`);
      setSelectedChat(res.data);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to open chat.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();

    if (!selectedChat) {
      setNotice("Please select a chat first.");
      return;
    }

    if (!message.trim()) {
      setNotice("Please write a message.");
      return;
    }

    try {
      setSending(true);
      setNotice("");

      const res = await API.post(`/chats/${selectedChat._id}/reply`, {
        text: message.trim(),
      });

      setSelectedChat(res.data.chat);
      setMessage("");
      fetchChats();
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const selectedPerson = useMemo(() => {
    if (!selectedChat) return null;

    if (user?.role === "seller") {
      return selectedChat.customer;
    }

    return selectedChat.seller;
  }, [selectedChat, user?.role]);

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-BD", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getLastMessage = (chat) => {
    const lastMessage = chat.messages?.[chat.messages.length - 1];

    if (!lastMessage) {
      return "No messages yet";
    }

    return lastMessage.text;
  };

  const isMyMessage = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const userId = user?._id || user?.id;

    return senderId?.toString() === userId?.toString();
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>Chat With Seller</p>

          <h1 style={styles.title}>
            Keep your product conversations organized
          </h1>

          <p style={styles.subtitle}>
            Customers and sellers can discuss product details, availability,
            price, freshness, and delivery questions in one place.
          </p>
        </div>

        <div style={styles.heroActions}>
          <Link to="/" style={styles.homeButton}>
            Go to Home
          </Link>

          <button type="button" onClick={fetchChats} style={styles.refreshBtn}>
            Refresh Chats
          </button>
        </div>
      </section>

      {notice && <div style={styles.noticeBox}>{notice}</div>}

      <section style={styles.chatShell}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <h2 style={styles.sectionTitle}>My Chats</h2>
              <p style={styles.smallText}>
                Select a conversation to view messages.
              </p>
            </div>

            <span style={styles.chatCount}>{chats.length}</span>
          </div>

          {loadingChats ? (
            <div style={styles.emptyState}>Loading chats...</div>
          ) : chats.length === 0 ? (
            <div style={styles.emptyState}>
              <strong>No chats found.</strong>
              <p style={styles.emptyText}>
                Customer chats will appear here after a product message is
                started.
              </p>
            </div>
          ) : (
            <div style={styles.chatList}>
              {chats.map((chat) => {
                const person =
                  user?.role === "seller" ? chat.customer : chat.seller;

                const isSelected = selectedChat?._id === chat._id;

                return (
                  <button
                    key={chat._id}
                    type="button"
                    onClick={() => openChat(chat._id)}
                    style={{
                      ...styles.chatCard,
                      ...(isSelected ? styles.activeChatCard : {}),
                    }}
                  >
                    <div style={styles.avatar}>
                      {(person?.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div style={styles.chatCardBody}>
                      <div style={styles.chatCardTop}>
                        <strong style={styles.personName}>
                          {person?.name || "Unknown User"}
                        </strong>

                        <span style={styles.timeText}>
                          {formatTime(
                            chat.messages?.[chat.messages.length - 1]
                              ?.createdAt || chat.updatedAt
                          )}
                        </span>
                      </div>

                      <p style={styles.productName}>
                        Product: {chat.product?.name || "Unknown Product"}
                      </p>

                      <p style={styles.lastMessage}>{getLastMessage(chat)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <main style={styles.messagePanel}>
          {!selectedChat ? (
            <div style={styles.noChatSelected}>
              <div style={styles.largeIcon}>💬</div>
              <h2 style={styles.sectionTitle}>Select a chat</h2>
              <p style={styles.smallText}>
                Choose a conversation from the left side to start reading or
                replying.
              </p>

              <Link to="/" style={styles.secondaryHomeButton}>
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div style={styles.messageHeader}>
                <div style={styles.headerLeft}>
                  <div style={styles.bigAvatar}>
                    {(selectedPerson?.name || "U").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 style={styles.chatTitle}>
                      {selectedChat.product?.name || "Product Chat"}
                    </h2>

                    <p style={styles.smallText}>
                      Chatting with{" "}
                      <strong>{selectedPerson?.name || "Unknown User"}</strong>
                    </p>
                  </div>
                </div>

                <Link to="/" style={styles.smallHomeLink}>
                  Home
                </Link>
              </div>

              <div style={styles.productInfoBar}>
                <span>
                  <strong>Product:</strong>{" "}
                  {selectedChat.product?.name || "Unknown"}
                </span>

                {selectedChat.product?.price !== undefined && (
                  <span>
                    <strong>Price:</strong> ৳{selectedChat.product.price}
                  </span>
                )}

                <span>
                  <strong>Your role:</strong> {user?.role || "User"}
                </span>
              </div>

              <div style={styles.messagesBox}>
                {loadingMessages ? (
                  <div style={styles.emptyState}>Loading messages...</div>
                ) : selectedChat.messages?.length === 0 ? (
                  <div style={styles.emptyState}>No messages yet.</div>
                ) : (
                  selectedChat.messages?.map((msg) => {
                    const mine = isMyMessage(msg);

                    return (
                      <div
                        key={msg._id}
                        style={{
                          ...styles.messageRow,
                          justifyContent: mine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(mine
                              ? styles.myMessageBubble
                              : styles.otherMessageBubble),
                          }}
                        >
                          <div style={styles.messageSender}>
                            {mine ? "You" : msg.sender?.name || "User"}
                          </div>

                          <p style={styles.messageText}>{msg.text}</p>

                          <div
                            style={{
                              ...styles.messageTime,
                              color: mine ? "#e7f8ec" : "#6b7280",
                            }}
                          >
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendReply} style={styles.replyForm}>
                <input
                  type="text"
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={styles.messageInput}
                />

                <button type="submit" style={styles.sendButton} disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </main>
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #ffffff 45%, #ecfdf5 100%)",
    color: "#1f2937",
  },

  hero: {
    maxWidth: "1180px",
    margin: "0 auto 22px",
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  kicker: {
    margin: "0 0 8px",
    color: "#15803d",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "13px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: "1.15",
    color: "#14532d",
  },

  subtitle: {
    margin: "12px 0 0",
    maxWidth: "720px",
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  heroActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  homeButton: {
    background: "#15803d",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "800",
    boxShadow: "0 10px 20px rgba(21, 128, 61, 0.18)",
  },

  refreshBtn: {
    border: "1px solid #bbf7d0",
    background: "#ffffff",
    color: "#166534",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  noticeBox: {
    maxWidth: "1180px",
    margin: "0 auto 18px",
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "700",
  },

  chatShell: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: "18px",
    alignItems: "stretch",
  },

  sidebar: {
    background: "#ffffff",
    border: "1px solid #dcfce7",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
    minHeight: "620px",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "24px",
  },

  smallText: {
    margin: "6px 0 0",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  chatCount: {
    background: "#dcfce7",
    color: "#166534",
    minWidth: "38px",
    height: "38px",
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    fontWeight: "900",
  },

  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "540px",
    overflowY: "auto",
    paddingRight: "4px",
  },

  chatCard: {
    width: "100%",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "12px",
    display: "flex",
    gap: "12px",
    textAlign: "left",
    cursor: "pointer",
  },

  activeChatCard: {
    border: "1px solid #86efac",
    background: "#f0fdf4",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#15803d",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  chatCardBody: {
    minWidth: 0,
    flex: 1,
  },

  chatCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
  },

  personName: {
    color: "#1f2937",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  timeText: {
    color: "#6b7280",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  productName: {
    margin: "5px 0",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "800",
  },

  lastMessage: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  messagePanel: {
    background: "#ffffff",
    border: "1px solid #dcfce7",
    borderRadius: "22px",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
    minHeight: "620px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  noChatSelected: {
    flex: 1,
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "30px",
  },

  largeIcon: {
    fontSize: "54px",
    marginBottom: "8px",
  },

  secondaryHomeButton: {
    display: "inline-block",
    marginTop: "16px",
    color: "#166534",
    textDecoration: "none",
    fontWeight: "800",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "10px 14px",
    borderRadius: "12px",
  },

  messageHeader: {
    padding: "18px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
  },

  headerLeft: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  bigAvatar: {
    width: "54px",
    height: "54px",
    borderRadius: "999px",
    background: "#14532d",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: "900",
    fontSize: "20px",
  },

  chatTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "24px",
  },

  smallHomeLink: {
    color: "#166534",
    textDecoration: "none",
    fontWeight: "800",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "10px 14px",
    borderRadius: "12px",
  },

  productInfoBar: {
    padding: "12px 18px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    color: "#374151",
    fontSize: "14px",
  },

  messagesBox: {
    flex: 1,
    padding: "18px",
    overflowY: "auto",
    background:
      "linear-gradient(180deg, #ffffff 0%, #f8fff9 100%)",
  },

  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },

  messageBubble: {
    maxWidth: "72%",
    padding: "10px 13px",
    borderRadius: "16px",
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.06)",
  },

  myMessageBubble: {
    background: "#15803d",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },

  otherMessageBubble: {
    background: "#ffffff",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "4px",
  },

  messageSender: {
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "4px",
    opacity: 0.9,
  },

  messageText: {
    margin: 0,
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  messageTime: {
    marginTop: "6px",
    fontSize: "11px",
    textAlign: "right",
  },

  replyForm: {
    padding: "14px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "10px",
    background: "#ffffff",
  },

  messageInput: {
    flex: 1,
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
  },

  sendButton: {
    border: "none",
    background: "#15803d",
    color: "#ffffff",
    padding: "0 22px",
    borderRadius: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  emptyState: {
    background: "#f9fafb",
    border: "1px dashed #86efac",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    color: "#4b5563",
  },

  emptyText: {
    margin: "8px 0 0",
    color: "#6b7280",
    lineHeight: "1.5",
  },
};

export default Chat;