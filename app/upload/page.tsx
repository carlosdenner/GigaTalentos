"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link as LinkIcon } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getYouTubeEmbedUrl } from "@/utils"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    if (url) {
      const embedUrl = getYouTubeEmbedUrl(url)
      setPreviewUrl(embedUrl)
    } else {
      setPreviewUrl("")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f] p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Envie Seu Projeto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Envio de Vídeo</CardTitle>
              <CardDescription className="text-gray-400">Compartilhe seu projeto com o mundo</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="mb-8" onValueChange={(value) => setUploadMethod(value as "file" | "url")}>
                <TabsList className="bg-[#0a192f] border-gray-700">
                  <TabsTrigger value="file" className="data-[state=active]:bg-[#1e90ff]">
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Arquivo
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#1e90ff]">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    URL do Vídeo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center ${
                      dragActive ? "border-[#10b981] bg-[#10b981]/10" : "border-gray-700"
                    }`}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragActive(true)
                    }}
                    onDrop={() => setDragActive(false)}
                  >
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium">Arraste e solte seu arquivo de vídeo</h3>
                        <p className="text-gray-400">ou clique para procurar arquivos</p>
                      </div>
                      <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
                        Selecionar Arquivo
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL do Vídeo</Label>
                      <Input
                        id="videoUrl"
                        placeholder="Digite a URL do vídeo do YouTube"
                        className="bg-[#0a192f] border-gray-700"
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                      />
                    </div>
                    {previewUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={previewUrl}
                          title="Video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Digite um título para seu vídeo"
                    className="bg-[#0a192f] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu projeto..."
                    className="bg-[#0a192f] border-gray-700 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger className="bg-[#0a192f] border-gray-700">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      <SelectItem value="cognitive">Habilidade Cognitiva & Técnica</SelectItem>
                      <SelectItem value="creative">Criatividade & Inovação</SelectItem>
                      <SelectItem value="motivation">Motivação & Paixão</SelectItem>
                      <SelectItem value="leadership">Liderança & Colaboração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Adicione tags separadas por vírgulas"
                    className="bg-[#0a192f] border-gray-700"
                  />
                </div>

                <div className="pt-4">
                  <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full">Enviar Vídeo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Diretrizes de Envio</CardTitle>
              <CardDescription className="text-gray-400">Siga estas regras para um envio bem-sucedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Formatos Aceitos</h3>
                <p className="text-gray-400 text-sm">MP4, MOV, AVI (máx 100MB)</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Política de Conteúdo</h3>
                <p className="text-gray-400 text-sm">
                  Todo conteúdo deve ser apropriado e seguir nossas diretrizes da comunidade
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Direitos Autorais</h3>
                <p className="text-gray-400 text-sm">Envie apenas conteúdo que você possui ou tem permissão para usar</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Tempo de Processamento</h3>
                <p className="text-gray-400 text-sm">Vídeos podem levar até 30 minutos para processar após o envio</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white mt-6">
            <CardHeader>
              <CardTitle>Conexões com Mentores</CardTitle>
              <CardDescription className="text-gray-400">Seja descoberto por mentores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Ao enviar seu projeto, você concorda em ser descoberto por mentores verificados em nossa plataforma.
              </p>

              <div className="bg-[#0a192f] p-4 rounded-lg">
                <h3 className="font-medium mb-1">Verificação de Mentores</h3>
                <p className="text-gray-400 text-sm">Todos os mentores são verificados para garantir legitimidade e segurança</p>
              </div>

              <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white w-full">
                Saiba Mais Sobre Mentores
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

