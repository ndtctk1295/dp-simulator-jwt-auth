"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/app/store/use-user-store"
import { AlertCircle, Check, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { useUserService } from "@/app/_services"
import { zodResolver } from "@hookform/resolvers/zod"

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
      }
    ),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password must match.",
  path: ["confirmPassword"], // This will target the confirmPassword field
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

interface AccountFormProps {
  onComplete?: () => void
}

export function AccountForm({ onComplete }: AccountFormProps) {
  const { currentUser } = useUserStore()
  const userService = useUserService();
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema), // Ensure Zod validation is applied
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // form.trigger("currentPassword", )
      // adapter function that converts between the two error setting formats
      const setErrorAdapter = (field: string, error: { type: string; message: string }) => {
        form.setError("currentPassword", { 
            type: error.type,
            message: `${error.message}`
          });
        
      };
      
      await userService.changePassword(currentUser.id, data, setErrorAdapter);
      
      form.reset();

      setTimeout(() => {
        setShowPasswordForm(false);
      }, 1500);
    } catch (error: any) {
      // Do not reset the form on error
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and change your password.</p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Email Address</h4>
          <p className="text-sm text-muted-foreground">
            Your email address is <strong>{currentUser?.email}</strong>
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Password</h4>
          <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>

          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)} className="mt-2">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          ) : (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>
                  Make sure your new password is at least 8 characters and different from your current password.
                </CardDescription>
              </CardHeader>              
              <CardContent>
                <FormProvider {...form}>
                  <form id="password-form" onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                    {/* {form.formState.errors.root && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {form.formState.errors.root.message}
                        </AlertDescription>
                      </Alert>
                    )} */}

                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input id="currentPassword" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input id="newPassword" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input id="confirmPassword" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowPasswordForm(false)
      

                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Account Status</h4>
        <p className="text-sm text-muted-foreground">
          Your account is <strong>{currentUser?.status || "Active"}</strong>
        </p>
      </div>
    </div>
  )
}
