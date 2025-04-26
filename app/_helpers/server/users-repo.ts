import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";

const User = db.User;

export const usersRepo = {
  create,
  authenticate,
  getCurrent,
  getAll,
  delete: _delete,
  getById,
  update,
  changePassword
};

async function create(params: any) {
  // validate
  if (await User.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  const user = new User(params);

  const middleNames = ["Văn", "Thị", "Minh", "Anh"];

  if (params.firstName && params.lastName) {
    user.fullName = `${params.firstName} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${params.lastName}`;
  }
  user.phoneNumber = `09${Math.floor(Math.random() * 900000000) + 100000000}`;
  user.citizenId = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, "0");
  user.taxCode = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(6, "0");    user.bankCode = "VCB";
  user.status = 'pending';
  // Ensure role is always an array with at least 'guest'
  user.role = Array.isArray(params.role) ? params.role : (params.role ? [params.role] : ['guest']);
  if (!user.role.length) user.role = ['guest'];
  if (params.password) {
    // hash password
    user.passwordHash = bcrypt.hashSync(params.password, 10);
    user.hash = bcrypt.hashSync(params.password, 10);
  }


  // save user
  await user.save();
  return user;
}

async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!(user && bcrypt.compareSync(password, user.passwordHash))) {
    throw "Email or password is incorrect";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
    // expiresIn: '60000',
    // expiresIn: '5000',
  });

  return {
    user: user.toJSON(),
    token,
  };
}

async function getCurrent() {
  try {
    const currentUserId = headers().get("userId");
    return await User.findById(currentUserId);
  } catch {
    throw "Current User Not Found";
  }
}

async function getAll() {
  return await User.find();
}

async function _delete(id: string) {
  await User.findByIdAndDelete(id);
}

async function getById(id: string) {
  try {
    return await User.findById(id);
  } catch {
    throw "User Not Found";
  }
}

async function update(id: string, params: any) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.email !== params.email &&
    (await User.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }
  // hash password if it was entered
   if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // ensure role is always an array and has at least 'guest'
  if (params.role) {
    params.role = Array.isArray(params.role) ? params.role : [params.role];
    if (!params.role.length) {
      params.role = ['guest'];
    }
  }

  // copy params properties to user
  Object.assign(user, params);
  console.log('user:', user)
  console.log('params:', params);
  await user.save();
}

async function changePassword(id: string, currentPassword: string, newPassword: string, confirmPassword: string) {
  const user = await getById(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match");
  }

  // Compare current password with hashed password in the database
  const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Update the user's passwordHash field
  await update(id, { passwordHash: hashedPassword });

  return { message: "Password updated successfully" };
}
