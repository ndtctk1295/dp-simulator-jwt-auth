interface ITransaction {
  _id: string; // MongoDB object ID
  instructedAmount: {
    value: number;
    currency: string;
  };
  balances: {
    value: number;
    currency: string;
  };
  instructionIdentification: string;
  commitDate: Date; 
  orderId: string;
  relatedParties: {
    debtor: {
      name: string;
      bankCode: string;
      accountNo: string;
    };
    creditor: {
      name: string;
      bankCode: string;
      accountNo: string;
    };
  };
  remittanceInformation: string;
  paymentId: string;
  paymentStatus: string;
  dpTransactionId: string;
  updatedDate: Date; 
  createdDate: Date; 
  account: string; // Account ID (in MongoDB ObjectID format)
  createdAt: Date; 
  updatedAt: Date; 
}

// amount: {
//   currency: string;
//   value: number;
// };
// balances: {
//   currency: string;
//   value: number;
// };
// creditDebitIndicator: string;
// valueDate: Date;
// relatedParties: {
//   debtor: {
//     name: string;
//     bankCode: string;
//     accountNo: string;
//   };
//   creditor: {
//     name: string;
//     bankCode: string;
//     accountNo: string;
//   };
// };
// additionalTransactionInformation: string;
// account: string;
// createdAt: Date;
// updatedAt: Date;