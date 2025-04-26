import { apiHandler } from "@/app/_helpers/server/api";
import { consentRepo } from "@/app/_helpers/server/consent-repo";
import { transactionRepo } from "@/app/_helpers/server/transaction-repo";
import { ObTransactionRepo } from "@/app/_helpers/server/ObTransaction-repo";
import { parse } from "url";
import { NextApiResponse } from "next";

module.exports = apiHandler({
    POST: getFilteredTransactions,
})

async function getFilteredTransactions(req: Request, res: NextApiResponse) {
    try {
        const body = await req.json();
        const { userId, filters } = body;
    
        if (!userId) {
          return res.status(400).json({ message: "User ID is required in filters" });
        }
        const finalFilters = { ...filters, userId };
    
        return await ObTransactionRepo.getFilteredTransactions(finalFilters);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(400).json({ message: "Failed to fetch transactions" });
      }
}