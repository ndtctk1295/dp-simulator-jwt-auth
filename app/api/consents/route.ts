import { apiHandler } from "@/app/_helpers/server/api";
import { consentRepo } from "@/app/_helpers/server/consent-repo";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "url";
module.exports = apiHandler({
  POST: getFilteredConsents,
  getByStatus,
  PUT: update,
  fetchData,
});


async function fetchData(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await consentRepo.update(id, body);
}

async function getFilteredConsents(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { userId, filters } = body;
    if (!userId) {
      return { status: 400, body: { error: "User ID is required" } };
    }
    const finalFilters = { ...filters, userId };
    return await consentRepo.getFilteredConsents(finalFilters); 
  } catch (error) {
    console.error("Error fetching filtered consents:", error);
    return { status: 400, body: { error: `Failed to fetch consents: ${error}` } };
  }
}
async function getByStatus(req: Request, { params: { id } }: any) {
  return await consentRepo.getByStatus(id);
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await consentRepo.update(id, body);
}
