import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";
import mongoose from 'mongoose'

const User = db.User;
const Transaction = db.Transaction;
const Account = db.Account;
export const transactionRepo = {
  getAll,
  getByUserId,
};

async function getAll() {
  return await Transaction.find();
}

async function getByUserId(userId: string) {
    try {
        const userAccounts = await Account.find({ user: new mongoose.Types.ObjectId(userId) });
        const accountIds = userAccounts.map(account => account._id);
        const transactions = await Transaction.find({ account: { $in: accountIds } });
        return transactions;
    } catch (error) {
        throw "Failed to retrieve transactions";
    }
}


