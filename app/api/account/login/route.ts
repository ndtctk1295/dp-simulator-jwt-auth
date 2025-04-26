import joi from 'joi'

import { cookies } from 'next/headers'
import { usersRepo } from '@/app/_helpers/server'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  POST: login,
})

async function login(req: Request) {
  const body = await req.json()
  const { user, token } = await usersRepo.authenticate(body)

  // return jwt token in http only cookie
  cookies().set('authorization', token, { httpOnly: true })

  return user
}

login.schema = joi.object({
  email: joi.string().required(),
  // password: joi.string().min(6).required(),
  password: joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
})
