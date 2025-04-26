import mongoose, { FilterQuery } from "mongoose";
import { db } from "./db";
import { CONSENT_STATUS } from "@/app/constant/constant";

const Account = db.Account;
const Consent = db.Consent;
const User = db.User;

export const consentRepo = {
  getByUserId,
  update,
  getByStatus,
  getFilteredConsents
};

async function getByUserId(userId: string) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);
    const accounts = await Account.find({ user: objectId });
    const accountNumber = accounts.map((acc) => acc.accountNo);
    //  Extract user's identifiers
    const { phoneNumber, citizenId, taxCode } = user;
    // Extract the account numbers for consent lookup
    const consents = await Consent.find({
      $or: [
        { psuId: phoneNumber, psuType: "PHONE_NUMBER" },
        { psuId: citizenId, psuType: "CITIZENID" },
        { psuId: taxCode, psuType: "TAXCODE" },
        { psuId: { $in: accountNumber }, psuType: "ACCOUNT_NO"},
      ],
    });

    return consents;
  } catch {
    throw "Consents Not Found";
  }
}
async function getByStatus(userId: string) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);
    const accounts = await Account.find({ user: objectId });
    const accountNumber = accounts.map((acc) => acc.accountNo);
    //  Extract user's identifiers
    const { phoneNumber, citizenId, taxCode } = user;
    // Extract the account numbers for consent lookup
    const consents = await Consent.find({
      $or: [
        { psuId: phoneNumber, psuType: "PHONE_NUMBER" },
        { psuId: citizenId, psuType: "CITIZENID" },
        { psuId: taxCode, psuType: "TAXCODE" },
        { psuId: { $in: accountNumber }, psuType: "ACCOUNT_NO"},
      ],
      status: CONSENT_STATUS.AWAITING_AUTH,
    });

    return consents;
  } catch {
    throw "Consents Not Found";
  }
}

async function getData(userId: string, reqBody: any) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);
    //  Extract user's identifiers
    const { phoneNumber, citizenId, taxCode } = user;
    // Extract the account numbers for consent lookup
    const consents = await Consent.find(
      {
        $or: [
          { psuId: phoneNumber, psuType: "PHONE_NUMBER" },
          { psuId: citizenId, psuType: "CITIZENID" },
          { psuId: taxCode, psuType: "TAXCODE" },
        ],
        status: CONSENT_STATUS,
      },
      reqBody
    );

    if (consents.length === 0) {
      throw new Error("No consents found for this user");
    }
    return consents;
  } catch (err: any) {
    throw `Update failed: ${err.message}`;
  }
}

async function update(consentId: string, params: any) {
  try {
    const consent = await Consent.findByIdAndUpdate(consentId, params);
    return consent;
  } catch (err: any) {
    throw `Update failed: ${err.message}`;
  }
}

async function getFilteredConsents(filters: {
  userId: string;
  name?: string;
  fromDate?: Date;
  toDate?: Date;
  status?: string;
}): Promise<IConsent[]> {
  try {
    const objectId = new mongoose.Types.ObjectId(filters.userId);
    const user = await User.findById(objectId);
    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await Account.find({ user: objectId });
    const accountNumbers = accounts.map((acc) => acc.accountNo);

    const query: FilterQuery<IConsent> = {
      $or: [
        { psuId: user.phoneNumber, psuType: "PHONE_NUMBER" },
        { psuId: user.citizenId, psuType: "CITIZENID" },
        { psuId: user.taxCode, psuType: "TAXCODE" },
        { psuId: { $in: accountNumbers }, psuType: "ACCOUNT_NO" },
      ],
    };

    if (filters.name) {
      // Overwrite psuId with regex search if a name filter is provided
      query.psuId = { $regex: new RegExp(filters.name, "i") };
    }

    if (filters.fromDate || filters.toDate) {
      query.created = {};
      if (filters.fromDate) {
        const startDate = new Date(filters.fromDate);
        query.created.$gte = startDate;
      }
      if (filters.toDate) {
        const endDate = new Date(filters.toDate);
        query.created.$lte = endDate;
      }
    }

    if (filters.status) {
      query.status = filters.status;
    }

    return await Consent.find(query);
  } catch (error) {
    console.error("Error fetching consents:", error);
    throw new Error("Consents Not Found");
  }
}

