import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Award, Globe, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">About RiseMeUp</h1>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              RiseMeUp is dedicated to discovering, promoting, and connecting talented African youth with opportunities
              in creative fields. We believe that talent knows no boundaries, and our platform serves as a bridge
              between talented individuals and the global stage.
            </p>
            <p className="text-gray-300 mb-6">
              Our mission is to empower the next generation of African creators, performers, and artists by providing
              them with a platform to showcase their talents, connect with sponsors, and build their careers.
            </p>
            <Link href="/contact">
              <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Get in Touch</Button>
            </Link>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Our+Mission"
              alt="Our Mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#ff1493]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-[#ff1493]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Talent</h3>
              <p className="text-gray-400">
                We connect talented individuals with sponsors, mentors, and opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#9d4edd]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Globe className="h-8 w-8 text-[#9d4edd]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Exposure</h3>
              <p className="text-gray-400">We provide a platform for African talent to reach a global audience.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#1e90ff]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Award className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Talent Development</h3>
              <p className="text-gray-400">We offer resources and support to help talents grow and improve.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#ff1493]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#ff1493]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-400">We foster a supportive community of creators and fans.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "John Doe", role: "Founder & CEO", avatar: "/placeholder.svg?height=200&width=200&text=JD" },
            {
              name: "Jane Smith",
              role: "Chief Technology Officer",
              avatar: "/placeholder.svg?height=200&width=200&text=JS",
            },
            {
              name: "Michael Johnson",
              role: "Head of Talent Relations",
              avatar: "/placeholder.svg?height=200&width=200&text=MJ",
            },
            {
              name: "Sarah Williams",
              role: "Marketing Director",
              avatar: "/placeholder.svg?height=200&width=200&text=SW",
            },
            { name: "David Brown", role: "Content Manager", avatar: "/placeholder.svg?height=200&width=200&text=DB" },
            { name: "Emily Davis", role: "Community Manager", avatar: "/placeholder.svg?height=200&width=200&text=ED" },
          ].map((member) => (
            <Card key={member.name} className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#9d4edd] mb-4">{member.role}</p>
                <p className="text-gray-400 text-sm">Passionate about discovering and promoting African talent.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a talented individual looking to showcase your skills, a sponsor seeking the next big star,
            or a fan who appreciates creativity, there's a place for you at RiseMeUp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register">
              <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Sign Up Now</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-[#9d4edd] text-[#9d4edd]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

