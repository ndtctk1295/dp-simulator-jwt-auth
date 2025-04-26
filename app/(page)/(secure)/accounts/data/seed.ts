import fs from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { statuses } from './data'

const users = Array.from({ length: 200 }, () => {
  // let createdAt = faker.date.past()
  // let updatedAt

  // // Ensure updatedAt is later than or equal to createdAt
  // do {
  //   updatedAt = faker.date.past(createdAt)
  // } while (updatedAt < createdAt)

  return {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    status: faker.helpers.arrayElement(statuses).value,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  }
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

fs.writeFileSync(
  path.join(__dirname, 'users.json'),
  JSON.stringify(users, null, 2)
)

console.log('✅ Users data generated.')
