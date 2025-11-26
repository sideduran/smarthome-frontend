package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Light;

/**
 * Concrete Command (Command pattern).
 *
 * This command turns on a light device (opens the light).
 * Only works if the device is actually a Light type.
 */
public class TurnOnLightCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public TurnOnLightCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Light
            if (device instanceof Light) {
                device.setOn(true);
                store.updateDevice(device);
            }
        });
    }
}

