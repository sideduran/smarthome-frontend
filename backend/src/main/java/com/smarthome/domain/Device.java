package com.smarthome.domain;

/**
 * Base Device entity class.
 * 
 * This is the parent class for all device types (Thermostat, Light, Lock, Camera).
 * Uses inheritance to share common device properties and behavior.
 */
public class Device {
    private String id;
    private String name;
    private String type;
    private boolean online;
    private boolean on;
    private String roomId; // Reference to the room this device belongs to

    public Device() {
    }

    public Device(String id, String name, String type, boolean online) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.online = online;
        this.on = false;
    }

    public Device(String id, String name, String type, boolean online, String roomId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.online = online;
        this.on = false;
        this.roomId = roomId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public boolean isOn() {
        return on;
    }

    public void setOn(boolean on) {
        this.on = on;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
}


