package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Device;

/**
 * Concrete Command (Command pattern).
 *
 * This command updates an existing device.
 */
public class UpdateDeviceCommand implements SmartHomeCommand {

    private final Device device;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public UpdateDeviceCommand(Device device) {
        this.device = device;
    }

    @Override
    public void execute() {
        store.updateDevice(device);
    }
}

