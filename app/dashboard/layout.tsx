"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Lightbulb, Zap, Shield, Menu, X } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Devices", href: "/dashboard/devices", icon: Lightbulb },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Security", href: "/dashboard/security", icon: Shield },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700 animate-in spin-in-180 duration-200" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 animate-in fade-in duration-200" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-xl font-semibold text-gray-900">Smart Home</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full animate-in slide-in-from-left duration-300" />
                )}
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-blue-600 group-hover:scale-110"
                }`} />
                <span className="font-medium transition-all duration-200">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
            <Avatar className="w-9 h-9 transition-all duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-blue-200">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                AX
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">Alex</p>
              <p className="text-xs text-gray-500 truncate">alex@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  )
}

