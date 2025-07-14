import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Seed in order: Categories -> Users -> Desafios -> Projects -> Projetos -> Featured Content -> User Interactions
    const results: {
      categories: any;
      users: any;
      desafios: any;
      projects: any;
      projetos: any;
      featuredContent: any;
      userInteractions: any;
    } = {
      categories: null,
      users: null,
      desafios: null,
      projects: null,
      projetos: null,
      featuredContent: null,
      userInteractions: null
    };

    // 1. Seed Categories
    try {
      const categoriesResponse = await fetch(`${baseUrl}/api/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (categoriesResponse.ok) {
        results.categories = await categoriesResponse.json();
      }
    } catch (error) {
      console.error('Error seeding categories:', error);
    }

    // 2. Seed Demo Users 
    try {
      const usersResponse = await fetch(`${baseUrl}/api/seed-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (usersResponse.ok) {
        results.users = await usersResponse.json();
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    }

    // 3. Seed Desafios
    try {
      const desafiosResponse = await fetch(`${baseUrl}/api/seed-desafios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (desafiosResponse.ok) {
        results.desafios = await desafiosResponse.json();
      }
    } catch (error) {
      console.error('Error seeding desafios:', error);
    }

    // 4. Seed Demo Projects
    try {
      const projectsResponse = await fetch(`${baseUrl}/api/seed-projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (projectsResponse.ok) {
        results.projects = await projectsResponse.json();
      }
    } catch (error) {
      console.error('Error seeding projects:', error);
    }

    // 5. Seed Giga Projetos
    try {
      const projetosResponse = await fetch(`${baseUrl}/api/seed-projetos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (projetosResponse.ok) {
        results.projetos = await projetosResponse.json();
      }
    } catch (error) {
      console.error('Error seeding projetos:', error);
    }

    // 6. Seed Featured Content
    try {
      const featuredResponse = await fetch(`${baseUrl}/api/seed/featured-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (featuredResponse.ok) {
        results.featuredContent = await featuredResponse.json();
      }
    } catch (error) {
      console.error('Error seeding featured content:', error);
    }

    // 7. Seed User Interactions (should be last to ensure content exists)
    try {
      const interactionsResponse = await fetch(`${baseUrl}/api/seed/user-interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (interactionsResponse.ok) {
        results.userInteractions = await interactionsResponse.json();
      }
    } catch (error) {
      console.error('Error seeding user interactions:', error);
    }

    return NextResponse.json({
      message: "Plataforma Giga Talentos populada com dados demo",
      results: {
        categories: results.categories?.categories?.length || 0,
        users: results.users?.users?.length || 0,
        desafios: results.desafios?.desafios?.length || 0,
        projects: results.projects?.projects || 0,
        projetos: results.projetos?.projetos?.length || 0,
        featuredContent: {
          videos: results.featuredContent?.results?.videos || 0,
          projetos: results.featuredContent?.results?.projetos || 0,
          desafios: results.featuredContent?.results?.desafios || 0
        },
        userInteractions: {
          usersUpdated: results.userInteractions?.results?.usersUpdated || 0,
          totalInteractions: results.userInteractions?.results?.totalInteractions || 0
        }
      },
      success: true
    });

  } catch (error) {
    console.error("Error in master seed:", error);
    return NextResponse.json(
      { error: "Erro ao popular plataforma com dados demo" },
      { status: 500 }
    );
  }
}
