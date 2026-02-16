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
    const {
      search,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1
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
      transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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


