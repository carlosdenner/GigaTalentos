import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, Eye, Heart } from "lucide-react"

async function getFeaturedProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/videos?featured=true&limit=12`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch featured projects")
  }

  const response = await res.json()
  return response.data || []
}

export default async function FeaturedProjectsPage() {
  const projects = await getFeaturedProjects()

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Projetos em Destaque</h1>
        <p className="text-gray-400 text-lg">
          Descubra projetos inovadores criados por talentos empreendedores da nossa comunidade
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <Card key={project._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-colors group">
            <CardContent className="p-0">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={project.thumbnail || "/placeholder.jpg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[#10b981] text-white">
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={project.channel_id?.avatar} alt={project.channel_id?.name} />
                    <AvatarFallback className="bg-[#3b82f6] text-white text-xs">
                      {project.channel_id?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-[#10b981] font-medium">{project.channel_id?.name}</p>
                    <p className="text-xs text-gray-500">Talento Empreendedor</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{project.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{project.likes?.length || 0}</span>
                    </div>
                  </div>
                  <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <Link href={`/channels/${project.channel_id?._id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#3b82f6] hover:from-[#059669] hover:to-[#2563eb] text-white">
                    Ver Projeto
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!projects || projects.length === 0 && (
        <div className="text-center py-12">
          <PlayCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum projeto em destaque ainda</h3>
          <p className="text-gray-500">
            Os projetos mais inovadores da nossa comunidade aparecerão aqui em breve!
          </p>
        </div>
      )}
    </div>
  )
}

