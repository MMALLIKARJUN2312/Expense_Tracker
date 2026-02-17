import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Explorer = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTransactions([]);
        setPage(1);
    }, [search, category, startDate, endDate, minAmount, maxAmount]);

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);


    const fetchTransactions = async (pageNumber) => {
        try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                page: pageNumber,
                search,
                category,
                startDate,
                endDate,
                minAmount,
                maxAmount
            });

            const { data } = await API.get(`/transactions?${queryParams}`);

            if (pageNumber === 1) {
                setTransactions(data.data.transactions);
            } else {
                setTransactions((prev) => [...prev, ...data.data.transactions]);
            }

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

            {/* FILTER SECTION */}
            <div style={filterContainer}>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min Amount"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Max Amount"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                />

                <button onClick={() => fetchTransactions(1)}>
                    Apply Filters
                </button>

                <button onClick={() => {
                    setSearch("");
                    setCategory("");
                    setStartDate("");
                    setEndDate("");
                    setMinAmount("");
                    setMaxAmount("");
                    setPage(1);
                    fetchTransactions(1);
                }}>
                    Reset
                </button>
            </div>

            {/* TRANSACTION LIST */}
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
                                <small>
                                    {new Date(txn.date).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
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

const filterContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
    marginTop: "20px"
};

export default Explorer;
