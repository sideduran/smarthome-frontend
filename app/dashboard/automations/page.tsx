"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/dialog"
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Zap,
  Calendar,
  Lightbulb,
  Thermometer,
  Lock,
} from "lucide-react"

// Type definitions
type TriggerType = "time" | "device"
type ActionType = "turn_on" | "turn_off" | "set_brightness" | "set_temperature" | "lock" | "unlock"
type DeviceType = "light" | "thermostat" | "lock"

interface Device {
  id: string
  name: string
  type: DeviceType
  room: string
}

interface Automation {
  id: string
  name: string
  description: string
  triggerType: TriggerType
  time?: string
  days: string[]
  deviceIds: string[]
  action: ActionType
  actionValue?: number
  enabled: boolean
  type: "Time-based" | "Device-based"
}

// Mock devices
const mockDevices: Device[] = [
  { id: "1", name: "Living Room Ceiling Light", type: "light", room: "Living Room" },
  { id: "2", name: "Bedroom Table Lamp", type: "light", room: "Bedroom" },
  { id: "3", name: "Kitchen Overhead Lights", type: "light", room: "Kitchen" },
  { id: "4", name: "Entrance Light", type: "light", room: "Entrance" },
  { id: "5", name: "Living Room Thermostat", type: "thermostat", room: "Living Room" },
  { id: "6", name: "Bedroom Thermostat", type: "thermostat", room: "Bedroom" },
  { id: "7", name: "Front Door Lock", type: "lock", room: "Entrance" },
  { id: "8", name: "Back Door Lock", type: "lock", room: "Kitchen" },
]

