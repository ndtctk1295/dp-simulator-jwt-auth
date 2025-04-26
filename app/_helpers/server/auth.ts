import { cookies, headers } from 'next/headers'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const auth = {
  isAuthenticated,
  verifyToken,
}

function isAuthenticated() {
  try {
    verifyToken()
    return true
  } catch {
    return false
  }
}

function verifyToken() {
  const cookieToken = cookies().get('authorization')?.value ?? ''
  let headerToken
  try {
    if (headers().get('authorization')?.split(' ')[0] === 'Bearer') {
      headerToken = headers().get('authorization')?.split(' ')[1]
    }
  } catch (error) {
    console.error('error', error)
  }

  const token = headerToken?.trim() || cookieToken

  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  const id = decoded.sub as string

  return id
}
