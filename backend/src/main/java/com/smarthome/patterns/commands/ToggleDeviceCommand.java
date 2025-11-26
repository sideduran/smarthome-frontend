package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

/**
 * Concrete Command (Command pattern).
 *
 * This command toggles the on/off state of a device.
 */
public class ToggleDeviceCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public ToggleDeviceCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            device.setOn(!device.isOn());
            store.updateDevice(device);
        });
    }
}


