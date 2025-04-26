import { CreditCard, PiggyBank, Briefcase, Banknote } from "lucide-react"; // Import icons
import { LucideIcon } from "lucide-react";
// Helper function to filter and enhance accounts
const prepareAccountsForDisplay = (
  accounts?: IAccount[]
): IPreparedAccount[] => {
  if (!Array.isArray(accounts)) {
    // console.error("Invalid data received");
    return [];
  }

  const accountTypeMapping: Record<
    string,
    { accountLabel: string; icon: LucideIcon }
  > = {
    TRAN: { accountLabel: "Tài khoản giao dịch", icon: CreditCard },
    SVGS: { accountLabel: "Tài khoản tiết kiệm", icon: PiggyBank },
    LOAN: { accountLabel: "Tài khoản vay", icon: Briefcase },
    CARD: { accountLabel: "Tài khoản tín dụng", icon: Banknote },
  };

  return accounts.map((account) => ({
    accountNo: account.accountNo,
    accountName: account.accountName,
    availableBalance: account.availableBalance?.amount?.value ?? 0,
    currency: account.currency ?? "N/A",
    type: account.type,
    accountLabel: accountTypeMapping[account.type]?.accountLabel ?? "Khác",
    icon: accountTypeMapping[account.type]?.icon ?? CreditCard,
    openDate: account.openDate,
    isActive: account.isActive,
    id: account.id,
    user: account.user,
    status: account.status,
    
  }));
};

export default prepareAccountsForDisplay;

export interface IPreparedAccount {
  id?: string;
  accountNo: string;
  accountName: string;
  availableBalance: number;
  currency: string;
  type: string;
  accountLabel: string;
  icon: LucideIcon;
  isActive: boolean;
  status: string;
  openDate: Date;
}


