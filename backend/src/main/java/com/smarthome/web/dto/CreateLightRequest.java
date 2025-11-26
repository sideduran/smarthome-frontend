package com.smarthome.web.dto;

/**
 * DTO for creating Light devices.
 */
public class CreateLightRequest {
    private String id;
    private String name;
    private boolean online;
    private String roomId;
    private Integer brightness; // Brightness level from 0 to 100

    public CreateLightRequest() {
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

    public Integer getBrightness() {
        return brightness;
    }

    public void setBrightness(Integer brightness) {
        this.brightness = brightness;
    }
}

