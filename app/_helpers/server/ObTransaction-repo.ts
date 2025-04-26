import mongoose, { FilterQuery } from "mongoose";
import { db } from "./db";

const User = db.User;
const ObTransaction = db.ObTransaction;
const Account = db.Account;
export const ObTransactionRepo = {
  findByDpTransactionId,
  getByUserId,
  getFilteredTransactions
};

async function findByDpTransactionId(dpTransactionId: string) {
  try {
    const query: FilterQuery<any> = {
      dpTransactionId,
    };

    const transactions = ObTransaction.findOne(query);
    return transactions;
  } catch (err: any) {
    throw `${err.message}`;
  }
}

async function getByUserId(userId: string) {
  try {
    const accountQuery: FilterQuery<any> = { user: userId };
    const accounts = await Account.find(accountQuery);
    if (!accounts.length) {
      return { success: false, message: 'No accounts found for this user.' };
    }
    const accountIds = accounts.map(account => account._id);
    const transactionQuery: FilterQuery<any> = { account: { $in: accountIds } };
    return await ObTransaction.find(transactionQuery).populate('account');
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, message: 'An error occurred while fetching transactions.' };
  }
}

async function getFilteredTransactions(filters: {
  userId: string;
  fromDate?: Date;
  toDate?: Date;
  paymentStatus?: string;
  account?: string;
  transactionType?: string;
}) {
  try {
    if (!filters.userId) {
      throw new Error("User ID is required");
    }
    const user = await User.findById(filters.userId);
    if (!user) {
      throw new Error("User not found");
    }
  
    // Default date range: last 30 days if both dates are not provided
    if (!filters.fromDate && !filters.toDate) {
      filters.toDate = new Date();
      filters.fromDate = new Date();
      filters.fromDate.setDate(filters.toDate.getDate() - 30);
    }
  
    const query: FilterQuery<ITransaction> = {};  
    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) {
        // Set fromDate to the start of the day
        const startDate = new Date(filters.fromDate);
        // startDate.setHours(0, 0, 0, 0);
        query.createdAt.$gte = startDate;
      }
      if (filters.toDate) {
        // Set toDate to the end of the day
        const endDate = new Date(filters.toDate);
        // endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
  
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
  
    if (filters.transactionType) {
      query.transactionType = filters.transactionType;
    }
  
    if (filters.account) {
      query.account = filters.account;
    } else {
      // if no accounts pass in filter, find all accounts of the user
      const userAccounts = await Account.find({
        user: new mongoose.Types.ObjectId(filters.userId)
      });
      const accountIds = userAccounts.map((account) => account._id);
      // find all transactions of the user's accounts
      query.account = { $in: accountIds };
    }
  
    // console.log("Query", query);
    return await ObTransaction.find(query);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error(`Error fetching transactions: ${error}`);
  }
}