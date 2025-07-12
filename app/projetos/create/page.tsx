"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [desafios, setDesafios] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    objetivo: "",
    video_apresentacao: "",
    categoria: "",
    portfolio_id: "",
    desafio_id: "",
    status: "ativo",
    avatar: "",
    imagem_capa: ""
  });

  const categorias = [
    "Tecnologia",
    "Design", 
    "Marketing",
    "Música",
    "Arte",
    "Esportes",
    "Educação",
    "Saúde",
    "Finanças",
    "Empreendedorismo",
    "Sustentabilidade",
    "Inovação",
    "Liderança",
    "Comunicação",
    "Habilidade Cognitiva & Técnica",
    "Criatividade & Inovação",
    "Liderança & Colaboração",
    "Resiliência & Adaptabilidade"
  ];

  useEffect(() => {
    fetchPortfoliosAndChallenges();
  }, [session]);

  const fetchPortfoliosAndChallenges = async () => {
    try {
      const [portfoliosRes, desafiosRes] = await Promise.all([
        fetch('/api/channels'),
        fetch('/api/desafios')
      ]);

      if (portfoliosRes.ok) {
        const portfoliosData = await portfoliosRes.json();
        setPortfolios(portfoliosData);
      }

      if (desafiosRes.ok) {
        const desafiosData = await desafiosRes.json();
        setDesafios(desafiosData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.portfolio_id) {
      toast({
        title: "Erro",
        description: "Nome e Portfólio são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Convert empty strings to undefined for optional fields
          video_apresentacao: formData.video_apresentacao || undefined,
          desafio_id: formData.desafio_id === "none" ? undefined : formData.desafio_id || undefined,
          avatar: formData.avatar || undefined,
          imagem_capa: formData.imagem_capa || undefined
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create project");
      }

      const projeto = await response.json();

      toast({
        title: "Sucesso!",
        description: "Projeto criado com sucesso",
      });

      router.push(`/projetos/${projeto._id}`);
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar projeto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-white">Faça login para criar um projeto</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="text-white border-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-white">🚀 Criar Novo Projeto</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-white mb-2 block font-medium">Nome do Projeto *</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  placeholder="Digite o nome do seu projeto"
                  required
                />
              </div>

              <div>
                <label className="text-white mb-2 block font-medium">Descrição</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  rows={4}
                  placeholder="Descreva o que é seu projeto, seus principais recursos e diferenciais..."
                />
              </div>

              <div>
                <label className="text-white mb-2 block font-medium">Objetivo do Projeto</label>
                <Textarea
                  value={formData.objetivo}
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  rows={3}
                  placeholder="Qual é o objetivo principal deste projeto? Que problema ele resolve?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white mb-2 block font-medium">Categoria</label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white mb-2 block font-medium">Portfólio *</label>
                  <Select 
                    value={formData.portfolio_id} 
                    onValueChange={(value) => setFormData({ ...formData, portfolio_id: value })}
                  >
                    <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                      <SelectValue placeholder="Selecione um portfólio" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      {portfolios.map((portfolio) => (
                        <SelectItem key={portfolio._id} value={portfolio._id}>
                          {portfolio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {portfolios.length === 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      Primeiro você precisa ter um portfólio/canal criado
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mídia e Recursos */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎬 Mídia e Recursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-white mb-2 block font-medium">Vídeo de Apresentação</label>
                <Input
                  value={formData.video_apresentacao}
                  onChange={(e) => setFormData({ ...formData, video_apresentacao: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  placeholder="URL do vídeo de apresentação (YouTube, Vimeo, etc.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white mb-2 block font-medium">Avatar do Projeto</label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="bg-[#0a192f] border-gray-700 text-white"
                    placeholder="URL da imagem do avatar"
                  />
                </div>

                <div>
                  <label className="text-white mb-2 block font-medium">Imagem de Capa</label>
                  <Input
                    value={formData.imagem_capa}
                    onChange={(e) => setFormData({ ...formData, imagem_capa: e.target.value })}
                    className="bg-[#0a192f] border-gray-700 text-white"
                    placeholder="URL da imagem de capa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vinculações Opcionais */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔗 Vinculações Opcionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-white mb-2 block font-medium">Desafio Relacionado</label>
                <Select 
                  value={formData.desafio_id} 
                  onValueChange={(value) => setFormData({ ...formData, desafio_id: value })}
                >
                  <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                    <SelectValue placeholder="Selecione um desafio (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                    <SelectItem value="none">Nenhum desafio</SelectItem>
                    {desafios.map((desafio) => (
                      <SelectItem key={desafio._id} value={desafio._id}>
                        {desafio.title || desafio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400 mt-1">
                  Vincular a um desafio pode aumentar a visibilidade do seu projeto
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              className="text-white border-gray-600"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white"
            >
              {isLoading ? "Criando..." : "🚀 Criar Projeto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
