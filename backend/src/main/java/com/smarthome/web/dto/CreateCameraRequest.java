package com.smarthome.web.dto;

/**
 * DTO for creating Camera devices.
 */
public class CreateCameraRequest {
    private String id;
    private String name;
    private Boolean recording; // Whether camera is currently recording

    public CreateCameraRequest() {
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

    public Boolean getRecording() {
        return recording;
    }

    public void setRecording(Boolean recording) {
        this.recording = recording;
    }
}

