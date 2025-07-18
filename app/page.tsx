import { Button } from "@/components/ui/button"
import Link from "next/link"
import FeaturedContent from "@/components/featured-content"
import HomepageCategories from "@/components/homepage-categories"

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo ao Giga Talentos</h1>
        <p className="text-xl text-gray-400 mb-4">
          Identificação, desenvolvimento e estímulo do potencial inovador de jovens brasileiros
        </p>
        <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
          Transformando talentos em soluções inovadoras através de desafios reais, mentorias especializadas e conexões estratégicas com o ecossistema empreendedor
        </p>
        <Link href="/categories">
          <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white text-lg px-8 py-4">Começar</Button>
        </Link>
      </section>

      <HomepageCategories />

      <FeaturedContent />

      <section className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pronto para desenvolver seu potencial inovador?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Junte-se a jovens talentos brasileiros em tecnologias emergentes, empreendedorismo e sustentabilidade
        </p>
        <Link href="/talents/add">
          <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white text-lg px-8 py-4">
            Submeter Seu Projeto
          </Button>
        </Link>
      </section>
    </div>
  )
}

