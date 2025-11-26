package com.smarthome.web.dto;

/**
 * DTO for creating Lock devices.
 */
public class CreateLockRequest {
    private String id;
    private String name;
    private boolean online;
    private String roomId;
    private Boolean locked; // Lock status (true = locked, false = unlocked)

    public CreateLockRequest() {
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

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }
}

