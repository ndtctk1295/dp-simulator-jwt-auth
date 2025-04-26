"use client"

import type React from "react"

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from '@/app/store/use-user-store';
import { statuses } from '@/app/(page)/(secure)/accounts/data/data';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";

interface ProfileFormProps {
  onComplete?: () => void
}

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { currentUser } = useUserStore();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
    },
  });

  const handleSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted:", data);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName">First Name</Label>
                <FormControl>
                  <Input id="firstName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="lastName">Last Name</Label>
                <FormControl>
                  <Input id="lastName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input id="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />


          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  );
}
