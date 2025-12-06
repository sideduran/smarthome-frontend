package com.smarthome.domain;

import java.util.ArrayList;
import java.util.List;

public class Scene {
    private String id;
    private String name;
    private List<String> deviceIds = new ArrayList<>();
    private boolean active;

    public Scene() {
    }

    public Scene(String id, String name, List<String> deviceIds) {
        this.id = id;
        this.name = name;
        this.deviceIds = new ArrayList<>(deviceIds);
        this.active = false;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}