// Mock automations
const initialAutomations: Automation[] = [
  {
    id: "1",
    name: "Good Night",
    description: "Every day at 23:00, turn off all lights in the Living Room.",
    triggerType: "time",
    time: "23:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    deviceIds: ["1"],
    action: "turn_off",
    enabled: true,
    type: "Time-based",
  },
  {
    id: "2",
    name: "Morning Warm-up",
    description: "Every weekday at 07:00, set Living Room thermostat to 22°C.",
    triggerType: "time",
    time: "07:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    deviceIds: ["5"],
    action: "set_temperature",
    actionValue: 22,
    enabled: true,
    type: "Time-based",
  },
  {
    id: "3",
    name: "Welcome Home",
    description: "Every day at 18:30, turn on lights in the Entrance.",
    triggerType: "time",
    time: "18:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    deviceIds: ["4"],
    action: "turn_on",
    enabled: true,
    type: "Time-based",
  },
  {
    id: "4",
    name: "Bedtime Routine",
    description: "Every day at 22:00, turn off Kitchen lights and lock all doors.",
    triggerType: "time",
    time: "22:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    deviceIds: ["3", "7", "8"],
    action: "turn_off",
    enabled: false,
    type: "Time-based",
  },
  {
    id: "5",
    name: "Weekend Morning",
    description: "Every weekend at 09:00, turn on Bedroom light.",
    triggerType: "time",
    time: "09:00",
    days: ["Sat", "Sun"],
    deviceIds: ["2"],
    action: "turn_on",
    enabled: true,
    type: "Time-based",
  },
]

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const actionOptions = [
  { value: "turn_on", label: "Turn On", icon: Zap },
  { value: "turn_off", label: "Turn Off", icon: Zap },
  { value: "set_brightness", label: "Set Brightness", icon: Lightbulb },
  { value: "set_temperature", label: "Set Temperature", icon: Thermometer },
  { value: "lock", label: "Lock", icon: Lock },
  { value: "unlock", label: "Unlock", icon: Lock },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations)
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formName, setFormName] = useState("")
  const [formTriggerType, setFormTriggerType] = useState<TriggerType>("time")
  const [formTime, setFormTime] = useState("12:00")
  const [formDays, setFormDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
  const [formDeviceIds, setFormDeviceIds] = useState<string[]>([])
  const [formAction, setFormAction] = useState<ActionType>("turn_on")
  const [formActionValue, setFormActionValue] = useState<number>(22)
  const [formEnabled, setFormEnabled] = useState(true)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Filter automations
  const filteredAutomations = automations.filter((automation) => {
    if (filter === "enabled") return automation.enabled
    if (filter === "disabled") return !automation.enabled
    return true
  })

  // Generate natural language description
  const generateDescription = () => {
    if (!formDeviceIds.length || !formAction) return "Configure your automation..."

    const selectedDevices = mockDevices.filter((d) => formDeviceIds.includes(d.id))
    const deviceNames = selectedDevices.map((d) => d.name).join(", ")
    
    let actionText = ""
    switch (formAction) {
      case "turn_on":
        actionText = "turn ON"
        break
      case "turn_off":
        actionText = "turn OFF"
        break
      case "set_brightness":
        actionText = `set brightness to ${formActionValue}%`
        break
      case "set_temperature":
        actionText = `set temperature to ${formActionValue}°C`
        break
      case "lock":
        actionText = "lock"
        break
      case "unlock":
        actionText = "unlock"
        break
    }

    const daysText = formDays.length === 7 
      ? "Every day" 
      : formDays.length === 5 && !formDays.includes("Sat") && !formDays.includes("Sun")
      ? "Every weekday"
      : formDays.length === 2 && formDays.includes("Sat") && formDays.includes("Sun")
      ? "Every weekend"
      : `On ${formDays.join(", ")}`

    return `${daysText} at ${formTime}, ${actionText} ${deviceNames}.`
  }

  // Open modal for creating new automation
  const handleCreate = () => {
    setEditingId(null)
    setFormName("")
    setFormTriggerType("time")
    setFormTime("12:00")
    setFormDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    setFormDeviceIds([])
    setFormAction("turn_on")
    setFormActionValue(22)
    setFormEnabled(true)
    setIsModalOpen(true)
  }

  // Open modal for editing existing automation
  const handleEdit = (automation: Automation) => {
    setEditingId(automation.id)
    setFormName(automation.name)
    setFormTriggerType(automation.triggerType)
    setFormTime(automation.time || "12:00")
    setFormDays(automation.days)
    setFormDeviceIds(automation.deviceIds)
    setFormAction(automation.action)
    setFormActionValue(automation.actionValue || 22)
    setFormEnabled(automation.enabled)
    setIsModalOpen(true)
  }

  // Save automation
  const handleSave = () => {
    if (!formName.trim() || formDeviceIds.length === 0) return

    const newAutomation: Automation = {
      id: editingId || Date.now().toString(),
      name: formName,
      description: generateDescription(),
      triggerType: formTriggerType,
      time: formTime,
      days: formDays,
      deviceIds: formDeviceIds,
      action: formAction,
      actionValue: formActionValue,
      enabled: formEnabled,
      type: "Time-based",
    }

    if (editingId) {
      setAutomations((prev) => prev.map((a) => (a.id === editingId ? newAutomation : a)))
    } else {
      setAutomations((prev) => [...prev, newAutomation])
    }

    setIsModalOpen(false)
  }

  // Delete automation
  const handleDelete = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id))
  }

  // Toggle automation enabled status
  const toggleEnabled = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    )
  }

  // Toggle day selection
  const toggleDay = (day: string) => {
    if (formDays.includes(day)) {
      setFormDays(formDays.filter((d) => d !== day))
    } else {
      setFormDays([...formDays, day])
    }
  }

  // Toggle device selection
  const toggleDevice = (deviceId: string) => {
    if (formDeviceIds.includes(deviceId)) {
      setFormDeviceIds(formDeviceIds.filter((id) => id !== deviceId))
    } else {
      setFormDeviceIds([...formDeviceIds, deviceId])
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Automations</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Create and manage your smart home routines
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
        {/* Header Section with Filters and Create Button */}
        <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Filters */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="transition-all duration-200 hover:scale-105"
              >
                All
              </Button>
              <Button
                variant={filter === "enabled" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("enabled")}
                className="transition-all duration-200 hover:scale-105"
              >
                Enabled
              </Button>
              <Button
                variant={filter === "disabled" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("disabled")}
                className="transition-all duration-200 hover:scale-105"
              >
                Disabled
              </Button>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto whitespace-nowrap hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Create Automation
            </Button>
          </div>
        </section>

        {/* Automations List */}
        <section className="space-y-4">
          {filteredAutomations.length === 0 ? (
            <Card className="bg-white animate-in fade-in duration-500">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">No automations found</p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  {filter !== "all"
                    ? "Try adjusting your filters or create a new automation"
                    : "Create your first automation to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAutomations.map((automation, index) => (
              <Card
                key={automation.id}
                className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0 transition-all duration-300 hover:scale-110">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                            {automation.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {automation.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{automation.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    {/* Schedule Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{automation.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {automation.days.length === 7
                            ? "Every day"
                            : automation.days.length === 5 &&
                              !automation.days.includes("Sat") &&
                              !automation.days.includes("Sun")
                            ? "Weekdays"
                            : automation.days.length === 2 &&
                              automation.days.includes("Sat") &&
                              automation.days.includes("Sun")
                            ? "Weekends"
                            : automation.days.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {automation.enabled ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                          checked={automation.enabled}
                          onCheckedChange={() => toggleEnabled(automation.id)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(automation)}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(automation.id)}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>

      {/* Create/Edit Automation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Automation" : "Create Automation"}
            </DialogTitle>
            <DialogDescription>
              Set up an automated routine for your smart home devices
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Automation Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                Automation Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Good Night Routine"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Trigger Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Trigger Type</Label>
              <Select
                value={formTriggerType}
                onValueChange={(value) => setFormTriggerType(value as TriggerType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time of day</SelectItem>
                  <SelectItem value="device" disabled>
                    Device event (coming soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-900">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
              />
            </div>

            {/* Days of Week */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={formDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day)}
                    className="transition-all duration-200"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Device Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Select Device{formDeviceIds.length !== 1 ? 's' : ''} ({formDeviceIds.length} selected)
              </Label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {mockDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    onClick={() => toggleDevice(device.id)}
                  >
                    <Checkbox
                      checked={formDeviceIds.includes(device.id)}
                      onCheckedChange={() => toggleDevice(device.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{device.name}</p>
                      <p className="text-xs text-gray-500">{device.room}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {device.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Action</Label>
              <Select
                value={formAction}
                onValueChange={(value) => setFormAction(value as ActionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Value (for brightness/temperature) */}
            {(formAction === "set_brightness" || formAction === "set_temperature") && (
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium text-gray-900">
                  {formAction === "set_brightness" ? "Brightness (%)" : "Temperature (°C)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min={formAction === "set_brightness" ? 0 : 16}
                  max={formAction === "set_brightness" ? 100 : 30}
                  value={formActionValue}
                  onChange={(e) => setFormActionValue(Number(e.target.value))}
                />
              </div>
            )}

            {/* Enabled Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Enable automation</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Automation will run automatically when enabled
                </p>
              </div>
              <Switch checked={formEnabled} onCheckedChange={setFormEnabled} />
            </div>

            {/* Natural Language Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Summary</p>
              <p className="text-sm text-blue-700">{generateDescription()}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formName.trim() || formDeviceIds.length === 0 || formDays.length === 0}
            >
              {editingId ? "Save Changes" : "Create Automation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

