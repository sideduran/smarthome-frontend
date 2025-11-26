package com.smarthome.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * Room entity.
 * 
 * Represents a room in the smart home. Rooms contain devices.
 * This is a separate entity type (not inheriting from Device).
 */
public class Room {
    private String id;
    private String name;
    private String description;
    private List<String> deviceIds; // List of device IDs in this room

    public Room() {
        this.deviceIds = new ArrayList<>();
    }

    public Room(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.deviceIds = new ArrayList<>();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getDeviceIds() {
        return deviceIds;
    }

    public void setDeviceIds(List<String> deviceIds) {
        this.deviceIds = deviceIds;
    }

    public void addDevice(String deviceId) {
        if (!deviceIds.contains(deviceId)) {
            deviceIds.add(deviceId);
        }
    }

    public void removeDevice(String deviceId) {
        deviceIds.remove(deviceId);
    }
}

