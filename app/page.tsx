import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Zap } from "lucide-react"
import FeaturedContent from "@/components/featured-content"

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error("Failed to fetch categories:", res.status);
      return [];
    }
    
    const data = await res.json();
    console.log("Categories data type:", typeof data, "is array:", Array.isArray(data));
    return Array.isArray(data) ? data.slice(0, 3) : []; // Limit to 3 categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories()

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo ao Giga Talentos</h1>
        <p className="text-xl text-gray-400 mb-8">Descubra os Empreendedores Brasileiros em Ascensão</p>
        <Link href="/categories">
          <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white text-lg px-8 py-4">Começar</Button>
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-white mb-6">Habilidades Empreendedoras Fundamentais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="bg-[#1a2942] border-gray-800">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-[#3b82f6] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}>
                  <Button variant="outline" className="w-full">
                    Explorar {category.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FeaturedContent />

      <section className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pronto para mostrar seu talento empreendedor?</h2>
        <p className="text-xl text-gray-400 mb-8">Junte-se a milhares de empreendedores talentosos em todo o Brasil</p>
        <Link href="/talents/add">
          <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white text-lg px-8 py-4">
            Submeter Seu Projeto
          </Button>
        </Link>
      </section>
    </div>
  )
}

