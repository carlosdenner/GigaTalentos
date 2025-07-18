"use client"

import Link from "next/link"
import { Heart, ListMusic, Zap, LogIn, UserPlus, Users, Star, User, LogOut, Search, Trophy, PlayCircle, BookOpen, Youtube } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

interface Desafio {
  _id: string;
  title: string;
  participants: number;
  category: {
    name: string;
  };
  difficulty: string;
}

export default function Sidebar() {
  const { user, signOut, isAuthenticated } = useAuth()
  const [popularDesafios, setPopularDesafios] = useState<Desafio[]>([])

  useEffect(() => {
    fetch('/api/desafios?sortBy=popularity&limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setPopularDesafios(data.data.slice(0, 4)) // Show top 4
        }
      })
      .catch(err => console.error('Error fetching desafios:', err))
  }, [])

  return (
    <aside className="w-64 bg-[#0a192f] border-r border-gray-800 h-screen sticky top-0 overflow-y-auto text-white flex flex-col">
        <div className="p-4">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold">
              <span className="text-[#10b981]">Giga</span>
              <span className="text-[#3b82f6]">Talentos</span>
            </span>
          </Link>
          <div className="text-[#3b82f6] text-sm mt-1">Empreendedorismo & Inovação</div>
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
            <BookOpen className="h-5 w-5 text-[#10b981]" />
            <span>Habilidades</span>
          </Link>
          <Link href="/videos" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <span>Vídeos</span>
          </Link>
          <Link href="/desafios" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Trophy className="h-5 w-5 text-[#3b82f6]" />
            <span>Desafios</span>
          </Link>
        </nav>

        <div className="mt-8 px-4">
          <h3 className="text-[#10b981] mb-4 text-sm font-semibold">DESCOBRIR</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/projetos" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span>Giga Projetos</span>
            </Link>
            <Link href="/featured-channels" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <PlayCircle className="h-5 w-5 text-gray-400" />
              <span>Giga Canais</span>
            </Link>
            <Link href="/talents" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span>Giga Talentos</span>
            </Link>
          </nav>
        </div>

        <div className="mt-8 px-4">
          <h3 className="text-[#3b82f6] mb-4 text-sm font-semibold">BIBLIOTECA PESSOAL</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/playlists" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <ListMusic className="h-5 w-5 text-gray-400" />
              <span>{isAuthenticated ? "Minhas Playlists" : "Playlists da Comunidade"}</span>
            </Link>
            <Link href="/favorites" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <Heart className="h-5 w-5 text-gray-400" />
              <span>{isAuthenticated ? "Meus Favoritos" : "Projetos Mais Curtidos"}</span>
            </Link>
          </nav>
        </div>

        <div className="mt-8 px-4 flex-grow">
          <h3 className="text-[#3b82f6] mb-4 text-sm font-semibold">DESAFIOS EM DESTAQUE</h3>
          <div className="flex flex-col gap-3">
            {popularDesafios.length > 0 ? (
              popularDesafios.map((desafio) => (
                <Link 
                  key={desafio._id} 
                  href={`/desafios/${desafio._id}`} 
                  className="flex items-start gap-3 text-gray-300 hover:text-white py-2 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate group-hover:text-[#10b981] transition-colors">
                      {desafio.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {desafio.participants} participantes
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Show loading or empty state while loading
              <div className="text-center text-gray-500 text-sm py-4">
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-gray-700 rounded-lg mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-1"></div>
                  <div className="h-2 bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            )}
          </div>
          <Link href="/desafios" className="text-[#3b82f6] hover:text-[#10b981] hover:underline text-sm block mt-4">
            Ver todos os desafios →
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
                      ?.split(" ")
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
    </aside>
  )
}