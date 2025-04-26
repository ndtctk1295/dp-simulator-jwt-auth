import { accountRepo } from "@/app/_helpers/server/account-repo";
import { usersRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";
async function getAll() {
    const accounts = await accountRepo.getAll();
    console.log('getAll:', accounts);
    return await accountRepo.getAll();
}

module.exports = apiHandler({
    GET: getAll,
  })