package com.smarthome.domain;

/**
 * Camera device entity.
 * 
 * Inherits from Device (inheritance pattern).
 * Adds camera-specific properties like recording status and stream URL.
 */
public class Camera extends Device {
    private boolean recording; // Whether camera is currently recording
    private String streamUrl; // URL for video stream (if available)

    public Camera() {
        super();
        this.setType("camera");
    }

    public Camera(String id, String name, boolean online) {
        super(id, name, "camera", online);
        this.recording = false;
        this.streamUrl = null;
    }

    public Camera(String id, String name, boolean online, String roomId) {
        super(id, name, "camera", online, roomId);
        this.recording = false;
        this.streamUrl = null;
    }

    public boolean isRecording() {
        return recording;
    }

    public void setRecording(boolean recording) {
        this.recording = recording;
    }

    public String getStreamUrl() {
        return streamUrl;
    }

    public void setStreamUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }
}

