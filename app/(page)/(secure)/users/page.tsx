
import { Metadata } from 'next'
import UsersClient from './UsersClient'

export const metadata: Metadata = {
  title: 'Users',
  description: 'List Users build using Tanstack Table.',
}


export default async function UsersPage() {


  return <UsersClient  />
}
