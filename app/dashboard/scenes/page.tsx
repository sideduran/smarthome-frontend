"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Zap,
  Play,
  Lightbulb,
  Thermometer,
  Lock,
} from "lucide-react"

// Type definitions
interface Device {
  id: string
  name: string
  type: string
  room: string
  on: boolean
}

interface SceneAction {
  deviceId: string
  actionType: string
  value?: number
}

interface Scene {
  id: string
  name: string
  actions: SceneAction[]
  active: boolean
}

export default function ScenesPage() {
  const { toast } = useToast()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formName, setFormName] = useState("")
  const [formActions, setFormActions] = useState<SceneAction[]>([])
  
  // Track active scene (derived from device states)
  const isSceneActive = (scene: Scene) => {
    return scene.active;
  };

  useEffect(() => {
    fetchScenes();
    fetchDevices();
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/scenes");
      if (response.ok) {
        const data = await response.json();
        setScenes(data);
      }
    } catch (error) {
      console.error("Error fetching scenes:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/devices");
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Open modal for creating new scene
  const handleCreate = () => {
    setEditingId(null)
    setFormName("")
    setFormActions([])
    setIsModalOpen(true)
  }

  // Open modal for editing existing scene
  const handleEdit = (scene: Scene) => {
    setEditingId(scene.id)
    setFormName(scene.name)
    setFormActions(scene.actions || [])
    setIsModalOpen(true)
  }

  // Save scene
  const handleSave = async () => {
    if (!formName.trim()) return

    const sceneData = {
      id: editingId || Date.now().toString(),
      name: formName,
      actions: formActions
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `http://localhost:8080/api/scenes/${editingId}`
        : "http://localhost:8080/api/scenes";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sceneData)
      });

      if (response.ok) {
        fetchScenes();
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving scene:", error);
    }
  }

  // Delete scene
  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/scenes/${id}`, { method: "DELETE" });
      setScenes((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting scene:", error);
    }
  }

  // Activate scene
  const handleActivate = async (id: string) => {
    const scene = scenes.find((s) => s.id === id);
    
    if (scene && isSceneActive(scene)) {
      toast({
        title: "Already Active",
        description: `${scene.name} is already active.`,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/scenes/${id}/activate`, { method: "POST" });
      if (response.ok) {
        fetchScenes();
        toast({
          title: "Scene Activated",
          description: `${scene?.name || "Scene"} has been activated successfully.`,
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to activate scene.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error activating scene:", error);
      toast({
        title: "Error",
        description: "Failed to activate scene due to a network error.",
        variant: "destructive",
      });
    }
  }

  // Toggle device selection
  const toggleDevice = (deviceId: string) => {
    const existingAction = formActions.find(a => a.deviceId === deviceId);
    if (existingAction) {
      setFormActions(formActions.filter(a => a.deviceId !== deviceId));
    } else {
      const device = devices.find(d => d.id === deviceId);
      let defaultAction = "TURN_ON";
      let defaultValue = undefined;

      if (device?.type === 'lock') defaultAction = "LOCK";
      if (device?.type === 'camera') defaultAction = "RECORD";
      if (device?.type === 'thermostat') {
        defaultAction = "SET_TEMP";
        defaultValue = 22;
      }
      
      setFormActions([...formActions, { deviceId, actionType: defaultAction, value: defaultValue }]);
    }
  }

  const updateActionType = (deviceId: string, type: string) => {
    setFormActions(formActions.map(a => a.deviceId === deviceId ? { ...a, actionType: type } : a));
  }

  const updateActionValue = (deviceId: string, value: number) => {
    setFormActions(formActions.map(a => a.deviceId === deviceId ? { ...a, value } : a));
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light': return <Lightbulb className="w-4 h-4" />;
      case 'thermostat': return <Thermometer className="w-4 h-4" />;
      case 'lock': return <Lock className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Scenes</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Create and manage your smart home scenes
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
            {/* Create Button */}
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto whitespace-nowrap hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Create Scene
            </Button>
          </div>
        </section>

        {/* Scenes List */}
        <section className="space-y-4">
          {scenes.length === 0 ? (
            <Card className="bg-white animate-in fade-in duration-500">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">No scenes found</p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Create your first scene to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene, index) => {
              const isActive = isSceneActive(scene);
              return (
              <Card
                key={scene.id}
                className={`bg-white transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${
                  isActive 
                    ? "ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] border-yellow-200" 
                    : "hover:shadow-lg"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-purple-50 shrink-0 transition-all duration-300 hover:scale-110">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                          {scene.name}
                        </CardTitle>
                        <div className="text-sm text-gray-600 mt-1">
                          {devices
                            .filter(d => scene.actions?.some(a => a.deviceId === d.id))
                            .map(d => d.name)
                            .join(", ") || "No devices"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleActivate(scene.id)}
                        >
                            <Play className="w-4 h-4 mr-2" /> Activate
                        </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(scene)}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(scene.id)}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
            </div>
          )}
        </section>
      </main>

      {/* Create/Edit Scene Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Scene" : "Create Scene"}
            </DialogTitle>
            <DialogDescription>
              Create a scene to control multiple devices at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Scene Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                Scene Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Movie Night"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Device Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Select Devices and Actions ({formActions.length} selected)
              </Label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-96 overflow-y-auto space-y-2">
                {devices.map((device) => {
                  const isSelected = formActions.some(a => a.deviceId === device.id);
                  const action = formActions.find(a => a.deviceId === device.id);

                  return (
                    <div
                      key={device.id}
                      className={`flex flex-col space-y-2 p-3 rounded transition-colors border ${
                        isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleDevice(device.id)}
                        />
                        <div className="flex-1 flex items-center gap-2">
                            {getDeviceIcon(device.type)}
                            <div>
                                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{device.type}</p>
                            </div>
                        </div>
                      </div>

                      {isSelected && action && (
                        <div className="pl-7 pt-2 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
                          <Select
                            value={action.actionType}
                            onValueChange={(val) => updateActionType(device.id, val)}
                          >
                            <SelectTrigger className="h-8 w-[140px] text-xs">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              {device.type === 'lock' ? (
                                <>
                                  <SelectItem value="LOCK">Lock</SelectItem>
                                  <SelectItem value="UNLOCK">Unlock</SelectItem>
                                </>
                              ) : device.type === 'camera' ? (
                                <>
                                  <SelectItem value="RECORD">Record</SelectItem>
                                  <SelectItem value="STOP_RECORDING">Stop Rec</SelectItem>
                                </>
                              ) : device.type === 'thermostat' ? (
                                <>
                                  <SelectItem value="SET_TEMP">Set Temp</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="TURN_ON">Turn On</SelectItem>
                                  <SelectItem value="TURN_OFF">Turn Off</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>

                          {action.actionType === 'SET_TEMP' && (
                             <div className="flex items-center gap-2">
                                <Input 
                                    type="number" 
                                    className="h-8 w-20 text-xs" 
                                    value={action.value || 22} 
                                    onChange={(e) => updateActionValue(device.id, parseFloat(e.target.value))}
                                />
                                <span className="text-xs text-gray-500">°C</span>
                             </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formName.trim() || formActions.length === 0}
            >
              {editingId ? "Save Changes" : "Create Scene"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
