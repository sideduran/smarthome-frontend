"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Wifi, 
  WifiOff, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Home,
  LockKeyhole,
  Clock,
  Plus
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Types matching Backend DTOs
interface Automation {
  id: string
  name: string
  time: string
  active: boolean
  days: string[]
  actions?: {
    type: string
    targetId: string
    action: string
    value?: number
  }[]
}

interface ActivityLog {
  id: string
  timestamp: string
  deviceName: string
  action: string
  details: string
  iconType: string
}

interface Room {
  id: string
  name: string
  description: string
  deviceIds: string[]
}

interface Device {
  id: string
  name: string
  type: string
  online: boolean
  on: boolean
  roomId: string
  currentTemperature?: number // For thermostats
}

// Stats interface for state
interface DashboardStats {
  totalDevices: number
  onlineDevices: number
  lightsOn: number
  totalLights: number
  avgTemperature: number
  securityStatus: string
}

// Room display interface
interface RoomDisplay {
  id: string
  name: string
  devices: number
  activeDevices: number
  lightOn: boolean
  temperature: string
}

const initialStats: DashboardStats = {
  totalDevices: 0,
  onlineDevices: 0,
  lightsOn: 0,
  totalLights: 0,
  avgTemperature: 0,
  securityStatus: "Disarmed"
}

