import joi from 'joi';
import { usersRepo } from '@/app/_helpers/server';
import { NextRequest, NextResponse } from 'next/server';

// Define the schema directly here instead of as a property of a function
const schema = joi.object({
  currentPassword: joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: joi.string().min(8).required().messages({
    'string.min': 'New password must be at least {#limit} characters long',
    'string.empty': 'New password is required',
  }),
  confirmPassword: joi.string().min(8).required().messages({
    'string.min': 'Confirm password must be at least {#limit} characters long',
    'string.empty': 'Confirm password is required',
  }),
});

// Export a POST handler function directly (Next.js App Router style)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    // Validate schema first
    const { error } = schema.validate(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = body;
    
    try {

      await usersRepo.changePassword(params.id, currentPassword, newPassword, confirmPassword);

      return NextResponse.json(
        { message: 'Password updated successfully' }, 
        { status: 200 }
      );
    } catch (validationError: any) {

      return NextResponse.json(
        { message: validationError.message },
        { status: 400 } // Use 400 for client-side validation errors
      );
    }
  } catch (err: any) {
    // This catches JSON parsing errors or other unexpected server errors
    console.error('Error in changePassword route:', err);
    return NextResponse.json(
      { message: err.message || 'An unexpected error occurred' },
      { status: 500 } // Use 500 for server errors
    );
  }
}
// Updated change password API
