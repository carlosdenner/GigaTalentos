import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Seed in order: Categories -> Users -> Desafios -> Projects -> Projetos
    const results = {
      categories: null,
      users: null,
      desafios: null,
      projects: null,
      projetos: null
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

    // 5. Seed Projetos (nova funcionalidade)
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

    return NextResponse.json({
      message: "Plataforma Giga Talentos populada com dados demo",
      results: {
        categories: results.categories?.categories?.length || 0,
        users: results.users?.users?.length || 0,
        desafios: results.desafios?.desafios?.length || 0,
        projects: results.projects?.projects || 0,
        projetos: results.projetos?.projetos?.length || 0
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
