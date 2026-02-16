import Transaction from "../models/Transaction.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a new transaction
export const createTransaction = asyncHandler(async (req, res) => {
  const { title, amount, category, date, notes } = req.body;

  const transaction = new Transaction({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    notes,
  });

  res.status(201).json({
    success: true,
    message: "Transaction created successfully",
    data: transaction,
  });
});

// Get all transactions
export const getTransactions = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    page = 1,
  } = req.query;

  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  const query = { user: req.user._id };

  // Text Search
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // Category Filter
  if (category) {
    query.category = category;
  }

  // Date Range Filter
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Amount Range Filter
  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  res.json({
    success: true,
    message: "Transactions fetched successfully",
    data: {
      transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    },
  });
});

// Get transaction by id
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  res.json({
    success: true,
    message: "Transaction fetched successfully",
    data: transaction,
  });
});

// Update a transaction
export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  transaction.title = req.body.title ?? transaction.title;
  transaction.amount = req.body.amount ?? transaction.amount;
  transaction.category = req.body.category ?? transaction.category;
  transaction.date = req.body.date ?? transaction.date;
  transaction.notes = req.body.notes ?? transaction.notes;

  const updated = await transaction.save();
  res.json({
    success: true,
    message: "Transaction updated successfully",
    data: updated,
  });
});

// Delete a transaction
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  await transaction.deleteOne();

  res.json({
    success: true,
    message: "Transaction deleted successfully",
    data: null,
  });
});

// Get Transactions Summary
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const summary = await Transaction.aggregate([
    {
      $match: { user: userId },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data: {
      totalAmount: summary[0]?.totalAmount || 0,
      totalTransactions: summary[0]?.totalTransactions || 0,
    },
  });
});

// Get Category Breakdown
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const breakdown = await Transaction.aggregate([
    {
      $match: { user: userId },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  const formatted = breakdown.map((item) => ({
    category: item._id,
    total: item.total,
  }));

  res.json({
    success: true,
    message: "Category breakdown fetched successfully",
    data: formatted,
  });
});
