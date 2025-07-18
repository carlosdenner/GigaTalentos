import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Award, Globe, Heart, Users, Search, BookOpen, Eye, Handshake } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Sobre o Giga Talentos</h1>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
            <p className="text-gray-300 mb-6">
              O <strong>GigaTalentos</strong> é um programa dedicado à identificação, ao desenvolvimento e ao estímulo do potencial inovador de jovens brasileiros, especialmente aqueles com altas habilidades e interesses em tecnologias emergentes, empreendedorismo e sustentabilidade.
            </p>
            <p className="text-gray-300 mb-6">
              Acreditamos que o talento pode transformar a sociedade, e nosso compromisso é oferecer aos jovens um ambiente dinâmico e desafiador, repleto de oportunidades práticas e mentorias especializadas. Por meio de desafios reais, projetos educacionais e conexões estratégicas com o ecossistema empreendedor, capacitamos os participantes a construir suas carreiras, desenvolver competências essenciais e gerar soluções inovadoras que tenham impacto positivo no mundo.
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
                <Search className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Identificação e Conexão de Talentos</h3>
              <p className="text-gray-400">
                Descobrimos jovens com alto potencial e conectamos esses talentos a mentores experientes, oportunidades de aprendizagem e ao ecossistema de inovação.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#3b82f6]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Formação e Desenvolvimento</h3>
              <p className="text-gray-400">Proporcionamos desafios práticos, projetos educacionais e trilhas de aprendizagem específicas nas áreas de tecnologias emergentes, empreendedorismo e sustentabilidade.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#1e90ff]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Eye className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exposição e Oportunidades</h3>
              <p className="text-gray-400">Oferecemos visibilidade para que jovens talentos brasileiros possam demonstrar suas competências e se conectar com oportunidades reais em ambientes acadêmicos, empresariais e sociais.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6 text-center">
              <div className="bg-[#10b981]/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Handshake className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade e Colaboração</h3>
              <p className="text-gray-400">Construímos uma comunidade colaborativa que estimula a troca de conhecimentos, experiências e apoio mútuo entre participantes, mentores e parceiros.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Nossa Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              name: "Carlos Denner", 
              role: "Pesquisa & Desenvolvimento", 
              avatar: "/placeholder.svg?height=200&width=200&text=CD",
              initials: "CD",
              bio: "Focado em criar soluções inovadoras para identificar e desenvolver talentos brasileiros em tecnologias emergentes."
            },
            {
              name: "Paulo Angelo",
              role: "Idealizador & Coordenador Geral",
              avatar: "/placeholder.svg?height=200&width=200&text=PA",
              initials: "PA",
              bio: "Responsável pela concepção e coordenação do projeto, desenvolvendo estratégias para identificação e desenvolvimento dos participantes com alto potencial."
            },
            {
              name: "Leonardo Lazarte",
              role: "Diretor & Coordenador Executivo",
              avatar: "/placeholder.svg?height=200&width=200&text=LL",
              initials: "LL",
              bio: "Coordena operações e estratégias, garantindo alinhamento entre as ações do projeto, parceiros envolvidos e objetivos institucionais."
            },
          ].map((member) => (
            <Card key={member.name} className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  {/* <AvatarImage src={member.avatar} alt={member.name} /> */}
                  <AvatarFallback className="text-lg font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#10b981] mb-4">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Junte-se à Nossa Comunidade</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Se você é um jovem talento buscando desafios inovadores, um mentor disposto a compartilhar conhecimento e experiência, ou um parceiro interessado em promover a próxima geração de inovadores brasileiros, o GigaTalentos é o seu espaço. Faça parte dessa comunidade colaborativa e ajude a transformar ideias criativas em soluções reais para o futuro.
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

