"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddTalentPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically:
    // 1. Create a FormData object
    // 2. Append all the fields
    // 3. Send a POST request to your API

    console.log({ title, description, category, videoFile })

    // Redirect to the talents page after submission
    router.push("/talents")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Add Your Talent</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-[#1a2942] border-gray-700 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="singing">Singing</SelectItem>
              <SelectItem value="dancing">Dancing</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="art">Art</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="video">Upload Video</Label>
          <Input
            id="video"
            type="file"
            onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
            required
            accept="video/*"
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <Button type="submit" className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
          Submit Talent
        </Button>
      </form>
    </div>
  )
}

