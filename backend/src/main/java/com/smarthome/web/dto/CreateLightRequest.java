package com.smarthome.web.dto;

/**
 * DTO for creating Light devices.
 */
public class CreateLightRequest {
    private String id;
    private String name;
    private Boolean on; // Whether the light starts on/off

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

    public Boolean getOn() {
        return on;
    }

    public void setOn(Boolean on) {
        this.on = on;
    }
}

