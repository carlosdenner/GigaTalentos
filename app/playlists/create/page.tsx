'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, ListMusic, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreatePlaylistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: true
  });

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-[#1a2942] border-gray-800">
          <CardContent className="p-8 text-center">
            <ListMusic className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Login Necessário</h2>
            <p className="text-gray-400 mb-6">
              Você precisa estar logado para criar playlists
            </p>
            <Link href="/auth/login">
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da playlist é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const playlist = await response.json();
      
      toast({
        title: "Sucesso!",
        description: "Playlist criada com sucesso",
      });

      router.push(`/playlists/${playlist._id}`);
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar playlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/playlists">
          <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">Criar Nova Playlist</h1>
          <p className="text-gray-400 text-lg mt-2">
            Organize seus vídeos favoritos em uma coleção personalizada
          </p>
        </div>
      </div>

      {/* Creation Form */}
      <div className="max-w-2xl">
        <Card className="bg-[#1a2942] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ListMusic className="h-6 w-6 text-[#10b981]" />
              Detalhes da Playlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Playlist Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Nome da Playlist *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Meus Vídeos Favoritos"
                  className="bg-[#0a192f] border-gray-700 text-white"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                  Descrição (opcional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua playlist para ajudar outros usuários a entender o conteúdo..."
                  className="bg-[#0a192f] border-gray-700 text-white"
                  rows={4}
                />
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Visibilidade</Label>
                <div className="flex items-center space-x-2 p-4 bg-[#0a192f] rounded-lg border border-gray-700">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                  <div className="flex items-center gap-2">
                    {formData.is_public ? (
                      <Eye className="h-4 w-4 text-[#10b981]" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Label htmlFor="is_public" className="text-white cursor-pointer">
                      {formData.is_public ? 'Pública' : 'Privada'}
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  {formData.is_public 
                    ? 'Outros usuários poderão encontrar e seguir sua playlist'
                    : 'Apenas você poderá ver e acessar esta playlist'
                  }
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-950/50 border border-blue-800/50 rounded-lg p-4">
                <h4 className="text-blue-300 font-medium mb-2">💡 Dica</h4>
                <p className="text-blue-200 text-sm">
                  Após criar sua playlist, você poderá adicionar vídeos navegando pelos vídeos 
                  e clicando no botão "Adicionar à Playlist".
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Link href="/playlists" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full text-gray-400 border-gray-600"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.name.trim()}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white"
                >
                  {isLoading ? (
                    "Criando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Playlist
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
