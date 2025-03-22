import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Medal, Clock, Star } from "lucide-react"

const TALENTS_DATA = {
  categories: [
    {
      id: 1,
      name: "Music",
      description: "Musical talents and abilities",
      thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      talents: [
        {
          id: 101,
          title: "Guitar Performance",
          description: "Fingerstyle guitar playing with focus on acoustic covers",
          image: "https://images.unsplash.com/photo-1555638024-3f2e549ebc69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: true,
          date: "2025-01-15"
        },
        {
          id: 102,
          title: "Piano Composition",
          description: "Original piano compositions in the contemporary classical style",
          image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: false,
          date: "2025-02-03"
        },
        {
          id: 103,
          title: "Music Production",
          description: "Electronic music production using Ableton Live",
          image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: false,
          date: "2024-12-20"
        }
      ]
    },
    {
      id: 2,
      name: "Visual Arts",
      description: "Drawing, painting and visual design skills",
      thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      talents: [
        {
          id: 201,
          title: "Digital Illustration",
          description: "Character design and concept art in Procreate",
          image: "https://images.unsplash.com/photo-1607934450279-8226727d03db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: true,
          date: "2025-01-25"
        },
        {
          id: 202,
          title: "Oil Painting",
          description: "Landscape and portrait painting in traditional oils",
          image: "https://images.unsplash.com/photo-1579762593175-20226054cad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: false,
          date: "2024-11-18"
        }
      ]
    },
    {
      id: 3,
      name: "Programming",
      description: "Software development and coding abilities",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      talents: [
        {
          id: 301,
          title: "React Development",
          description: "Frontend development with React and Next.js",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: true,
          date: "2025-02-10"
        },
        {
          id: 302,
          title: "Python Automation",
          description: "Creating scripts and tools for task automation",
          image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          featured: false,
          date: "2025-01-05"
        },
        {
          id: 303,
          title: "Mobile App Development",
          description: "Creating cross-platform apps with React Native",
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", 
          featured: false,
          date: "2024-12-15"
        }
      ]
    }
  ]
};

// Format date to be more readable
function formatDate(dateString: string | number | Date) {
  const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function TalentsPage() {
  const { categories } = TALENTS_DATA;
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">My Talents</h1>
          <p className="text-gray-400 mt-2">Showcase of my abilities across different categories</p>
        </div>
        
        <Link href="/add-talent">
          <Button className="bg-[#ff1493] hover:bg-[#ff1493]/80 text-white">
            Add New Talent
          </Button>
        </Link>
      </div>
      
      {categories.length > 0 ? (
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <Medal className="text-[#ff1493]" size={20} />
                <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.talents.map((talent) => (
                  <Card 
                    key={talent.id} 
                    className="bg-[#1a2942] border-gray-800 hover:shadow-lg hover:shadow-[#ff1493]/10 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-video bg-[#0a192f] overflow-hidden">
                      <Image
                        src={talent.image}
                        alt={talent.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2942] to-transparent opacity-60"></div>
                      {talent.featured && (
                        <div className="absolute top-2 right-2 bg-[#ff1493]/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Star className="mr-1" size={12} /> Featured
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-white mb-2">{talent.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {talent.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" /> {formatDate(talent.date)}
                        </span>
                        <Link href={`/talents/${talent.id}`}>
                          <Button size="sm" variant="outline" className="border-[#ff1493] text-[#ff1493] hover:bg-[#ff1493]/10">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {category.talents.length > 3 && (
                <div className="flex justify-end">
                  <Link href={`/categories/${category.name.toLowerCase()}`}>
                    <Button variant="ghost" className="text-[#ff1493] hover:text-[#ff1493] hover:bg-[#ff1493]/10">
                      View all in {category.name} →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a2942] rounded-lg border border-gray-800">
          <Medal className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-white mb-2">No talents added yet</h3>
          <p className="text-gray-400 mb-6">Start showcasing your abilities by adding your first talent</p>
          <Link href="/add-talent">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/80 text-white">
              Add Your First Talent
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}