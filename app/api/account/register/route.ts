import joi from 'joi'

import { usersRepo } from '@/app/_helpers/server'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  POST: register,
})

async function register(req: Request) {
  const body = await req.json()
  await usersRepo.create(body)

  return { message: 'Registration successful' }
}

register.schema = joi.object({
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
})
