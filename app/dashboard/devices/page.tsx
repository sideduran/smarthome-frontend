"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Wifi,
  WifiOff,
  Plus,
  Search,
} from "lucide-react"

// Device type definitions
type DeviceType = "light" | "thermostat" | "lock" | "camera"
type DeviceStatus = "online" | "offline"

interface Device {
  id: string
  name: string
  type: DeviceType
  room: string
  status: DeviceStatus
  isOn?: boolean
  temperature?: number
  targetTemperature?: number
  isLocked?: boolean
}

// Mock data
const initialDevices: Device[] = [
  {
    id: "1",
    name: "Living Room Ceiling Light",
    type: "light",
    room: "Living Room",
    status: "online",
    isOn: true,
  },
  {
    id: "2",
    name: "Bedroom Table Lamp",
    type: "light",
    room: "Bedroom",
    status: "online",
    isOn: false,
  },
  {
    id: "3",
    name: "Kitchen Overhead Lights",
    type: "light",
    room: "Kitchen",
    status: "online",
    isOn: true,
  },
  {
    id: "4",
    name: "Living Room Thermostat",
    type: "thermostat",
    room: "Living Room",
    status: "online",
    temperature: 23,
    targetTemperature: 22,
  },
  {
    id: "5",
    name: "Bedroom Thermostat",
    type: "thermostat",
    room: "Bedroom",
    status: "online",
    temperature: 21,
    targetTemperature: 21,
  },
  {
    id: "6",
    name: "Front Door Lock",
    type: "lock",
    room: "Entrance",
    status: "online",
    isLocked: true,
  },
  {
    id: "7",
    name: "Back Door Lock",
    type: "lock",
    room: "Kitchen",
    status: "online",
    isLocked: true,
  },
  {
    id: "8",
    name: "Entrance Camera",
    type: "camera",
    room: "Entrance",
    status: "online",
    isOn: true,
  },
  {
    id: "9",
    name: "Garage Camera",
    type: "camera",
    room: "Entrance",
    status: "online",
    isOn: true,
  },
  {
    id: "10",
    name: "Entrance Light",
    type: "light",
    room: "Entrance",
    status: "online",
    isOn: true,
  },
  {
    id: "11",
    name: "Bedroom Reading Light",
    type: "light",
    room: "Bedroom",
    status: "offline",
    isOn: false,
  },
  {
    id: "12",
    name: "Kitchen Thermostat",
    type: "thermostat",
    room: "Kitchen",
    status: "online",
    temperature: 22,
    targetTemperature: 22,
  },
]

const rooms = ["All rooms", "Living Room", "Bedroom", "Kitchen", "Entrance"]
const deviceTypes = ["All", "Lights", "Thermostats", "Security"]

