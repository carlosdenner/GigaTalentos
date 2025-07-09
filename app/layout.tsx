import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Giga Talentos - Plataforma de Empreendedorismo e Identificação de Talentos",
  description: "Conecte jovens talentos brasileiros com oportunidades de empreendedorismo e desenvolvimento profissional",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <main className="flex-1 bg-[#0a192f] overflow-y-auto">
                    <div className="container mx-auto px-4 py-8">
                      {children}
                    </div>
                  </main>
                  <Footer />
                </div>
              </div>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
