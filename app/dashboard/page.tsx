"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Wifi, 
  WifiOff, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Home,
  LockKeyhole,
  Clock
} from "lucide-react"

// Mock data
const stats = [
  {
    title: "Devices",
    value: "24 devices",
    subtitle: "21 online",
    icon: Wifi,
    iconColor: "text-green-600",
    pulse: false,
  },
  {
    title: "Lights",
    value: "8 lights on",
    subtitle: "16 lights total",
    icon: Lightbulb,
    iconColor: "text-yellow-500",
    pulse: false,
  },
  {
    title: "Climate",
    value: "22°C",
    subtitle: "Average temperature",
    icon: Thermometer,
    iconColor: "text-blue-600",
    pulse: false,
  },
  {
    title: "Security",
    value: "Armed",
    subtitle: "All zones active",
    icon: Shield,
    iconColor: "text-red-600",
    pulse: true,
  },
]

const initialRooms = [
  {
    id: "living-room",
    name: "Living Room",
    devices: 8,
    activeDevices: 5,
    lightOn: true,
    temperature: "23°C",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    devices: 6,
    activeDevices: 2,
    lightOn: false,
    temperature: "21°C",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    devices: 5,
    activeDevices: 3,
    lightOn: true,
    temperature: "22°C",
  },
  {
    id: "entrance",
    name: "Entrance",
    devices: 5,
    activeDevices: 4,
    lightOn: true,
    temperature: "20°C",
  },
]

const automations = [
  { time: "22:00", description: "Turn off all lights in Living Room" },
  { time: "06:30", description: "Turn on lights in Bedroom" },
  { time: "23:00", description: "Lock all doors and arm security" },
  { time: "07:00", description: "Set thermostat to 22°C" },
]

const activities = [
  { time: "18:32", device: "Front door", action: "locked (by You)", icon: LockKeyhole },
  { time: "17:45", device: "Living Room", action: "lights turned on", icon: Lightbulb },
  { time: "16:20", device: "Kitchen", action: "thermostat set to 23°C", icon: Thermometer },
  { time: "15:10", device: "Bedroom", action: "lights turned off", icon: Lightbulb },
  { time: "14:05", device: "Security System", action: "disarmed (by Alex)", icon: Shield },
]

// Get current greeting
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState(initialRooms)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)

  const toggleRoomLight = (roomId: string) => {
    setIsAnimating(roomId)
    setTimeout(() => setIsAnimating(null), 500)
    
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, lightOn: !room.lightOn } : room
      )
    )
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{getGreeting()}, Alex</p>
          </div>
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:ring-4 hover:ring-blue-100 transition-all duration-300 hover:scale-110 animate-in fade-in zoom-in-50 duration-500">
            <AvatarFallback className="bg-blue-600 text-white font-medium text-sm">
              AX
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Status Summary */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card 
                  key={stat.title} 
                  className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 transition-colors group-hover:text-gray-900">{stat.title}</p>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-gray-50 ${stat.iconColor} flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.pulse ? 'animate-pulse' : ''}`} />
                        {stat.pulse && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Rooms Overview */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '200ms' }}>Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {rooms.map((room, index) => (
              <Card 
                key={room.id} 
                className={`bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${
                  isAnimating === room.id ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Home className="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform hover:scale-110" />
                    <span className="truncate">{room.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="transition-all duration-300">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {room.devices} devices · {room.activeDevices} on
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Temperature: {room.temperature}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Lightbulb 
                        className={`w-4 h-4 flex-shrink-0 transition-all duration-500 ${
                          room.lightOn 
                            ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" 
                            : "text-gray-400"
                        } ${isAnimating === room.id ? 'scale-125 rotate-12' : ''}`} 
                      />
                      <span className="text-xs sm:text-sm text-gray-700">Lights</span>
                    </div>
                    <Switch 
                      checked={room.lightOn} 
                      onCheckedChange={() => toggleRoomLight(room.id)}
                      className="transition-all duration-300"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upcoming Automations */}
          <section className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Upcoming Automations</h2>
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {automations.map((automation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex-shrink-0 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 transition-transform group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{automation.time}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{automation.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity */}
          <section className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 sm:gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex-shrink-0 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-110">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-all group-hover:text-gray-900 group-hover:rotate-12" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 transition-colors">{activity.time}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 break-words group-hover:text-gray-700 transition-colors">
                            {activity.device} {activity.action}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

