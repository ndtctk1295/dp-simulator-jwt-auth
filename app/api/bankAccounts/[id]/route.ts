import joi from 'joi'

import { cookies } from 'next/headers'

import { usersRepo } from '@/app/_helpers/server'
import { accountRepo } from '@/app/_helpers/server/account-repo'
import { apiHandler } from '@/app/_helpers/server/api'

module.exports = apiHandler({
  GET: getById,
})

async function getById(req: Request, { params: { id } }: any) {
    // console.log('getById:', userId);
      const accounts = await accountRepo.getById(id);
      // console.log('getAll:', accounts);
    return accounts
  }