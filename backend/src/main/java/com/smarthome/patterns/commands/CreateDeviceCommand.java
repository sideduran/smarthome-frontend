package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.*;

/**
 * Concrete Command (Command pattern).
 *
 * This command creates a new device. Supports creating specific device types
 * (Thermostat, Light, Lock, Camera) that inherit from Device.
 */
public class CreateDeviceCommand implements SmartHomeCommand {

    private final Device device;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public CreateDeviceCommand(Device device) {
        this.device = device;
    }

    @Override
    public void execute() {
        store.addDevice(device);
    }
}

