import Transaction from "../models/Transaction.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      notes,
    });

    res.status(201).json({ transaction });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({
      user: req.user._id,
    });

    res.json({
      transactions,
      page,
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get transaction by id
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ transaction });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.title = req.body.title || transaction.title;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.category = req.body.category || transaction.category;
    transaction.date = req.body.date || transaction.date;
    transaction.notes = req.body.notes || transaction.notes;

    const updated = await transaction.save();
    res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Transactions Summary
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await Transaction.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalAmount: summary[0]?.totalAmount || 0,
      totalTransactions: summary[0]?.totalTransactions || 0
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Category Breakdown
export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;

    const breakdown = await Transaction.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const formatted = breakdown.map(item => ({
      category: item._id,
      total: item.total
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


