"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect, useState } from "react";

// Fallback categories for when database is unavailable
const fallbackCategories = [
  {
    _id: "1",
    name: "Habilidade Cognitiva & Técnica",
    description: "Capacidade de resolver problemas complexos, pensamento analítico e competências técnicas específicas.",
    thumbnail: "/placeholder.jpg"
  },
  {
    _id: "2", 
    name: "Criatividade & Inovação",
    description: "Capacidade de gerar ideias originais e implementar soluções inovadoras para desafios existentes.",
    thumbnail: "/placeholder.jpg"
  },
  {
    _id: "3",
    name: "Liderança & Colaboração", 
    description: "Habilidade de inspirar equipes, facilitar colaboração e dirigir projetos para o sucesso.",
    thumbnail: "/placeholder.jpg"
  },
  {
    _id: "4",
    name: "Resiliência & Adaptabilidade",
    description: "Capacidade de superar obstáculos, aprender com falhas e adaptar-se a mudanças rapidamente.",
    thumbnail: "/placeholder.jpg"
  },
  {
    _id: "5", 
    name: "Consciência Social & Ética",
    description: "Compreensão do impacto social, responsabilidade ética e compromisso com desenvolvimento sustentável.",
    thumbnail: "/placeholder.jpg"
  },
  {
    _id: "6",
    name: "Comunicação & Persuasão",
    description: "Habilidade de comunicar ideias efetivamente e influenciar stakeholders para ação.",
    thumbnail: "/placeholder.jpg"
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Keep fallback categories
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/placeholder.jpg') {
      target.src = '/placeholder.jpg';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Habilidades Empreendedoras</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Ative as seis dimensões que impulsionam os talentos mais promissores do Brasil
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-[#1a2942] border-gray-800 animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video rounded-t-lg bg-gray-700" />
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-700 rounded mb-6 w-3/4" />
                  <div className="h-12 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: { _id: Key | null | undefined; thumbnail: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <Card key={category._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#10b981]/10 group h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative aspect-video rounded-t-lg overflow-hidden bg-[#0a192f]">
                  <Image
                    src={category.thumbnail || `/placeholder.jpg`}
                    alt={typeof category.name === 'string' ? category.name : ''}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2942]/90 via-[#1a2942]/20 to-transparent" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-white mb-4 leading-tight group-hover:text-[#10b981] transition-colors duration-300">{category.name}</h2>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">{category.description}</p>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <Link href={`/categories/${category?._id}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-medium py-3 px-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#10b981]/25 transform hover:-translate-y-0.5 group-hover:scale-[1.02] active:scale-[0.98] min-h-[4rem]">
                        <span className="flex items-center justify-center gap-2 text-xs leading-tight">
                          <span className="text-center leading-tight">
                            Explorar<br />
                            <span className="font-normal">{typeof category.name === 'string' ? category.name.split(' & ')[0] : ''}</span>
                          </span>
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

