// Validation functions based on the create-user-modal Zod schema
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (email.length < 6) return "Email must be at least 6 characters";
  if (email.length > 50) return "Email must be maximum 50 characters";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validateFirstName = (firstName: string): string | null => {
  if (!firstName) return "First name is required";
  if (firstName.length < 2) return "First name must be at least 2 characters";
  if (firstName.length > 50) return "First name must be maximum 50 characters";
  // Check for numbers and special characters, but allow Vietnamese characters
  const nameRegex = /^[A-Za-z\s\u00C0-\u024F\u1EA0-\u1EF9]+$/;
  if (!nameRegex.test(firstName)) return "First name cannot contain numbers or special characters";
  return null;
};

export const validateLastName = (lastName: string): string | null => {
  if (!lastName) return "Last name is required";
  if (lastName.length < 2) return "Last name must be at least 2 characters";
  if (lastName.length > 50) return "Last name must be maximum 50 characters";
  // Check for numbers and special characters, but allow Vietnamese characters
  const nameRegex = /^[A-Za-z\s\u00C0-\u024F\u1EA0-\u1EF9]+$/;
  if (!nameRegex.test(lastName)) return "Last name cannot contain numbers or special characters";
  return null;
};

export const validateStatus = (status: string): string | null => {
  if (!status) return "Status is required";
  if (!["pending", "active", "delete"].includes(status)) {
    return "Status must be pending, active, or delete";
  }
  return null;
};

export const validateRole = (role: string[]): string | null => {
  if (!Array.isArray(role) || role.length === 0) {
    return "At least one role is required";
  }
  const validRoles = ['admin', 'guest', 'user', 'dev'];
  if (role.some(r => !validRoles.includes(r))) {
    return "Invalid role selected";
  }
  return null;
};
