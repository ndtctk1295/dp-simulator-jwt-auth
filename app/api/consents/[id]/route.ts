import { apiHandler } from "@/app/_helpers/server/api";
import { consentRepo } from "@/app/_helpers/server/consent-repo";
module.exports = apiHandler({
  GET: getByUserId,
  getByStatus,
  PUT: update,
  fetchData,
});

async function fetchData(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await consentRepo.update(id, body);
}

async function getByUserId(req: Request, { params: { id } }: any) {
  const consents = await consentRepo.getByUserId(id);
  return consents;
}
async function getByStatus(req: Request, { params: { id } }: any) {
  const consents = await consentRepo.getByStatus(id);
  return consents;
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await consentRepo.update(id, body);
}
