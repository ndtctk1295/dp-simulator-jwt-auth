import joi from 'joi'

import { usersRepo } from '@/app/_helpers/server'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  GET: getAll,
  POST: create,
})

async function getAll() {
  return await usersRepo.getAll()
}

async function create(req: Request) {
  const body = await req.json()
  const user = await usersRepo.create(body)
  const { id } = user

  return { message: 'Create User successful', user: { ...body, id } }
}

create.schema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  // password: joi.string().min(6).required(),
  password: joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
  role: joi.array().items(joi.string().valid('admin', 'guest', 'user', 'dev')).default(['guest'])
})
