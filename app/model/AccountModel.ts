interface IAccount {
    id?: string
    accountNo: string
    accountName: string
    type: string
    openDate: Date
    currency: string
    availableBalance: {
      amount: {
        value: number;
      };
    };
    actualBalance: {
      amount: {
        value: number;
      };
    };
    holdBalance: {
      amount: {
        value: number;
      };
    };
    status: string
    user: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
  }