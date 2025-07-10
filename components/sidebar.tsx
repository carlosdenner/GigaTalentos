"use client"

import Link from "next/link"
import { Heart, ListMusic, Zap, LogIn, UserPlus, Users, Star, User, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function Sidebar() {
  const { user, signOut, isAuthenticated } = useAuth()

  return (
    <aside className="w-64 bg-[#0a192f] border-r border-gray-800 h-screen sticky top-0 overflow-y-auto">
      <div className="w-64 flex-shrink-0 bg-[#0a192f] text-white flex flex-col border-r border-gray-800 overflow-y-auto">
        <div className="p-4">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold">
              <span className="text-[#10b981]">Giga</span>
              <span className="text-[#3b82f6]">Talentos</span>
            </span>
          </Link>
          <div className="text-[#3b82f6] text-sm mt-1">Empreendedorismo & Tecnologia</div>
        </div>

        <div className="mt-6 px-4">
          <Link href="/search">
            <Button variant="default" className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              <Search className="h-4 w-4 mr-2" />
              Descobrir
            </Button>
          </Link>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <Link href="/categories" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Zap className="h-5 w-5 text-[#3b82f6]" />
            <span>Habilidades</span>
          </Link>
          <Link href="/desafios" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Users className="h-5 w-5 text-[#3b82f6]" />
            <span>Desafios</span>
          </Link>
          <Link href="/favorites" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Heart className="h-5 w-5 text-[#3b82f6]" />
            <span>{isAuthenticated ? "Seus Favoritos" : "Vídeos Populares"}</span>
          </Link>
        </nav>

        <div className="mt-8 px-4">
          <h3 className="text-[#3b82f6] mb-4">{isAuthenticated ? "Seus Vídeos" : "Vídeos"}</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/playlist" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <ListMusic className="h-5 w-5 text-gray-300" />
              <span>{isAuthenticated ? "Sua Playlist" : "Vídeos Populares"}</span>
            </Link>
          </nav>
        </div>

        <div className="mt-8 px-4 flex-grow">
          <h3 className="text-[#3b82f6] mb-4">Desafios Populares</h3>
          <div className="flex flex-col gap-3">
            <Link href="/desafios/1" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span>Habilidade Cognitiva</span>
            </Link>
            <Link href="/desafios/2" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <span>Criatividade</span>
            </Link>
            <Link href="/desafios/3" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span>Motivação</span>
            </Link>
            <Link href="/desafios/4" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span>Liderança</span>
            </Link>
          </div>
          <Link href="/desafios" className="text-[#3b82f6] hover:underline text-sm block mt-2">
            Ver todos os desafios
          </Link>
        </div>

        <div className="mt-auto p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 text-gray-300 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{user?.name}</span>
              </div>
              <Button variant="outline" className="w-full border-[#3b82f6] text-[#3b82f6]" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-[#3b82f6] text-[#3b82f6]">
                  <LogIn className="mr-2 h-4 w-4" /> Entrar
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">
                  <UserPlus className="mr-2 h-4 w-4" /> Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="p-4 border-t border-gray-800">
            <Link href="/profile" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <User className="h-5 w-5" />
              <span>Seu Perfil</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}