package com.smarthome.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Scene {
    private String id;
    private String name;
    private List<SceneAction> actions = new ArrayList<>();
    private boolean active;

    public Scene() {
    }

    public Scene(String id, String name, List<SceneAction> actions) {
        this.id = id;
        this.name = name;
        this.actions = new ArrayList<>(actions);
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

    public List<SceneAction> getActions() {
        return actions;
    }

    public void setActions(List<SceneAction> actions) {
        this.actions = actions;
    }

    public List<String> getDeviceIds() {
        return actions.stream()
                .map(SceneAction::getDeviceId)
                .collect(Collectors.toList());
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
