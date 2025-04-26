import { PAYMENT_STATUS } from "@/app/constant/constant";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Account: accountModel(),
  Transaction: transactionModel(),
  Consent: consentModel(),
  ObTransaction: obTransactionModel()
};

// mongoose models with schema definitions

function userModel() {
  const schema = new Schema(
    {
      email: { type: String, unique: true, required: true },
      hash: { type: String, required: true },
      passwordHash: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      citizenId: { type: String, maxlength: 20, required: true },
      taxCode: { type: String, maxlength: 13 },
      address: { type: String, maxlength: 255 },
      bankCode: { type: String, required: true, maxlength: 6 },
      status: { type: String, required: true, maxlength: 10 },
      role: { type: [String], required: true, default: ['guest'] },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.User || mongoose.model("User", schema);
}

function accountModel() {
  const accountSchema = new Schema(
    {
      accountNo: { type: String, required: true, maxlength: 34, unique: true },
      accountName: { type: String, required: true, maxlength: 50 },
      type: {
        type: String,
        required: true,
        maxlength: 4,
        enum: ["TRAN", "SVGS", "LOAN", "CARD"],
      },
      openDate: { type: Date },
      currency: { type: String, required: true, maxlength: 3 },
      availableBalance: {
        amount: {
          value: { type: Number, required: true },
          currency: { type: String, required: true, maxlength: 3 },
        },
      },
      actualBalance: {
        amount: {
          value: { type: Number, required: true },
          currency: { type: String, required: true, maxlength: 3 },
        },
      },
      holdBalance: {
        amount: {
          value: { type: Number },
          currency: { type: String, maxlength: 3 },
        },
      },
      status: { type: String, required: true, maxlength: 10 },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  accountSchema.virtual("isActive").get(function () {
    return !!this.status;
  });

  accountSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
    },
  });

  // return mongoose.models.User || mongoose.model('Account', accountSchema)
  return mongoose.models.Account || mongoose.model("Account", accountSchema);
}

function obTransactionModel() {
  const obTransactionSchema = new Schema(
    {
      instructedAmount: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, maxlength: 3 },
      },
      balances: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, maxlength: 3 },
      },
      instructionIdentification: {
        type: String,
        required: true,
        maxlength: 57,
      },
      commitDate: { type: Date, required: false },
      orderId: { type: String, maxlength: 57, unique: true },
      relatedParties: {
        debtor: {
          name: { type: String, required: true, maxlength: 140 },
          bankCode: { type: String, required: true, maxlength: 8 },
          accountNo: { type: String, required: true, maxlength: 34 },
        },
        creditor: {
          name: { type: String, required: true, maxlength: 140 },
          bankCode: { type: String, required: true, maxlength: 6 },
          accountNo: { type: String, required: true, maxlength: 34 },
        },
      },
      remittanceInformation: {
        type: String,
        required: true,
        maxlength: 255,
      },
      paymentId: { type: String, required: false, maxlength: 57 },
      paymentStatus: {
        type: String,
        required: true,
        enum: PAYMENT_STATUS.PAYMENT_STATUS,
      },
      dpTransactionId: { type: String, required: true, maxlength: 57 },
      updatedDate: { type: Date, required: true },
      createdDate: { type: Date, required: true },
      cancelDate: { type: Date, required: false },
      account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    },
    { timestamps: true }
  );

  obTransactionSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
    },
  });

  return (
    mongoose.models.ObTransactions ||
    mongoose.model("ObTransactions", obTransactionSchema)
  );
}

function transactionModel() {
  const transactionSchema = new Schema(
    {
      amount: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, maxlength: 3 },
      },
      balances: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, maxlength: 3 },
      },
      creditDebitIndicator: {
        type: String,
        required: true,
        maxlength: 4,
        enum: ["CRDT", "DBIT"],
      },
      valueDate: { type: Date, required: true },
      relatedParties: {
        debtor: {
          name: { type: String, required: true, maxlength: 50 },
          bankCode: { type: String, required: true, maxlength: 6 },
          accountNo: { type: String, required: true, maxlength: 34 },
        },
        creditor: {
          name: { type: String, required: true, maxlength: 50 },
          bankCode: { type: String, required: true, maxlength: 6 },
          accountNo: { type: String, required: true, maxlength: 34 },
        },
      },
      additionalTransactionInformation: { type: String, maxlength: 255 },
      account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  transactionSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
    },
  });

  return (
    mongoose.models.Transaction ||
    mongoose.model("Transaction", transactionSchema)
  );
}

function consentModel() {
  const consentSchema = new Schema(
    {
      tppId: { type: String, required: true, maxlength: 13 },
      //  CHECK permissions data type!!!
      //  permissions: { type: [String], required: true, enum: ["ACCOUNTS", "BALANCES", "TRANSACTIONS", "ACCOUNT_DETAIL", "PAYMENTS", "PAYMENT_CANCEL", "PAYMENT_STATUS"] },
      permissions: { type: String, required: true },
      period: { type: Number, required: true },
      psuType: {
        type: String,
        required: true,
        enum: ["PHONENUMBER", "ACCOUNTNO", "CITIZENID", "TAXCODE"],
      },
      psuId: { type: String, required: true, maxlength: 2000 },
      status: {
        type: String,
        required: true,
        enum: [
          "AWAITING_AUTH",
          "AUTHORIZED",
          "SCA_TIMEOUT",
          "REJECT",
          "REVOKE",
        ],
      },
      dpTransactionId: { type: String, required: true, maxlength: 57 },
      paymentStatus: { type: String },
      orderId: { type: String },
      approvalAccounts: [{ type: String }],
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  consentSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
    },
  });

  return mongoose.models.Consent || mongoose.model("Consent", consentSchema);
}
