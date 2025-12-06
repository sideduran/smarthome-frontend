package com.smarthome.domain;

import java.util.ArrayList;
import java.util.List;

public class Automation {
    private String id;
    private String name;
    private String time;
    private List<String> days = new ArrayList<>();
    private List<AutomationAction> actions = new ArrayList<>();
    private boolean active;

    public Automation() {
    }

    public Automation(String id, String name, String time, List<String> days, List<AutomationAction> actions, boolean active) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.days = days != null ? new ArrayList<>(days) : new ArrayList<>();
        this.actions = actions != null ? new ArrayList<>(actions) : new ArrayList<>();
        this.active = active;
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

