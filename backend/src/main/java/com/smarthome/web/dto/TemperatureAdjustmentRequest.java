package com.smarthome.web.dto;

/**
 * DTO for temperature adjustment requests.
 * Used when increasing or decreasing thermostat target temperature.
 */
public class TemperatureAdjustmentRequest {
    private Double amount; // Optional amount in Celsius (defaults to 1.0 if not provided)

    public TemperatureAdjustmentRequest() {
    }

    public TemperatureAdjustmentRequest(Double amount) {
        this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}

