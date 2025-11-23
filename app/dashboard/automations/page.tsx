"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AutomationsPage() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Automations</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{getGreeting()}, Alex</p>
          </div>
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
            <AvatarFallback className="bg-blue-600 text-white font-medium text-sm">
              AX
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-base sm:text-lg">Automations page coming soon...</p>
        </div>
      </main>
    </div>
  )
}

