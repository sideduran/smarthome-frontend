package com.smarthome.web.dto;

/**
 * DTO for creating Thermostat devices.
 */
public class CreateThermostatRequest {
    private String id;
    private String name;
    private Double currentTemperature; // Current room temperature in Celsius
    private Double targetTemperature; // Target temperature in Celsius (16-30°C)

    public CreateThermostatRequest() {
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

    public Double getCurrentTemperature() {
        return currentTemperature;
    }

    public void setCurrentTemperature(Double currentTemperature) {
        this.currentTemperature = currentTemperature;
    }

    public Double getTargetTemperature() {
        return targetTemperature;
    }

    public void setTargetTemperature(Double targetTemperature) {
        this.targetTemperature = targetTemperature;
    }
}

