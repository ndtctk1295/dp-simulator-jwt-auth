'use client'

import { useUserService } from '@/app/_services'
import { validateEmail, validateFirstName, validateLastName, validateRole, validateStatus } from './validation-utils'
import defaultPassword from '../modals/constant/data'
// Function to validate all form fields
export const validateUserForm = (
  editableValues: Record<string, any>,
  setValidationErrors: (errors: Record<string, string>) => void
): boolean => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(editableValues.email);
  if (emailError) errors.email = emailError;
  
  const firstNameError = validateFirstName(editableValues.firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateLastName(editableValues.lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const statusError = validateStatus(editableValues.status);
  if (statusError) errors.status = statusError;
  
  const roleError = validateRole(editableValues.role);
  if (roleError) errors.role = roleError;
  
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return false;
  }
  
  return true;
};

// Hook for user operations
export const useUserOperations = () => {
  const userService = useUserService();
  
  // Create a new user
  const createUser = async (
    editableValues: Record<string, any>,
    onSuccess: () => void
  ) => {
    try {
      await userService.create({
        email: editableValues.email,
        firstName: editableValues.firstName,
        lastName: editableValues.lastName,
        status: 'pending',
        role: editableValues.role || ['guest'],
        password: defaultPassword
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  // Update an existing user
  const updateUser = async (
    userId: string,
    editableValues: Record<string, any>,
    onSuccess: () => void
  ) => {
    try {
      await userService.update(userId, {
        email: editableValues.email,
        firstName: editableValues.firstName,
        lastName: editableValues.lastName,
        status: editableValues.status,
        role: editableValues.role
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  return {
    createUser,
    updateUser
  };
};

// Function to validate a single field
export const validateField = (key: string, value: any) => {
  let error = null;
  
  switch (key) {
    case 'email':
      error = validateEmail(value);
      break;
    case 'firstName':
      error = validateFirstName(value);
      break;
    case 'lastName':
      error = validateLastName(value);
      break;
    case 'status':
      error = validateStatus(value);
      break;
    case 'role':
      error = validateRole(value);
      break;
  }
  
  return error;
};
