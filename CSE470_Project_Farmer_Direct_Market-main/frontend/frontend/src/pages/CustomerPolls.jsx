import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const CustomerPolls = () => {
  const { user } = useAuth();

  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPolls = async () => {
    try {
      const res = await API.get("/polls");
      setPolls(res.data);
    } catch (error) {
      setMessage("Failed to load polls.");
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const votePoll = async (pollId) => {
    try {
      const res = await API.post(`/polls/${pollId}/vote`);
      setMessage(res.data.message || "Vote submitted successfully.");
      fetchPolls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to vote.");
    }
  };

  const getMyVotes = (poll) => {
    const myVote = poll.votes?.find(
      (vote) => vote.customer?.toString() === (user?._id || user?.id)?.toString()
    );

    return myVote ? myVote.votes : 0;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Product Polls</h1>
        <p className="page-subtitle">
          Vote for products you want more. You can vote maximum 2 times in each poll.
        </p>
      </div>

      {message && <div className="info-box">{message}</div>}

      {polls.length === 0 ? (
        <div className="empty-state">No active polls available.</div>
      ) : (
        <div className="grid">
          {polls.map((poll) => {
            const myVotes = getMyVotes(poll);
            const votesLeft = 2 - myVotes;

            return (
              <div className="page-card" key={poll._id}>
                <h2 className="card-title">{poll.product?.name}</h2>

                <p>
                  <strong>Category:</strong> {poll.product?.category}
                </p>

                <p>
                  <strong>Seller:</strong> {poll.seller?.name}
                </p>

                <p>
                  <strong>Question:</strong> {poll.question}
                </p>

                <p>
                  <strong>Total Votes:</strong> {poll.totalVotes}
                </p>

                <p>
                  <strong>Your Votes:</strong> {myVotes} / 2
                </p>

                <p>
                  <strong>Ends At:</strong>{" "}
                  {new Date(poll.endsAt).toLocaleString()}
                </p>

                <button
                  className="primary-btn"
                  disabled={votesLeft <= 0}
                  onClick={() => votePoll(poll._id)}
                >
                  {votesLeft <= 0 ? "Maximum Votes Used" : `Vote (${votesLeft} left)`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerPolls;