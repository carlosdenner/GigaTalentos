import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'

export async function POST() {
  try {
    await connectDB()

    const updates = [
      {
        name: "Habilidade Cognitiva & Técnica",
        description: "Capacidade de desenvolver soluções tecnológicas inovadoras, dominar ferramentas técnicas e aplicar pensamento analítico para resolver problemas complexos de negócios."
      },
      {
        name: "Criatividade & Inovação", 
        description: "Habilidade de identificar oportunidades de mercado únicas, criar produtos disruptivos e transformar ideias criativas em modelos de negócio viáveis."
      },
      {
        name: "Liderança & Colaboração",
        description: "Competência para inspirar equipes, construir parcerias estratégicas, negociar com stakeholders e dirigir organizações em crescimento acelerado."
      },
      {
        name: "Resiliência & Adaptabilidade",
        description: "Capacidade de navegar pela incerteza do mercado, superar fracassos, pivotar estratégias rapidamente e manter foco em objetivos de longo prazo."
      },
      {
        name: "Consciência Social & Ética",
        description: "Compreensão de impacto social, responsabilidade corporativa e capacidade de construir negócios sustentáveis que geram valor para a sociedade."
      },
      {
        name: "Comunicação & Persuasão",
        description: "Habilidade de fazer pitches convincentes, comunicar visões empresariais, negociar investimentos e influenciar stakeholders para crescimento do negócio."
      }
    ]

    const updatedCategories = []

    for (const update of updates) {
      const category = await Category.findOneAndUpdate(
        { name: update.name },
        { description: update.description },
        { new: true }
      )
      if (category) {
        updatedCategories.push(category)
      }
    }

    return NextResponse.json({
      message: "Category descriptions updated successfully",
      categories: updatedCategories
    })

  } catch (error) {
    console.error('Error updating descriptions:', error)
    return NextResponse.json(
      { error: 'Failed to update descriptions' },
      { status: 500 }
    )
  }
}
