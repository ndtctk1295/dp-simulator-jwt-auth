interface IConsent{
  id: string;
  tppId: string;
  permissions: string;
  period: number;
  psuType: string;
  psuId: string;
  status: string;
  consentId: string;
  bankCode: string;
  dpTransactionId: string;
  obTransactionId: string;
  paymentStatus: string;
  orderId: string;
  approvalAccounts: string[];
  createdAt: Date;
  updateAt: Date;
}