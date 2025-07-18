"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    location: "",
    experience: "",
    portfolio: "",
    skills: [] as string[],
    categories: [] as string[],
    account_type: "talent"
  });
  
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const availableCategories = [
    "Tecnologia", "Design", "Marketing", "Música", "Arte", "Esportes",
    "Educação", "Saúde", "Finanças", "Empreendedorismo", "Sustentabilidade",
    "Inovação", "Liderança", "Comunicação"
  ];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (data) {
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            avatar: data.avatar || "",
            location: data.location || "",
            experience: data.experience || "",
            portfolio: data.portfolio || "",
            skills: data.skills || [],
            categories: data.categories || [],
            account_type: data.account_type || "talent"
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addCategory = (category: string) => {
    if (!formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo inválido. Use JPEG, PNG, GIF ou WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Tamanho máximo: 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { avatarUrl } = await response.json();
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      
      toast({
        title: "Sucesso",
        description: "Foto do perfil atualizada!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao fazer upload da foto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });

      router.push("/profile");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">✏️ Editar Perfil</h1>
        
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback>
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <Button 
                      variant="outline" 
                      className="text-white border-gray-600 cursor-pointer"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        {isUploading ? "Enviando..." : "📷 Alterar Foto"}
                      </span>
                    </Button>
                  </label>
                  <p className="text-gray-400 text-sm mt-2">
                    JPG, PNG ou GIF. Máximo 5MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white mb-2 block font-medium">Nome Completo</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#0a192f] border-gray-700 text-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="text-white mb-2 block font-medium">Localização</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-[#0a192f] border-gray-700 text-white"
                    placeholder="Cidade, Estado"
                  />
                </div>
              </div>

              <div>
                <label className="text-white mb-2 block font-medium">Biografia</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  rows={4}
                  placeholder="Conte um pouco sobre você, suas paixões e objetivos..."
                />
              </div>

              <div>
                <label className="text-white mb-2 block font-medium">Link do Portfólio Externo</label>
                <Input
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  placeholder="https://seuportfolio.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experiência Profissional */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💼 Experiência Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-white mb-2 block font-medium">Experiência</label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-[#0a192f] border-gray-700 text-white"
                  rows={4}
                  placeholder="Descreva sua experiência profissional, projetos anteriores, conquistas..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛠️ Habilidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-[#0a192f] border-gray-700 text-white flex-1"
                  placeholder="Digite uma habilidade"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  className="bg-[#10b981] hover:bg-[#10b981]/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#0a192f] text-white border border-[#10b981]/20 px-3 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categorias de Interesse */}
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📂 Categorias de Interesse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addCategory}>
                <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                  {availableCategories
                    .filter(cat => !formData.categories.includes(cat))
                    .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              className="text-white border-gray-600"
              onClick={() => router.push("/profile")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white"
            >
              💾 Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
