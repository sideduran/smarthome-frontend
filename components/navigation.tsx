"use client"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const navLinks = ["Home", "Features", "Devices", "Automations", "Security", "Pricing", "Support"]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-semibold text-gray-900">Smart Home</span>
          </div>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#signin"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium hidden sm:inline-block"
            >
              Sign In
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
