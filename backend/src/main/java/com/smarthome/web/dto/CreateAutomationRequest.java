package com.smarthome.web.dto;

import com.smarthome.domain.AutomationAction;
import java.util.List;

public class CreateAutomationRequest {
    private String id;
    private String name;
    private String time;
    private List<String> days;
    private List<AutomationAction> actions;
    private boolean active;

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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public List<String> getDays() {
        return days;
    }

    public void setDays(List<String> days) {
        this.days = days;
    }

    public List<AutomationAction> getActions() {
        return actions;
    }

    public void setActions(List<AutomationAction> actions) {
        this.actions = actions;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

