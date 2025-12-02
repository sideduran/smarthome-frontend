"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Unlock, Activity, AlertCircle, Clock, Video, VideoOff } from "lucide-react"

// Type definitions
type SecurityStatus = "armed" | "disarmed"
type DeviceType = "lock" | "camera" | "sensor"
type DeviceStatus = "locked" | "unlocked" | "recording" | "idle" | "motion" | "no-motion" | "offline"

interface SecurityDevice {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  isLocked?: boolean
  isRecording?: boolean
}

interface SecurityAlert {
  id: string
  time: string
  message: string
  type: "info" | "warning"
}

// Mock alerts (keeping as mock for now)
const initialAlerts: SecurityAlert[] = [
  { id: "1", time: "18:32", message: "Front Door unlocked (by You)", type: "info" },
  { id: "2", time: "18:10", message: "Motion detected in Entrance", type: "warning" },
  { id: "3", time: "17:45", message: "Back Door locked (by You)", type: "info" },
  { id: "4", time: "16:20", message: "Security system armed", type: "info" },
]

export default function SecurityPage() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>("disarmed")
  const [devices, setDevices] = useState<SecurityDevice[]>([])
  const [lastChanged] = useState("18:20")

  useEffect(() => {
    fetchSecurityStatus();
    fetchDevices();
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/security/status");
      if (res.ok) {
        const data = await res.json();
        setSecurityStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch security status:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/devices");
      if (res.ok) {
        const allDevices = await res.json();
        const filtered = allDevices
          .filter((d: any) => d.type === "lock" || d.type === "camera")
          .map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            status: d.type === "lock" 
              ? (d.locked ? "locked" : "unlocked")
              : (d.recording ? "recording" : "idle"),
            isLocked: d.locked,
            isRecording: d.recording
          }));
        setDevices(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    }
  };

  const toggleSecurityStatus = async () => {
    const newStatus = securityStatus === "armed" ? "disarmed" : "armed";
    const endpoint = securityStatus === "armed" ? "disarm" : "arm";
    
    // Optimistic update
    setSecurityStatus(newStatus);
    
    // Update local devices state optimistically if arming
    if (newStatus === "armed") {
        setDevices(prev => prev.map(d => {
            if (d.type === 'lock') {
                return { ...d, isLocked: true, status: "locked" };
            }
            if (d.type === 'camera') {
                return { ...d, isRecording: true, status: "recording" };
            }
            return d;
        }));
    }

    try {
      await fetch(`http://localhost:8080/api/security/${endpoint}`, { method: "POST" });
      // Re-fetch to ensure sync with backend (especially if disarming doesn't auto-unlock/stop recording)
      fetchDevices();
    } catch (error) {
      console.error("Failed to update security status:", error);
      fetchSecurityStatus(); // Revert on error
      fetchDevices();
    }
  }

  const toggleLock = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || device.type !== 'lock') return;

    const newIsLocked = !device.isLocked;
    const action = device.isLocked ? "unlock" : "lock";

    // Optimistic update
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { ...d, isLocked: newIsLocked, status: newIsLocked ? "locked" : "unlocked" } 
        : d
    ));

    try {
      await fetch(`http://localhost:8080/api/locks/${deviceId}/${action}`, { method: "POST" });
      fetchSecurityStatus();
    } catch (error) {
      console.error("Failed to toggle lock:", error);
      fetchDevices(); // Revert
    }
  }

  const toggleRecording = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || device.type !== 'camera') return;

    const newIsRecording = !device.isRecording;
    const action = device.isRecording ? "stop-recording" : "start-recording";

    // Optimistic update
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { ...d, isRecording: newIsRecording, status: newIsRecording ? "recording" : "idle" } 
        : d
    ));

    try {
      await fetch(`http://localhost:8080/api/cameras/${deviceId}/${action}`, { method: "POST" });
      fetchSecurityStatus();
    } catch (error) {
      console.error("Failed to toggle recording:", error);
      fetchDevices(); // Revert
    }
  }


  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="pl-12 lg:pl-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Security</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Monitor and control your home security
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Security Status Card */}
          <Card className="bg-white animate-in fade-in slide-in-from-top-4 duration-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={`p-6 rounded-full transition-all duration-300 ${
                      securityStatus === "armed"
                        ? "bg-green-100 ring-4 ring-green-200"
                        : "bg-red-100 ring-4 ring-red-200"
                    }`}
                  >
                    <Shield
                      className={`w-12 h-12 transition-all duration-300 ${
                        securityStatus === "armed"
                          ? "text-green-600"
                          : "text-red-600 animate-pulse"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {securityStatus === "armed" ? "Armed" : "Disarmed"}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Last changed: {lastChanged} by You</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={toggleSecurityStatus}
                  className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 ${
                    securityStatus === "armed"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  {securityStatus === "armed" ? "Disarm System" : "Arm System"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Devices */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Devices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device, index) => {
                const isLock = device.type === "lock"
                const isCamera = device.type === "camera"
                
                // Lock variables
                const isLocked = isLock && device.status === "locked"
                
                // Camera variables
                const isRecording = isCamera && device.status === "recording"
                
                // Motion variables (if we support sensors later)
                const hasMotion = device.type === "sensor" && device.status === "motion"

                return (
                  <Card
                    key={device.id}
                    className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 transition-all duration-300 ${
                              isLock
                                ? isLocked
                                  ? "bg-green-50"
                                  : "bg-red-50"
                                : isCamera
                                  ? isRecording
                                    ? "bg-red-50"
                                    : "bg-gray-50"
                                  : hasMotion
                                    ? "bg-orange-50"
                                    : "bg-gray-50"
                            }`}
                          >
                            {isLock ? (
                              isLocked ? (
                                <Lock className="w-5 h-5 text-green-600" />
                              ) : (
                                <Unlock className="w-5 h-5 text-red-600" />
                              )
                            ) : isCamera ? (
                              isRecording ? (
                                <Video className="w-5 h-5 text-red-600 animate-pulse" />
                              ) : (
                                <VideoOff className="w-5 h-5 text-gray-400" />
                              )
                            ) : (
                              <Activity
                                className={`w-5 h-5 ${
                                  hasMotion ? "text-orange-600" : "text-gray-400"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                              {device.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs bg-gray-50 capitalize">
                              {device.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {isLock ? (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span
                            className={`text-sm font-medium ${
                              isLocked ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isLocked ? "Locked" : "Unlocked"}
                          </span>
                          <Button
                            size="sm"
                            variant={isLocked ? "outline" : "default"}
                            onClick={() => toggleLock(device.id)}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            {isLocked ? "Unlock" : "Lock"}
                          </Button>
                        </div>
                      ) : isCamera ? (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span
                            className={`text-sm font-medium ${
                              isRecording ? "text-red-600" : "text-gray-600"
                            }`}
                          >
                            {isRecording ? "Recording" : "Idle"}
                          </span>
                          <Button
                            size="sm"
                            variant={isRecording ? "destructive" : "secondary"}
                            onClick={() => toggleRecording(device.id)}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            {isRecording ? "Stop Rec" : "Record"}
                          </Button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Status</span>
                            <Badge
                              className={`${
                                hasMotion
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {hasMotion ? "Motion" : "No motion"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Recent Security Alerts */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {initialAlerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-left-4"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <div
                        className={`p-2 rounded-full flex-shrink-0 ${
                          alert.type === "warning" ? "bg-orange-100" : "bg-blue-100"
                        }`}
                      >
                        <AlertCircle
                          className={`w-4 h-4 ${
                            alert.type === "warning" ? "text-orange-600" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

