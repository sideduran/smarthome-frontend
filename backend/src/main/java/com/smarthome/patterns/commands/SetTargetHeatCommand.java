package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Thermostat;

/**
 * Concrete Command (Command pattern).
 *
 * This command sets the target heat (target temperature) of a thermostat to a specific value.
 * Only works if the device is actually a Thermostat type.
 * The target temperature is constrained between 16°C and 30°C.
 */
public class SetTargetHeatCommand implements SmartHomeCommand {

    private final String deviceId;
    private final double targetTemperature; // Target temperature in Celsius
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public SetTargetHeatCommand(String deviceId, double targetTemperature) {
        this.deviceId = deviceId;
        this.targetTemperature = targetTemperature;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Thermostat
            if (device instanceof Thermostat) {
                Thermostat thermostat = (Thermostat) device;
                thermostat.setTargetTemperature(targetTemperature);
                store.updateDevice(thermostat);
            }
        });
    }
}

