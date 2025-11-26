package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

/**
 * Concrete Command (Command pattern).
 *
 * This command deletes a device by ID.
 */
public class DeleteDeviceCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public DeleteDeviceCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.deleteDevice(deviceId);
    }
}

