package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Thermostat;

/**
 * Concrete Command (Command pattern).
 *
 * This command increases the target heat (target temperature) of a thermostat.
 * Only works if the device is actually a Thermostat type.
 * The target temperature is constrained between 16°C and 30°C.
 */
public class IncreaseTargetHeatCommand implements SmartHomeCommand {

    private final String deviceId;
    private final double amount; // Amount to increase in Celsius (default 1.0 if not specified)
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public IncreaseTargetHeatCommand(String deviceId) {
        this.deviceId = deviceId;
        this.amount = 1.0; // Default increase by 1°C
    }

    public IncreaseTargetHeatCommand(String deviceId, double amount) {
        this.deviceId = deviceId;
        this.amount = amount;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Thermostat
            if (device instanceof Thermostat) {
                Thermostat thermostat = (Thermostat) device;
                thermostat.increaseTargetTemperature(amount);
                store.updateDevice(thermostat);
            }
        });
    }
}

