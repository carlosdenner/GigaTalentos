import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] border-t border-gray-800 py-6 px-8 ">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            <span className="text-[#10b981]">Giga</span>
            <span className="text-[#3b82f6]">Talentos</span>
          </Link>
          <p className="text-sm text-gray-400">Desenvolvendo talentos brasileiros</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="text-gray-400 hover:text-white text-sm">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
            Contact
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
            Terms
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
            Privacy
          </Link>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-[#10b981]">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-[#10b981]">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-[#10b981]">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-[#3b82f6]">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
}

