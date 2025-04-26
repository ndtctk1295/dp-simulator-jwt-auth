import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/registry/new-york/ui/button"
import { Button, buttonVariants } from "@/components/ui/button"
// import { UserAuthForm } from "@/app/(app)/examples/authentication/components/user-auth-form"
import { UserAuthForm } from "./components/login-form-test"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
      <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Container - Dark section with image */}
      <div className="relative flex w-full flex-col justify-center items-center bg-zinc-900 p-8 md:w-1/2 lg:w-2/5">
      <Image
            src="/logo/logo-napas.png"
            width={1450}
            height={390}
            // fill
            alt="Featured Image"
            className="object-cover"
            priority
          />
        {/* Image Container */}
      </div>

      {/* Right Container - Auth form */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2 lg:w-3/5">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[400px]">
          <div className="flex justify-end">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>

          <div className="grid gap-4">
            <Input type="email" placeholder="name@example.com" autoComplete="email" />
            <Button>Sign In with Email</Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}