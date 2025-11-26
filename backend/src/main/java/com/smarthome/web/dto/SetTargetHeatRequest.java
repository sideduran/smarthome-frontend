package com.smarthome.web.dto;

/**
 * DTO for setting target heat (target temperature) requests.
 * Used when setting thermostat target temperature to a specific value.
 */
public class SetTargetHeatRequest {
    private Double targetTemperature; // Target temperature in Celsius (16-30°C)

    public SetTargetHeatRequest() {
    }

    public SetTargetHeatRequest(Double targetTemperature) {
        this.targetTemperature = targetTemperature;
    }

    public Double getTargetTemperature() {
        return targetTemperature;
    }

    public void setTargetTemperature(Double targetTemperature) {
        this.targetTemperature = targetTemperature;
    }
}

