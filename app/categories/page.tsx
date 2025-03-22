import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"

async function getCategories() {
  const { data: categories, error } = await supabase.from("categories").select("*")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">Talent Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-[#0a192f]">
                <Image
                  src={category.thumbnail || `/placeholder.svg?height=200&width=350&text=${category.name}`}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">{category.name}</h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{category.description}</p>
              <Link href={`/categories/${category.name.toLowerCase()}`}>
                <Button className="w-full bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
                  Explore {category.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

