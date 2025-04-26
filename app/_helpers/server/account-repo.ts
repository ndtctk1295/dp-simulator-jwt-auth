import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";
import mongoose from 'mongoose'
const Account = db.Account;

export const accountRepo = {
  create,
  delete: _delete,
  getById,
  update,
  getAll,
  getByUserId
};

async function getAll() {
  return await Account.find();
}

async function create(params: any) {
  // validate
  if (await Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  const account = new Account(params);

  const middleNames = ["Văn", "Thị", "Minh", "Anh"];

  if (params.firstName && params.lastName) {
    account.fullName = `${params.firstName} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${params.lastName}`;
  }
  account.phoneNumber = `09${Math.floor(Math.random() * 900000000) + 100000000}`;
  account.citizenId = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, "0");
  account.taxCode = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(6, "0");
  account.bankCode = "VCB";
  account.status = 'active';  
  if (params.password) {
    // hash password
    account.passwordHash = bcrypt.hashSync(params.password, 10);
    account.hash = bcrypt.hashSync(params.password, 10);
  }

  // save user
  await account.save();
  return account;
}





async function _delete(id: string) {
  await Account.findByIdAndDelete(id);
}

async function getById(id: string) {
  try {
    return await Account.findById(id);
  } catch {
    throw "Account Not Found";
  }
}

async function getByUserId(userId: string) {
  try {
    // console.log("userId: ", userId);
    // console.log("valid: ", mongoose.Types.ObjectId.isValid(userId));
    const objectId = new mongoose.Types.ObjectId(userId);
    // console.log(objectId);
    return await Account.find({ user: objectId });
  } catch {
    throw "Account Not Found";
  }
}

async function update(id: string, params: any) {
  const account = await Account.findById(id);

  // validate
  if (!account) throw "User not found";
  if (
    account.email !== params.email &&
    (await Account.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(account, params);

  await account.save();
}
