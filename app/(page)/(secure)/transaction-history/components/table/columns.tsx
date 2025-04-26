import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

// TODO: bo sung them truong thong tin creditDebitIndicator trong transaction Model de biet giao dich nay la chuyen di hay nhan tien
export const columns: ColumnDef<ITransaction>[] = [
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Transaction Date' />
      ),
      cell: (row) => {
        let dateData = ""
        dateData = row.cell.getValue() as string;
        return dateData.slice(0, 10);
      }
    },
    {
      accessorKey: "instructedAmount",
      header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Amount' />
          ),
      cell: (row) => {
        // console.log("row :>> ", row.row.original);
        const instructedAmountObj = row.cell.getValue() as InstructedAmount;
        // const creditDebitIndicator = row.row.original.creditDebitIndicator;
        // const textColor = creditDebitIndicator === "DBIT" ? "text-red-600" : "text-green-600";
        const textColor = "text-red-600";
        return (
          <span className={`${textColor} font-bold`}>
            {/* {creditDebitIndicator === "DBIT" ? "-" : "+"} */}
            -
            {instructedAmountObj.value.toLocaleString()} {instructedAmountObj.currency}
          </span>
        );
      }
    },
    {
      accessorKey: "remittanceInformation",
      header: "Description",
    },
    {
      accessorKey: "relatedParties.creditor.name",
      header: "Beneficiary Unit / Transfer Unit",
    },
    {
      accessorKey: "relatedParties.creditor.accountNo",
      header: "Account Number",
    },
  ]
  

  interface InstructedAmount {
    value: number;
    currency: string;
  }