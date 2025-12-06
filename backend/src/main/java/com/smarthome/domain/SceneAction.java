package com.smarthome.domain;

public class SceneAction {
    private String deviceId;
    private String actionType; // TURN_ON, TURN_OFF, LOCK, UNLOCK, RECORD, STOP_RECORDING, SET_TEMP
    private Double value; // For thermostat temperature

    public SceneAction() {
    }

    public SceneAction(String deviceId, String actionType, Double value) {
        this.deviceId = deviceId;
        this.actionType = actionType;
        this.value = value;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}

