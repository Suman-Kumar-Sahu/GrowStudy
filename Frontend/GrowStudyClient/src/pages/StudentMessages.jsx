import React, { useState, useEffect, useContext } from "react";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/StudentMessages.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/notify/student/messages", { withCredentials: true });

        const msgs = res.data.map(msg => {
          let text = "";
          switch ((msg.status || "").toLowerCase()) {
            case "pending":
              text = `Your application for "${msg.jobId?.title}" is pending.`;
              break;
            case "reviewed":
              text = `Your application for "${msg.jobId?.title}" has been reviewed.`;
              break;
            case "selected":
              text = `Congratulations! You have been selected for "${msg.jobId?.title}".`;
              break;
            case "rejected":
              text = `We're sorry. You have been rejected for "${msg.jobId?.title}".`;
              break;
            default:
              text = `Update on your application for "${msg.jobId?.title}".`;
          }

          return {
            id: msg._id,
            jobTitle: msg.jobId?.title,
            company: msg.jobId?.company,
            status: msg.status,
            text,
          };
        });

        setMessages(msgs);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Delete a single message
  const handleRemove = async (id) => {
    try {
      await api.delete(`/notify/${id}`, { withCredentials: true });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.info("Notification removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove message");
    }
  };

  const handleClearAll = async () => {
    if (!messages.length) return;
    try {
      await api.delete("/notify/student/clear", { withCredentials: true });
      setMessages([]);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear all messages");
    }
  };

  if (loading) return <p className="loading-msg">Loading messages...</p>;
  if (!messages.length) return <p className="no-msg">No notifications yet.</p>; 

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h2 className="messages-title">Your Notifications</h2>
        <button className="btn-clear" onClick={handleClearAll}>Clear All</button>
      </div>

      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-card status-${msg.status?.toLowerCase()}`}>
            <div className="message-content">
              <h3>{msg.jobTitle || "Untitled Job"}</h3>
              <p><strong>Company:</strong> {msg.company || "Unknown"}</p>
              <p>{msg.text}</p>
            </div>
            <button className="btn-remove" onClick={() => handleRemove(msg.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
