import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  cropName: "",
  cropCategory: "",
  plantedDate: "",
  expectedHarvestDate: "",
  quantity: "",
  unit: "kg",
  location: "",
  notes: "",
  status: "Planted",
};

const SellerHarvestCalendar = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyEntries = async () => {
    try {
      setLoading(true);
      const res = await API.get("/harvest-calendar/seller/my");
      setEntries(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load your harvest calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEntries();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cropName || !form.cropCategory || !form.plantedDate || !form.expectedHarvestDate || !form.quantity) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(form.expectedHarvestDate) < new Date(form.plantedDate)) {
      alert("Expected harvest date cannot be before planted date");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/harvest-calendar/${editingId}`, form);
        alert("Harvest calendar entry updated");
      } else {
        await API.post("/harvest-calendar", form);
        alert("Harvest calendar entry added");
      }

      resetForm();
      fetchMyEntries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save harvest calendar entry");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);

    setForm({
      cropName: entry.cropName,
      cropCategory: entry.cropCategory,
      plantedDate: entry.plantedDate?.slice(0, 10),
      expectedHarvestDate: entry.expectedHarvestDate?.slice(0, 10),
      quantity: entry.quantity,
      unit: entry.unit,
      location: entry.location || "",
      notes: entry.notes || "",
      status: entry.status,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (entryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this harvest entry?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/harvest-calendar/${entryId}`);
      alert("Harvest calendar entry deleted");
      fetchMyEntries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete harvest calendar entry");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Seller Harvest Calendar</h2>
      <p>Add and manage your expected crop harvest schedule.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "600px",
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>{editingId ? "Update Harvest Entry" : "Add Harvest Entry"}</h3>

        <input
          type="text"
          name="cropName"
          placeholder="Crop Name"
          value={form.cropName}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />

        <input
          type="text"
          name="cropCategory"
          placeholder="Crop Category"
          value={form.cropCategory}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />

        <label>
          Planted Date
          <input
            type="date"
            name="plantedDate"
            value={form.plantedDate}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </label>

        <label>
          Expected Harvest Date
          <input
            type="date"
            name="expectedHarvestDate"
            value={form.expectedHarvestDate}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </label>

        <input
          type="number"
          name="quantity"
          placeholder="Expected Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          min="0"
          style={{ padding: "8px" }}
        />

        <input
          type="text"
          name="unit"
          placeholder="Unit e.g. kg, ton, bundle"
          value={form.unit}
          onChange={handleChange}
          style={{ padding: "8px" }}
        />

        <input
          type="text"
          name="location"
          placeholder="Farm Location"
          value={form.location}
          onChange={handleChange}
          style={{ padding: "8px" }}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          style={{ padding: "8px" }}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ padding: "8px" }}
        >
          <option value="Planted">Planted</option>
          <option value="Growing">Growing</option>
          <option value="Ready to Harvest">Ready to Harvest</option>
          <option value="Harvested">Harvested</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ padding: "8px 14px" }}>
            {editingId ? "Update Entry" : "Add Entry"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: "8px 14px" }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>My Harvest Calendar Entries</h3>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>You have not added any harvest calendar entries yet.</p>
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
              <p><strong>Planted Date:</strong> {formatDate(entry.plantedDate)}</p>
              <p><strong>Expected Harvest:</strong> {formatDate(entry.expectedHarvestDate)}</p>
              <p><strong>Quantity:</strong> {entry.quantity} {entry.unit}</p>
              <p><strong>Location:</strong> {entry.location || "Not specified"}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleEdit(entry)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(entry._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerHarvestCalendar;