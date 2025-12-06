package com.smarthome.web.dto;

import com.smarthome.domain.SceneAction;
import java.util.List;

public class CreateSceneRequest {
    private String id;
    private String name;
    private List<SceneAction> actions;

    public CreateSceneRequest() {
    }

    public CreateSceneRequest(String id, String name, List<SceneAction> actions) {
        this.id = id;
        this.name = name;
        this.actions = actions;
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
}
