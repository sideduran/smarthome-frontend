package com.smarthome.domain;

public class AutomationAction {
    private String type; // SCENE, DEVICE_CONTROL
    private String targetId;
    private String action; // turnOn, turnOff, setTemperature, record
    private Double value; // for temperature, etc.

    public AutomationAction() {
    }

    public AutomationAction(String type, String targetId, String action, Double value) {
        this.type = type;
        this.targetId = targetId;
        this.action = action;
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}

