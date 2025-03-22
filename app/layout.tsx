import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiseMeUp - African Youth Talent Discovery Platform",
  description: "Connect talented African youth with opportunities in creative fields",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#0a192f]`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-7xl mx-auto">{children}</div>
                </main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'