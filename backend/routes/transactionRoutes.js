import express from 'express';
import protectedToken from '../middleware/authMiddleware';
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { getDashboardSummary } from "../controllers/transactionController.js";
import { getCategoryBreakdown } from "../controllers/transactionController.js";

const router = express.Router();

router.route('/')
    .post(protectedToken, createTransaction)
    .get(protectedToken, getTransactions);

router.get("/summary", protectedToken, getDashboardSummary);
router.get("/category-breakdown", protectedToken, getCategoryBreakdown);

router.route('/:id')
    .get(protectedToken, getTransactionById)
    .put(protectedToken, updateTransaction)
    .delete(protectedToken, deleteTransaction);


export default router;