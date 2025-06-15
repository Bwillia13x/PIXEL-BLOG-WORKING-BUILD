import Link from "next/link"
import { Monitor, Home, User, Briefcase, BookOpen, Mail } from "lucide-react"

const NavMenu = () => {
  return (
    <nav className="flex justify-center flex-wrap gap-2 my-4">
      <Link
        href="/"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <Home className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Home</span>
      </Link>
      <Link
        href="/about"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <User className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">About</span>
      </Link>
      <Link
        href="/projects"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <Briefcase className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Projects</span>
      </Link>
      <Link
        href="/projects/current"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <Monitor className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Current</span>
      </Link>
      <Link
        href="/blog"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <BookOpen className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Blog</span>
      </Link>
      <Link
        href="/contact"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <Mail className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Contact</span>
      </Link>
    </nav>
  )
}

export default NavMenu
