import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-[#0a192f] border-b border-gray-800 py-4 px-6 flex items-center justify-between">
      <div className="flex-1">{/* You can add a breadcrumb or page title here if needed */}</div>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input className="bg-[#1a2942] border-none text-white pl-10" placeholder="Search for talents..." />
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <Link href="/profile">
          <Button variant="ghost" className="text-white">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your Profile" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span>Your Profile</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}

