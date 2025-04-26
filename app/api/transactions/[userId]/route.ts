import { transactionRepo } from '@/app/_helpers/server/transaction-repo'
import { apiHandler } from '@/app/_helpers/server/api'
import { ObTransactionRepo } from '@/app/_helpers/server/ObTransaction-repo';
module.exports = apiHandler({
    GET: getByUserId,
})

//TODO: COMPLETE THIS FUNCTION
async function getByUserId(req: Request, { params: { userId } }: any) {
    const transactions = await ObTransactionRepo.getByUserId(userId);
    // console.log('transactions:', transactions);
    return transactions;
  }