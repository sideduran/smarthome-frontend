package com.smarthome.web.dto;

import java.util.List;

public class CreateSceneRequest {
    private String id;
    private String name;
    private List<String> deviceIds;

    public CreateSceneRequest() {
    }

    public CreateSceneRequest(String id, String name, List<String> deviceIds) {
        this.id = id;
        this.name = name;
        this.deviceIds = deviceIds;
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

    public List<String> getDeviceIds() {
        return deviceIds;
    }

    public void setDeviceIds(List<String> deviceIds) {
        this.deviceIds = deviceIds;
    }
}

