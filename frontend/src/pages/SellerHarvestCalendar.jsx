import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerHarvestCalendar = () => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    productName: "",
    category: "",
    expectedHarvestDate: "",
    quantity: "",
    unit: "kg",
    expectedPrice: "",
    location: "",
    description: "",
    status: "Upcoming",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/harvest-calendar/seller",
        config
      );
      setItems(res.data || []);
    } catch (error) {
      setMessage("Failed to load harvest items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      productName: "",
      category: "",
      expectedHarvestDate: "",
      quantity: "",
      unit: "kg",
      expectedPrice: "",
      location: "",
      description: "",
      status: "Upcoming",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/harvest-calendar/${editingId}`,
          form,
          config
        );
        setMessage("Harvest item updated successfully.");
      } else {
        await axios.post(
          "http://localhost:5000/api/harvest-calendar",
          form,
          config
        );
        setMessage("Harvest item added successfully.");
      }

      resetForm();
      fetchItems();
    } catch (error) {
      setMessage("Failed to save harvest item.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      productName: item.productName || "",
      category: item.category || "",
      expectedHarvestDate: item.expectedHarvestDate
        ? item.expectedHarvestDate.slice(0, 10)
        : "",
      quantity: item.quantity || "",
      unit: item.unit || "kg",
      expectedPrice: item.expectedPrice || "",
      location: item.location || "",
      description: item.description || "",
      status: item.status || "Upcoming",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this harvest item?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/harvest-calendar/${id}`,
        config
      );
      setMessage("Harvest item deleted successfully.");
      fetchItems();
    } catch (error) {
      setMessage("Failed to delete harvest item.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.label}>SELLER DASHBOARD</p>
          <h1 style={styles.title}>Manage Harvest Calendar</h1>
          <p style={styles.subtitle}>
            Add and manage upcoming harvesting products before they become available.
          </p>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editingId ? "Update Harvest Product" : "Add Upcoming Harvest Product"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} name="productName" placeholder="Product Name" value={form.productName} onChange={handleChange} required />
          <input style={styles.input} name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input style={styles.input} type="date" name="expectedHarvestDate" value={form.expectedHarvestDate} onChange={handleChange} required />
          <input style={styles.input} type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />

          <select style={styles.input} name="unit" value={form.unit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="piece">piece</option>
            <option value="bundle">bundle</option>
            <option value="ton">ton</option>
          </select>

          <input style={styles.input} type="number" name="expectedPrice" placeholder="Expected Price" value={form.expectedPrice} onChange={handleChange} required />
          <input style={styles.input} name="location" placeholder="Location" value={form.location} onChange={handleChange} required />

          <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
            <option value="Upcoming">Upcoming</option>
            <option value="Harvesting Soon">Harvesting Soon</option>
            <option value="Available">Available</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Seller Notes / Description"
            value={form.description}
            onChange={handleChange}
          />

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryBtn}>
              {editingId ? "Update Harvest Item" : "Add Harvest Item"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} style={styles.secondaryBtn}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.listHeader}>
        <h2 style={styles.sectionTitle}>Your Harvest Items</h2>
        <span style={styles.count}>{items.length} item(s)</span>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>No harvest items added yet.</div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item._id} style={styles.itemCard}>
              <div style={styles.itemTop}>
                <div>
                  <h3 style={styles.itemName}>{item.productName}</h3>
                  <p style={styles.category}>{item.category}</p>
                </div>
                <span style={styles.badge}>{item.status}</span>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <small>Harvest Date</small>
                  <strong>{new Date(item.expectedHarvestDate).toLocaleDateString()}</strong>
                </div>
                <div style={styles.infoBox}>
                  <small>Quantity</small>
                  <strong>{item.quantity} {item.unit}</strong>
                </div>
                <div style={styles.infoBox}>
                  <small>Expected Price</small>
                  <strong>৳{item.expectedPrice}</strong>
                </div>
                <div style={styles.infoBox}>
                  <small>Location</small>
                  <strong>{item.location}</strong>
                </div>
              </div>

              {item.description && (
                <p style={styles.description}>{item.description}</p>
              )}

              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>
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

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#14532d",
    color: "white",
    borderRadius: "18px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },
  label: {
    letterSpacing: "2px",
    fontWeight: "700",
    fontSize: "13px",
    color: "#bbf7d0",
    margin: 0,
  },
  title: {
    fontSize: "42px",
    margin: "8px 0",
  },
  subtitle: {
    fontSize: "18px",
    maxWidth: "700px",
    color: "#dcfce7",
  },
  message: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    color: "#166534",
    padding: "14px 18px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontWeight: "700",
  },
  card: {
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    marginBottom: "32px",
  },
  cardTitle: {
    color: "#14532d",
    marginTop: 0,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    gridColumn: "1 / -1",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    minHeight: "90px",
    outline: "none",
  },
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    background: "#15803d",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "white",
    color: "#15803d",
    border: "1px solid #15803d",
    padding: "14px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  sectionTitle: {
    color: "#14532d",
    margin: 0,
  },
  count: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "700",
  },
  emptyBox: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    color: "#64748b",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "22px",
  },
  itemCard: {
    background: "white",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #dcfce7",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
  },
  itemName: {
    margin: 0,
    color: "#14532d",
    fontSize: "26px",
  },
  category: {
    margin: "6px 0 0",
    color: "#64748b",
    fontWeight: "700",
  },
  badge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: "999px",
    height: "fit-content",
    fontWeight: "700",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  infoBox: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "12px",
  },
  description: {
    marginTop: "16px",
    background: "#f0fdf4",
    padding: "14px",
    borderRadius: "12px",
    color: "#334155",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  },
  editBtn: {
    flex: 1,
    background: "#15803d",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default SellerHarvestCalendar;