package com.smarthome.web.dto;

/**
 * DTO for creating or updating Room entities without device IDs.
 */
public class CreateRoomRequest {
    private String id;
    private String name;
    private String description;

    public CreateRoomRequest() {
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
}


