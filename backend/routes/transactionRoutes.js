import express from 'express';
import protectedToken from '../middleware/authMiddleware';
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from '../controllers/transactionController';

const router = express.Router();

router.route('/')
    .post(protectedToken, createTransaction)
    .get(protectedToken, getTransactions);

router.route('/:id')
    .get(protectedToken, getTransactionById)
    .put(protectedToken, updateTransaction)
    .delete(protectedToken, deleteTransaction);

export default router;