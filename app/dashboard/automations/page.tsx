"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
} from "@/components/ui/dialog"
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Zap,
  Power,
  Thermometer,
  Video
} from "lucide-react"

// Type definitions
interface Scene {
  id: string
  name: string
}

interface Device {
  id: string
  name: string
  type: string // 'light', 'thermostat', 'camera', 'lock'
  room: string
}

type ActionType = 'SCENE' | 'DEVICE_CONTROL'

interface AutomationAction {
  type: ActionType
  targetId: string // sceneId or deviceId
  action?: string // 'turnOn', 'turnOff', 'setTemperature', 'record'
  value?: any // temperature value, etc.
}

interface Automation {
  id: string
  name: string
  time: string
  days: string[]
  actions: AutomationAction[]
  active: boolean
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formName, setFormName] = useState("")
  const [formTime, setFormTime] = useState("12:00")
  const [formDays, setFormDays] = useState<string[]>([])
  const [formActive, setFormActive] = useState(true)
  
  // Action Form State (Simplified to single action for UI, but model supports list)
  const [formActionType, setFormActionType] = useState<ActionType>('SCENE')
  const [formTargetId, setFormTargetId] = useState("")
  const [formDeviceAction, setFormDeviceAction] = useState("turnOn")
  const [formActionValue, setFormActionValue] = useState<any>(null)

  useEffect(() => {
    fetchAutomations()
    fetchScenes()
    fetchDevices()
  }, [])

  const fetchAutomations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/automations")
      if (response.ok) {
        const data = await response.json()
        setAutomations(data)
      }
    } catch (error) {
      console.error("Error fetching automations:", error)
      // Fallback mock data if API fails
      if (automations.length === 0) {
        setAutomations([
            { 
              id: "1", 
              name: "Morning Routine", 
              time: "07:00", 
              days: ["Mon", "Tue", "Wed", "Thu", "Fri"], 
              actions: [{ type: 'SCENE', targetId: '1' }], 
              active: true 
            },
            { 
              id: "2", 
              name: "Night Mode", 
              time: "23:00", 
              days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
              actions: [{ type: 'SCENE', targetId: '2' }], 
              active: true 
            }
        ])
      }
    }
  }

  const fetchScenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/scenes")
      if (response.ok) {
        const data = await response.json()
        setScenes(data)
      }
    } catch (error) {
      console.error("Error fetching scenes:", error)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/devices")
      if (response.ok) {
        const data = await response.json()
        setDevices(data)
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
      // Mock devices if fetch fails to allow UI testing
      if (devices.length === 0) {
        setDevices([
          { id: "d1", name: "Living Room Light", type: "light", room: "Living Room" },
          { id: "d2", name: "Nest Thermostat", type: "thermostat", room: "Hallway" },
          { id: "d3", name: "Front Door Camera", type: "camera", room: "Entrance" }
        ])
      }
    }
  }

  const handleCreate = () => {
    setEditingId(null)
    setFormName("")
    setFormTime("12:00")
    setFormDays([])
    setFormActive(true)
    
    // Reset Action Form
    setFormActionType('SCENE')
    setFormTargetId("")
    setFormDeviceAction("turnOn")
    setFormActionValue(null)
    
    setIsModalOpen(true)
  }

  const handleEdit = (automation: Automation) => {
    setEditingId(automation.id)
    setFormName(automation.name)
    setFormTime(automation.time)
    setFormDays(automation.days)
    setFormActive(automation.active)
    
    // Load first action into form (simplified UI)
    const action = automation.actions[0]
    if (action) {
      setFormActionType(action.type)
      setFormTargetId(action.targetId)
      setFormDeviceAction(action.action || "turnOn")
      setFormActionValue(action.value)
    }

    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formName.trim() || !formTargetId || formDays.length === 0) return

    const newAction: AutomationAction = {
      type: formActionType,
      targetId: formTargetId,
    }

    if (formActionType === 'DEVICE_CONTROL') {
      newAction.action = formDeviceAction
      if (formDeviceAction === 'setTemperature') {
        newAction.value = formActionValue
      }
    }

    const automationData = {
      id: editingId || Date.now().toString(),
      name: formName,
      time: formTime,
      days: formDays,
      actions: [newAction],
      active: formActive
    }

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId 
        ? `http://localhost:8080/api/automations/${editingId}`
        : "http://localhost:8080/api/automations"

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automationData)
      })

      if (response.ok) {
        fetchAutomations()
        setIsModalOpen(false)
      } else {
        // Optimistic update
        setAutomations(prev => {
            if (editingId) {
                return prev.map(a => a.id === editingId ? automationData : a)
            }
            return [...prev, automationData]
        })
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving automation:", error)
       // Optimistic update
       setAutomations(prev => {
        if (editingId) {
            return prev.map(a => a.id === editingId ? automationData : a)
        }
        return [...prev, automationData]
    })
    setIsModalOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/automations/${id}`, { method: "DELETE" })
      setAutomations((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      console.error("Error deleting automation:", error)
      setAutomations((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const toggleDay = (day: string) => {
    if (formDays.includes(day)) {
      setFormDays(formDays.filter((d) => d !== day))
    } else {
      setFormDays([...formDays, day])
    }
  }

  const toggleAutomationActive = async (automation: Automation) => {
    const updated = { ...automation, active: !automation.active }
    try {
        setAutomations(prev => prev.map(a => a.id === automation.id ? updated : a))
        await fetch(`http://localhost:8080/api/automations/${automation.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        })
    } catch (error) {
        console.error("Error toggling automation:", error)
    }
  }

  // Render Action Summary
  const renderActionSummary = (automation: Automation) => {
    const action = automation.actions[0]
    if (!action) return <span>No action configured</span>

    if (action.type === 'SCENE') {
      const scene = scenes.find(s => s.id === action.targetId)
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
           <Zap className="w-4 h-4 text-purple-500" />
           <span>Run Scene: <strong>{scene?.name || 'Unknown Scene'}</strong></span>
        </div>
      )
    }

    if (action.type === 'DEVICE_CONTROL') {
      const device = devices.find(d => d.id === action.targetId)
      let actionText = ""
      let Icon = Power

      switch (action.action) {
        case 'turnOn': actionText = "Turn On"; Icon = Power; break;
        case 'turnOff': actionText = "Turn Off"; Icon = Power; break;
        case 'setTemperature': 
          actionText = `Set to ${action.value}°C`; 
          Icon = Thermometer; 
          break;
        case 'record': 
          actionText = "Start Recording"; 
          Icon = Video; 
          break;
        default: actionText = action.action || "Interact";
      }

      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
           <Icon className="w-4 h-4 text-blue-500" />
           <span>{actionText}: <strong>{device?.name || 'Unknown Device'}</strong></span>
        </div>
      )
    }
  }

  const getTargetDevice = () => devices.find(d => d.id === formTargetId)

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Automations</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Schedule scenes or control devices automatically
            </p>
          </div>
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:ring-4 hover:ring-blue-100 transition-all hover:scale-110 animate-in fade-in zoom-in-50 duration-500">
            <AvatarFallback className="bg-blue-600 text-white font-medium text-sm">
              AX
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Header Section with Create Button */}
        <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div />
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
          {automations.length === 0 ? (
            <Card className="bg-white animate-in fade-in duration-500">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">No automations found</p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Create your first automation to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {automations.map((automation, index) => (
                <Card
                  key={automation.id}
                  className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${automation.active ? 'bg-blue-50' : 'bg-gray-100'} shrink-0 transition-colors duration-300`}>
                          <Clock className={`w-6 h-6 ${automation.active ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="font-mono bg-gray-50">
                              {automation.time}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {automation.days.length === 7 ? 'Every day' : automation.days.join(', ')}
                            </span>
                          </div>
                          <div className="mt-2">
                            {renderActionSummary(automation)}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={automation.active}
                        onCheckedChange={() => toggleAutomationActive(automation)}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(automation)}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(automation.id)}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Automation" : "Create Automation"}
            </DialogTitle>
            <DialogDescription>
              Set a schedule to control your home
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Morning Routine"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                    id="time"
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                />
                </div>
            </div>

            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`
                      cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${formDays.includes(day) 
                        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select 
                        value={formActionType} 
                        onValueChange={(val) => {
                            setFormActionType(val as ActionType)
                            setFormTargetId("") // Reset target when type changes
                        }}
                    >
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="SCENE">Run a Scene</SelectItem>
                        <SelectItem value="DEVICE_CONTROL">Control a Device</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formActionType === 'SCENE' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label>Select Scene</Label>
                        <Select value={formTargetId} onValueChange={setFormTargetId}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a scene..." />
                            </SelectTrigger>
                            <SelectContent>
                            {scenes.map((scene) => (
                                <SelectItem key={scene.id} value={scene.id}>
                                {scene.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {formActionType === 'DEVICE_CONTROL' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>Select Device</Label>
                            <Select value={formTargetId} onValueChange={setFormTargetId}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a device..." />
                                </SelectTrigger>
                                <SelectContent>
                                {devices.map((device) => (
                                    <SelectItem key={device.id} value={device.id}>
                                    {device.name} ({device.type})
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formTargetId && (
                            <div className="space-y-2">
                                <Label>Action</Label>
                                <Select value={formDeviceAction} onValueChange={setFormDeviceAction}>
                                    <SelectTrigger>
                                    <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="turnOn">Turn On</SelectItem>
                                    <SelectItem value="turnOff">Turn Off</SelectItem>
                                    {getTargetDevice()?.type === 'thermostat' && (
                                        <SelectItem value="setTemperature">Set Temperature</SelectItem>
                                    )}
                                    {getTargetDevice()?.type === 'camera' && (
                                        <SelectItem value="record">Record Video</SelectItem>
                                    )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {formDeviceAction === 'setTemperature' && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Temperature: {formActionValue || 22}°C</Label>
                                </div>
                                <Slider
                                    defaultValue={[formActionValue || 22]}
                                    max={32}
                                    min={16}
                                    step={1}
                                    onValueChange={(vals) => setFormActionValue(vals[0])}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName || !formTargetId || formDays.length === 0}>
              Save Automation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
