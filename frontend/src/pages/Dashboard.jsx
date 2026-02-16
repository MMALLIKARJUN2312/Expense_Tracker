import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalTransactions: 0
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchCategories();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await API.get("/transactions/summary");
      setSummary(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/transactions/category-breakdown");
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={container}>
      <div style={header}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={cardContainer}>
        <div style={card}>
          <h3>Total Expenses</h3>
          <p>₹ {summary.totalAmount}</p>
        </div>

        <div style={card}>
          <h3>Total Transactions</h3>
          <p>{summary.totalTransactions}</p>
        </div>
      </div>

      <div style={categorySection}>
        <h3>Category Breakdown</h3>
        {categories.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          categories.map((cat, index) => (
            <div key={index} style={categoryItem}>
              <span>{cat.category}</span>
              <span>₹ {cat.total}</span>
            </div>
          ))
        )}
      </div>

      <button onClick={() => navigate("/explorer")}>
        Go to Transaction Explorer
      </button>
    </div>
  );
};

const container = {
  maxWidth: "800px",
  margin: "50px auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "30px"
};

const card = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center"
};

const categorySection = {
  marginTop: "40px"
};

const categoryItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee"
};

export default Dashboard;
