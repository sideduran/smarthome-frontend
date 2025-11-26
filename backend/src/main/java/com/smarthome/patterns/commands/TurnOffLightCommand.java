package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Light;

/**
 * Concrete Command (Command pattern).
 *
 * This command turns off a light device (closes the light).
 * Only works if the device is actually a Light type.
 */
public class TurnOffLightCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public TurnOffLightCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Light
            if (device instanceof Light) {
                device.setOn(false);
                store.updateDevice(device);
            }
        });
    }
}

