"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function ProfileForm() {
  const [urls, setUrls] = useState(["https://shadcn.com", "http://twitter.com/shadcn"])

  const addUrl = () => {
    setUrls([...urls, ""])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <form className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="shadcn" />
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym. You can only change this once
            every 30 days.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Select>
            <SelectTrigger id="email">
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email1">email@example.com</SelectItem>
              <SelectItem value="email2">another@example.com</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            You can manage verified email addresses in your email settings.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" defaultValue="I own a computer." />
          <p className="text-sm text-muted-foreground">
            You can @mention other users and organizations to link to them.
          </p>
        </div>

        <div className="space-y-2">
          <Label>URLs</Label>
          <p className="text-sm text-muted-foreground">Add links to your website, blog, or social media profiles.</p>

          <div className="space-y-2">
            {urls.map((url, index) => (
              <Input key={index} defaultValue={url} />
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addUrl} className="mt-2">
            Add URL
          </Button>
        </div>

        <Button type="submit">Update profile</Button>
      </form>
    </div>
  )
}
