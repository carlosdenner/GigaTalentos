import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Award, Globe, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Sobre o Giga Talentos</h1>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
            <p className="text-gray-300 mb-6">
              O Giga Talentos é dedicado a descobrir, promover e conectar jovens talentos brasileiros com oportunidades
              em empreendedorismo e inovação. Acreditamos que o talento não conhece fronteiras, e nossa plataforma serve como uma ponte
              entre indivíduos talentosos e o cenário global de negócios.
            </p>
            <p className="text-gray-300 mb-6">
              Nossa missão é capacitar a próxima geração de empreendedores brasileiros, fornecendo-lhes uma plataforma para mostrar seus talentos, conectar-se com mentores e construir suas carreiras.
            </p>
            <Link href="/contact">
              <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">Entre em Contato</Button>
            </Link>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src="/handsup.jpg?height=400&width=600&text=Nossa+Missao"
              alt="Nossa Missão"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">O Que Fazemos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#10b981]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conectar Talentos</h3>
              <p className="text-gray-400">
                Conectamos indivíduos talentosos com patrocinadores, mentores e oportunidades.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#3b82f6]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Globe className="h-8 w-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exposição Global</h3>
              <p className="text-gray-400">Fornecemos uma plataforma para talentos brasileiros alcançarem um público global.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#1e90ff]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Award className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Desenvolvimento de Talentos</h3>
              <p className="text-gray-400">Oferecemos recursos e suporte para ajudar os talentos a crescer e se aprimorar.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#10b981]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Construção de Comunidade</h3>
              <p className="text-gray-400">Promovemos uma comunidade solidária de criadores e admiradores.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Nossa Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Carlos Denner", role: "Fundador & CEO", avatar: "/placeholder.svg?height=200&width=200&text=CD" },
            {
              name: "Maria Silva",
              role: "Diretora de Tecnologia",
              avatar: "/placeholder.svg?height=200&width=200&text=MS",
            },
            {
              name: "João Santos",
              role: "Coordenador de Talentos",
              avatar: "/placeholder.svg?height=200&width=200&text=JS",
            },
            {
              name: "Ana Costa",
              role: "Diretora de Marketing",
              avatar: "/placeholder.svg?height=200&width=200&text=AC",
            },
            { name: "Pedro Oliveira", role: "Gerente de Conteúdo", avatar: "/placeholder.svg?height=200&width=200&text=PO" },
            { name: "Luiza Ferreira", role: "Gerente de Comunidade", avatar: "/placeholder.svg?height=200&width=200&text=LF" },
          ].map((member) => (
            <Card key={member.name} className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  {/* <AvatarImage src={member.avatar} alt={member.name} /> */}
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#10b981] mb-4">{member.role}</p>
                <p className="text-gray-400 text-sm">Apaixonado por descobrir e promover talentos brasileiros.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Junte-se à Nossa Comunidade</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Seja você um indivíduo talentoso querendo mostrar suas habilidades, um patrocinador em busca da próxima grande estrela,
            ou um entusiasta que aprecia criatividade, há um lugar para você no Giga Talentos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register">
              <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">Cadastre-se Agora</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6]">
                Entre em Contato
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

