package com.smarthome.domain;

/**
 * Thermostat device entity.
 * 
 * Inherits from Device (inheritance pattern).
 * Adds thermostat-specific properties like temperature and target temperature.
 * Target temperature range is constrained between 16°C and 30°C.
 */
public class Thermostat extends Device {
    private static final double MIN_TARGET_TEMPERATURE = 16.0; // Minimum target temperature in Celsius
    private static final double MAX_TARGET_TEMPERATURE = 30.0; // Maximum target temperature in Celsius
    
    private double currentTemperature; // Current room temperature
    private double targetTemperature; // Desired temperature setpoint (16-30°C)

    public Thermostat() {
        super();
        this.setType("thermostat");
    }

    public Thermostat(String id, String name, boolean online) {
        super(id, name, "thermostat", online);
        this.currentTemperature = 20.0;
        this.targetTemperature = 22.0;
    }

    public Thermostat(String id, String name, boolean online, String roomId) {
        super(id, name, "thermostat", online, roomId);
        this.currentTemperature = 20.0;
        this.targetTemperature = 22.0;
    }

    public double getCurrentTemperature() {
        return currentTemperature;
    }

    public void setCurrentTemperature(double currentTemperature) {
        this.currentTemperature = currentTemperature;
    }

    public double getTargetTemperature() {
        return targetTemperature;
    }

    /**
     * Sets the target temperature, clamping it to the valid range (16-30°C).
     */
    public void setTargetTemperature(double targetTemperature) {
        // Clamp target temperature between 16°C and 30°C
        this.targetTemperature = Math.max(MIN_TARGET_TEMPERATURE, Math.min(MAX_TARGET_TEMPERATURE, targetTemperature));
    }

    /**
     * Increases the target temperature by the specified amount (in Celsius).
     * The result is clamped to the valid range (16-30°C).
     */
    public void increaseTargetTemperature(double amount) {
        setTargetTemperature(this.targetTemperature + amount);
    }

    /**
     * Decreases the target temperature by the specified amount (in Celsius).
     * The result is clamped to the valid range (16-30°C).
     */
    public void decreaseTargetTemperature(double amount) {
        setTargetTemperature(this.targetTemperature - amount);
    }
}

