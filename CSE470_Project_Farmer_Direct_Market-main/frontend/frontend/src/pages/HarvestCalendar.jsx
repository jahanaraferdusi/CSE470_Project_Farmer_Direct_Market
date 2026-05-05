import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const months = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const statuses = [
  { value: "", label: "All Status" },
  { value: "Planted", label: "Planted" },
  { value: "Growing", label: "Growing" },
  { value: "Ready to Harvest", label: "Ready to Harvest" },
  { value: "Harvested", label: "Harvested" },
  { value: "Cancelled", label: "Cancelled" },
];

const HarvestCalendar = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchHarvestEntries = async (customFilters = null) => {
    try {
      setLoading(true);
      setMessage("");

      const selectedSearch =
        customFilters?.search !== undefined ? customFilters.search : search;
      const selectedStatus =
        customFilters?.status !== undefined ? customFilters.status : status;
      const selectedMonth =
        customFilters?.month !== undefined ? customFilters.month : month;

      const params = {};

      if (selectedSearch.trim()) {
        params.search = selectedSearch.trim();
      }

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      if (selectedMonth) {
        params.month = selectedMonth;
      }

      const res = await API.get("/harvest-calendar", { params });

      if (Array.isArray(res.data)) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load harvest calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestEntries({
      search: "",
      status: "",
      month: "",
    });
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchHarvestEntries();
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setMonth("");

    fetchHarvestEntries({
      search: "",
      status: "",
      month: "",
    });
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysLeft = (date) => {
    if (!date) return "Not specified";

    const today = new Date();
    const harvestDate = new Date(date);

    if (Number.isNaN(harvestDate.getTime())) {
      return "Invalid date";
    }

    today.setHours(0, 0, 0, 0);
    harvestDate.setHours(0, 0, 0, 0);

    const difference = harvestDate - today;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days === 1 ? "" : "s"} left`;
    if (days === 0) return "Harvest expected today";
    return "Harvest date passed";
  };

  const getStatusStyle = (entryStatus) => {
    const baseStyle = {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: "700",
    };

    if (entryStatus === "Ready to Harvest") {
      return {
        ...baseStyle,
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (entryStatus === "Growing") {
      return {
        ...baseStyle,
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (entryStatus === "Planted") {
      return {
        ...baseStyle,
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (entryStatus === "Harvested") {
      return {
        ...baseStyle,
        background: "#ede9fe",
        color: "#5b21b6",
      };
    }

    if (entryStatus === "Cancelled") {
      return {
        ...baseStyle,
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      ...baseStyle,
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  const stats = useMemo(() => {
    const total = entries.length;
    const ready = entries.filter(
      (entry) => entry.status === "Ready to Harvest"
    ).length;
    const growing = entries.filter(
      (entry) => entry.status === "Growing"
    ).length;
    const planted = entries.filter(
      (entry) => entry.status === "Planted"
    ).length;

    return {
      total,
      ready,
      growing,
      planted,
    };
  }, [entries]);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>Public Harvest Calendar</p>

          <h1 style={styles.title}>Know what crops are coming soon</h1>

          <p style={styles.subtitle}>
            This calendar helps visitors, customers, sellers, and admins see
            upcoming harvests from sellers. Customers can understand when fresh
            products may become available, and sellers can share crop
            availability in advance.
          </p>

          <div style={styles.heroActions}>
            <Link to="/" style={styles.primaryLink}>
              Go to Home
            </Link>

            <a href="#calendar-list" style={styles.secondaryLink}>
              View Harvests
            </a>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h2 style={styles.infoTitle}>How to use it?</h2>

          <ul style={styles.infoList}>
            <li>Search by crop name, category, or location.</li>
            <li>Filter by harvest status or month.</li>
            <li>Check expected harvest dates before buying.</li>
            <li>Sellers can manage their own harvest plans separately.</li>
          </ul>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.total}</span>
          <span style={styles.statLabel}>Total Entries</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.ready}</span>
          <span style={styles.statLabel}>Ready to Harvest</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.growing}</span>
          <span style={styles.statLabel}>Growing</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.planted}</span>
          <span style={styles.statLabel}>Planted</span>
        </div>
      </section>

      <section style={styles.filterCard}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Find Harvest Information</h2>
            <p style={styles.sectionText}>
              Use filters to quickly find crops by name, location, status, or
              expected harvest month.
            </p>
          </div>

          <Link to="/" style={styles.homeSmallLink}>
            Back to Home
          </Link>
        </div>

        <form onSubmit={handleFilter} style={styles.form}>
          <input
            type="text"
            placeholder="Search crop, category, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            {statuses.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={styles.select}
          >
            {months.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button type="submit" style={styles.filterButton}>
            Apply Filter
          </button>

          <button type="button" onClick={handleReset} style={styles.resetButton}>
            Reset
          </button>
        </form>
      </section>

      {message && <div style={styles.errorBox}>{message}</div>}

      <section id="calendar-list" style={styles.listSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Harvest Calendar Entries</h2>
            <p style={styles.sectionText}>
              Browse upcoming and current harvest updates from sellers.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading harvest calendar...</div>
        ) : entries.length === 0 ? (
          <div style={styles.emptyState}>
            No harvest calendar entries found.
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {entries.map((entry) => (
              <article key={entry._id} style={styles.cropCard}>
                <div style={styles.cardTop}>
                  <div>
                    <h3 style={styles.cropTitle}>
                      {entry.cropName || "Unnamed Crop"}
                    </h3>
                    <p style={styles.cropCategory}>
                      {entry.cropCategory || "No category"}
                    </p>
                  </div>

                  <span style={getStatusStyle(entry.status)}>
                    {entry.status || "Unknown"}
                  </span>
                </div>

                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Seller</span>
                    <strong style={styles.detailValue}>
                      {entry.seller?.name || "Unknown Seller"}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Location</span>
                    <strong style={styles.detailValue}>
                      {entry.location || "Not specified"}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Planted Date</span>
                    <strong style={styles.detailValue}>
                      {formatDate(entry.plantedDate)}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Expected Harvest</span>
                    <strong style={styles.detailValue}>
                      {formatDate(entry.expectedHarvestDate)}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Quantity</span>
                    <strong style={styles.detailValue}>
                      {entry.quantity || 0} {entry.unit || "kg"}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Time Left</span>
                    <strong style={styles.detailValue}>
                      {getDaysLeft(entry.expectedHarvestDate)}
                    </strong>
                  </div>
                </div>

                {entry.notes && (
                  <div style={styles.notesBox}>
                    <span style={styles.detailLabel}>Seller Notes</span>
                    <p style={styles.notesText}>{entry.notes}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
    maxWidth: "1180px",
    margin: "0 auto 24px",
  },

  kicker: {
    margin: "0 0 10px",
    color: "#15803d",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "13px",
  },

  title: {
    margin: "0",
    fontSize: "42px",
    lineHeight: "1.1",
    color: "#14532d",
  },

  subtitle: {
    marginTop: "16px",
    maxWidth: "760px",
    color: "#4b5563",
    fontSize: "17px",
    lineHeight: "1.7",
  },

  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "22px",
  },

  primaryLink: {
    background: "#15803d",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "800",
    boxShadow: "0 10px 20px rgba(21, 128, 61, 0.18)",
  },

  secondaryLink: {
    background: "#ffffff",
    color: "#166534",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "800",
    border: "1px solid #bbf7d0",
  },

  infoCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #dcfce7",
    boxShadow: "0 18px 40px rgba(22, 101, 52, 0.1)",
  },

  infoTitle: {
    margin: "0 0 12px",
    color: "#14532d",
    fontSize: "22px",
  },

  infoList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#4b5563",
    lineHeight: "1.8",
  },

  statsGrid: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "14px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #dcfce7",
    boxShadow: "0 10px 25px rgba(22, 101, 52, 0.08)",
  },

  statNumber: {
    display: "block",
    fontSize: "32px",
    fontWeight: "900",
    color: "#15803d",
  },

  statLabel: {
    display: "block",
    marginTop: "4px",
    color: "#4b5563",
    fontWeight: "700",
  },

  filterCard: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #dcfce7",
    boxShadow: "0 12px 30px rgba(22, 101, 52, 0.08)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "26px",
  },

  sectionText: {
    margin: "6px 0 0",
    color: "#6b7280",
  },

  homeSmallLink: {
    color: "#166534",
    textDecoration: "none",
    fontWeight: "800",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "10px 14px",
    borderRadius: "12px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  input: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
  },

  select: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    background: "#ffffff",
    outline: "none",
  },

  filterButton: {
    border: "none",
    background: "#15803d",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  resetButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  errorBox: {
    maxWidth: "1180px",
    margin: "0 auto 20px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "700",
  },

  listSection: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  emptyState: {
    background: "#ffffff",
    border: "1px dashed #86efac",
    borderRadius: "18px",
    padding: "30px",
    textAlign: "center",
    color: "#4b5563",
    fontWeight: "700",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: "18px",
  },

  cropCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #dcfce7",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  cropTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "24px",
  },

  cropCategory: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontWeight: "700",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
  },

  detailItem: {
    background: "#f9fafb",
    borderRadius: "14px",
    padding: "12px",
    border: "1px solid #f3f4f6",
  },

  detailLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "4px",
    fontWeight: "700",
  },

  detailValue: {
    color: "#1f2937",
    fontSize: "15px",
  },

  notesBox: {
    marginTop: "14px",
    background: "#f0fdf4",
    borderRadius: "14px",
    padding: "12px",
    border: "1px solid #bbf7d0",
  },

  notesText: {
    margin: "4px 0 0",
    color: "#374151",
    lineHeight: "1.6",
  },
};

export default HarvestCalendar;