// Device icon mapping
const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  lock: Lock,
  camera: Camera,
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("All rooms")
  const [selectedType, setSelectedType] = useState("All")
  const [animatingDevice, setAnimatingDevice] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  // New device form state
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState<DeviceType>("light")
  const [newDeviceRoom, setNewDeviceRoom] = useState("Living Room")

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Filter devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRoom = selectedRoom === "All rooms" || device.room === selectedRoom
    const matchesType =
      selectedType === "All" ||
      (selectedType === "Lights" && device.type === "light") ||
      (selectedType === "Thermostats" && device.type === "thermostat") ||
      (selectedType === "Security" && (device.type === "lock" || device.type === "camera"))
    return matchesSearch && matchesRoom && matchesType
  })

  // Toggle device handlers
  const toggleLight = (deviceId: string) => {
    setAnimatingDevice(deviceId)
    setTimeout(() => setAnimatingDevice(null), 500)
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, isOn: !device.isOn } : device
      )
    )
  }

  const toggleLock = (deviceId: string) => {
    setAnimatingDevice(deviceId)
    setTimeout(() => setAnimatingDevice(null), 500)
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, isLocked: !device.isLocked } : device
      )
    )
  }

  const updateTemperature = (deviceId: string, value: number[]) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, targetTemperature: value[0] } : device
      )
    )
  }

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) return
    
    const newDevice: Device = {
      id: Date.now().toString(),
      name: newDeviceName,
      type: newDeviceType,
      room: newDeviceRoom,
      status: "online",
      ...(newDeviceType === "light" && { isOn: false }),
      ...(newDeviceType === "thermostat" && { temperature: 21, targetTemperature: 21 }),
      ...(newDeviceType === "lock" && { isLocked: false }),
      ...(newDeviceType === "camera" && { isOn: true }),
    }

    setDevices((prev) => [...prev, newDevice])
    setIsAddDialogOpen(false)
    setNewDeviceName("")
    setNewDeviceType("light")
    setNewDeviceRoom("Living Room")
  }

  // Group devices by room
  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = []
    }
    acc[device.room].push(device)
    return acc
  }, {} as Record<string, Device[]>)

  const roomNames = Object.keys(devicesByRoom).sort()

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Devices</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage all your smart home devices in one place
            </p>
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
        {/* Filters Section */}
        <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Device Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Room Filter */}
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Device Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto whitespace-nowrap hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>
                    Add a new smart device to your home network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Device Name</label>
                    <Input
                      placeholder="e.g., Living Room Light"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Device Type</label>
                    <Select
                      value={newDeviceType}
                      onValueChange={(value) => setNewDeviceType(value as DeviceType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="thermostat">Thermostat</SelectItem>
                        <SelectItem value="lock">Lock</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Room</label>
                    <Select value={newDeviceRoom} onValueChange={setNewDeviceRoom}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.filter((r) => r !== "All rooms").map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDevice}>Add Device</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Devices Organized by Room */}
        {filteredDevices.length === 0 ? (
          <Card className="bg-white animate-in fade-in duration-500">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">No devices found</p>
              <p className="text-gray-400 text-sm text-center mt-1">
                Try adjusting your filters or add a new device
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {roomNames.map((roomName, roomIndex) => {
              const roomDevices = devicesByRoom[roomName]
              const onlineCount = roomDevices.filter((d) => d.status === "online").length

              return (
                <section
                  key={roomName}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${roomIndex * 100}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Room Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">{roomName}</h2>
                      <Badge variant="outline" className="bg-gray-50">
                        {roomDevices.length} device{roomDevices.length !== 1 ? "s" : ""}
                      </Badge>
                      <Badge
                        className={`${
                          onlineCount === roomDevices.length
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {onlineCount} online
                      </Badge>
                    </div>
                  </div>

                  {/* Room Devices Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roomDevices.map((device, index) => {
                      const Icon = deviceIcons[device.type]
                      const isAnimating = animatingDevice === device.id

                      return (
                        <Card
                          key={device.id}
                          className={`bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                            isAnimating ? "ring-2 ring-blue-400 scale-[1.02]" : ""
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                  className={`p-2 rounded-lg flex-shrink-0 transition-all duration-300 ${
                                    device.type === "light" && device.isOn
                                      ? "bg-yellow-50"
                                      : device.type === "thermostat"
                                        ? "bg-blue-50"
                                        : device.type === "lock"
                                          ? device.isLocked
                                            ? "bg-green-50"
                                            : "bg-red-50"
                                          : "bg-gray-50"
                                  }`}
                                >
                                  <Icon
                                    className={`w-5 h-5 transition-all duration-300 ${
                                      device.type === "light" && device.isOn
                                        ? "text-yellow-600 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                                        : device.type === "thermostat"
                                          ? "text-blue-600"
                                          : device.type === "lock"
                                            ? device.isLocked
                                              ? "text-green-600"
                                              : "text-red-600"
                                            : "text-gray-600"
                                    } ${isAnimating ? "scale-125 rotate-12" : ""}`}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                                    {device.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    {device.status === "online" ? (
                                      <Wifi className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <WifiOff className="w-3 h-3 text-gray-400" />
                                    )}
                                    <span
                                      className={`text-xs ${
                                        device.status === "online"
                                          ? "text-green-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {device.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3">
                            {/* Light Control */}
                            {device.type === "light" && (
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-sm text-gray-700">
                                  {device.isOn ? "On" : "Off"}
                                </span>
                                <Switch
                                  checked={device.isOn}
                                  onCheckedChange={() => toggleLight(device.id)}
                                  disabled={device.status === "offline"}
                                />
                              </div>
                            )}

                            {/* Thermostat Control */}
                            {device.type === "thermostat" && (
                              <div className="space-y-3 pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">Current</span>
                                  <span className="text-lg font-semibold text-gray-900">
                                    {device.temperature}°C
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Target</span>
                                    <span className="text-sm font-medium text-blue-600">
                                      {device.targetTemperature}°C
                                    </span>
                                  </div>
                                  <Slider
                                    value={[device.targetTemperature || 21]}
                                    onValueChange={(value) => updateTemperature(device.id, value)}
                                    min={16}
                                    max={30}
                                    step={1}
                                    disabled={device.status === "offline"}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Lock Control */}
                            {device.type === "lock" && (
                              <div className="pt-2 border-t border-gray-100">
                                <Button
                                  variant={device.isLocked ? "default" : "destructive"}
                                  className="w-full"
                                  onClick={() => toggleLock(device.id)}
                                  disabled={device.status === "offline"}
                                >
                                  {device.isLocked ? "Unlock" : "Lock"}
                                </Button>
                              </div>
                            )}

                            {/* Camera Status */}
                            {device.type === "camera" && (
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-sm text-gray-700">Recording</span>
                                <Badge
                                  className={`${
                                    device.isOn
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  {device.isOn ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

