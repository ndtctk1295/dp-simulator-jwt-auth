import { apiHandler } from "@/app/_helpers/server/api";
import { ObTransactionRepo } from "@/app/_helpers/server/ObTransaction-repo";

module.exports = apiHandler({
  GET: getByDpTransactionId,
});

async function getByDpTransactionId(
  req: Request,
  { params: { dpTransactionId } }: any
) {
  return await ObTransactionRepo.findByDpTransactionId(dpTransactionId);
}
