import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Explorer = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (pageNumber) => {
    try {
      setLoading(true);

      const { data } = await API.get(`/transactions?page=${pageNumber}`);

      setTransactions((prev) => [...prev, ...data.data.transactions]);
      setTotalPages(data.data.totalPages);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2>Transaction Explorer</h2>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {transactions.length === 0 && !loading ? (
        <p style={{ marginTop: "30px" }}>No transactions found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {transactions.map((txn) => (
            <div key={txn._id} style={transactionCard}>
              <div>
                <strong>{txn.title}</strong>
                <p>{txn.category}</p>
              </div>

              <div>
                <p>₹ {txn.amount}</p>
                <small>{new Date(txn.date).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {page < totalPages && (
        <button
          style={{ marginTop: "20px" }}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

const container = {
  maxWidth: "800px",
  margin: "50px auto"
};

const transactionCard = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  marginBottom: "10px"
};

export default Explorer;
