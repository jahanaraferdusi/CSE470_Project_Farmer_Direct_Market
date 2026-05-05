import { useEffect, useState } from "react";
import API from "../services/api";

const HarvestCalendar = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHarvestEntries = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (month) params.month = month;

      const res = await API.get("/harvest-calendar", { params });
      setEntries(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load harvest calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestEntries();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchHarvestEntries();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Harvest Calendar</h2>
      <p>View upcoming crops and expected harvest dates from sellers.</p>

      <form
        onSubmit={handleFilter}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search crop, category, location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", minWidth: "220px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Status</option>
          <option value="Planted">Planted</option>
          <option value="Growing">Growing</option>
          <option value="Ready to Harvest">Ready to Harvest</option>
          <option value="Harvested">Harvested</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <button type="submit" style={{ padding: "8px 14px" }}>
          Apply Filter
        </button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatus("");
            setMonth("");
            setTimeout(fetchHarvestEntries, 0);
          }}
          style={{ padding: "8px 14px" }}
        >
          Reset
        </button>
      </form>

      {loading ? (
        <p>Loading harvest calendar...</p>
      ) : entries.length === 0 ? (
        <p>No harvest calendar entries found.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {entries.map((entry) => (
            <div
              key={entry._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{entry.cropName}</h3>
              <p><strong>Category:</strong> {entry.cropCategory}</p>
              <p><strong>Seller:</strong> {entry.seller?.name || "Unknown Seller"}</p>
              <p><strong>Planted Date:</strong> {formatDate(entry.plantedDate)}</p>
              <p><strong>Expected Harvest:</strong> {formatDate(entry.expectedHarvestDate)}</p>
              <p><strong>Quantity:</strong> {entry.quantity} {entry.unit}</p>
              <p><strong>Location:</strong> {entry.location || "Not specified"}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HarvestCalendar;