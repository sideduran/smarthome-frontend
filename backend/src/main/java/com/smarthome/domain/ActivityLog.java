package com.smarthome.domain;

import java.time.LocalDateTime;

public class ActivityLog {
    private String id;
    private String timestamp;
    private String deviceName;
    private String action;
    private String details;
    private String iconType; // e.g., "LIGHT", "LOCK", "THERMOSTAT", "SECURITY"

    public ActivityLog() {
    }

    public ActivityLog(String id, String timestamp, String deviceName, String action, String details, String iconType) {
        this.id = id;
        this.timestamp = timestamp;
        this.deviceName = deviceName;
        this.action = action;
        this.details = details;
        this.iconType = iconType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }
}