// Get current greeting
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rooms, setRooms] = useState<RoomDisplay[]>([])
  const [automations, setAutomations] = useState<Automation[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [allDevices, setAllDevices] = useState<Device[]>([])
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Add Room State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      const id = Date.now().toString()
      const res = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: newRoomName,
          description: newRoomDescription
        })
      })

      if (res.ok) {
        // Optimistically add the room
        const newRoomDisplay: RoomDisplay = {
          id,
          name: newRoomName,
          devices: 0,
          activeDevices: 0,
          lightOn: false,
          temperature: "-"
        }
        
        setRooms(prev => [...prev, newRoomDisplay])
        setIsAddRoomOpen(false)
        setNewRoomName("")
        setNewRoomDescription("")
      }
    } catch (error) {
      console.error("Failed to add room:", error)
    }
  }

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, devicesRes, securityRes, automationsRes, activitiesRes] = await Promise.all([
          fetch('http://localhost:8080/api/rooms'),
          fetch('http://localhost:8080/api/devices'),
          fetch('http://localhost:8080/api/security/status'),
          fetch('http://localhost:8080/api/automations'),
          fetch('http://localhost:8080/api/activities')
        ])

        if (!roomsRes.ok || !devicesRes.ok) throw new Error("Failed to fetch data")

        const roomsData: Room[] = await roomsRes.json()
        const devicesData: Device[] = await devicesRes.json()
        setAllDevices(devicesData)
        const securityData = securityRes.ok ? await securityRes.json() : { status: "disarmed" }
        const automationsData: Automation[] = automationsRes.ok ? await automationsRes.json() : []
        const activitiesData: ActivityLog[] = activitiesRes.ok ? await activitiesRes.json() : []

        // Only take first 5 items (or sort and take first 5)
        setAutomations(
          automationsData
            .filter(a => a.active)
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(0, 5)
        )
        setActivities(activitiesData.slice(0, 5))

        // Calculate Stats
        const totalDevices = devicesData.length
        const onlineDevices = devicesData.filter(d => d.online).length
        const lights = devicesData.filter(d => d.type === 'light')
        const lightsOn = lights.filter(d => d.on).length
        
        // Calculate Average Temperature
        const thermostats = devicesData.filter(d => d.type === 'thermostat')
        let avgTemp = 0
        if (thermostats.length > 0) {
          const sumTemp = thermostats.reduce((acc, curr) => acc + (curr.currentTemperature || 0), 0)
          avgTemp = Math.round(sumTemp / thermostats.length)
        }

        setStats({
          totalDevices,
          onlineDevices,
          lightsOn,
          totalLights: lights.length,
          avgTemperature: avgTemp,
          securityStatus: securityData.status === "armed" ? "Armed" : "Disarmed"
        })

        // Map Rooms to Display format
        const roomsDisplay: RoomDisplay[] = roomsData.map(room => {
          // Find devices in this room
          const roomDevices = devicesData.filter(d => d.roomId === room.id)
          
          // Calculate active devices (online and on)
          const activeCount = roomDevices.filter(d => d.online && d.on).length
          
          // Check if any light is on in the room
          const isAnyLightOn = roomDevices.some(d => d.type === 'light' && d.on)
          
          // Calculate room temperature (average of thermostats in room, or general average if none)
          const roomThermostats = roomDevices.filter(d => d.type === 'thermostat')
          let roomTemp = "N/A"
          if (roomThermostats.length > 0) {
             const sum = roomThermostats.reduce((acc, curr) => acc + (curr.currentTemperature || 0), 0)
             roomTemp = `${Math.round(sum / roomThermostats.length)}°C`
          } else if (avgTemp > 0) {
            // Fallback to house average if no thermostat in room, or just hide
            roomTemp = "-" 
          }

          return {
            id: room.id,
            name: room.name,
            devices: roomDevices.length,
            activeDevices: activeCount,
            lightOn: isAnyLightOn,
            temperature: roomTemp
          }
        })

        setRooms(roomsDisplay)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleRoomLight = async (roomId: string) => {
    setIsAnimating(roomId)
    setTimeout(() => setIsAnimating(null), 500)
    
    // Find room and determine new state
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    const newState = !room.lightOn

    // Optimistic update for room card
    setRooms(prevRooms =>
      prevRooms.map(r =>
        r.id === roomId ? { ...r, lightOn: newState } : r
      )
    )

    // Find all lights in this room
    const roomLights = allDevices.filter(d => d.roomId === roomId && d.type === 'light')
    
    if (roomLights.length === 0) {
      toast({
        title: "No lights found",
        description: `There are no lights in ${room.name} to switch on.`,
        variant: "destructive",
      })
      
      // Revert the optimistic update if no lights found
      setRooms(prevRooms =>
        prevRooms.map(r =>
          r.id === roomId ? { ...r, lightOn: !newState } : r
        )
      )
      return
    }

    try {
      // Send requests to backend for each light
      await Promise.all(roomLights.map(light => {
        const endpoint = newState ? 'turn-on' : 'turn-off'
        return fetch(`http://localhost:8080/api/lights/${light.id}/${endpoint}`, {
          method: 'POST'
        })
      }))

      // Update local devices state to reflect changes
      setAllDevices(prevDevices => 
        prevDevices.map(d => {
          if (d.roomId === roomId && d.type === 'light') {
            return { ...d, on: newState }
          }
          return d
        })
      )

      // Update stats
      setStats(prev => ({
        ...prev,
        lightsOn: newState 
          ? prev.lightsOn + roomLights.filter(l => !l.on).length 
          : prev.lightsOn - roomLights.filter(l => l.on).length
      }))

    } catch (error) {
      console.error("Failed to toggle room lights:", error)
      // Revert optimistic update on error
      setRooms(prevRooms =>
        prevRooms.map(r =>
          r.id === roomId ? { ...r, lightOn: !newState } : r
        )
      )
    }
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
            {/* Devices Card */}
            <Card 
              className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
              onClick={() => router.push("/dashboard/devices")}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 transition-colors group-hover:text-gray-900">Devices</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stats.totalDevices} devices</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.onlineDevices} online</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 text-green-600 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative">
                    <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lights Card */}
            <Card 
              className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 transition-colors group-hover:text-gray-900">Lights</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stats.lightsOn} lights on</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.totalLights} lights total</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 text-yellow-500 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climate Card */}
            <Card 
              className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 transition-colors group-hover:text-gray-900">Climate</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stats.avgTemperature > 0 ? `${stats.avgTemperature}°C` : '--'}</p>
                    <p className="text-xs text-gray-500 mt-1">Average temperature</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 text-blue-600 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative">
                    <Thermometer className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* Security Card */}
             <Card 
              className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
              onClick={() => router.push("/dashboard/security")}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 transition-colors group-hover:text-gray-900">Security</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stats.securityStatus}</p>
                    <p className="text-xs text-gray-500 mt-1">System status</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative ${
                    stats.securityStatus === "Armed" ? "text-green-600" : "text-red-600"
                  }`}>
                    <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${stats.securityStatus === "Armed" ? "" : "animate-pulse"}`} />
                     {stats.securityStatus === "Disarmed" && (
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                     )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Rooms Overview */}
        <section className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '200ms' }}>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Rooms</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1" 
              onClick={() => setIsAddRoomOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Add Room</span>
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
             <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">No rooms found. Add rooms in the backend config.</p>
            </div>
          ) : (
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
                        {room.devices} devices
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
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upcoming Automations */}
          <section className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Automations</h2>
              <button 
                onClick={() => router.push("/dashboard/automations")}
                className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>
            <Card 
              className="bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => router.push("/dashboard/automations")}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {automations.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming automations.</p>
                  ) : (
                    automations.map((automation, index) => {
                    // Check if this is a scene automation
                    const isScene = automation.actions?.some(a => a.type === "SCENE") || false
                    
                    return (
                    <div
                      key={automation.id || index}
                      className="flex items-start gap-3 sm:gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        isScene ? "bg-purple-50 group-hover:bg-purple-100" : "bg-blue-50 group-hover:bg-blue-100"
                      }`}>
                        <Clock className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12 ${
                          isScene ? "text-purple-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium text-gray-900 transition-colors ${
                          isScene ? "group-hover:text-purple-600" : "group-hover:text-blue-600"
                        }`}>{automation.time}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{automation.name}</p>
                      </div>
                    </div>
                  )})
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity */}
          <section className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
              {/* Note: In a real app, this could link to a dedicated Activity Log page */}
            </div>
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent activity.</p>
                  ) : (
                    activities.map((activity, index) => {
                    let Icon = Shield
                    if (activity.iconType === "LIGHT") Icon = Lightbulb
                    else if (activity.iconType === "THERMOSTAT") Icon = Thermometer
                    else if (activity.iconType === "LOCK") Icon = LockKeyhole
                    else if (activity.iconType === "SCENE") Icon = Home
                    else if (activity.iconType === "SECURITY") Icon = Shield
                    
                    return (
                      <div
                        key={activity.id || index}
                        className="flex items-start gap-3 sm:gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex-shrink-0 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-110">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-all group-hover:text-gray-900 group-hover:rotate-12" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 transition-colors">{activity.timestamp}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 break-words group-hover:text-gray-700 transition-colors">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                    )
                  })
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Create a new room to organize your devices.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                placeholder="e.g. Living Room"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g. Main gathering space"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom} disabled={!newRoomName.trim()}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
