import joi from 'joi'

import { cookies } from 'next/headers'

import { usersRepo } from '@/app/_helpers/server'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  GET: getById,
  PUT: update,
  DELETE: _delete,
})

async function getById(req: Request, { params: { id } }: any) {
  return await usersRepo.getById(id)
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json()
  // console.log('update user ben backend:', id, body)
  await usersRepo.update(id, body)
}

update.schema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string(),
  password: joi.string().min(8).allow(''),
  status: joi.string().valid('pending', 'delete', 'active'),
  role: joi.array().items(joi.string().valid('admin', 'guest', 'user', 'dev'))
})

async function _delete(req: Request, { params: { id } }: any) {
  await usersRepo.delete(id)

  // auto logout if deleted self
  if (id === req.headers.get('userId')) {
    cookies().delete('authorization')
    return { deletedSelf: true }
  }
}
