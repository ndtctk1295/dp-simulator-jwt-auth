import joi from 'joi'

import { cookies } from 'next/headers'

import { usersRepo } from '@/app/_helpers/server'
import { accountRepo } from '@/app/_helpers/server/account-repo'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  GET: getByUserId,
  PUT: update,
  DELETE: _delete,
})

async function getByUserId(req: Request, { params: { userId } }: any) {
  // console.log('getById:', userId);
    const accounts = await accountRepo.getByUserId(userId);
    // console.log('getAll:', accounts);
  return accounts
}

async function update(req: Request, { params: { userId } }: any) {
  const body = await req.json()
  await usersRepo.update(userId, body)
}

update.schema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string(),
  password: joi.string().min(8).allow(''),
})

async function _delete(req: Request, { params: { userId } }: any) {
  await usersRepo.delete(userId)

  // auto logout if deleted self
  if (userId === req.headers.get('userId')) {
    cookies().delete('authorization')
    return { deletedSelf: true }
  }
}
