"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation() {
  const navLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "Support", href: "/support" }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold text-gray-900">Smart Home</Link>
          </div>

          {/* Right Side - Navigation Links and Actions */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium hidden sm:inline-block"
              >
                Sign In
              </a>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
