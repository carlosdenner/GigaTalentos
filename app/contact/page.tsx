"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("general")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setName("")
      setEmail("")
      setSubject("general")
      setMessage("")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#10b981]/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="text-gray-400">info@risemeup.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Phone</h3>
                  <p className="text-gray-400">+250 788 123 456</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#1e90ff]/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-[#1e90ff]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Address</h3>
                  <p className="text-gray-400">Kigali Innovation City, Rwanda</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Office Hours</CardTitle>
              <CardDescription className="text-gray-400">When you can reach us</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-white">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-[#0a192f] border-gray-700"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="bg-[#0a192f] border-gray-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject} disabled={isLoading}>
                    <SelectTrigger className="bg-[#0a192f] border-gray-700">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="bg-[#0a192f] border-gray-700 min-h-[150px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

