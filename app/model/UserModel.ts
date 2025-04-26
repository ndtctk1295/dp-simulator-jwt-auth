
interface IUser {
    id?: string
    email: string
    passwordHash?: string
    password?: string
    firstName: string
    lastName: string
    // fullName: string
    // phoneNumber: string
    // citizenId: string
    // taxCode: string
    // address: string
    // bankCode: string
    status: string
    // updatedAt?: Date
    // createdAt?: Date
    isDeleting?: boolean
    role: string[]
  }