import { Value } from "@radix-ui/react-select";
import {
  Banknote,
  CreditCard,
  CreditCardIcon,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";

export const TypeAccount = [
  {
    id: "current",
    label: "Tài khoản thanh toán",
  },
  {
    id: "saving",
    label: "Tài khoản tiết kiệm",
  },
  {
    id: "foreign_currency",
    label: "Tài khoản ngoại tệ",
  },
  {
    id: "credit_card",
    label: "Thẻ tín dụng",
  },
  {
    id: "current_account",
    label: "Tài khoản Thanh Toán",
  },
];

export const Duration = [
  {
    id: "1",
    label: "15 ngày",
    value: 15,
  },
  {
    id: "2",
    label: "1 Tháng",
    value: 30,
  },
  {
    id: "3",
    label: "3 tháng",
    value: 90,
  },
  {
    id: "4",
    label: "6 tháng",
    value: 180,
  },
  {
    id: "5",
    label: "9 tháng",
    value: 270,
  },
  {
    id: "6",
    label: "12 tháng",
    value: 360,
  },
];

export const API_ACCESS = [
  {
    id: "ais",
    label: "AIS",
    value: [
      {
        id: "ACCOUNTS",
        label: "Lấy danh sách tài khoản",
      },
      {
        id: "ACCOUNT_DETAIL",
        label: "Lấy chi tiết thông tin tài khoản",
      },
      {
        id: "BALANCES",
        label: "Tra cứu số dư",
      },
      {
        id: "TRANSACTIONS",
        label: "lịch sử giao dịch",
      },
    ],
  },
  {
    id: "pis",
    label: "PIS",
    value: "PAYMENTS",
  },
];

export const CONSENT_STATUS = {
  AUTHORIZED: "AUTHORIZED",
  AWAITING_AUTH: "AWAITING_AUTH",
  SCA_TIMEOUT: "SCA_TIMEOUT",
  REJECT: "REJECT",
  REVOKE: "REVOKE",
  AWAITING: "AWAITING",
  EXPIRED: "EXPIRED",
};

export const PAYMENT_STATUS = {
  PDNG: 'PDNG',
  ACSP: 'ACSP',
  ACSC: 'ACSC',
  RJCT: 'RJCT',
  CANC: 'CANC',
  EXPR: 'EXPR',
  PAYMENT_STATUS: ['PDNG', 'ACSP', 'ACSC', 'RJCT', 'EXPR', 'CANC'],
}